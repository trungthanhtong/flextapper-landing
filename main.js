const APK_URL = "downloads/FlexTapper.apk";
const CONTACT_EMAIL = "support@flextapper.app";
const SITE_URL = "https://flextapper.app";

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const apkLinks = document.querySelectorAll("[data-apk-link]");
const contactLinks = document.querySelectorAll("[data-contact-link]");
const yearNode = document.querySelector("[data-current-year]");

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeMobileNav() {
  if (!navToggle || !navMenu) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
  navMenu.classList.remove("is-open");
  document.body.classList.remove("nav-open");
}

function openMobileNav() {
  if (!navToggle || !navMenu) return;
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Close menu");
  navMenu.classList.add("is-open");
  document.body.classList.add("nav-open");
}

apkLinks.forEach((link) => {
  link.href = APK_URL;
  link.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("flextapper:cta", {
      detail: {
        action: link.dataset.cta || "download",
        href: APK_URL,
        siteUrl: SITE_URL
      }
    }));
  });
});

contactLinks.forEach((link) => {
  link.href = `mailto:${CONTACT_EMAIL}`;
});

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });
}

document.querySelectorAll(".faq-item").forEach((item) => {
  const button = item.querySelector("button");
  if (!button) return;

  button.addEventListener("click", () => {
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileNav();
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();
