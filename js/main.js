(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* Logo fallback: shows the "assets/logo.png" you'll add, falls back to
     the text wordmark until that file exists. */
  var logoImg = document.getElementById("logo-img");
  var logoText = document.getElementById("logo-text");
  if (logoImg) {
    logoImg.addEventListener("error", function () {
      logoImg.style.display = "none";
      logoText.style.display = "flex";
    });
  }

  /* Sticky header shadow on scroll */
  var header = document.getElementById("site-header");
  var lastState = false;
  function onScroll() {
    var scrolled = window.scrollY > 8;
    if (scrolled !== lastState) {
      header.classList.toggle("scrolled", scrolled);
      lastState = scrolled;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  function closeNav() {
    navToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("open");
  }
  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* Scroll-reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---- Lead form ---- */
  var form = document.getElementById("lead-form");
  var statusEl = document.getElementById("form-status");
  var submitBtn = document.getElementById("form-submit");

  var validators = {
    name: function (v) { return v.trim().length > 0 ? "" : "Please enter your name."; },
    email: function (v) {
      if (!v.trim()) return "Please enter your email.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address.";
    },
    phone: function (v) { return v.trim().length > 0 ? "" : "Please enter a phone number."; }
  };

  function setFieldError(field, message) {
    var wrap = field.closest(".form-field");
    var errorEl = document.getElementById(field.id + "-error");
    if (message) {
      wrap.classList.add("has-error");
      field.setAttribute("aria-invalid", "true");
      if (errorEl) { errorEl.textContent = message; field.setAttribute("aria-describedby", errorEl.id); }
    } else {
      wrap.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
      if (errorEl) errorEl.textContent = "";
    }
  }

  function validateField(field) {
    var validator = validators[field.name];
    if (!validator) return true;
    var message = validator(field.value);
    setFieldError(field, message);
    return !message;
  }

  Object.keys(validators).forEach(function (name) {
    var field = form.elements[name];
    if (field) field.addEventListener("blur", function () { validateField(field); });
  });

  function showStatus(kind, message) {
    statusEl.hidden = false;
    statusEl.className = "form-status " + kind;
    statusEl.textContent = message;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var fieldsValid = Object.keys(validators)
      .map(function (name) { return validateField(form.elements[name]); })
      .every(Boolean);

    if (!fieldsValid) {
      showStatus("error", "Please fix the highlighted fields and try again.");
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var endpoint = form.getAttribute("action");
    var isPlaceholder = !endpoint || endpoint.indexOf("YOUR_FORM_ID") !== -1;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    if (isPlaceholder) {
      // No live form endpoint configured yet -- see README for setup.
      window.setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Request a Proposal";
        showStatus(
          "error",
          "This form isn't connected to an inbox yet. Add your Formspree endpoint in index.html (see README) to start receiving enquiries."
        );
      }, 400);
      return;
    }

    fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (res) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Request a Proposal";
        if (res.ok) {
          form.reset();
          showStatus("success", "Thanks — your request has been sent. We'll be in touch within one business day.");
        } else {
          showStatus("error", "Something went wrong sending your request. Please try again or call us directly.");
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Request a Proposal";
        showStatus("error", "Something went wrong sending your request. Please try again or call us directly.");
      });
  });
})();
