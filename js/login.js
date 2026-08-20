// ==========================================
// CODECOLLAB LOGIN
// login.js
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const form = document.getElementById("loginForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("email");

    const passwordInput = document.getElementById("password");

    const rememberInput = document.getElementById("remember");

    const email = emailInput.value.trim().toLowerCase();

    const password = passwordInput.value;

    const rememberMe = rememberInput?.checked || false;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email || !password) {
      CodeCollabUI.toast(
        "Please enter your email and password.",
        "warning",
        "Missing Information",
      );

      return;
    }

    // ==========================================
    // FIND USER
    // ==========================================

    const users = CodeCollabAuth.getUsers();

    const user = users.find(
      (item) =>
        item.email?.toLowerCase() === email && item.password === password,
    );

    // ==========================================
    // INVALID LOGIN
    // ==========================================

    if (!user) {
      CodeCollabUI.toast(
        "The email or password you entered is incorrect.",
        "error",
        "Login Failed",
      );

      return;
    }

    // ==========================================
    // LOGIN
    // ==========================================

    const loggedIn = CodeCollabAuth.login(user.id, rememberMe);

    if (!loggedIn) {
      CodeCollabUI.toast(
        "We couldn't start your session. Please try again.",
        "error",
        "Login Failed",
      );

      return;
    }

    // ==========================================
    // SUCCESS
    // ==========================================

    CodeCollabUI.toast(
      `Welcome back, ${user.firstName || "Developer"}!`,
      "success",
      "Login Successful",
    );

    // Give the toast a moment to appear
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 900);
  });
});
