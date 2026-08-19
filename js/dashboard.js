// ==========================================
// CODECOLLAB DASHBOARD
// dashboard.js
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================
  // AUTH GUARD
  // ==========================================

  if (!window.CodeCollabAuth?.requireAuth()) {
    return;
  }

  // ==========================================
  // CURRENT USER
  // ==========================================

  const currentUser = CodeCollabAuth.getCurrentUser();

  if (!currentUser) {
    return;
  }

  // ==========================================
  // ELEMENTS
  // ==========================================

  const welcomeUserName = document.getElementById("welcomeUserName");

  const navUserName = document.getElementById("navUserName");

  const avatarElements = document.querySelectorAll(".dashboard-avatar");

  // ==========================================
  // USER NAME
  // ==========================================

  if (welcomeUserName) {
    welcomeUserName.textContent = currentUser.firstName || "Developer";
  }

  if (navUserName) {
    navUserName.textContent = currentUser.firstName || "Developer";
  }

  // ==========================================
  // USER AVATAR
  // ==========================================

  const firstLetter = currentUser.firstName?.charAt(0).toUpperCase() || "U";

  avatarElements.forEach((avatar) => {
    avatar.textContent = firstLetter;
  });

  // ==========================================
  // DEBUG
  // ==========================================

  console.log("CodeCollab current user:", currentUser);
});
