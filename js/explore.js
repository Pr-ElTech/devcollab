// ==========================================
// CODECOLLAB EXPLORE
// explore.js
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

  const searchInput = document.getElementById("exploreSearch");

  const resultsContainer = document.getElementById("exploreResults");

  const emptyState = document.getElementById("exploreEmpty");

  const filterButtons = document.querySelectorAll(".explore-filter");

  // ==========================================
  // STATE
  // ==========================================

  let activeFilter = "all";

  // ==========================================
  // STORAGE
  // ==========================================

  function getArray(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key));

      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function getPosts() {
    return getArray("codecollabPosts");
  }

  function getProjects() {
    return getArray("codecollabProjects");
  }

  function getUsers() {
    return getArray("codecollabUsers");
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

  function getAuthorName(author) {
    if (!author) {
      return "CodeCollab Developer";
    }

    return (
      `${author.firstName || ""} ${author.lastName || ""}`.trim() ||
      author.username ||
      "Developer"
    );
  }

  function getInitials(author) {
    if (!author) {
      return "U";
    }

    return `${author.firstName || ""}`.charAt(0).toUpperCase() || "U";
  }

  // ==========================================
  // BUILD DATASET
  // ==========================================

  function buildResults() {
    const posts = getPosts().map((post) => ({
      ...post,
      resultType: "post",
    }));

    const projects = getProjects().map((project) => ({
      ...project,
      resultType: "project",
    }));

    const people = getUsers().map((user) => ({
      ...user,
      resultType: "person",
    }));

    return [...projects, ...posts, ...people];
  }

  // ==========================================
  // SEARCH
  // ==========================================

  function matchesSearch(item, search) {
    if (!search) {
      return true;
    }

    const query = search.toLowerCase();

    const values = [
      item.name,

      item.title,

      item.description,

      item.content,

      item.username,

      item.role,

      ...(item.technologies || []),

      ...(item.tags || []),

      item.author?.firstName,

      item.author?.lastName,

      item.author?.username,
    ];

    return values.some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(query),
    );
  }

  // ==========================================
  // FILTER
  // ==========================================

  function filterResults(results) {
    if (activeFilter === "all") {
      return results;
    }

    return results.filter(
      (item) => item.resultType === activeFilter.slice(0, -1),
    );
  }

  // ==========================================
  // PROJECT CARD
  // ==========================================

  function projectCard(project) {
    const author = project.author || {};

    return `
      <div class="col-md-6 col-lg-4">

        <article class="explore-card h-100">

          <div
            class="d-flex align-items-center gap-3 mb-3"
          >

            <div class="explore-avatar">
              ${getInitials(author)}
            </div>

            <div>

              <h6 class="fw-bold mb-0">
                ${escapeHtml(getAuthorName(author))}
              </h6>

              <small class="text-muted">
                ${
                  author.username
                    ? `@${escapeHtml(author.username)}`
                    : "Developer"
                }
              </small>

            </div>

          </div>


          <span class="explore-type project-type">
            Project
          </span>


          <h3 class="h5 fw-bold mt-3">
            ${escapeHtml(project.name || "Untitled Project")}
          </h3>


          <p class="text-muted small">
            ${escapeHtml(project.description || "No project description.")}
          </p>


          <div class="d-flex flex-wrap gap-2 mb-3">

            ${(project.technologies || [])
              .slice(0, 4)
              .map(
                (technology) =>
                  `<span class="tech-tag">
                      ${escapeHtml(technology)}
                    </span>`,
              )
              .join("")}

          </div>


          <div
            class="d-flex align-items-center gap-3 small text-muted"
          >

            <span>
              <i class="bi bi-star me-1"></i>
              ${project.stars || 0}
            </span>

            <span>
              <i class="bi bi-diagram-3 me-1"></i>
              ${project.forks || 0}
            </span>

          </div>

        </article>

      </div>
    `;
  }

  // ==========================================
  // POST CARD
  // ==========================================

  function postCard(post) {
    const author = post.author || {};

    return `
      <div class="col-md-6 col-lg-4">

        <article class="explore-card h-100">

          <div
            class="d-flex align-items-center gap-3 mb-3"
          >

            <div class="explore-avatar">
              ${getInitials(author)}
            </div>

            <div>

              <h6 class="fw-bold mb-0">
                ${escapeHtml(getAuthorName(author))}
              </h6>

              <small class="text-muted">
                ${
                  author.username
                    ? `@${escapeHtml(author.username)}`
                    : "Developer"
                }
              </small>

            </div>

          </div>


          <span class="explore-type post-type">
            Post
          </span>


          <h3 class="h5 fw-bold mt-3">
            ${escapeHtml(post.title || "Developer Post")}
          </h3>


          <p class="text-muted small">
            ${escapeHtml(post.content || "")}
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
            class="d-flex gap-3 small text-muted"
          >

            <span>
              <i class="bi bi-heart me-1"></i>
              ${post.likes || 0}
            </span>

            <span>
              <i class="bi bi-chat me-1"></i>
              ${(post.comments || []).length}
            </span>

          </div>

        </article>

      </div>
    `;
  }

  // ==========================================
  // PERSON CARD
  // ==========================================

  function personCard(user) {
    return `
      <div class="col-md-6 col-lg-4">

        <article class="explore-card h-100">

          <div class="text-center">

            <div class="explore-profile-avatar mx-auto">
              ${getInitials(user)}
            </div>


            <h3 class="h5 fw-bold mt-3 mb-1">
              ${escapeHtml(getAuthorName(user))}
            </h3>


            <p class="text-primary small mb-2">
              ${user.username ? `@${escapeHtml(user.username)}` : "@developer"}
            </p>


            <p class="text-muted small">
              ${escapeHtml(user.role || "Developer")}
            </p>


            <a
              href="profile.html"
              class="btn btn-outline-primary btn-sm rounded-pill px-4"
            >
              View Profile
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
    const search = searchInput?.value.trim() || "";

    let results = buildResults();

    results = results.filter((item) => matchesSearch(item, search));

    results = filterResults(results);

    if (!results.length) {
      resultsContainer.innerHTML = "";

      emptyState.classList.remove("d-none");

      return;
    }

    emptyState.classList.add("d-none");

    resultsContainer.innerHTML = results
      .map((item) => {
        if (item.resultType === "project") {
          return projectCard(item);
        }

        if (item.resultType === "post") {
          return postCard(item);
        }

        return personCard(item);
      })
      .join("");
  }

  // ==========================================
  // SEARCH EVENT
  // ==========================================

  searchInput?.addEventListener("input", render);

  // ==========================================
  // FILTER EVENTS
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
  // INITIAL RENDER
  // ==========================================

  render();
});
