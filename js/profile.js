document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // STORAGE KEYS
  // ==========================================

  const USERS_KEY = "codecollabUsers";
  const CURRENT_USER_KEY = "codecollabCurrentUser";
  const POSTS_KEY = "codecollabPosts";
  const PROJECTS_KEY = "codecollabProjects";

  // ==========================================
  // CHECK LOGIN SESSION
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

  const currentUser = users.find((user) => user.id === currentUserId);

  if (!currentUser) {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = "login.html";
    return;
  }

  // ==========================================
  // GET POSTS AND PROJECTS
  // ==========================================

  const posts = JSON.parse(localStorage.getItem(POSTS_KEY)) || [];

  const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];

  // ==========================================
  // ELEMENTS
  // ==========================================

  const navUserName = document.getElementById("navUserName");

  const navUserAvatar = document.getElementById("navUserAvatar");

  const profileAvatar = document.getElementById("profileAvatar");

  const profileName = document.getElementById("profileName");

  const profileUsername = document.getElementById("profileUsername");

  const profileRole = document.getElementById("profileRole");

  const profileRoleInfo = document.getElementById("profileRoleInfo");

  const profileBio = document.getElementById("profileBio");

  const profileEmail = document.getElementById("profileEmail");

  const profileJoined = document.getElementById("profileJoined");

  const profileSkills = document.getElementById("profileSkills");

  const profilePostCount = document.getElementById("profilePostCount");

  const profileProjectCount = document.getElementById("profileProjectCount");

  const profileFollowerCount = document.getElementById("profileFollowerCount");

  const profilePostsEmpty = document.getElementById("profilePostsEmpty");

  const profilePostsList = document.getElementById("profilePostsList");

  const profileProjectsEmpty = document.getElementById("profileProjectsEmpty");

  const profileProjectsList = document.getElementById("profileProjectsList");

  const logoutBtn = document.getElementById("logoutBtn");

  const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");

  // ==========================================
  // USER DATA
  // ==========================================

  const firstName = currentUser.firstName || "";
  const lastName = currentUser.lastName || "";

  const fullName = `${firstName} ${lastName}`.trim() || "CodeCollab User";

  const username = currentUser.username ? `@${currentUser.username}` : "@user";

  const role = currentUser.role || "Developer";

  const avatarLetter = firstName.charAt(0).toUpperCase() || "U";

  // ==========================================
  // NAVBAR
  // ==========================================

  if (navUserName) {
    navUserName.textContent = firstName || "User";
  }

  if (navUserAvatar) {
    navUserAvatar.textContent = avatarLetter;
  }

  // ==========================================
  // PROFILE HEADER
  // ==========================================

  if (profileAvatar) {
    profileAvatar.textContent = avatarLetter;
  }

  if (profileName) {
    profileName.textContent = fullName;
  }

  if (profileUsername) {
    profileUsername.textContent = username;
  }

  if (profileRole) {
    profileRole.textContent = role;
  }

  if (profileRoleInfo) {
    profileRoleInfo.textContent = role;
  }

  // ==========================================
  // BIO
  // ==========================================

  if (profileBio) {
    profileBio.textContent =
      currentUser.bio?.trim() ||
      "No bio added yet. Tell the CodeCollab community what you build and what you're learning.";
  }

  // ==========================================
  // EMAIL
  // ==========================================

  if (profileEmail) {
    profileEmail.textContent = currentUser.email || "Not provided";
  }

  // ==========================================
  // JOIN DATE
  // ==========================================

  if (profileJoined) {
    if (currentUser.createdAt) {
      const joinedDate = new Date(currentUser.createdAt);

      profileJoined.textContent = joinedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else {
      profileJoined.textContent = "Recently";
    }
  }

  // ==========================================
  // SKILLS
  // ==========================================

  if (profileSkills) {
    profileSkills.innerHTML = "";

    const skills = Array.isArray(currentUser.skills) ? currentUser.skills : [];

    if (skills.length === 0) {
      const emptySkills = document.createElement("span");

      emptySkills.className = "text-muted small";

      emptySkills.textContent = "No skills added yet.";

      profileSkills.appendChild(emptySkills);
    } else {
      skills.forEach((skill) => {
        const skillBadge = document.createElement("span");

        skillBadge.className = "badge rounded-pill text-bg-light border";

        skillBadge.textContent = skill;

        profileSkills.appendChild(skillBadge);
      });
    }
  }

  // ==========================================
  // USER POSTS
  // ==========================================

  const userPosts = posts.filter(
    (post) => post.author && post.author.id === currentUser.id,
  );

  if (profilePostCount) {
    profilePostCount.textContent = userPosts.length;
  }

  renderUserPosts(userPosts);

  // ==========================================
  // USER PROJECTS
  // ==========================================

  const userProjects = projects.filter(
    (project) => project.author && project.author.id === currentUser.id,
  );

  if (profileProjectCount) {
    profileProjectCount.textContent = userProjects.length;
  }

  renderUserProjects(userProjects);

  // ==========================================
  // FOLLOWERS
  // ==========================================

  const followerCount = Array.isArray(currentUser.followers)
    ? currentUser.followers.length
    : Number(currentUser.followers) || 0;

  if (profileFollowerCount) {
    profileFollowerCount.textContent = followerCount;
  }

  // ==========================================
  // RENDER POSTS
  // ==========================================

  function renderUserPosts(userPosts) {
    if (!profilePostsEmpty || !profilePostsList) {
      return;
    }

    if (userPosts.length === 0) {
      profilePostsEmpty.classList.remove("d-none");
      profilePostsList.classList.add("d-none");
      profilePostsList.innerHTML = "";
      return;
    }

    profilePostsEmpty.classList.add("d-none");
    profilePostsList.classList.remove("d-none");

    profilePostsList.innerHTML = "";

    userPosts.forEach((post) => {
      const article = document.createElement("article");

      article.className = "profile-post-item";

      const tags = Array.isArray(post.tags) ? post.tags : [];

      const tagsHTML =
        tags.length > 0
          ? `
            <div class="d-flex flex-wrap gap-2 mt-3">
              ${tags
                .map(
                  (tag) => `
                    <span class="badge text-bg-light border">
                      ${escapeHTML(tag)}
                    </span>
                  `,
                )
                .join("")}
            </div>
          `
          : "";

      article.innerHTML = `
        <div class="d-flex justify-content-between align-items-start gap-3">
          <div>
            <h3 class="h6 fw-bold mb-1">
              ${escapeHTML(post.title)}
            </h3>

            <p class="text-muted small mb-0">
              ${formatDate(post.createdAt)}
            </p>
          </div>

          <span class="badge rounded-pill bg-primary-subtle text-primary">
            Post
          </span>
        </div>

        <p class="text-muted small profile-post-content mt-3 mb-0">
          ${escapeHTML(post.content)}
        </p>

        ${tagsHTML}

        <div class="profile-post-meta border-top mt-3 pt-3">
          <span>
            <i class="bi bi-heart me-1"></i>
            ${Number(post.likes) || 0}
          </span>

          <span>
            <i class="bi bi-chat me-1"></i>
            ${Array.isArray(post.comments) ? post.comments.length : 0}
          </span>
        </div>
      `;

      profilePostsList.appendChild(article);
    });
  }

  // ==========================================
  // RENDER PROJECTS
  // ==========================================

  function renderUserProjects(userProjects) {
    if (!profileProjectsEmpty || !profileProjectsList) {
      return;
    }

    if (userProjects.length === 0) {
      profileProjectsEmpty.classList.remove("d-none");
      profileProjectsList.classList.add("d-none");
      profileProjectsList.innerHTML = "";
      return;
    }

    profileProjectsEmpty.classList.add("d-none");
    profileProjectsList.classList.remove("d-none");

    profileProjectsList.innerHTML = "";

    userProjects.forEach((project) => {
      const projectCard = document.createElement("article");

      projectCard.className = "profile-project-item";

      const technologies = Array.isArray(project.technologies)
        ? project.technologies
        : [];

      const technologiesHTML =
        technologies.length > 0
          ? `
            <div class="d-flex flex-wrap gap-2 mt-3">
              ${technologies
                .map(
                  (technology) => `
                    <span class="badge text-bg-light border">
                      ${escapeHTML(technology)}
                    </span>
                  `,
                )
                .join("")}
            </div>
          `
          : "";

      const linksHTML = `
        <div class="d-flex flex-wrap gap-2 mt-3">
          ${
            project.repositoryUrl
              ? `
                <a
                  href="${escapeAttribute(project.repositoryUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-sm btn-dark rounded-3"
                >
                  <i class="bi bi-github me-1"></i>
                  Repository
                </a>
              `
              : ""
          }

          ${
            project.liveUrl
              ? `
                <a
                  href="${escapeAttribute(project.liveUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-sm btn-outline-primary rounded-3"
                >
                  <i class="bi bi-box-arrow-up-right me-1"></i>
                  Live project
                </a>
              `
              : ""
          }
        </div>
      `;

      projectCard.innerHTML = `
        <div class="d-flex justify-content-between align-items-start gap-3">

          <div>
            <h3 class="h6 fw-bold mb-1">
              ${escapeHTML(project.name)}
            </h3>

            <p class="text-muted small mb-0">
              ${formatDate(project.createdAt)}
            </p>
          </div>

          <span class="badge rounded-pill bg-primary-subtle text-primary">
            Project
          </span>

        </div>

        <p class="text-muted small mt-3 mb-0">
          ${escapeHTML(project.description)}
        </p>

        ${technologiesHTML}

        ${linksHTML}

        <div class="profile-post-meta border-top mt-3 pt-3">

          <span>
            <i class="bi bi-star me-1"></i>
            ${Number(project.stars) || 0}
          </span>

          <span>
            <i class="bi bi-diagram-3 me-1"></i>
            ${Number(project.forks) || 0}
          </span>

        </div>
      `;

      profileProjectsList.appendChild(projectCard);
    });
  }

  // ==========================================
  // DATE FORMATTER
  // ==========================================

  function formatDate(dateString) {
    if (!dateString) {
      return "Recently";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // ==========================================
  // BASIC HTML SAFETY
  // ==========================================

  function escapeHTML(value) {
    const element = document.createElement("div");

    element.textContent = String(value ?? "");

    return element.innerHTML;
  }

  function escapeAttribute(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);

    window.location.href = "login.html";
  }

  logoutBtn?.addEventListener("click", logout);

  sidebarLogoutBtn?.addEventListener("click", logout);

  // ==========================================
  // DEBUG
  // ==========================================

  console.log("Current profile:", currentUser);
  console.log("User posts:", userPosts);
  console.log("User projects:", userProjects);
});
