/* ==========================================================================
   application.js — simple single-page interest form.
   Vanilla JS, no dependencies, no build step (file:// safe).
   Mounts into #pt-application on apply.html.

   NOTE: the long multi-step qualification funnel (scoring, auto-
   disqualifiers, deposit, Calendly, cooldown) has been shelved. Its
   logic is preserved in git history — see FUNNEL-SETUP.md. This file
   is a plain "register your interest" form: one page, one submit,
   same thank-you for everyone.
   ========================================================================== */

(function () {
  "use strict";

  var mount = document.getElementById("pt-application");
  if (!mount) return;

  // ------------------------------------------------------------------
  // CONFIG
  // ------------------------------------------------------------------
  var CONFIG = {
    // Google Apps Script web app URL (doPost). Leave empty to skip
    // network logging entirely — the form works standalone without it.
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
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" }
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
    } catch (err) {
      return {};
    }
  }

  function saveState(state) {
    try {
      window.localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      // storage unavailable — fine, just no autosave
    }
  }

  function clearState() {
    try {
      window.localStorage.removeItem(CONFIG.STORAGE_KEY);
    } catch (err) {}
  }

  var state = loadState();

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (key) {
      if (key === "text") {
        node.textContent = attrs[key];
      } else if (key === "html") {
        node.innerHTML = attrs[key];
      } else {
        node.setAttribute(key, attrs[key]);
      }
    });
    (children || []).forEach(function (child) {
      if (child) node.appendChild(child);
    });
    return node;
  }

  function radioGroup(name, options, checkedValue) {
    var wrap = el("div", { class: "pt-app__options" });
    options.forEach(function (opt) {
      var input = el("input", { type: "radio", name: name, value: opt.value });
      if (checkedValue === opt.value) input.setAttribute("checked", "checked");
      var label = el("label", { class: "pt-app__option" }, [
        input,
        el("span", { text: opt.label })
      ]);
      wrap.appendChild(label);
    });
    return wrap;
  }

  function checkboxGroup(name, options, checkedValues) {
    checkedValues = checkedValues || [];
    var wrap = el("div", { class: "pt-app__options" });
    options.forEach(function (opt) {
      var input = el("input", { type: "checkbox", name: name, value: opt.value });
      if (checkedValues.indexOf(opt.value) !== -1) input.setAttribute("checked", "checked");
      var label = el("label", { class: "pt-app__option" }, [
        input,
        el("span", { text: opt.label })
      ]);
      wrap.appendChild(label);
    });
    return wrap;
  }

  // ------------------------------------------------------------------
  // Render: form
  // ------------------------------------------------------------------
  function renderForm() {
    mount.innerHTML = "";

    var card = el("div", { class: "pt-app" });
    var stepWrap = el("div", { class: "pt-app__step" });

    var form = el("form", { novalidate: "novalidate" });

    var errorBox = el("div", { class: "pt-app__error-box", role: "alert" });
    form.appendChild(errorBox);

    var fields = el("div", { class: "pt-app__fields" });

    // Section 1 — details
    fields.appendChild(sectionHeading("Your details"));

    var nameField = el("div", { class: "pt-app__field" }, [
      el("label", { for: "f-name", text: "Full name" }),
      el("input", { type: "text", id: "f-name", name: "name", autocomplete: "name", value: state.name || "" })
    ]);
    fields.appendChild(nameField);

    var emailField = el("div", { class: "pt-app__field" }, [
      el("label", { for: "f-email", text: "Email" }),
      el("input", { type: "email", id: "f-email", name: "email", autocomplete: "email", value: state.email || "" })
    ]);
    fields.appendChild(emailField);

    var ageField = el("div", { class: "pt-app__field" }, [
      el("label", { for: "f-age", text: "Age" }),
      el("input", { type: "number", id: "f-age", name: "age", min: "13", max: "100", value: state.age || "" })
    ]);
    fields.appendChild(ageField);

    var genderQ = el("div", { class: "pt-app__question" }, [
      el("p", { class: "pt-app__q-label", text: "Gender" }),
      radioGroup("gender", GENDER_OPTIONS, state.gender)
    ]);
    fields.appendChild(genderQ);

    // Section 2 — requirements
    fields.appendChild(sectionHeading("What are you looking for?"));
    var reqQ = el("div", { class: "pt-app__question" }, [
      el("p", { class: "pt-app__hint", text: "Choose all that apply" }),
      checkboxGroup("requirements", REQUIREMENTS, state.requirements)
    ]);
    fields.appendChild(reqQ);

    // Section 3 — days per week
    fields.appendChild(sectionHeading("How many days a week do you want to train?"));
    fields.appendChild(el("div", { class: "pt-app__question" }, [
      radioGroup("days_per_week", DAYS_OPTIONS, state.days_per_week)
    ]));

    // Section 4 — budget
    fields.appendChild(sectionHeading("What are you comfortable investing per month?"));
    fields.appendChild(el("div", { class: "pt-app__question" }, [
      radioGroup("budget", BUDGET_OPTIONS, state.budget)
    ]));

    // Section 5 — timing
    fields.appendChild(sectionHeading("Preferred class timing"));
    fields.appendChild(el("div", { class: "pt-app__question" }, [
      radioGroup("timing", TIMING_OPTIONS, state.timing)
    ]));

    // Section 6 — source
    fields.appendChild(sectionHeading("Where did you hear about me?"));
    var sourceOptionsWrap = radioGroup("source", SOURCE_OPTIONS, state.source);
    var otherInput = el("input", {
      type: "text",
      class: "pt-app__other-input",
      name: "source_other",
      placeholder: "Tell us where",
      value: state.source_other || ""
    });
    otherInput.style.display = state.source === "other" ? "" : "none";
    // Attach the "other" text input inside the "Other" option label so it
    // sits with its option visually.
    var otherLabel = Array.prototype.find.call(
      sourceOptionsWrap.querySelectorAll(".pt-app__option"),
      function (labelEl) {
        var input = labelEl.querySelector("input");
        return input && input.value === "other";
      }
    );
    if (otherLabel) otherLabel.appendChild(otherInput);
    fields.appendChild(el("div", { class: "pt-app__question" }, [sourceOptionsWrap]));

    // Section 7 — start when
    fields.appendChild(sectionHeading("When do you want to begin?"));
    fields.appendChild(el("div", { class: "pt-app__question" }, [
      radioGroup("start_when", START_OPTIONS, state.start_when)
    ]));

    form.appendChild(fields);

    var nav = el("div", { class: "pt-app__nav pt-app__nav--single" }, [
      el("button", { type: "submit", class: "btn btn-pill", text: "Register my interest" })
    ]);
    form.appendChild(nav);

    stepWrap.appendChild(form);
    card.appendChild(stepWrap);
    mount.appendChild(card);

    // -----------------------------------------------------------
    // Behavior: autosave + "other" reveal
    // -----------------------------------------------------------
    form.addEventListener("input", function () {
      saveState(collect(form));
      var sourceValue = getRadioValue(form, "source");
      otherInput.style.display = sourceValue === "other" ? "" : "none";
    });

    form.addEventListener("change", function () {
      saveState(collect(form));
      var sourceValue = getRadioValue(form, "source");
      otherInput.style.display = sourceValue === "other" ? "" : "none";
    });

    form.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var data = collect(form);
      var errors = validate(data);
      if (errors.length) {
        renderErrors(errorBox, errors);
        errorBox.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      errorBox.innerHTML = "";
      submit(data);
    });
  }

  function sectionHeading(text) {
    return el("h2", { class: "pt-app__section-heading", text: text });
  }

  function getRadioValue(form, name) {
    var checked = form.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : "";
  }

  function getCheckboxValues(form, name) {
    var nodes = form.querySelectorAll('input[name="' + name + '"]:checked');
    return Array.prototype.map.call(nodes, function (n) { return n.value; });
  }

  function collect(form) {
    return {
      name: (form.querySelector('[name="name"]').value || "").trim(),
      email: (form.querySelector('[name="email"]').value || "").trim(),
      age: (form.querySelector('[name="age"]').value || "").trim(),
      gender: getRadioValue(form, "gender"),
      requirements: getCheckboxValues(form, "requirements"),
      days_per_week: getRadioValue(form, "days_per_week"),
      budget: getRadioValue(form, "budget"),
      timing: getRadioValue(form, "timing"),
      source: getRadioValue(form, "source"),
      source_other: (form.querySelector('[name="source_other"]').value || "").trim(),
      start_when: getRadioValue(form, "start_when")
    };
  }

  function validate(data) {
    var errors = [];
    if (!data.name) errors.push("Please enter your full name.");
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Please enter a valid email address.");
    }
    var age = Number(data.age);
    if (!data.age || isNaN(age) || age < 13 || age > 100) {
      errors.push("Please enter a valid age between 13 and 100.");
    }
    if (!data.gender) errors.push("Please select a gender option.");
    if (!data.requirements || !data.requirements.length) {
      errors.push("Please choose at least one thing you're looking for.");
    }
    if (!data.days_per_week) errors.push("Please choose how many days a week you want to train.");
    if (!data.budget) errors.push("Please choose a monthly investment range.");
    if (!data.timing) errors.push("Please choose a preferred class timing.");
    if (!data.source) errors.push("Please tell us where you heard about KC.");
    if (data.source === "other" && !data.source_other) {
      errors.push("Please tell us where — you selected \"Other\".");
    }
    if (!data.start_when) errors.push("Please choose when you want to begin.");
    return errors;
  }

  function renderErrors(errorBox, errors) {
    errorBox.innerHTML = "";
    errors.forEach(function (msg) {
      errorBox.appendChild(el("p", { class: "pt-app__error", text: msg }));
    });
  }

  // ------------------------------------------------------------------
  // Submission
  // ------------------------------------------------------------------
  function submit(data) {
    var payload = {
      name: data.name,
      email: data.email,
      age: data.age,
      gender: data.gender,
      requirements: data.requirements.join(", "),
      days_per_week: data.days_per_week,
      budget: data.budget,
      timing: data.timing,
      source: data.source,
      source_other: data.source_other,
      start_when: data.start_when,
      submitted_at: new Date().toISOString()
    };

    if (CONFIG.APPS_SCRIPT_URL) {
      try {
        fetch(CONFIG.APPS_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "text/plain;charset=utf-8" }
        }).catch(function () {
          // no-cors gives no readable response either way; swallow network errors
          // so the thank-you screen always shows.
        });
      } catch (err) {
        // ignore — still show thank-you
      }
    }

    clearState();
    renderThankYou();
  }

  // ------------------------------------------------------------------
  // Render: thank-you
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
  renderForm();
})();
