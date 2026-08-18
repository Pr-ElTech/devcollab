document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector("form");
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.querySelector(".password-toggle");

  const USERS_KEY = "codecollabUsers";
  const CURRENT_USER_KEY = "codecollabCurrentUser";

  // -------------------------------
  // Password visibility toggle
  // -------------------------------

  passwordToggle?.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    passwordToggle.innerHTML = isPassword
      ? '<i class="bi bi-eye-slash"></i>'
      : '<i class="bi bi-eye"></i>';

    passwordToggle.setAttribute(
      "aria-label",
      isPassword ? "Hide password" : "Show password",
    );
  });

  // -------------------------------
  // Signup
  // -------------------------------

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();

    const lastName = document.getElementById("lastName").value.trim();

    const username = document
      .getElementById("username")
      .value.trim()
      .toLowerCase();

    const email = document.getElementById("email").value.trim().toLowerCase();

    const password = passwordInput.value;

    const role = document.getElementById("role").value;

    const termsAccepted = document.getElementById("terms").checked;

    // -------------------------------
    // Validation
    // -------------------------------

    if (!firstName || !lastName || !username || !email || !password) {
      alert("Please complete all required fields.");
      return;
    }

    if (role === "Select your role") {
      alert("Please select your developer role.");
      return;
    }

    if (!termsAccepted) {
      alert("You must agree to the Terms of Service.");
      return;
    }

    if (password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    // Username validation
    const usernamePattern = /^[a-zA-Z0-9_]+$/;

    if (!usernamePattern.test(username)) {
      alert("Username can only contain letters, numbers and underscores.");
      return;
    }

    // -------------------------------
    // Get existing users
    // -------------------------------

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    // -------------------------------
    // Check duplicate email
    // -------------------------------

    const emailExists = users.some((user) => user.email === email);

    if (emailExists) {
      alert("An account with this email already exists.");
      return;
    }

    // -------------------------------
    // Check duplicate username
    // -------------------------------

    const usernameExists = users.some((user) => user.username === username);

    if (usernameExists) {
      alert("This username is already taken.");
      return;
    }

    // -------------------------------
    // Create user
    // -------------------------------

    const user = {
      id: `cc_${Date.now()}`,
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      bio: "",
      avatar: "",
      skills: [],
      createdAt: new Date().toISOString(),
    };

    // -------------------------------
    // Save user
    // -------------------------------

    users.push(user);

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // -------------------------------
    // Save current session
    // -------------------------------

    localStorage.setItem(CURRENT_USER_KEY, user.id);

    // -------------------------------
    // Redirect
    // -------------------------------

    window.location.href = "dashboard.html";
  });
});
