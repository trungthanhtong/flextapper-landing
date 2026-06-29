const DEFAULT_APK_URL = "/downloads/FlexTapper.apk";
const RELEASE_METADATA_URL = "/downloads/metadata.json";
const CONTACT_EMAIL = "support@flextapper.com";
const SITE_URL = "https://flextapper.com";

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const apkLinks = document.querySelectorAll("[data-apk-link]");
const contactLinks = document.querySelectorAll("[data-contact-link]");
const yearNode = document.querySelector("[data-current-year]");
const releaseStatus = document.querySelector("[data-release-status]");
const releaseVersion = document.querySelector("[data-release-version]");
const releaseUpdated = document.querySelector("[data-release-updated]");
const releaseSize = document.querySelector("[data-release-size]");
const releaseNotes = document.querySelector("[data-release-notes]");
const releaseChecksum = document.querySelector("[data-release-checksum]");

let currentApkUrl = DEFAULT_APK_URL;

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

function setApkUrl(url) {
  if (!url) return;
  currentApkUrl = url;
  apkLinks.forEach((link) => {
    link.href = currentApkUrl;
  });
}

apkLinks.forEach((link) => {
  link.href = currentApkUrl;
  link.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("flextapper:cta", {
      detail: {
        action: link.dataset.cta || "download",
        href: currentApkUrl,
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
loadReleaseMetadata();

async function loadReleaseMetadata() {
  if (!releaseStatus) return;

  if (!shouldFetchReleaseMetadata()) {
    releaseStatus.textContent = "Release details will appear after the first signed APK publishes.";
    return;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(RELEASE_METADATA_URL, {
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Release metadata request failed: ${response.status}`);
    }

    applyReleaseMetadata(await response.json());
  } catch {
    releaseStatus.textContent = "Release details will appear after the first signed APK publishes.";
  } finally {
    window.clearTimeout(timeout);
  }
}

function shouldFetchReleaseMetadata() {
  const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
  const isLocalPreview = localHosts.has(window.location.hostname);
  const forceLocalFetch = new URLSearchParams(window.location.search).has("release-metadata");

  return !isLocalPreview || forceLocalFetch;
}

function applyReleaseMetadata(metadata) {
  if (!metadata || typeof metadata !== "object") return;

  setApkUrl(metadata.apkUrl || DEFAULT_APK_URL);

  if (releaseStatus) {
    releaseStatus.textContent = "Current signed Android build, published from the main branch.";
  }

  if (releaseVersion) {
    const versionName = metadata.versionName ? `v${metadata.versionName}` : "Latest";
    const versionCode = Number.isFinite(Number(metadata.versionCode)) ? ` (${metadata.versionCode})` : "";
    releaseVersion.textContent = `${versionName}${versionCode}`;
  }

  if (releaseUpdated) {
    releaseUpdated.textContent = formatReleaseDate(metadata.updatedAt);
  }

  if (releaseSize) {
    releaseSize.textContent = formatFileSize(metadata.fileSizeBytes);
  }

  if (releaseChecksum && metadata.sha256) {
    releaseChecksum.textContent = metadata.sha256;
  }

  if (releaseNotes && Array.isArray(metadata.releaseNotes) && metadata.releaseNotes.length > 0) {
    releaseNotes.replaceChildren(...metadata.releaseNotes.map((note) => {
      const item = document.createElement("li");
      item.textContent = note;
      return item;
    }));
  }
}

function formatReleaseDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Available after publish";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function formatFileSize(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return "Available after publish";

  const units = ["B", "KB", "MB", "GB"];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const precision = unitIndex === 0 || size >= 10 ? 0 : 1;
  return `${size.toFixed(precision)} ${units[unitIndex]}`;
}
