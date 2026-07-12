/* ==========================================================================
   application.js — stepped "register your interest" form.
   Vanilla JS, no dependencies, no build step (file:// safe).
   Mounts into #pt-application on apply.html.

   One question (step) at a time — answer, Continue, the next appears.
   No scoring / disqualifiers / deposit — a plain interest form that posts
   to a Google Sheet (Apps Script) and shows the same thank-you for everyone.
   ========================================================================== */

(function () {
  "use strict";

  var mount = document.getElementById("pt-application");
  if (!mount) return;

  // ------------------------------------------------------------------
  // CONFIG
  // ------------------------------------------------------------------
  var CONFIG = {
    APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbysqDzsWCt1im0AbehIVTgnNNZLQundzNGEiMlAHN-cC9RUybsjeoOnex3nhvWg8xrH/exec",
    STORAGE_KEY: "kc-interest-form-v1"
  };

  // ------------------------------------------------------------------
  // Question content
  // ------------------------------------------------------------------
  var REQUIREMENTS = [
    { value: "fat-loss", label: "Fat loss" },
    { value: "general-health", label: "General health" },
    { value: "injury-prevention", label: "Injury prevention" },
    { value: "holistic-coaching", label: "Full holistic coaching" },
    { value: "clarity-in-life", label: "Clarity in life" }
  ];
  var DAYS_OPTIONS = [
    { value: "3", label: "3 days" },
    { value: "4", label: "4 days" },
    { value: "5", label: "5 days" }
  ];
  var BUDGET_OPTIONS = [
    { value: "30000", label: "₹30,000+" },
    { value: "40000", label: "₹40,000+" },
    { value: "50000", label: "₹50,000+" },
    { value: "whatever-it-takes", label: "Whatever it takes to get results" }
  ];
  var TIMING_OPTIONS = [
    { value: "early-morning", label: "Early morning (6–8 AM)" },
    { value: "early-afternoon", label: "Early afternoon (11 AM–2 PM)" },
    { value: "early-evening", label: "Early evening (5–7 PM)" },
    { value: "none", label: "None of these" }
  ];
  var SOURCE_OPTIONS = [
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "referral", label: "A friend / referral" },
    { value: "google", label: "Google search" },
    { value: "facebook", label: "Facebook" },
    { value: "other", label: "Other" }
  ];
  var START_OPTIONS = [
    { value: "asap", label: "As soon as possible" },
    { value: "upcoming-week", label: "In the upcoming week" },
    { value: "upcoming-month", label: "In the upcoming month" }
  ];
  var GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" }
  ];

  // ------------------------------------------------------------------
  // State + localStorage
  // ------------------------------------------------------------------
  function loadState() {
    try {
      var raw = window.localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (err) { return {}; }
  }
  function saveState(s) {
    try { window.localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(s)); } catch (err) {}
  }
  function clearState() {
    try { window.localStorage.removeItem(CONFIG.STORAGE_KEY); } catch (err) {}
  }

  var answers = loadState();
  var currentStep = 0;

  // ------------------------------------------------------------------
  // DOM helpers
  // ------------------------------------------------------------------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      if (key === "text") node.textContent = attrs[key];
      else if (key === "html") node.innerHTML = attrs[key];
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) { if (child) node.appendChild(child); });
    return node;
  }

  function radioGroup(name, options, checkedValue) {
    var wrap = el("div", { class: "pt-app__options" });
    options.forEach(function (opt) {
      var input = el("input", { type: "radio", name: name, value: opt.value });
      if (checkedValue === opt.value) input.setAttribute("checked", "checked");
      wrap.appendChild(el("label", { class: "pt-app__option" }, [input, el("span", { text: opt.label })]));
    });
    return wrap;
  }

  function checkboxGroup(name, options, checkedValues) {
    checkedValues = checkedValues || [];
    var wrap = el("div", { class: "pt-app__options" });
    options.forEach(function (opt) {
      var input = el("input", { type: "checkbox", name: name, value: opt.value });
      if (checkedValues.indexOf(opt.value) !== -1) input.setAttribute("checked", "checked");
      wrap.appendChild(el("label", { class: "pt-app__option" }, [input, el("span", { text: opt.label })]));
    });
    return wrap;
  }

  function field(labelText, inputEl) {
    return el("div", { class: "pt-app__field" }, [el("label", { text: labelText }), inputEl]);
  }

  // Safe readers (only the current step's fields exist in the DOM)
  function val(form, name) {
    var n = form.querySelector('[name="' + name + '"]');
    return n ? (n.value || "").trim() : "";
  }
  function radioVal(form, name) {
    var n = form.querySelector('input[name="' + name + '"]:checked');
    return n ? n.value : "";
  }
  function checkVals(form, name) {
    var nodes = form.querySelectorAll('input[name="' + name + '"]:checked');
    return Array.prototype.map.call(nodes, function (n) { return n.value; });
  }

  // ------------------------------------------------------------------
  // Steps — one question (or one logical group) per screen
  // ------------------------------------------------------------------
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var STEPS = [
    {
      key: "details",
      heading: "Your details",
      render: function (box) {
        // Honeypot — hidden from humans; server drops any submission where it's filled.
        box.appendChild(el("div", {
          "aria-hidden": "true",
          style: "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden"
        }, [
          el("label", { for: "f-company", text: "Company" }),
          el("input", { type: "text", id: "f-company", name: "company", tabindex: "-1", autocomplete: "off", value: "" })
        ]));
        box.appendChild(field("Full name", el("input", { type: "text", name: "name", autocomplete: "name", value: answers.name || "" })));
        box.appendChild(field("Email", el("input", { type: "email", name: "email", autocomplete: "email", value: answers.email || "" })));
        box.appendChild(field("Age", el("input", { type: "number", name: "age", min: "13", max: "100", value: answers.age || "" })));
        box.appendChild(el("div", { class: "pt-app__question" }, [
          el("p", { class: "pt-app__q-label", text: "Gender" }),
          radioGroup("gender", GENDER_OPTIONS, answers.gender)
        ]));
      },
      collect: function (form) {
        return {
          name: val(form, "name"), email: val(form, "email"), age: val(form, "age"),
          gender: radioVal(form, "gender"), company: val(form, "company")
        };
      },
      validate: function (v) {
        var e = [];
        if (!v.name) e.push("Please enter your full name.");
        if (!v.email || !emailRe.test(v.email)) e.push("Please enter a valid email address.");
        var age = Number(v.age);
        if (!v.age || isNaN(age) || age < 13 || age > 100) e.push("Please enter a valid age between 13 and 100.");
        if (!v.gender) e.push("Please select a gender option.");
        return e;
      }
    },
    {
      key: "requirements",
      heading: "What are you looking for?",
      hint: "Choose all that apply",
      render: function (box) { box.appendChild(checkboxGroup("requirements", REQUIREMENTS, answers.requirements)); },
      collect: function (form) { return { requirements: checkVals(form, "requirements") }; },
      validate: function (v) { return (!v.requirements || !v.requirements.length) ? ["Please choose at least one thing you're looking for."] : []; }
    },
    {
      key: "days",
      heading: "How many days a week do you want to train?",
      render: function (box) { box.appendChild(radioGroup("days_per_week", DAYS_OPTIONS, answers.days_per_week)); },
      collect: function (form) { return { days_per_week: radioVal(form, "days_per_week") }; },
      validate: function (v) { return !v.days_per_week ? ["Please choose how many days a week you want to train."] : []; }
    },
    {
      key: "budget",
      heading: "What are you comfortable investing per month?",
      render: function (box) { box.appendChild(radioGroup("budget", BUDGET_OPTIONS, answers.budget)); },
      collect: function (form) { return { budget: radioVal(form, "budget") }; },
      validate: function (v) { return !v.budget ? ["Please choose a monthly investment range."] : []; }
    },
    {
      key: "timing",
      heading: "Preferred class timing",
      render: function (box) { box.appendChild(radioGroup("timing", TIMING_OPTIONS, answers.timing)); },
      collect: function (form) { return { timing: radioVal(form, "timing") }; },
      validate: function (v) { return !v.timing ? ["Please choose a preferred class timing."] : []; }
    },
    {
      key: "source",
      heading: "Where did you hear about me?",
      render: function (box) {
        var group = radioGroup("source", SOURCE_OPTIONS, answers.source);
        var other = el("input", { type: "text", class: "pt-app__other-input", name: "source_other", placeholder: "Tell us where", value: answers.source_other || "" });
        other.style.display = answers.source === "other" ? "" : "none";
        var otherLabel = Array.prototype.find.call(group.querySelectorAll(".pt-app__option"), function (l) {
          var i = l.querySelector("input"); return i && i.value === "other";
        });
        if (otherLabel) otherLabel.appendChild(other);
        box.appendChild(group);
      },
      onChange: function (form) {
        var other = form.querySelector('[name="source_other"]');
        if (other) other.style.display = radioVal(form, "source") === "other" ? "" : "none";
      },
      collect: function (form) { return { source: radioVal(form, "source"), source_other: val(form, "source_other") }; },
      validate: function (v) {
        if (!v.source) return ["Please tell us where you heard about me."];
        if (v.source === "other" && !v.source_other) return ["Please tell us where — you selected “Other”."];
        return [];
      }
    },
    {
      key: "start",
      heading: "When do you want to begin?",
      render: function (box) { box.appendChild(radioGroup("start_when", START_OPTIONS, answers.start_when)); },
      collect: function (form) { return { start_when: radioVal(form, "start_when") }; },
      validate: function (v) { return !v.start_when ? ["Please choose when you want to begin."] : []; }
    }
  ];

  function mergeInto(vals) {
    Object.keys(vals).forEach(function (k) { answers[k] = vals[k]; });
    saveState(answers);
  }

  // ------------------------------------------------------------------
  // Render one step
  // ------------------------------------------------------------------
  function renderStep() {
    mount.innerHTML = "";
    var step = STEPS[currentStep];
    var isLast = currentStep === STEPS.length - 1;

    var card = el("div", { class: "pt-app" });
    var stepWrap = el("div", { class: "pt-app__step" });

    // Progress
    var barFill = el("span");
    barFill.style.width = (((currentStep + 1) / STEPS.length) * 100) + "%";
    stepWrap.appendChild(el("div", { class: "pt-app__progress" }, [
      el("div", { class: "pt-app__progress-bar" }, [barFill]),
      el("p", { class: "pt-app__progress-label", text: "Step " + (currentStep + 1) + " of " + STEPS.length })
    ]));

    var form = el("form", { novalidate: "novalidate" });
    var errorBox = el("div", { class: "pt-app__error-box", role: "alert" });
    form.appendChild(errorBox);

    form.appendChild(el("h2", { class: "pt-app__section-heading", text: step.heading }));
    if (step.hint) form.appendChild(el("p", { class: "pt-app__hint", text: step.hint }));

    var fields = el("div", { class: "pt-app__fields" });
    step.render(fields);
    form.appendChild(fields);

    // Nav
    var nav = el("div", { class: currentStep > 0 ? "pt-app__nav" : "pt-app__nav pt-app__nav--single" });
    if (currentStep > 0) {
      var back = el("button", { type: "button", class: "btn btn-pill btn-secondary", text: "Back" });
      back.addEventListener("click", function () {
        mergeInto(step.collect(form));
        currentStep--;
        renderStep();
      });
      nav.appendChild(back);
    }
    nav.appendChild(el("button", { type: "submit", class: "btn btn-pill btn-primary", text: isLast ? "Register my interest" : "Continue" }));
    form.appendChild(nav);

    stepWrap.appendChild(form);
    card.appendChild(stepWrap);
    mount.appendChild(card);

    // Autosave + source-other reveal
    form.addEventListener("input", function () { mergeInto(step.collect(form)); });
    form.addEventListener("change", function () {
      mergeInto(step.collect(form));
      if (step.onChange) step.onChange(form);
    });

    form.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var vals = step.collect(form);
      mergeInto(vals);
      var errs = step.validate(vals);
      if (errs.length) {
        renderErrors(errorBox, errs);
        errorBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      errorBox.innerHTML = "";
      if (isLast) { submit(answers); }
      else { currentStep++; renderStep(); }
    });

    // Focus the first input for keyboard flow
    var first = form.querySelector('input:not([type=hidden]):not([tabindex="-1"]), textarea');
    if (first) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
  }

  function renderErrors(errorBox, errors) {
    errorBox.innerHTML = "";
    errors.forEach(function (msg) { errorBox.appendChild(el("p", { class: "pt-app__error", text: msg })); });
  }

  // ------------------------------------------------------------------
  // Submission
  // ------------------------------------------------------------------
  function submit(data) {
    var payload = {
      name: data.name, email: data.email, age: data.age, gender: data.gender,
      requirements: (data.requirements || []).join(", "),
      days_per_week: data.days_per_week, budget: data.budget, timing: data.timing,
      source: data.source, source_other: data.source_other, start_when: data.start_when,
      company: data.company, // honeypot
      submitted_at: new Date().toISOString()
    };

    if (CONFIG.APPS_SCRIPT_URL) {
      try {
        fetch(CONFIG.APPS_SCRIPT_URL, {
          method: "POST", mode: "no-cors",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "text/plain;charset=utf-8" }
        }).catch(function () {});
      } catch (err) {}
    }

    clearState();
    renderThankYou();
  }

  // ------------------------------------------------------------------
  // Thank-you
  // ------------------------------------------------------------------
  function renderThankYou() {
    mount.innerHTML = "";
    var card = el("div", { class: "pt-app" });
    var stepWrap = el("div", { class: "pt-app__step pt-app__step--outcome" });
    stepWrap.appendChild(el("h2", { text: "Thank you for showing your interest." }));
    stepWrap.appendChild(el("p", {
      class: "pt-app__body",
      text: "We'll get back to you when classes open up that fit your preferences. Thank you for your time — I hope to start working with you soon."
    }));
    stepWrap.appendChild(el("div", { class: "pt-app__decline-wrap" }, [
      el("a", { class: "pt-app__quiet-link", href: "/", text: "Back to homepage" })
    ]));
    card.appendChild(stepWrap);
    mount.appendChild(card);
  }

  // ------------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------------
  renderStep();
})();
