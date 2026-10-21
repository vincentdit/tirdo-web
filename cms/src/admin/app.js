import logo from "./extensions/logo.jpg";
import { LOGIN_CSS } from "./extensions/login-css.js";

// TIRDO brand: teal #006979 · blue #17488e · gold #f2c500 · pale #f3f7f8
const brand = {
  primary100: "#f3f7f8",
  primary200: "#d4e8eb",
  primary500: "#006979",
  primary600: "#00566b",
  primary700: "#17488e",
  buttonPrimary500: "#006979",
  buttonPrimary600: "#00566b",
  danger100: "#fdecec",
  danger500: "#c0392b",
  danger600: "#9b1c1c",
  danger700: "#7a1515",
};

const FRIENDLY_ERRORS = {
  "invalid credentials":
    "The email or password is not correct. Check your details and try again.",
  "invalid identifier or password":
    "The email or password is not correct. Check your details and try again.",
  "missing credentials": "Enter your TIRDO email and password to sign in.",
  "forbidden": "This account is not allowed to access TIRDO Content Manager.",
};

function friendlyAuthError(text) {
  const key = String(text || "")
    .trim()
    .toLowerCase();
  if (FRIENDLY_ERRORS[key]) return FRIENDLY_ERRORS[key];
  if (key.includes("network") || key.includes("failed to fetch") || key === "something went wrong") {
    return "Could not reach TIRDO Content Manager. Check your connection and try again.";
  }
  return text;
}

function isAuthScreen() {
  return Boolean(document.querySelector('header [aria-label="Select interface language"]'));
}

function applyAuthChrome() {
  if (typeof document === "undefined") return;

  document.title = isAuthScreen()
    ? "Sign in | TIRDO Content Management"
    : "TIRDO Content Manager";

  let footer = document.querySelector(".tirdo-auth-footer");
  if (!footer) {
    footer = document.createElement("footer");
    footer.className = "tirdo-auth-footer";
    footer.textContent = `© ${new Date().getFullYear()} TIRDO – Tanzania Industrial Research and Development Organization`;
    document.body.appendChild(footer);
  }

  const h1 = document.querySelector("main h1");
  if (isAuthScreen() && h1 && !document.querySelector(".tirdo-org-name")) {
    const org = document.createElement("p");
    org.className = "tirdo-org-name";
    org.textContent = "Tanzania Industrial Research and Development Organization";
    h1.parentElement?.insertBefore(org, h1);
  }

  const error = document.getElementById("global-form-error");
  if (error?.textContent) {
    const next = friendlyAuthError(error.textContent);
    if (next && next !== error.textContent) {
      error.textContent = next;
    }
  }
}

export default {
  config: {
    head: {
      favicon: logo,
    },
    auth: {
      logo,
    },
    menu: {
      logo,
    },
    theme: {
      light: { colors: brand },
      dark: { colors: brand },
    },
    tutorials: false,
    notifications: { releases: false },
    translations: {
      en: {
        "Auth.form.welcome.title": "TIRDO Website Content Management System",
        "Auth.form.welcome.subtitle":
          "Sign in to manage and publish website content.",
        "Auth.form.register-admin.welcome.title": "Set up TIRDO Content Manager",
        "Auth.form.register-admin.welcome.subtitle":
          "Create the first TIRDO administrator using an official TIRDO email.",
        "Auth.form.button.login": "Sign in",
        "Auth.form.email.label": "Email address",
        "Auth.form.email.placeholder": "name@tirdo.or.tz",
        "Auth.form.rememberMe.label": "Remember me",
        "Auth.link.forgot-password": "Forgot password?",
        "Auth.form.button.password-recovery": "Reset your TIRDO password",
        "Auth.form.button.forgot-password": "Send reset email",
        "Auth.link.ready": "Back to sign in",
        "app.containers.AuthPage.ForgotPasswordSuccess.title": "Check your email",
        "app.containers.AuthPage.ForgotPasswordSuccess.text.email":
          "If an account exists for that address, TIRDO Content Manager will send a password reset link. It can take a few minutes to arrive.",
        "app.containers.AuthPage.ForgotPasswordSuccess.text.contact-admin":
          "If you do not receive the email, contact your TIRDO website administrator.",
        "Auth.form.register.subtitle":
          "These details are only used to sign in to TIRDO Content Manager.",
        "app.components.LeftMenu.navbrand.title": "TIRDO CMS",
        "app.components.LeftMenu.navbrand.workplace": "Content Manager",
        "app.components.HomePage.welcome": "Welcome to TIRDO Content Manager",
        "app.components.HomePage.welcome.again": "Welcome back to TIRDO",
        "app.components.HomePage.welcomeBlock.content":
          "Publish news, departments, services, board members and other pages that appear on the TIRDO website. Changes go live after you click Publish.",
        "app.components.HomePage.welcomeBlock.content.again":
          "Edit and publish TIRDO website content. Use Board & Management for directors, and Articles for news.",
        "HomePage.helmet.title": "TIRDO Content Manager",
      },
    },
  },
  bootstrap() {
    if (typeof document === "undefined") return;

    if (!document.getElementById("tirdo-login-css")) {
      const style = document.createElement("style");
      style.id = "tirdo-login-css";
      style.textContent = LOGIN_CSS;
      document.head.appendChild(style);
    }

    applyAuthChrome();
    const observer = new MutationObserver(applyAuthChrome);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener(
      "submit",
      (event) => {
        if (!isAuthScreen()) return;
        const form = event.target;
        if (!(form instanceof HTMLFormElement)) return;
        const button = form.querySelector('button[type="submit"]');
        if (!(button instanceof HTMLButtonElement) || button.disabled) return;
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        window.setTimeout(() => {
          if (isAuthScreen()) {
            button.disabled = false;
            button.removeAttribute("aria-busy");
          }
        }, 12000);
      },
      true
    );
  },
};
