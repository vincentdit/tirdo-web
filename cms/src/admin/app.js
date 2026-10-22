import logo from "./extensions/logo.jpg";

export default {
  config: {
    auth: {
      logo,
    },
    menu: {
      logo,
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
        "Auth.form.button.forgot-password": "Send reset email",
        "Auth.link.ready": "Back to sign in",
        "app.containers.AuthPage.ForgotPasswordSuccess.title": "Check your email",
        "app.containers.AuthPage.ForgotPasswordSuccess.text.email":
          "If an account exists for that address, TIRDO Content Manager will send a password reset link. It can take a few minutes to arrive.",
        "app.containers.AuthPage.ForgotPasswordSuccess.text.contact-admin":
          "If you do not receive the email, contact your TIRDO website administrator.",
        "app.components.LeftMenu.navbrand.title": "TIRDO CMS",
        "app.components.LeftMenu.navbrand.workplace": "Website",
      },
    },
  },
  bootstrap() {},
};
