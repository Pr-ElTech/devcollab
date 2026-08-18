document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // STORAGE KEYS
  // ==========================================

  const USERS_KEY = "codecollabUsers";
  const CURRENT_USER_KEY = "codecollabCurrentUser";

  // ==========================================
  // GET CURRENT SESSION
  // ==========================================

  const currentUserId = localStorage.getItem(CURRENT_USER_KEY);

  // No logged-in user → return to login
  if (!currentUserId) {
    window.location.href = "login.html";
    return;
  }

  // ==========================================
  // GET USERS
  // ==========================================

  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  // ==========================================
  // FIND CURRENT USER
  // ==========================================

  const currentUser = users.find((user) => user.id === currentUserId);

  // Session exists but user doesn't
  if (!currentUser) {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = "login.html";
    return;
  }

  // ==========================================
  // ELEMENTS
  // ==========================================

  const welcomeUserName = document.getElementById("welcomeUserName");

  const navUserName = document.getElementById("navUserName");

  const logoutBtn = document.getElementById("logoutBtn");

  const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");

  // ==========================================
  // DISPLAY USER INFORMATION
  // ==========================================

  if (welcomeUserName) {
    welcomeUserName.textContent = currentUser.firstName;
  }

  if (navUserName) {
    navUserName.textContent = currentUser.firstName;
  }

  // ==========================================
  // USER AVATAR
  // ==========================================

  const avatarElements = document.querySelectorAll(
    ".dashboard-avatar, .post-avatar",
  );

  const firstLetter = currentUser.firstName?.charAt(0).toUpperCase() || "U";

  avatarElements.forEach((avatar) => {
    // Only change dashboard user's avatar.
    // We leave post avatars untouched.
    if (avatar.classList.contains("dashboard-avatar")) {
      avatar.textContent = firstLetter;
    }
  });

  // ==========================================
  // LOGOUT FUNCTION
  // ==========================================

  function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);

    window.location.href = "login.html";
  }

  // ==========================================
  // LOGOUT EVENTS
  // ==========================================

  logoutBtn?.addEventListener("click", logout);

  sidebarLogoutBtn?.addEventListener("click", logout);

  // ==========================================
  // OPTIONAL: SHOW USER INFO IN CONSOLE
  // Useful while learning/debugging
  // ==========================================

  console.log("Logged in user:", currentUser);
});
