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

  const currentUser = window.CodeCollabAuth.getCurrentUser();

  if (!currentUser) {
    return;
  }

  // ==========================================
  // ELEMENTS
  // ==========================================

  const welcomeUserName = document.getElementById("welcomeUserName");

  const navUserName = document.getElementById("navUserName");

  const avatarElements = document.querySelectorAll(".dashboard-avatar");

  const logoutBtn = document.getElementById("logoutBtn");

  const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");

  const notificationBtn = document.getElementById("notificationBtn");

  const mobileSearchBtn = document.getElementById("mobileSearchBtn");

  const mobileSearchContainer = document.getElementById(
    "mobileSearchContainer",
  );

  const savedNavLink = document.getElementById("savedNavLink");

  const feedSortButton = document.getElementById("feedSortButton");

  const viewProjectBtn = document.getElementById("viewProjectBtn");

  // ==========================================
  // USER DATA
  // ==========================================

  const firstName = currentUser.firstName || "Developer";

  const initials = window.CodeCollabAuth.getUserInitials(currentUser);

  // ==========================================
  // USER NAME
  // ==========================================

  if (welcomeUserName) {
    welcomeUserName.textContent = firstName;
  }

  if (navUserName) {
    navUserName.textContent = firstName;
  }

  // ==========================================
  // USER AVATAR
  // ==========================================

  avatarElements.forEach((avatar) => {
    avatar.textContent = initials;
  });

  // ==========================================
  // LOGOUT CONFIRMATION
  // ==========================================

  function handleLogout() {
    if (!window.CodeCollabUI) {
      window.CodeCollabAuth.logout();
      return;
    }

    window.CodeCollabUI.confirm({
      title: "Log out?",
      message:
        "You will need to sign in again to access your CodeCollab account.",
      confirmText: "Log out",
      confirmClass: "btn-danger",
      onConfirm: () => {
        window.CodeCollabAuth.logout();
      },
    });
  }

  logoutBtn?.addEventListener("click", handleLogout);

  sidebarLogoutBtn?.addEventListener("click", handleLogout);

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  notificationBtn?.addEventListener("click", () => {
    window.CodeCollabUI?.toast(
      "You have 3 new notifications.",
      "info",
      "Notifications",
    );
  });

  // ==========================================
  // MOBILE SEARCH
  // ==========================================

  mobileSearchBtn?.addEventListener("click", () => {
    if (!mobileSearchContainer) {
      return;
    }

    mobileSearchContainer.classList.toggle("d-none");
  });

  // ==========================================
  // SAVED
  // ==========================================

  savedNavLink?.addEventListener("click", (event) => {
    event.preventDefault();

    window.CodeCollabUI?.toast(
      "Saved projects will appear here.",
      "info",
      "Saved Projects",
    );
  });

  // ==========================================
  // FEED SORT
  // ==========================================

  feedSortButton?.addEventListener("click", () => {
    window.CodeCollabUI?.toast(
      "Latest posts are currently being shown.",
      "info",
      "Community Feed",
    );
  });

  // ==========================================
  // VIEW PROJECT
  // ==========================================

  viewProjectBtn?.addEventListener("click", () => {
    window.CodeCollabUI?.toast(
      "Project details are coming next.",
      "info",
      "Project Preview",
    );
  });

  // ==========================================
  // POST ACTIONS
  // ==========================================

  document.querySelectorAll(".post-action").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;

      switch (action) {
        case "like":
          button.classList.toggle("text-danger");

          window.CodeCollabUI?.toast("Post liked.", "success");

          break;

        case "comment":
          window.CodeCollabUI?.toast(
            "Comment section is ready for the next step.",
            "info",
            "Comments",
          );

          break;

        case "save":
          window.CodeCollabUI?.toast(
            "Project saved to your collection.",
            "success",
            "Saved",
          );

          break;

        case "share":
          window.CodeCollabUI?.toast(
            "Share link copied conceptually for this demo.",
            "success",
            "Shared",
          );

          break;
      }
    });
  });

  // ==========================================
  // DEBUG
  // ==========================================

  console.log("CodeCollab dashboard loaded for:", currentUser);
});
