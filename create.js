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
  // ELEMENTS
  // ==========================================

  const postOptionBtn = document.getElementById("postOptionBtn");

  const projectOptionBtn = document.getElementById("projectOptionBtn");

  const postFormSection = document.getElementById("postFormSection");

  const projectFormSection = document.getElementById("projectFormSection");

  const cancelPostBtn = document.getElementById("cancelPostBtn");

  const cancelProjectBtn = document.getElementById("cancelProjectBtn");

  const postForm = document.getElementById("postForm");

  const projectForm = document.getElementById("projectForm");

  const logoutBtn = document.getElementById("logoutBtn");

  const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");

  const navUserName = document.getElementById("navUserName");

  const navUserAvatar = document.getElementById("navUserAvatar");

  // ==========================================
  // DISPLAY CURRENT USER
  // ==========================================

  if (navUserName) {
    navUserName.textContent = currentUser.firstName;
  }

  if (navUserAvatar) {
    navUserAvatar.textContent =
      currentUser.firstName?.charAt(0).toUpperCase() || "U";
  }

  // ==========================================
  // SHOW POST FORM
  // ==========================================

  postOptionBtn?.addEventListener("click", () => {
    postFormSection.classList.remove("d-none");
    projectFormSection.classList.add("d-none");

    postFormSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  // ==========================================
  // SHOW PROJECT FORM
  // ==========================================

  projectOptionBtn?.addEventListener("click", () => {
    projectFormSection.classList.remove("d-none");
    postFormSection.classList.add("d-none");

    projectFormSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  // ==========================================
  // CANCEL POST
  // ==========================================

  cancelPostBtn?.addEventListener("click", () => {
    postForm.reset();
    postFormSection.classList.add("d-none");
  });

  // ==========================================
  // CANCEL PROJECT
  // ==========================================

  cancelProjectBtn?.addEventListener("click", () => {
    projectForm.reset();
    projectFormSection.classList.add("d-none");
  });

  // ==========================================
  // CREATE POST
  // ==========================================

  postForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("postTitle").value.trim();

    const content = document.getElementById("postContent").value.trim();

    const tagsInput = document.getElementById("postTags").value.trim();

    // ------------------------------------------
    // Validation
    // ------------------------------------------

    if (!title || !content) {
      alert("Please complete the post title and content.");
      return;
    }

    // ------------------------------------------
    // Convert tags into an array
    // ------------------------------------------

    const tags = tagsInput
      ? tagsInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    // ------------------------------------------
    // Get existing posts
    // ------------------------------------------

    const posts = JSON.parse(localStorage.getItem(POSTS_KEY)) || [];

    // ------------------------------------------
    // Create post
    // ------------------------------------------

    const newPost = {
      id: `post_${Date.now()}`,
      type: "post",

      title,
      content,
      tags,

      author: {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        username: currentUser.username,
        role: currentUser.role,
      },

      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    // ------------------------------------------
    // Save post
    // ------------------------------------------

    posts.unshift(newPost);

    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));

    // ------------------------------------------
    // Success
    // ------------------------------------------

    alert("Your post has been published.");

    postForm.reset();

    window.location.href = "dashboard.html";
  });

  // ==========================================
  // CREATE PROJECT
  // ==========================================

  projectForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("projectName").value.trim();

    const description = document
      .getElementById("projectDescription")
      .value.trim();

    const technologiesInput = document
      .getElementById("projectTechnologies")
      .value.trim();

    const repositoryUrl = document.getElementById("projectRepo").value.trim();

    const liveUrl = document.getElementById("projectLiveUrl").value.trim();

    // ------------------------------------------
    // Validation
    // ------------------------------------------

    if (!name || !description) {
      alert("Please enter a project name and description.");
      return;
    }

    // ------------------------------------------
    // Convert technologies into an array
    // ------------------------------------------

    const technologies = technologiesInput
      ? technologiesInput
          .split(",")
          .map((technology) => technology.trim())
          .filter((technology) => technology.length > 0)
      : [];

    // ------------------------------------------
    // Get existing projects
    // ------------------------------------------

    const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];

    // ------------------------------------------
    // Create project
    // ------------------------------------------

    const newProject = {
      id: `project_${Date.now()}`,
      type: "project",

      name,
      description,
      technologies,

      repositoryUrl,
      liveUrl,

      author: {
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        username: currentUser.username,
        role: currentUser.role,
      },

      stars: 0,
      forks: 0,
      contributors: [],

      createdAt: new Date().toISOString(),
    };

    // ------------------------------------------
    // Save project
    // ------------------------------------------

    projects.unshift(newProject);

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));

    // ------------------------------------------
    // Success
    // ------------------------------------------

    alert("Your project has been published.");

    projectForm.reset();

    window.location.href = "projects.html";
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
});
