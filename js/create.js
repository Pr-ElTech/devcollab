// ==========================================
// CODECOLLAB CREATE SYSTEM
// create.js
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================
  // STORAGE KEYS
  // ==========================================

  const POSTS_KEY = "codecollabPosts";
  const PROJECTS_KEY = "codecollabProjects";

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

  const postOptionBtn = document.getElementById("postOptionBtn");

  const projectOptionBtn = document.getElementById("projectOptionBtn");

  const postFormSection = document.getElementById("postFormSection");

  const projectFormSection = document.getElementById("projectFormSection");

  const cancelPostBtn = document.getElementById("cancelPostBtn");

  const cancelProjectBtn = document.getElementById("cancelProjectBtn");

  const postForm = document.getElementById("postForm");

  const projectForm = document.getElementById("projectForm");

  // ==========================================
  // HELPER: READ ARRAY FROM LOCAL STORAGE
  // ==========================================

  function getStoredArray(key) {
    try {
      const stored = JSON.parse(localStorage.getItem(key));

      return Array.isArray(stored) ? stored : [];
    } catch (error) {
      console.error(`CodeCollab: Could not read ${key}.`, error);

      return [];
    }
  }

  // ==========================================
  // HELPER: SAVE ARRAY TO LOCAL STORAGE
  // ==========================================

  function saveArray(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ==========================================
  // AUTHOR SNAPSHOT
  // ==========================================

  function createAuthorSnapshot() {
    return {
      id: currentUser.id,
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      username: currentUser.username || "",
      role: currentUser.role || "Developer",
    };
  }

  // ==========================================
  // SHOW POST FORM
  // ==========================================

  postOptionBtn?.addEventListener("click", () => {
    if (!postFormSection) {
      return;
    }

    postFormSection.classList.remove("d-none");

    projectFormSection?.classList.add("d-none");

    postFormSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  // ==========================================
  // SHOW PROJECT FORM
  // ==========================================

  projectOptionBtn?.addEventListener("click", () => {
    if (!projectFormSection) {
      return;
    }

    projectFormSection.classList.remove("d-none");

    postFormSection?.classList.add("d-none");

    projectFormSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  // ==========================================
  // CANCEL POST
  // ==========================================

  cancelPostBtn?.addEventListener("click", () => {
    postForm?.reset();

    postFormSection?.classList.add("d-none");
  });

  // ==========================================
  // CANCEL PROJECT
  // ==========================================

  cancelProjectBtn?.addEventListener("click", () => {
    projectForm?.reset();

    projectFormSection?.classList.add("d-none");
  });

  // ==========================================
  // CREATE POST
  // ==========================================

  postForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    // ----------------------------------------
    // GET VALUES
    // ----------------------------------------

    const titleInput = document.getElementById("postTitle");

    const contentInput = document.getElementById("postContent");

    const tagsInput = document.getElementById("postTags");

    const title = titleInput?.value.trim() || "";

    const content = contentInput?.value.trim() || "";

    const tagsValue = tagsInput?.value.trim() || "";

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!title || !content) {
      window.CodeCollabUI?.toast(
        "Please complete the post title and content.",
        "warning",
        "Missing Information",
      );

      return;
    }

    // ----------------------------------------
    // TAGS
    // ----------------------------------------

    const tags = tagsValue
      ? tagsValue
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    // ----------------------------------------
    // EXISTING POSTS
    // ----------------------------------------

    const posts = getStoredArray(POSTS_KEY);

    // ----------------------------------------
    // CREATE POST
    // ----------------------------------------

    const newPost = {
      id: `post_${Date.now()}`,

      type: "post",

      title,

      content,

      tags,

      author: createAuthorSnapshot(),

      likes: 0,

      comments: [],

      createdAt: new Date().toISOString(),
    };

    // ----------------------------------------
    // SAVE
    // ----------------------------------------

    posts.unshift(newPost);

    saveArray(POSTS_KEY, posts);

    // ----------------------------------------
    // FEEDBACK
    // ----------------------------------------

    window.CodeCollabUI?.toast(
      "Your post has been published successfully.",
      "success",
      "Post Published",
    );

    // ----------------------------------------
    // RESET
    // ----------------------------------------

    postForm.reset();

    // ----------------------------------------
    // REDIRECT
    // ----------------------------------------

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 900);
  });

  // ==========================================
  // CREATE PROJECT
  // ==========================================

  projectForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    // ----------------------------------------
    // GET VALUES
    // ----------------------------------------

    const nameInput = document.getElementById("projectName");

    const descriptionInput = document.getElementById("projectDescription");

    const technologiesInput = document.getElementById("projectTechnologies");

    const repositoryInput = document.getElementById("projectRepo");

    const liveUrlInput = document.getElementById("projectLiveUrl");

    const name = nameInput?.value.trim() || "";

    const description = descriptionInput?.value.trim() || "";

    const technologiesValue = technologiesInput?.value.trim() || "";

    const repositoryUrl = repositoryInput?.value.trim() || "";

    const liveUrl = liveUrlInput?.value.trim() || "";

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!name || !description) {
      window.CodeCollabUI?.toast(
        "Please enter a project name and description.",
        "warning",
        "Missing Information",
      );

      return;
    }

    // ----------------------------------------
    // TECHNOLOGIES
    // ----------------------------------------

    const technologies = technologiesValue
      ? technologiesValue
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean)
      : [];

    // ----------------------------------------
    // EXISTING PROJECTS
    // ----------------------------------------

    const projects = getStoredArray(PROJECTS_KEY);

    // ----------------------------------------
    // CREATE PROJECT
    // ----------------------------------------

    const newProject = {
      id: `project_${Date.now()}`,

      type: "project",

      name,

      description,

      technologies,

      repositoryUrl,

      liveUrl,

      author: createAuthorSnapshot(),

      stars: 0,

      forks: 0,

      contributors: [],

      createdAt: new Date().toISOString(),
    };

    // ----------------------------------------
    // SAVE
    // ----------------------------------------

    projects.unshift(newProject);

    saveArray(PROJECTS_KEY, projects);

    // ----------------------------------------
    // FEEDBACK
    // ----------------------------------------

    window.CodeCollabUI?.toast(
      "Your project has been published successfully.",
      "success",
      "Project Published",
    );

    // ----------------------------------------
    // RESET
    // ----------------------------------------

    projectForm.reset();

    // ----------------------------------------
    // REDIRECT
    // ----------------------------------------

    setTimeout(() => {
      window.location.href = "projects.html";
    }, 900);
  });
});
