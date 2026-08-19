// ==========================================
// CODECOLLAB AUTH SYSTEM
// auth.js
// ==========================================

(function () {
  "use strict";

  // ==========================================
  // STORAGE KEYS
  // ==========================================

  const USERS_KEY = "codecollabUsers";
  const CURRENT_USER_KEY = "codecollabCurrentUser";
  const REMEMBER_ME_KEY = "codecollabRememberMe";

  // ==========================================
  // USERS
  // ==========================================

  function getUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY));
      return Array.isArray(users) ? users : [];
    } catch (error) {
      console.error("CodeCollab: Could not read users.", error);
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // ==========================================
  // CURRENT USER
  // ==========================================

  function getCurrentUserId() {
    return localStorage.getItem(CURRENT_USER_KEY);
  }

  function getCurrentUser() {
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      return null;
    }

    const users = getUsers();

    return (
      users.find((user) => String(user.id) === String(currentUserId)) || null
    );
  }

  function isLoggedIn() {
    return Boolean(getCurrentUser());
  }

  // ==========================================
  // LOGIN
  // ==========================================

  function login(userId, rememberMe = false) {
    if (!userId) {
      return false;
    }

    localStorage.setItem(CURRENT_USER_KEY, String(userId));

    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, "true");
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }

    return true;
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  function logout(redirect = true) {
    localStorage.removeItem(CURRENT_USER_KEY);

    localStorage.removeItem(REMEMBER_ME_KEY);

    if (redirect) {
      window.location.href = "login.html";
    }
  }

  // ==========================================
  // ROUTE PROTECTION
  // ==========================================

  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.href = "login.html";
      return false;
    }

    return true;
  }

  function requireGuest() {
    if (isLoggedIn()) {
      window.location.href = "dashboard.html";
      return false;
    }

    return true;
  }

  // ==========================================
  // UPDATE CURRENT USER
  // ==========================================

  function updateCurrentUser(updates = {}) {
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      return null;
    }

    const users = getUsers();

    const index = users.findIndex(
      (user) => String(user.id) === String(currentUserId),
    );

    if (index === -1) {
      return null;
    }

    users[index] = {
      ...users[index],
      ...updates,
    };

    saveUsers(users);

    return users[index];
  }

  // ==========================================
  // INITIALS
  // ==========================================

  function getUserInitials(user) {
    if (!user) {
      return "U";
    }

    const firstName = user.firstName?.trim() || "";

    const lastName = user.lastName?.trim() || "";

    if (!firstName && !lastName) {
      return "U";
    }

    if (!lastName) {
      return firstName.charAt(0).toUpperCase();
    }

    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  // ==========================================
  // AUTH UI
  // ==========================================

  function renderAuthUI() {
    const user = getCurrentUser();

    // Logged in elements
    document
      .querySelectorAll('[data-session="logged-in"]')
      .forEach((element) => {
        element.classList.toggle("d-none", !user);
      });

    // Logged out elements
    document
      .querySelectorAll('[data-session="logged-out"]')
      .forEach((element) => {
        element.classList.toggle("d-none", Boolean(user));
      });

    if (!user) {
      return;
    }

    // First name
    document.querySelectorAll("[data-user-name]").forEach((element) => {
      element.textContent = user.firstName || "Developer";
    });

    // Full name
    document.querySelectorAll("[data-user-full-name]").forEach((element) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

      element.textContent = fullName || "CodeCollab User";
    });

    // Username
    document.querySelectorAll("[data-user-username]").forEach((element) => {
      element.textContent = user.username ? `@${user.username}` : "@user";
    });

    // Role
    document.querySelectorAll("[data-user-role]").forEach((element) => {
      element.textContent = user.role || "Developer";
    });

    // Avatar
    const initials = getUserInitials(user);

    document.querySelectorAll("[data-user-avatar]").forEach((element) => {
      element.textContent = initials;
    });
  }

  // ==========================================
  // PAGE INITIALIZATION
  // ==========================================

  function initializeAuth() {
    const authMode = document.body.dataset.auth;

    if (authMode === "required") {
      if (!requireAuth()) {
        return;
      }
    }

    if (authMode === "guest") {
      if (!requireGuest()) {
        return;
      }
    }

    renderAuthUI();
  }

  // ==========================================
  // PUBLIC API
  // ==========================================

  window.CodeCollabAuth = {
    getUsers,
    saveUsers,
    getCurrentUserId,
    getCurrentUser,
    isLoggedIn,
    login,
    logout,
    requireAuth,
    requireGuest,
    updateCurrentUser,
    getUserInitials,
    renderAuthUI,
  };

  // ==========================================
  // START
  // ==========================================

  document.addEventListener("DOMContentLoaded", initializeAuth);
})();
