/* main.js — vanilla JS, no dependencies, no CDN. */

(function () {
  "use strict";

  // Footer year — kept in JS so it never goes stale on a static site.
  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ==================================================================
  //  TESTIMONIALS  —  KC: this is the only thing you edit here.
  // ==================================================================
  //  Add a real client testimonial by pasting a new block into the
  //  array below, following this exact shape:
  //
  //      {
  //        quote: "What the client actually said.",
  //        attribution: "First name / initials — Online PT client, Dubai"
  //      },
  //
  //  Rules:
  //   • Only real, consented client words. Never invent one.
  //   • Anonymise if the client prefers (initials / city is fine).
  //   • Hindi testimonials are welcome — paste the Hindi text directly.
  //
  //  While this array is EMPTY, the whole "Results" section hides
  //  itself automatically, so the page looks intentional with zero
  //  testimonials. The moment you add one, the section appears.
  // ==================================================================
  var testimonials = [
    // (empty for launch — add your first real testimonial above this line)
  ];

  var grid = document.getElementById("testimonial-grid");
  var resultsSection = document.getElementById("results");

  if (testimonials.length === 0) {
    // No testimonials yet → hide the Results section entirely, and hide
    // every nav/footer link that points at it so nothing scrolls nowhere.
    if (resultsSection) {
      resultsSection.hidden = true;
    }
    document.querySelectorAll('a[href="#results"]').forEach(function (link) {
      link.hidden = true;
    });
  } else if (grid) {
    testimonials.forEach(function (t, i) {
      var card = document.createElement("figure");
      card.className = "testimonial-card";
      card.style.setProperty("--stagger", i);

      var quote = document.createElement("blockquote");
      quote.textContent = t.quote;

      var caption = document.createElement("figcaption");
      caption.textContent = t.attribution;

      card.appendChild(quote);
      card.appendChild(caption);
      grid.appendChild(card);
    });
  }
})();
