const loader = document.querySelector("[data-loader]");
const transition = document.querySelector("[data-transition]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const themeToggle = document.querySelector("[data-theme-toggle]");
const year = document.querySelector("[data-year]");

if (year) year.textContent = new Date().getFullYear();

function hideLoader() {
  setTimeout(() => loader?.classList.add("is-hidden"), 350);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hideLoader);
} else {
  hideLoader();
}
window.addEventListener("load", hideLoader);
setTimeout(hideLoader, 1400);

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
if (themeToggle) {
  themeToggle.textContent = document.documentElement.dataset.theme === "dark" ? "Light" : "Dark";
  themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    themeToggle.textContent = next === "dark" ? "Light" : "Dark";
  });
}

document.querySelectorAll('a[href$=".html"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.href === location.href) return;
    event.preventDefault();
    transition?.classList.add("is-active");
    setTimeout(() => {
      location.href = link.href;
    }, 260);
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const counterSection = document.querySelector("[data-counter-section]");
const counters = document.querySelectorAll("[data-counter]");
let countersStarted = false;
function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || "0");
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
if (counterSection) {
  new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) animateCounters();
  }, { threshold: 0.35 }).observe(counterSection);
}

const testimonialSlider = document.querySelector("[data-testimonials]");
if (testimonialSlider) {
  const slides = Array.from(testimonialSlider.querySelectorAll("article"));
  let active = 0;
  setInterval(() => {
    slides[active].classList.remove("active");
    active = (active + 1) % slides.length;
    slides[active].classList.add("active");
  }, 3800);
}

const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = lightbox?.querySelector("img");
document.querySelectorAll("[data-lightbox]").forEach((item) => {
  item.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = item.dataset.lightbox || "";
    lightbox.classList.add("is-open");
  });
});
document.querySelector("[data-lightbox-close]")?.addEventListener("click", () => {
  lightbox?.classList.remove("is-open");
});
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.classList.remove("is-open");
});
