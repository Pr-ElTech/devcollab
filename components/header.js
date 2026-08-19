// ==========================================
// CODECOLLAB SHARED HEADER
// header.js
// ==========================================

(function () {
  "use strict";

  // ==========================================
  // ESCAPE HTML
  // ==========================================

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ==========================================
  // ACTIVE PAGE
  // ==========================================

  function getCurrentPage() {
    const page = window.location.pathname.split("/").pop().toLowerCase();

    return page || "index.html";
  }

  function activeClass(page) {
    return getCurrentPage() === page ? "active" : "";
  }

  // ==========================================
  // RENDER
  // ==========================================

  function renderHeader() {
    const container = document.getElementById("app-header");

    if (!container) {
      return;
    }

    const user = window.CodeCollabAuth?.getCurrentUser() || null;

    container.innerHTML = `
      <nav class="navbar navbar-expand-lg bg-white border-bottom py-3">
        <div class="container">

          <!-- LOGO -->

          <a
            class="navbar-brand"
            href="index.html"
          >
            <img
              src="assets/images/logo.png"
              alt="CodeCollab"
              class="navbar-logo"
            />
          </a>


          <!-- MOBILE BUTTON -->

          <button
            class="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>


          <!-- NAVIGATION -->

          <div
            class="collapse navbar-collapse"
            id="navbarNav"
          >

            <ul class="navbar-nav mx-auto">

              <li class="nav-item">
                <a
                  class="nav-link ${activeClass("index.html")}"
                  href="index.html"
                >
                  Home
                </a>
              </li>


              <li class="nav-item">
                <a
                  class="nav-link ${activeClass("features.html")}"
                  href="features.html"
                >
                  Features
                </a>
              </li>


              <li class="nav-item">
                <a
                  class="nav-link ${activeClass("how-it-works.html")}"
                  href="how-it-works.html"
                >
                  How It Works
                </a>
              </li>


              <li class="nav-item">
                <a
                  class="nav-link ${activeClass("projects.html")}"
                  href="projects.html"
                >
                  Projects
                </a>
              </li>


              <li class="nav-item">
                <a
                  class="nav-link ${activeClass("about.html")}"
                  href="about.html"
                >
                  About
                </a>
              </li>

            </ul>


            <!-- AUTH AREA -->

            <div
              class="d-flex align-items-center gap-3 mt-3 mt-lg-0"
            >

              ${
                user
                  ? `
                    <!-- LOGGED IN -->

                    <a
                      href="dashboard.html"
                      class="btn btn-outline-primary rounded-pill px-4"
                    >
                      Dashboard
                    </a>


                    <div class="dropdown">

                      <button
                        class="btn p-0 border-0 shadow-none d-flex align-items-center gap-2"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >

                        <div class="header-avatar">
                          ${window.CodeCollabAuth.getUserInitials(user)}
                        </div>

                        <span
                          class="d-none d-lg-inline fw-semibold text-dark"
                        >
                          ${escapeHtml(user.firstName || "Developer")}
                        </span>

                        <i
                          class="bi bi-chevron-down small text-muted"
                        ></i>

                      </button>


                      <ul
                        class="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-2"
                      >

                        <li>
                          <a
                            class="dropdown-item"
                            href="profile.html"
                          >
                            <i class="bi bi-person me-2"></i>
                            Profile
                          </a>
                        </li>


                        <li>
                          <a
                            class="dropdown-item"
                            href="settings.html"
                          >
                            <i class="bi bi-gear me-2"></i>
                            Settings
                          </a>
                        </li>


                        <li>
                          <hr class="dropdown-divider">
                        </li>


                        <li>
                          <button
                            type="button"
                            class="dropdown-item text-danger"
                            data-action="logout"
                          >
                            <i class="bi bi-box-arrow-right me-2"></i>
                            Log out
                          </button>
                        </li>

                      </ul>

                    </div>
                  `
                  : `
                    <!-- LOGGED OUT -->

                    <a
                      href="login.html"
                      class="text-dark text-decoration-none fw-medium"
                    >
                      Log in
                    </a>

                    <a
                      href="signup.html"
                      class="btn btn-primary rounded-pill px-4"
                    >
                      Sign Up
                    </a>
                  `
              }

            </div>

          </div>

        </div>
      </nav>
    `;

    bindLogout();
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  function bindLogout() {
    const logoutButton = document.querySelector('[data-action="logout"]');

    if (!logoutButton) {
      return;
    }

    logoutButton.addEventListener("click", () => {
      window.CodeCollabAuth.logout();
    });
  }

  // ==========================================
  // START
  // ==========================================

  document.addEventListener("DOMContentLoaded", renderHeader);
})();
