document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const rememberInput = document.getElementById("remember");
  const passwordToggle = document.querySelector(".password-toggle");

  const USERS_KEY = "codecollabUsers";
  const CURRENT_USER_KEY = "codecollabCurrentUser";

  // ==========================================
  // PASSWORD VISIBILITY
  // ==========================================

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

  // ==========================================
  // LOGIN
  // ==========================================

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    // ------------------------------------------
    // Basic validation
    // ------------------------------------------

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    // ------------------------------------------
    // Get registered users
    // ------------------------------------------

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

    // ------------------------------------------
    // Find user
    // ------------------------------------------

    const user = users.find((user) => user.email === email);

    if (!user) {
      alert("No account was found with this email.");
      return;
    }

    // ------------------------------------------
    // Check password
    // ------------------------------------------

    if (user.password !== password) {
      alert("Incorrect password.");
      return;
    }

    // ------------------------------------------
    // Save current user session
    // ------------------------------------------

    localStorage.setItem(CURRENT_USER_KEY, user.id);

    // ------------------------------------------
    // Optional remember-me flag
    // ------------------------------------------

    localStorage.setItem(
      "codecollabRememberMe",
      rememberInput.checked ? "true" : "false",
    );

    // ------------------------------------------
    // Redirect to dashboard
    // ------------------------------------------

    window.location.href = "dashboard.html";
  });
});
