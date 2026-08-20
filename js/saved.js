// ==========================================
// CODECOLLAB SAVED
// saved.js
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================
  // AUTH
  // ==========================================

  if (!window.CodeCollabAuth?.requireAuth()) {
    return;
  }

  // ==========================================
  // ELEMENTS
  // ==========================================

  const results = document.getElementById("savedResults");

  const empty = document.getElementById("savedEmpty");

  const filterButtons = document.querySelectorAll(".saved-filter");

  let activeFilter = "all";

  // ==========================================
  // STORAGE
  // ==========================================

  function getSaved() {
    try {
      return JSON.parse(localStorage.getItem("codecollabSaved")) || [];
    } catch {
      return [];
    }
  }

  function getArray(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key));

      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  // ==========================================
  // HELPERS
  // ==========================================

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")

      .replaceAll("<", "&lt;")

      .replaceAll(">", "&gt;")

      .replaceAll('"', "&quot;")

      .replaceAll("'", "&#039;");
  }

  // ==========================================
  // GET SAVED ITEMS
  // ==========================================

  function getSavedItems() {
    const saved = getSaved();

    const projects = getArray("codecollabProjects");

    const posts = getArray("codecollabPosts");

    const projectItems = projects
      .filter((project) => saved.includes(project.id))
      .map((project) => ({
        ...project,
        savedType: "project",
      }));

    const postItems = posts
      .filter((post) => saved.includes(post.id))
      .map((post) => ({
        ...post,
        savedType: "post",
      }));

    return [...projectItems, ...postItems];
  }

  // ==========================================
  // RENDER PROJECT
  // ==========================================

  function renderProject(project) {
    return `

      <div class="col-md-6 col-lg-4">

        <article class="saved-card h-100">

          <span
            class="saved-type project-type"
          >
            Project
          </span>


          <h2 class="h5 fw-bold mt-3">
            ${escapeHtml(project.name)}
          </h2>


          <p class="text-muted small">
            ${escapeHtml(project.description)}
          </p>


          <div
            class="d-flex flex-wrap gap-2 mb-3"
          >

            ${(project.technologies || [])
              .slice(0, 4)
              .map(
                (tech) =>
                  `<span class="tech-tag">
                      ${escapeHtml(tech)}
                    </span>`,
              )
              .join("")}

          </div>


          <div
            class="d-flex justify-content-between align-items-center"
          >

            <span class="small text-muted">
              <i class="bi bi-bookmark-fill me-1"></i>
              Saved
            </span>


            <a
              href="projects.html"
              class="btn btn-sm btn-outline-primary rounded-pill"
            >
              View
            </a>

          </div>

        </article>

      </div>

    `;
  }

  // ==========================================
  // RENDER POST
  // ==========================================

  function renderPost(post) {
    return `

      <div class="col-md-6 col-lg-4">

        <article class="saved-card h-100">

          <span
            class="saved-type post-type"
          >
            Post
          </span>


          <h2 class="h5 fw-bold mt-3">
            ${escapeHtml(post.title)}
          </h2>


          <p class="text-muted small">
            ${escapeHtml(post.content)}
          </p>


          <div
            class="d-flex flex-wrap gap-2 mb-3"
          >

            ${(post.tags || [])
              .slice(0, 4)
              .map(
                (tag) =>
                  `<span class="tech-tag">
                      ${escapeHtml(tag)}
                    </span>`,
              )
              .join("")}

          </div>


          <div
            class="d-flex justify-content-between align-items-center"
          >

            <span class="small text-muted">
              <i class="bi bi-bookmark-fill me-1"></i>
              Saved
            </span>


            <a
              href="dashboard.html"
              class="btn btn-sm btn-outline-primary rounded-pill"
            >
              Read
            </a>

          </div>

        </article>

      </div>

    `;
  }

  // ==========================================
  // RENDER
  // ==========================================

  function render() {
    let items = getSavedItems();

    if (activeFilter !== "all") {
      const type = activeFilter === "projects" ? "project" : "post";

      items = items.filter((item) => item.savedType === type);
    }

    if (!items.length) {
      results.innerHTML = "";

      empty.classList.remove("d-none");

      return;
    }

    empty.classList.add("d-none");

    results.innerHTML = items
      .map((item) =>
        item.savedType === "project" ? renderProject(item) : renderPost(item),
      )
      .join("");
  }

  // ==========================================
  // FILTERS
  // ==========================================

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active"));

      button.classList.add("active");

      activeFilter = button.dataset.filter;

      render();
    });
  });

  // ==========================================
  // INITIAL
  // ==========================================

  render();
});
