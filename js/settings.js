document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // STORAGE KEYS
  // ==========================================

  const USERS_KEY = "codecollabUsers";
  const CURRENT_USER_KEY = "codecollabCurrentUser";

  // ==========================================
  // CHECK SESSION
  // ==========================================

  const currentUserId = localStorage.getItem(CURRENT_USER_KEY);

  if (!currentUserId) {
    window.location.href = "login.html";
    return;
  }

  // ==========================================
  // GET USERS
  // ==========================================

  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const currentUserIndex = users.findIndex((user) => user.id === currentUserId);

  if (currentUserIndex === -1) {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = "login.html";
    return;
  }

  let currentUser = users[currentUserIndex];

  // ==========================================
  // ELEMENTS
  // ==========================================

  const navUserName = document.getElementById("navUserName");

  const navUserAvatar = document.getElementById("navUserAvatar");

  const settingsEmail = document.getElementById("settingsEmail");

  const profileSettingsForm = document.getElementById("profileSettingsForm");

  const developerSettingsForm = document.getElementById(
    "developerSettingsForm",
  );

  const settingsFirstName = document.getElementById("settingsFirstName");

  const settingsLastName = document.getElementById("settingsLastName");

  const settingsUsername = document.getElementById("settingsUsername");

  const settingsBio = document.getElementById("settingsBio");

  const settingsRole = document.getElementById("settingsRole");

  const settingsSkills = document.getElementById("settingsSkills");

  const logoutBtn = document.getElementById("logoutBtn");

  const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");

  const settingsLogoutBtn = document.getElementById("settingsLogoutBtn");

  const changePasswordBtn = document.getElementById("changePasswordBtn");

  // ==========================================
  // LOAD CURRENT USER
  // ==========================================

  function loadUserData() {
    const firstName = currentUser.firstName || "";

    const lastName = currentUser.lastName || "";

    const username = currentUser.username || "";

    const bio = currentUser.bio || "";

    const role = currentUser.role || "";

    const skills = Array.isArray(currentUser.skills) ? currentUser.skills : [];

    // Profile information
    if (settingsFirstName) {
      settingsFirstName.value = firstName;
    }

    if (settingsLastName) {
      settingsLastName.value = lastName;
    }

    if (settingsUsername) {
      settingsUsername.value = username;
    }

    if (settingsBio) {
      settingsBio.value = bio;
    }

    // Developer information
    if (settingsRole) {
      settingsRole.value = role;
    }

    if (settingsSkills) {
      settingsSkills.value = skills.join(", ");
    }

    // Account information
    if (settingsEmail) {
      settingsEmail.textContent = currentUser.email || "Not provided";
    }

    // Navigation
    if (navUserName) {
      navUserName.textContent = firstName || "User";
    }

    if (navUserAvatar) {
      navUserAvatar.textContent = firstName.charAt(0).toUpperCase() || "U";
    }
  }

  loadUserData();

  // ==========================================
  // SAVE USERS
  // ==========================================

  function saveUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // ==========================================
  // VALIDATE USERNAME
  // ==========================================

  function isValidUsername(username) {
    return /^[a-zA-Z0-9_]+$/.test(username);
  }

  // ==========================================
  // CHECK USERNAME AVAILABILITY
  // ==========================================

  function usernameAlreadyExists(username) {
    return users.some(
      (user, index) =>
        index !== currentUserIndex &&
        user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  // ==========================================
  // PROFILE SETTINGS
  // ==========================================

  profileSettingsForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstName = settingsFirstName.value.trim();

    const lastName = settingsLastName.value.trim();

    const username = settingsUsername.value.trim().toLowerCase();

    const bio = settingsBio.value.trim();

    // ----------------------------------------
    // Validation
    // ----------------------------------------

    if (!firstName || !lastName || !username) {
      alert("First name, last name and username are required.");
      return;
    }

    if (!isValidUsername(username)) {
      alert("Username can only contain letters, numbers and underscores.");
      return;
    }

    if (usernameAlreadyExists(username)) {
      alert("That username is already being used by another developer.");
      return;
    }

    if (bio.length > 280) {
      alert("Your bio cannot be longer than 280 characters.");
      return;
    }

    // ----------------------------------------
    // Update current user
    // ----------------------------------------

    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.username = username;
    currentUser.bio = bio;

    users[currentUserIndex] = currentUser;

    saveUsers();

    alert("Profile information saved successfully.");

    loadUserData();
  });

  // ==========================================
  // DEVELOPER PROFILE
  // ==========================================

  developerSettingsForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const role = settingsRole.value;

    const skillsInput = settingsSkills.value.trim();

    if (!role) {
      alert("Please select your developer role.");
      return;
    }

    // ----------------------------------------
    // Convert skills into array
    // ----------------------------------------

    const skills = skillsInput
      ? skillsInput
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0)
      : [];

    // Remove duplicate skills
    const uniqueSkills = [
      ...new Set(skills.map((skill) => skill.toLowerCase())),
    ];

    // ----------------------------------------
    // Update user
    // ----------------------------------------

    currentUser.role = role;
    currentUser.skills = uniqueSkills;

    users[currentUserIndex] = currentUser;

    saveUsers();

    alert("Developer profile saved successfully.");

    loadUserData();
  });

  // ==========================================
  // LOGOUT
  // ==========================================

  function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);

    window.location.href = "login.html";
  }

  logoutBtn?.addEventListener("click", logout);

  sidebarLogoutBtn?.addEventListener("click", logout);

  settingsLogoutBtn?.addEventListener("click", logout);

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  changePasswordBtn?.addEventListener("click", () => {
    alert(
      "Password management will be connected to the backend authentication system later.",
    );
  });

  // ==========================================
  // DEBUG
  // ==========================================

  console.log("Settings loaded for:", currentUser);
});
