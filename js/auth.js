// ==========================================
// CODECOLLAB AUTH SYSTEM
// auth.js
// ==========================================

(function () {
  "use strict";

  const USERS_KEY = "codecollabUsers";
  const CURRENT_USER_KEY = "codecollabCurrentUser";

  // ==========================================
  // STORAGE
  // ==========================================

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  }

  function getCurrentUserId() {
    return localStorage.getItem(CURRENT_USER_KEY);
  }

  function getCurrentUser() {
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      return null;
    }

    const users = getUsers();

    return users.find((user) => user.id === currentUserId) || null;
  }

  function isLoggedIn() {
    return Boolean(getCurrentUser());
  }

  // ==========================================
  // SESSION
  // ==========================================

  function login(userId) {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  }

  function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);

    localStorage.removeItem("codecollabRememberMe");

    window.location.href = "login.html";
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
  // UPDATE USER DATA
  // ==========================================

  function updateCurrentUser(updates) {
    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
      return null;
    }

    const users = getUsers();

    const index = users.findIndex((user) => user.id === currentUserId);

    if (index === -1) {
      return null;
    }

    users[index] = {
      ...users[index],
      ...updates,
    };

    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return users[index];
  }

  // ==========================================
  // AUTH UI
  // ==========================================

  function renderAuthUI() {
    const user = getCurrentUser();

    // ------------------------------
    // Logged-in elements
    // ------------------------------

    document
      .querySelectorAll('[data-session="logged-in"]')
      .forEach((element) => {
        element.classList.toggle("d-none", !user);
      });

    // ------------------------------
    // Logged-out elements
    // ------------------------------

    document
      .querySelectorAll('[data-session="logged-out"]')
      .forEach((element) => {
        element.classList.toggle("d-none", Boolean(user));
      });

    if (!user) {
      return;
    }

    // ------------------------------
    // User names
    // ------------------------------

    document.querySelectorAll("[data-user-name]").forEach((element) => {
      element.textContent = user.firstName || "User";
    });

    document.querySelectorAll("[data-user-full-name]").forEach((element) => {
      element.textContent =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "CodeCollab User";
    });

    // ------------------------------
    // Username
    // ------------------------------

    document.querySelectorAll("[data-user-username]").forEach((element) => {
      element.textContent = user.username ? `@${user.username}` : "@user";
    });

    // ------------------------------
    // Role
    // ------------------------------

    document.querySelectorAll("[data-user-role]").forEach((element) => {
      element.textContent = user.role || "Developer";
    });

    // ------------------------------
    // Avatar
    // ------------------------------

    const initial = user.firstName?.charAt(0).toUpperCase() || "U";

    document.querySelectorAll("[data-user-avatar]").forEach((element) => {
      element.textContent = initial;
    });

    // ------------------------------
    // Logout buttons
    // ------------------------------

    document.querySelectorAll("[data-action='logout']").forEach((button) => {
      button.addEventListener("click", () => {
        CodeCollabUI.confirm({
          title: "Log out?",
          message:
            "You will need to sign in again to access your CodeCollab account.",
          confirmText: "Log out",
          confirmClass: "btn-danger",
          onConfirm: logout,
        });
      });
    });
  }

  // ==========================================
  // PAGE AUTH GUARD
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
  // EXPOSE API
  // ==========================================

  window.CodeCollabAuth = {
    getUsers,
    getCurrentUser,
    getCurrentUserId,
    isLoggedIn,
    login,
    logout,
    requireAuth,
    requireGuest,
    updateCurrentUser,
    renderAuthUI,
  };

  // ==========================================
  // RUN
  // ==========================================

  document.addEventListener("DOMContentLoaded", initializeAuth);
})();
