/* ==========================================================================
   application.js — PT application questionnaire engine.
   Vanilla JS, no dependencies, no build step, no ES modules (file:// safe).
   Mounts into #pt-application on apply.html.

   Structure of this file:
     1. CONFIG            — external links KC must paste in (Razorpay, Calendly, Apps Script)
     2. SCORING_CONFIG     — every scored value lives here, tune without touching logic
     3. QUESTION_DEFS      — the questionnaire content model
     4. State + storage    — localStorage autosave + 6-month cooldown
     5. Scoring engine
     6. Render engine       — one function per screen type
     7. Submission + logging
     8. Boot
   ========================================================================== */

(function () {
  "use strict";

  var mount = document.getElementById("pt-application");
  if (!mount) return;

  // ------------------------------------------------------------------
  // 1. CONFIG — paste real values here. See FUNNEL-SETUP.md.
  // ------------------------------------------------------------------
  var CONFIG = {
    // Strategy-session reservation deposit — shown on the button, e.g.
    // "Reserve your Strategy Session — ₹199". Intentionally small and
    // symbolic — not real revenue, a commitment filter. KC creates the
    // payment link (Razorpay/UPI works fine even for NRI clients);
    // link is a placeholder until he does.
    DEPOSIT_LABEL: "₹199",
    DEPOSIT_LINK: "#deposit-link-here",
    // Calendly (or equivalent) booking link, shown after payment link.
    CALENDLY_URL: "#calendly-link-here",
    // Google Apps Script web app URL (doPost). Leave empty to skip
    // network logging entirely — the funnel works standalone without it.
    APPS_SCRIPT_URL: "",
    // Days before a rejected/withdrawn applicant may re-apply.
    COOLDOWN_DAYS: 180
  };

  // ------------------------------------------------------------------
  // 2. SCORING_CONFIG — KC tunes weights/thresholds here only.
  //    Nothing below this object should need to change for tuning.
  // ------------------------------------------------------------------
  var SCORING_CONFIG = {
    // Score 0-100. At/above this, applicant is qualified (barring an
    // auto-disqualifier below, which overrides score entirely).
    qualificationThreshold: 65,

    // Bucket weights must sum to 1.
    weights: {
      philosophy: 0.30,      // q4, q5, q6
      commitment: 0.30,      // q7, q9, q10
      goalsTimeframe: 0.20,  // q3
      lifestyle: 0.10,       // q12
      documentation: 0.10    // q17
    },

    buckets: {
      philosophy: { questions: ["q4", "q5", "q6"] },
      commitment: { questions: ["q7", "q9", "q10"] },
      goalsTimeframe: { questions: ["q3"] },
      lifestyle: { questions: ["q12"] },
      documentation: { questions: ["q17"] }
    },

    // Any one of these answers disqualifies regardless of score.
    autoDisqualifiers: function (a) {
      return a.q9 === "2-or-fewer" || a.q16 === "under-1500" || a.q17 === "no-documentation" ||
        a.qLang === "neither";
    },

    // Recommended plan is a function of Q9 only, applied post-qualification.
    // Deliberate: 5-6/week is never sold upfront — it's earned inside the
    // relationship once the first training block proves it out.
    recommendPlan: function (a) {
      if (a.q9 === "3") return { label: "3 sessions per week", note: "" };
      if (a.q9 === "4") return { label: "4 sessions per week", note: "" };
      if (a.q9 === "5-6") {
        return {
          label: "4 sessions per week",
          note: "We start at 4 sessions per week. If your first training block shows you'll benefit from more, we'll build up from there."
        };
      }
      return { label: "4 sessions per week", note: "" };
    }
  };

  // ------------------------------------------------------------------
  // 3. QUESTION_DEFS — the questionnaire content model.
  //    `points` on an option feeds the scoring engine. `autoDisqualify`
  //    on an option is read by SCORING_CONFIG.autoDisqualifiers above
  //    (kept as plain string checks there for clarity/tunability).
  // ------------------------------------------------------------------
  var QUESTION_DEFS = {
    q1: {
      type: "multiselect",
      required: true,
      label: "What do you want to achieve?",
      hint: "Select everything that applies.",
      options: [
        { value: "pain", label: "Move without pain" },
        { value: "strength", label: "Build strength" },
        { value: "fat-loss", label: "Lose fat sustainably" },
        { value: "muscle", label: "Build muscle" },
        { value: "energy", label: "More energy / better daily life" },
        { value: "performance", label: "Athletic performance" },
        { value: "other", label: "Other", hasOther: true }
      ]
    },
    q2: {
      type: "textarea",
      required: true,
      minLength: 100,
      label: "Why now? What changed?",
      hint: "Minimum 100 characters — this is the question that tells me the most, take your time."
    },
    q3: {
      type: "radio",
      required: true,
      label: "What's a realistic timeframe for the change you want?",
      options: [
        { value: "multi-year", label: "This is a multi-year lifestyle change", points: 4 },
        { value: "one-year", label: "About a year of consistent work", points: 3 },
        { value: "3-6-months", label: "3–6 months", points: 1 },
        { value: "under-3-months", label: "Under 3 months — I need fast results", points: 0 }
      ]
    },
    q4: {
      type: "radio",
      required: true,
      label: "Which is closer to your view?",
      options: [
        { value: "consistency", label: "Small consistent habits compound into transformation", points: 4 },
        { value: "mix", label: "Mix of both", points: 2 },
        { value: "intensity", label: "Intense short pushes get results; maintenance comes later", points: 0 }
      ]
    },
    q5: {
      type: "radio",
      required: true,
      label: "Three weeks in, progress feels slow. What do you do?",
      options: [
        { value: "trust-process", label: "Trust the process, keep showing up", points: 4 },
        { value: "raise-with-coach", label: "Raise it with my coach and adjust together", points: 4 },
        { value: "push-harder", label: "Push harder on my own", points: 1 },
        { value: "question-works", label: "Start questioning whether this works", points: 0 }
      ]
    },
    q6: {
      type: "radio",
      required: true,
      label: "What matters more?",
      options: [
        { value: "consistency", label: "Consistency", points: 4 },
        { value: "intensity", label: "Intensity", points: 1 }
      ]
    },
    q7: {
      type: "radio",
      required: true,
      label: "Your coach programs something you don't immediately understand. You:",
      options: [
        { value: "do-then-ask", label: "Do it, ask why after", points: 4 },
        { value: "ask-then-do", label: "Ask why first, then do it", points: 3 },
        { value: "only-makes-sense", label: "Only do what makes sense to me", points: 0 }
      ]
    },
    q8: {
      type: "textarea",
      required: true,
      label: "Have you worked with a coach before? How did it end?",
      hint: "Not scored — this just helps me understand your history. If never, just say so."
    },
    q9: {
      type: "radio",
      required: true,
      label: "How many training sessions per week can you realistically commit to, for years?",
      options: [
        { value: "2-or-fewer", label: "2 or fewer" },
        { value: "3", label: "3", points: 2 },
        { value: "4", label: "4", points: 3 },
        { value: "5-6", label: "5–6", points: 4 }
      ]
    },
    q10: {
      type: "radio",
      required: true,
      label: "Coaching involves tracking — sleep, food, training logs. Are you willing?",
      options: [
        { value: "yes-consistently", label: "Yes, consistently", points: 4 },
        { value: "mostly", label: "Mostly, with occasional gaps", points: 2 },
        { value: "not-for-me", label: "Tracking isn't for me", points: 0 }
      ]
    },
    q11: {
      type: "radio",
      required: true,
      label: "Work schedule",
      options: [
        { value: "regular", label: "Regular hours" },
        { value: "shift", label: "Shift work" },
        { value: "irregular", label: "Irregular / travel-heavy" },
        { value: "flexible", label: "Flexible / self-employed" }
      ]
    },
    q12: {
      type: "radio",
      required: true,
      label: "Average sleep",
      options: [
        { value: "under-6", label: "Under 6 hours", points: 0 },
        { value: "6-7", label: "6–7 hours", points: 2 },
        { value: "7-8", label: "7–8 hours", points: 2 },
        { value: "8-plus", label: "8 hours+", points: 2 }
      ]
    },
    q13: {
      type: "radio",
      required: true,
      label: "Current stress",
      options: [
        { value: "low", label: "Low" },
        { value: "moderate", label: "Moderate" },
        { value: "high", label: "High" },
        { value: "very-high", label: "Very high" }
      ]
    },
    q14: {
      type: "textarea",
      required: true,
      label: "What training equipment do you currently have access to?",
      hint: "Home gym, commercial gym, bodyweight only, resistance bands — whatever's true."
    },
    q15: {
      type: "multiselect",
      required: true,
      label: "Preferred training times",
      options: [
        { value: "early-morning", label: "Early morning" },
        { value: "morning", label: "Morning" },
        { value: "midday", label: "Midday" },
        { value: "evening", label: "Evening" },
        { value: "night", label: "Night" },
        { value: "flexible", label: "Flexible" }
      ]
    },
    q16: {
      type: "radio",
      required: true,
      label: "Coaching at this level is a significant monthly investment. Which range fits your situation?",
      hint: "This isn't a negotiation — it just tells me whether coaching is realistic for you right now.",
      options: [
        { value: "under-1500", label: "Under $1,500/month" },
        { value: "1500-3000", label: "$1,500–$3,000/month" },
        { value: "3000-6000", label: "$3,000–$6,000/month" },
        { value: "not-constraint", label: "Investment isn't the constraint — results are" }
      ]
    },
    q17: {
      type: "radio",
      required: true,
      label: "Client progress is sometimes documented (photos, testimonials, case studies). Are you open to this?",
      options: [
        { value: "yes", label: "Yes", points: 2 },
        { value: "yes-anonymized", label: "Yes, anonymized only", points: 2 },
        { value: "no-documentation", label: "No, I don't want to be documented at all" }
      ]
    },
    q18: {
      type: "textarea",
      required: false,
      label: "Anything else I should know? Why should this application stand out?",
      hint: "Optional."
    },
    // Asked right after Contact, before Section A. Coaching is delivered
    // in English and/or Hindi — being comfortable in EITHER is fine.
    // Only "neither" disqualifies (we simply couldn't communicate).
    qLang: {
      type: "radio",
      required: true,
      label: "What languages are you comfortable communicating in?",
      options: [
        { value: "both", label: "I'm fluent in both English and Hindi" },
        { value: "english", label: "English" },
        { value: "hindi", label: "Hindi" },
        { value: "neither", label: "I'm not comfortable with either" }
      ]
    }
  };

  var SECTIONS = [
    { id: "goals", title: "Goals", questions: ["q1", "q2", "q3"] },
    { id: "philosophy", title: "Philosophy", questions: ["q4", "q5", "q6"] },
    { id: "commitment", title: "Commitment & Coachability", questions: ["q7", "q8", "q9", "q10"] },
    { id: "lifestyle", title: "Lifestyle", questions: ["q11", "q12", "q13"] },
    { id: "equipment", title: "Equipment & Logistics", questions: ["q14", "q15"] },
    { id: "investment", title: "Investment & Fit", questions: ["q16", "q17", "q18"] }
  ];

  var DECLINE_REASONS = [
    { value: "budget", label: "Outside my budget" },
    { value: "timing", label: "Wrong timing" },
    { value: "style", label: "Different coaching style" },
    { value: "support-level", label: "Wanted a different level of support" },
    { value: "other", label: "Other", hasOther: true }
  ];

  // ------------------------------------------------------------------
  // 4. State + storage
  // ------------------------------------------------------------------
  var STORAGE_KEY = "kc_pt_application_v1";
  var COOLDOWN_KEY = "kc_pt_application_cooldown_v1";

  var state = loadState() || {
    view: "contact",
    sectionIndex: 0,
    contact: { name: "", email: "", phone: "", newsletter: false },
    answers: {},
    decline: { reason: "", other: "", budgetAnswer: "" }
  };

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* localStorage unavailable (private mode etc.) — degrade silently */
    }
  }

  function clearState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* noop */ }
  }

  function loadCooldownRecords() {
    try {
      var raw = localStorage.getItem(COOLDOWN_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function recordCooldown(emailHash) {
    try {
      var records = loadCooldownRecords();
      records.push({ emailHash: emailHash, date: new Date().toISOString() });
      localStorage.setItem(COOLDOWN_KEY, JSON.stringify(records));
    } catch (e) { /* noop */ }
  }

  // Lightweight synchronous hash (djb2) used as a fallback when
  // crypto.subtle isn't available (older browsers / some file:// contexts).
  // Not cryptographically strong — acceptable here since this only powers
  // a client-side re-application cooldown, not a security boundary.
  function djb2Hash(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return "djb2:" + (hash >>> 0).toString(16);
  }

  function hashEmail(email) {
    var normalized = String(email || "").trim().toLowerCase();
    if (window.crypto && window.crypto.subtle && window.isSecureContext !== false) {
      var data = new TextEncoder().encode(normalized);
      return window.crypto.subtle.digest("SHA-256", data).then(function (buf) {
        var bytes = Array.from(new Uint8Array(buf));
        return "sha256:" + bytes.map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
      }).catch(function () {
        return djb2Hash(normalized);
      });
    }
    return Promise.resolve(djb2Hash(normalized));
  }

  function checkCooldown(email) {
    return hashEmail(email).then(function (hash) {
      var records = loadCooldownRecords();
      var cutoff = Date.now() - CONFIG.COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
      for (var i = 0; i < records.length; i++) {
        if (records[i].emailHash === hash && new Date(records[i].date).getTime() > cutoff) {
          return true;
        }
      }
      return false;
    });
  }

  // ------------------------------------------------------------------
  // 5. Scoring engine
  // ------------------------------------------------------------------
  function pointsFor(id, value) {
    var def = QUESTION_DEFS[id];
    if (!def || !def.options) return 0;
    var opt = def.options.filter(function (o) { return o.value === value; })[0];
    return (opt && typeof opt.points === "number") ? opt.points : 0;
  }

  function maxPointsFor(ids) {
    return ids.reduce(function (sum, id) {
      var def = QUESTION_DEFS[id];
      var max = 0;
      (def.options || []).forEach(function (o) {
        if (typeof o.points === "number" && o.points > max) max = o.points;
      });
      return sum + max;
    }, 0);
  }

  function computeResult(answers) {
    var disqualified = SCORING_CONFIG.autoDisqualifiers(answers);

    var bucketScores = {};
    Object.keys(SCORING_CONFIG.buckets).forEach(function (key) {
      var ids = SCORING_CONFIG.buckets[key].questions;
      var earned = ids.reduce(function (sum, id) { return sum + pointsFor(id, answers[id]); }, 0);
      var max = maxPointsFor(ids);
      bucketScores[key] = max > 0 ? (earned / max) * 100 : 0;
    });

    var score = 0;
    Object.keys(SCORING_CONFIG.weights).forEach(function (key) {
      score += bucketScores[key] * SCORING_CONFIG.weights[key];
    });
    score = Math.round(score);

    var qualified = !disqualified && score >= SCORING_CONFIG.qualificationThreshold;
    var plan = qualified ? SCORING_CONFIG.recommendPlan(answers) : null;

    return { score: score, disqualified: disqualified, qualified: qualified, plan: plan };
  }

  // ------------------------------------------------------------------
  // 6. Render engine
  // ------------------------------------------------------------------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k.indexOf("on") === 0 && typeof attrs[k] === "function") node.addEventListener(k.slice(2), attrs[k]);
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function render() {
    mount.innerHTML = "";
    mount.classList.add("pt-app");

    if (state.view === "cooldown") return mount.appendChild(renderCooldown());
    if (state.view === "contact") return mount.appendChild(renderContact());
    if (state.view === "language") return mount.appendChild(renderLanguageFit());
    if (state.view === "section") return mount.appendChild(renderSection(state.sectionIndex));
    if (state.view === "recommendation") return mount.appendChild(renderRecommendation());
    if (state.view === "decline-reason") return mount.appendChild(renderDeclineReason());
    if (state.view === "decline-budget") return mount.appendChild(renderDeclineBudget());
    if (state.view === "decline-thanks") return mount.appendChild(renderDeclineThanks());
    if (state.view === "waitlist") return mount.appendChild(renderWaitlist());
  }

  // Every step after Contact is one of: the language-fit check, then each
  // section in SECTIONS — that's the full sequence the progress bar tracks.
  var TOTAL_STEPS = 1 + SECTIONS.length;

  function renderProgress(stepNumber, total) {
    var bar = el("div", { class: "pt-app__progress-bar" }, [
      el("span", { style: "width:" + Math.round((stepNumber / total) * 100) + "%" })
    ]);
    return el("div", { class: "pt-app__progress" }, [
      bar,
      el("p", { class: "pt-app__progress-label" }, ["Step " + stepNumber + " of " + total])
    ]);
  }

  function stepWrap(children, extraClass) {
    return el("div", { class: "pt-app__step" + (extraClass ? " " + extraClass : "") }, children);
  }

  function errorNode(text) {
    return el("p", { class: "pt-app__error", role: "alert" }, [text]);
  }

  // ---- Contact step -------------------------------------------------

  function renderContact() {
    var errors = {};

    function field(labelText, inputEl, key) {
      var wrap = el("div", { class: "pt-app__field" }, [
        el("label", {}, [labelText]),
        inputEl
      ]);
      if (errors[key]) wrap.appendChild(errorNode(errors[key]));
      return wrap;
    }

    var nameInput = el("input", { type: "text", value: state.contact.name, autocomplete: "name" });
    var emailInput = el("input", { type: "email", value: state.contact.email, autocomplete: "email" });
    var phoneInput = el("input", { type: "tel", value: state.contact.phone, autocomplete: "tel" });
    var newsletterInput = el("input", { type: "checkbox" });
    newsletterInput.checked = !!state.contact.newsletter;

    var form = el("div", { class: "pt-app__fields" }, [
      field("Full name", nameInput, "name"),
      field("Email", emailInput, "email"),
      field("Phone", phoneInput, "phone"),
      el("label", { class: "pt-app__checkbox" }, [
        newsletterInput,
        el("span", {}, ["Send me fitness insights, coaching updates, and future program announcements."])
      ])
    ]);

    var errorBox = el("div", { class: "pt-app__error-box" });

    var continueBtn = el("button", { type: "button", class: "btn btn-pill btn-primary" }, ["Begin the application"]);
    continueBtn.addEventListener("click", function () {
      var name = nameInput.value.trim();
      var email = emailInput.value.trim();
      var phone = phoneInput.value.trim();
      var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      errorBox.innerHTML = "";
      var problems = [];
      if (!name) problems.push("Enter your full name.");
      if (!email || !emailValid) problems.push("Enter a valid email address.");
      if (!phone) problems.push("Enter a phone number.");

      if (problems.length) {
        problems.forEach(function (p) { errorBox.appendChild(errorNode(p)); });
        return;
      }

      state.contact = { name: name, email: email, phone: phone, newsletter: newsletterInput.checked };
      saveState();

      continueBtn.disabled = true;
      checkCooldown(email).then(function (onCooldown) {
        continueBtn.disabled = false;
        if (onCooldown) {
          state.view = "cooldown";
        } else {
          state.view = "language";
        }
        saveState();
        render();
      });
    });

    return stepWrap([
      el("p", { class: "pt-app__eyebrow" }, ["Before we begin"]),
      el("h2", {}, ["A few details"]),
      el("p", { class: "pt-app__intro" }, ["This is how I'll reach you if we're a fit. Takes about 10–15 minutes end to end — your progress is saved automatically if you need to step away."]),
      form,
      errorBox,
      el("div", { class: "pt-app__nav pt-app__nav--single" }, [continueBtn])
    ]);
  }

  // ---- Language-fit step ----------------------------------------------

  function renderLanguageFit() {
    var errorBox = el("div", { class: "pt-app__error-box" });
    var q = renderQuestion("qLang");

    var backBtn = el("button", { type: "button", class: "btn btn-pill btn-secondary" }, ["Back"]);
    backBtn.addEventListener("click", function () {
      state.view = "contact";
      saveState();
      render();
    });

    var nextBtn = el("button", { type: "button", class: "btn btn-pill btn-primary" }, ["Continue"]);
    nextBtn.addEventListener("click", function () {
      errorBox.innerHTML = "";
      var err = validateQuestion("qLang", q.getValue());
      if (err) {
        errorBox.appendChild(errorNode(err));
        return;
      }
      state.answers.qLang = q.getValue();
      state.view = "section";
      state.sectionIndex = 0;
      saveState();
      render();
    });

    return stepWrap([
      renderProgress(1, TOTAL_STEPS),
      el("p", { class: "pt-app__eyebrow" }, ["A quick fit check"]),
      el("div", { class: "pt-app__fields" }, [q.wrap]),
      errorBox,
      el("div", { class: "pt-app__nav" }, [backBtn, nextBtn])
    ]);
  }

  // ---- Section step ---------------------------------------------------

  function renderSection(index) {
    var section = SECTIONS[index];
    var errorBox = el("div", { class: "pt-app__error-box" });
    var questionNodes = {};

    var body = el("div", { class: "pt-app__fields" }, section.questions.map(function (qid) {
      var node = renderQuestion(qid);
      questionNodes[qid] = node;
      return node.wrap;
    }));

    var backBtn = el("button", { type: "button", class: "btn btn-pill btn-secondary" }, ["Back"]);
    backBtn.addEventListener("click", function () {
      if (index === 0) {
        state.view = "language";
      } else {
        state.sectionIndex = index - 1;
      }
      saveState();
      render();
    });

    var isLast = index === SECTIONS.length - 1;
    var nextBtn = el("button", { type: "button", class: "btn btn-pill btn-primary" }, [isLast ? "Submit application" : "Continue"]);
    nextBtn.addEventListener("click", function () {
      errorBox.innerHTML = "";
      var problems = [];
      section.questions.forEach(function (qid) {
        var err = validateQuestion(qid, questionNodes[qid].getValue());
        if (err) problems.push(err);
      });
      if (problems.length) {
        problems.forEach(function (p) { errorBox.appendChild(errorNode(p)); });
        return;
      }
      section.questions.forEach(function (qid) {
        state.answers[qid] = questionNodes[qid].getValue();
      });
      saveState();

      if (isLast) {
        submitApplication();
      } else {
        state.sectionIndex = index + 1;
        saveState();
        render();
      }
    });

    return stepWrap([
      renderProgress(index + 2, TOTAL_STEPS),
      el("h2", {}, [section.title]),
      body,
      errorBox,
      el("div", { class: "pt-app__nav" }, [backBtn, nextBtn])
    ]);
  }

  function validateQuestion(qid, value) {
    var def = QUESTION_DEFS[qid];
    if (!def.required) return null;

    if (def.type === "multiselect") {
      if (!value.selected || value.selected.length === 0) return "Select at least one option (" + def.label + ").";
      if (value.selected.indexOf("other") !== -1 && !value.other.trim()) return "Add a note for “Other” (" + def.label + ").";
      return null;
    }
    if (def.type === "radio") {
      if (!value) return "Choose an option (" + def.label + ").";
      return null;
    }
    if (def.type === "textarea") {
      if (!value || !value.trim()) return "This field is required (" + def.label + ").";
      if (def.minLength && value.trim().length < def.minLength) {
        return def.label + " needs at least " + def.minLength + " characters (currently " + value.trim().length + ").";
      }
      return null;
    }
    return null;
  }

  function renderQuestion(qid) {
    var def = QUESTION_DEFS[qid];
    var saved = state.answers[qid];

    var labelNode = el("h3", { class: "pt-app__q-label" }, [def.label]);
    var hintNode = def.hint ? el("p", { class: "pt-app__hint" }, [def.hint]) : null;
    var inner, getValue;

    if (def.type === "radio") {
      var radioInputs = [];
      var optionsWrap = el("div", { class: "pt-app__options" }, def.options.map(function (opt) {
        var input = el("input", { type: "radio", name: qid, value: opt.value });
        if (saved === opt.value) input.checked = true;
        radioInputs.push(input);
        var label = el("label", { class: "pt-app__option" }, [input, el("span", {}, [opt.label])]);
        return label;
      }));
      inner = optionsWrap;
      getValue = function () {
        var found = radioInputs.filter(function (i) { return i.checked; })[0];
        return found ? found.value : "";
      };
    } else if (def.type === "multiselect") {
      var savedSelected = (saved && saved.selected) || [];
      var savedOther = (saved && saved.other) || "";
      var checkInputs = [];
      var otherInput = null;
      var optWrap = el("div", { class: "pt-app__options" }, def.options.map(function (opt) {
        var input = el("input", { type: "checkbox", value: opt.value });
        if (savedSelected.indexOf(opt.value) !== -1) input.checked = true;
        checkInputs.push(input);
        var children = [input, el("span", {}, [opt.label])];
        var label = el("label", { class: "pt-app__option" }, children);
        if (opt.hasOther) {
          otherInput = el("input", { type: "text", class: "pt-app__other-input", placeholder: "Tell me more…", value: savedOther });
          label.appendChild(otherInput);
        }
        return label;
      }));
      inner = optWrap;
      getValue = function () {
        var selected = checkInputs.filter(function (i) { return i.checked; }).map(function (i) { return i.value; });
        return { selected: selected, other: otherInput ? otherInput.value : "" };
      };
    } else if (def.type === "textarea") {
      var textarea = el("textarea", { rows: "4" });
      textarea.value = saved || "";
      inner = textarea;
      getValue = function () { return textarea.value; };
    } else {
      var textInput = el("input", { type: "text" });
      textInput.value = saved || "";
      inner = textInput;
      getValue = function () { return textInput.value; };
    }

    var wrap = el("div", { class: "pt-app__question" }, [labelNode, hintNode, inner]);
    return { wrap: wrap, getValue: getValue };
  }

  // ---- Outcome: qualified / recommendation ---------------------------

  function renderRecommendation() {
    var plan = state.result.plan;
    var actions = el("div", { class: "pt-app__outcome-actions" });

    var reserveBtn = el("a", {
      class: "btn btn-pill btn-primary",
      href: CONFIG.DEPOSIT_LINK,
      target: "_blank",
      rel: "noopener"
    }, ["Reserve your Strategy Session — " + CONFIG.DEPOSIT_LABEL]);

    var calendlyBtn = el("a", {
      class: "btn btn-pill btn-secondary",
      href: CONFIG.CALENDLY_URL,
      target: "_blank",
      rel: "noopener"
    }, ["Pick your time"]);

    var declineLink = el("button", { type: "button", class: "pt-app__quiet-link" }, ["This isn't the right fit for me"]);
    declineLink.addEventListener("click", function () {
      state.view = "decline-reason";
      saveState();
      render();
    });

    actions.appendChild(reserveBtn);
    actions.appendChild(el("p", { class: "pt-app__fine-print" }, ["The " + CONFIG.DEPOSIT_LABEL + " reserves your slot and filters for serious applicants — it's not a fee for the call."]));
    actions.appendChild(calendlyBtn);
    actions.appendChild(el("div", { class: "pt-app__decline-wrap" }, [declineLink]));

    return stepWrap([
      el("p", { class: "pt-app__eyebrow" }, ["Application reviewed"]),
      el("h2", {}, ["You're a fit."]),
      el("div", { class: "pt-app__plan-card" }, [
        el("p", { class: "pt-app__plan-label" }, ["Recommended plan"]),
        el("p", { class: "pt-app__plan-value" }, [plan.label]),
        plan.note ? el("p", { class: "pt-app__plan-note" }, [plan.note]) : null
      ]),
      el("p", { class: "pt-app__body" }, ["Next is a short strategy session — we'll go deeper on your goals and history, confirm the plan above fits your life, and map out what the first weeks look like. No pressure, no obligation."]),
      actions
    ], "pt-app__step--outcome");
  }

  // ---- Outcome: decline flow ------------------------------------------

  function renderDeclineReason() {
    var radioInputs = [];
    var otherInput = null;
    var options = el("div", { class: "pt-app__options" }, DECLINE_REASONS.map(function (r) {
      var input = el("input", { type: "radio", name: "decline-reason", value: r.value });
      radioInputs.push(input);
      var children = [input, el("span", {}, [r.label])];
      var label = el("label", { class: "pt-app__option" }, children);
      if (r.hasOther) {
        otherInput = el("input", { type: "text", class: "pt-app__other-input", placeholder: "Tell me more…" });
        label.appendChild(otherInput);
      }
      return label;
    }));

    var errorBox = el("div", { class: "pt-app__error-box" });
    var continueBtn = el("button", { type: "button", class: "btn btn-pill btn-primary" }, ["Continue"]);
    continueBtn.addEventListener("click", function () {
      var found = radioInputs.filter(function (i) { return i.checked; })[0];
      if (!found) {
        errorBox.innerHTML = "";
        errorBox.appendChild(errorNode("Choose a reason so I can improve the application process."));
        return;
      }
      state.decline.reason = found.value;
      state.decline.other = otherInput ? otherInput.value : "";
      saveState();

      if (found.value === "budget") {
        state.view = "decline-budget";
      } else {
        state.view = "decline-thanks";
        logSubmission("declined");
      }
      saveState();
      render();
    });

    return stepWrap([
      el("h2", {}, ["What was the primary reason?"]),
      options,
      errorBox,
      el("div", { class: "pt-app__nav pt-app__nav--single" }, [continueBtn])
    ], "pt-app__step--outcome");
  }

  function renderDeclineBudget() {
    var input = el("input", { type: "text", placeholder: "e.g. $2,500 / month" });
    var continueBtn = el("button", { type: "button", class: "btn btn-pill btn-primary" }, ["Continue"]);
    continueBtn.addEventListener("click", function () {
      state.decline.budgetAnswer = input.value.trim();
      saveState();
      state.view = "decline-thanks";
      saveState();
      logSubmission("declined");
      render();
    });

    return stepWrap([
      el("h2", {}, ["At what monthly investment would coaching like this become a realistic decision for you?"]),
      el("p", { class: "pt-app__hint" }, ["Just research — this doesn't change anything about pricing."]),
      el("div", { class: "pt-app__fields" }, [el("div", { class: "pt-app__field" }, [input])]),
      el("div", { class: "pt-app__nav pt-app__nav--single" }, [continueBtn])
    ], "pt-app__step--outcome");
  }

  function renderDeclineThanks() {
    var newsletterLine = state.contact.newsletter
      ? el("p", { class: "pt-app__body" }, ["You'll stay on the newsletter — fitness insights, coaching updates, and future program announcements."])
      : null;
    return stepWrap([
      el("h2", {}, ["Thank you for your time."]),
      el("p", { class: "pt-app__body" }, ["I appreciate you being upfront. If things change, applications are always open."]),
      newsletterLine
    ], "pt-app__step--outcome");
  }

  // ---- Outcome: disqualified / waitlist -------------------------------

  function renderWaitlist() {
    var newsletterLine = state.contact.newsletter
      ? el("p", { class: "pt-app__body" }, ["You'll stay on the newsletter — fitness insights, coaching updates, and future program announcements."])
      : null;
    return stepWrap([
      el("p", { class: "pt-app__eyebrow" }, ["Application received"]),
      el("h2", {}, ["Thank you for applying."]),
      el("p", { class: "pt-app__body" }, ["The roster is currently full for your profile. You've been added to the waitlist — if a coaching opportunity opens up that's a better fit, you'll hear from me."]),
      newsletterLine
    ], "pt-app__step--outcome");
  }

  function renderCooldown() {
    return stepWrap([
      el("h2", {}, ["You have a recent application on file."]),
      el("p", { class: "pt-app__body" }, ["Bookings open up periodically — keep an eye on your inbox."])
    ], "pt-app__step--outcome");
  }

  // ------------------------------------------------------------------
  // 7. Submission + logging
  // ------------------------------------------------------------------
  function submitApplication() {
    var result = computeResult(state.answers);
    state.result = result;
    saveState();

    hashEmail(state.contact.email).then(function (hash) {
      recordCooldown(hash);
      logSubmission(result.qualified ? "qualified" : "disqualified");
      state.view = result.qualified ? "recommendation" : "waitlist";
      saveState();
      render();
    });
  }

  function logSubmission(outcome) {
    if (!CONFIG.APPS_SCRIPT_URL) return; // standalone mode — skip network call

    var payload = {
      timestamp: new Date().toISOString(),
      name: state.contact.name,
      email: state.contact.email,
      phone: state.contact.phone,
      newsletter: !!state.contact.newsletter,
      outcome: outcome,
      score: state.result ? state.result.score : null,
      recommendedPlan: (state.result && state.result.plan) ? state.result.plan.label : null,
      declineReason: state.decline.reason || null,
      declineOther: state.decline.other || null,
      declineBudgetAnswer: state.decline.budgetAnswer || null,
      answers: state.answers
    };

    try {
      fetch(CONFIG.APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      /* logging must never block the applicant's flow */
    }
  }

  // ------------------------------------------------------------------
  // 8. Boot
  // ------------------------------------------------------------------
  function boot() {
    if (state.contact && state.contact.email && state.view !== "recommendation" &&
        state.view !== "waitlist" && state.view !== "decline-thanks") {
      checkCooldown(state.contact.email).then(function (onCooldown) {
        if (onCooldown) {
          state.view = "cooldown";
          saveState();
        }
        render();
      });
    } else {
      render();
    }
  }

  boot();
})();
