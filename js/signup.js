// ==========================================
// CODECOLLAB SIGNUP
// signup.js
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const form = document.getElementById("signupForm");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // ==========================================
    // GET FORM VALUES
    // ==========================================

    const firstName = document.getElementById("firstName").value.trim();

    const lastName = document.getElementById("lastName").value.trim();

    const username = document
      .getElementById("username")
      .value.trim()
      .toLowerCase();

    const email = document.getElementById("email").value.trim().toLowerCase();

    const password = document.getElementById("password").value;

    const role = document.getElementById("role").value;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!firstName || !lastName || !username || !email || !password || !role) {
      CodeCollabUI.toast(
        "Please complete all required fields.",
        "warning",
        "Missing Information",
      );

      return;
    }

    // ==========================================
    // USERNAME VALIDATION
    // ==========================================

    const usernamePattern = /^[a-zA-Z0-9_]+$/;

    if (!usernamePattern.test(username)) {
      CodeCollabUI.toast(
        "Username can only contain letters, numbers and underscores.",
        "error",
        "Invalid Username",
      );

      return;
    }

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================

    if (password.length < 6) {
      CodeCollabUI.toast(
        "Your password must contain at least 6 characters.",
        "warning",
        "Weak Password",
      );

      return;
    }

    // ==========================================
    // GET EXISTING USERS
    // ==========================================

    const users = CodeCollabAuth.getUsers();

    // ==========================================
    // CHECK DUPLICATES
    // ==========================================

    const emailExists = users.some(
      (user) => user.email?.toLowerCase() === email,
    );

    if (emailExists) {
      CodeCollabUI.toast(
        "An account with this email already exists.",
        "error",
        "Email Already Registered",
      );

      return;
    }

    const usernameExists = users.some(
      (user) => user.username?.toLowerCase() === username,
    );

    if (usernameExists) {
      CodeCollabUI.toast(
        "This username is already taken. Please choose another one.",
        "error",
        "Username Unavailable",
      );

      return;
    }

    // ==========================================
    // CREATE USER
    // ==========================================

    const newUser = {
      id: crypto.randomUUID(),

      firstName,
      lastName,

      username,

      email,

      password,

      role,

      createdAt: new Date().toISOString(),
    };

    // ==========================================
    // SAVE USER
    // ==========================================

    CodeCollabAuth.saveUsers([...users, newUser]);

    // ==========================================
    // CREATE SESSION
    // ==========================================

    CodeCollabAuth.login(newUser.id, true);

    // ==========================================
    // SUCCESS
    // ==========================================

    CodeCollabUI.toast(
      `Welcome to CodeCollab, ${firstName}!`,
      "success",
      "Account Created",
    );

    // ==========================================
    // REDIRECT
    // ==========================================

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  });
});
