// ==========================================
// CODECOLLAB UI SYSTEM
// ui.js
// ==========================================

(function () {
  "use strict";

  // ==========================================
  // CREATE UI CONTAINER
  // ==========================================

  function createUIContainer() {
    let container = document.getElementById("codecollab-ui-container");

    if (container) {
      return container;
    }

    container = document.createElement("div");

    container.id = "codecollab-ui-container";

    container.innerHTML = `
      <div
        id="codecollabToastContainer"
        class="toast-container position-fixed top-0 end-0 p-3"
        style="z-index: 9999;"
      ></div>

      <div
        class="modal fade"
        id="codecollabConfirmModal"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg">

            <div class="modal-header border-0 pb-2">
              <h5
                class="modal-title fw-bold"
                id="codecollabConfirmTitle"
              >
                Are you sure?
              </h5>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body pt-2">
              <p
                id="codecollabConfirmMessage"
                class="text-muted mb-0"
              ></p>
            </div>

            <div class="modal-footer border-0">
              <button
                type="button"
                class="btn btn-light rounded-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button
                type="button"
                id="codecollabConfirmButton"
                class="btn btn-danger rounded-3"
              >
                Confirm
              </button>
            </div>

          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    return container;
  }

  // ==========================================
  // TOAST
  // ==========================================

  function showToast(message, type = "success", title = "") {
    const container = createUIContainer();

    const toastContainer = container.querySelector("#codecollabToastContainer");

    const toastId = `toast_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const config = {
      success: {
        icon: "bi-check-circle-fill",
        className: "text-bg-success",
        defaultTitle: "Success",
      },

      error: {
        icon: "bi-x-circle-fill",
        className: "text-bg-danger",
        defaultTitle: "Something went wrong",
      },

      warning: {
        icon: "bi-exclamation-triangle-fill",
        className: "text-bg-warning",
        defaultTitle: "Attention",
      },

      info: {
        icon: "bi-info-circle-fill",
        className: "text-bg-primary",
        defaultTitle: "Information",
      },
    };

    const selected = config[type] || config.info;

    const toastTitle = title || selected.defaultTitle;

    const toast = document.createElement("div");

    toast.id = toastId;

    toast.className = `toast ${selected.className} border-0`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    toast.innerHTML = `
      <div class="d-flex">

        <div class="toast-body d-flex gap-2 align-items-start">

          <i class="bi ${selected.icon} fs-5"></i>

          <div>
            <strong class="d-block mb-1">
              ${escapeHTML(toastTitle)}
            </strong>

            <span>
              ${escapeHTML(message)}
            </span>
          </div>

        </div>

        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>

      </div>
    `;

    toastContainer.appendChild(toast);

    const bootstrapToast = bootstrap.Toast.getOrCreateInstance(toast, {
      delay: 3500,
    });

    toast.addEventListener("hidden.bs.toast", () => {
      toast.remove();
    });

    bootstrapToast.show();
  }

  // ==========================================
  // CONFIRMATION MODAL
  // ==========================================

  function showConfirm({
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    confirmClass = "btn-danger",
    onConfirm = null,
  } = {}) {
    const container = createUIContainer();

    const modalElement = container.querySelector("#codecollabConfirmModal");

    const titleElement = container.querySelector("#codecollabConfirmTitle");

    const messageElement = container.querySelector("#codecollabConfirmMessage");

    const confirmButton = container.querySelector("#codecollabConfirmButton");

    titleElement.textContent = title;
    messageElement.textContent = message;

    confirmButton.textContent = confirmText;

    confirmButton.className = `btn ${confirmClass} rounded-3`;

    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    // Remove previous listener
    const newButton = confirmButton.cloneNode(true);

    confirmButton.replaceWith(newButton);

    newButton.addEventListener("click", () => {
      modal.hide();

      if (typeof onConfirm === "function") {
        onConfirm();
      }
    });

    modal.show();
  }

  // ==========================================
  // HTML SAFETY
  // ==========================================

  function escapeHTML(value) {
    const element = document.createElement("div");

    element.textContent = String(value ?? "");

    return element.innerHTML;
  }

  // ==========================================
  // GLOBAL API
  // ==========================================

  window.CodeCollabUI = {
    toast: showToast,
    confirm: showConfirm,
  };
})();
