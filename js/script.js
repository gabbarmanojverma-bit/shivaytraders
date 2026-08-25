(() => {
  "use strict";

  const number = "919412502311";
  const generalMessage = "Hello Shivay Traders, I want to enquire about your wholesale jewellery collection.";
  const waUrl = (message) => `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  document.querySelectorAll(".js-wa").forEach((link) => {
    link.href = waUrl(generalMessage);
  });

  const openProductEnquiry = (name, code) => {
    const message = [
      "Hello Shivay Traders,",
      "",
      "I want to enquire about this wholesale product.",
      "",
      `Product Name: ${name}`,
      `Product Code: ${code}`,
      "",
      "Please share price and availability."
    ].join("\n");
    window.open(waUrl(message), "_blank", "noopener");
  };

  document.querySelectorAll(".product-enquiry").forEach((button) => {
    button.addEventListener("click", () => {
      openProductEnquiry(button.dataset.product || "Product", button.dataset.code || "Not available");
    });
  });

  const form = document.getElementById("enquiryForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const value = (name) => String(data.get(name) || "").trim();
    const details = {
      buyerName: value("buyerName"),
      businessName: value("businessName"),
      mobile: value("mobile"),
      whatsapp: value("whatsapp"),
      city: value("city"),
      state: value("state")
    };

    if (Object.values(details).some((item) => !item)) {
      alert("Please fill in all required fields.");
      return;
    }

    const message = [
      "Hello Shivay Traders,",
      "",
      "I want to enquire about your wholesale jewellery collection.",
      "",
      `Buyer Name: ${details.buyerName}`,
      `Shop / Business Name: ${details.businessName}`,
      `Mobile Number: ${details.mobile}`,
      `WhatsApp Number: ${details.whatsapp}`,
      `City: ${details.city}`,
      `State: ${details.state}`
    ].join("\n");

    window.open(waUrl(message), "_blank", "noopener");
  });

  const header = document.querySelector(".header");
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".nav");

  const closeMenu = () => {
    nav?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const products = Array.isArray(window.SHIVAY_PRODUCTS) ? window.SHIVAY_PRODUCTS : [];

const grid = document.getElementById("productsGrid");
const filtersContainer = document.getElementById("categoryFilters");
const searchInput = document.getElementById("productSearch");
const countElement = document.getElementById("productCount");
const emptyState = document.getElementById("emptyState");
const clearFilters = document.getElementById("clearFilters");
const resetProducts = document.getElementById("resetProducts");

if (grid && filtersContainer && products.length) {

  /* =========================================
     MULTI PRODUCT ENQUIRY LIST
  ========================================= */

  const ENQUIRY_STORAGE_KEY = "shivay-traders-enquiry-list";

  let enquiryList = [];

  try {
    const savedList = JSON.parse(
      localStorage.getItem(ENQUIRY_STORAGE_KEY) || "[]"
    );

    enquiryList = Array.isArray(savedList) ? savedList : [];
  } catch (error) {
    enquiryList = [];
  }


  /* ---------- Create Enquiry Drawer ---------- */

  const enquiryUI = document.createElement("div");

  enquiryUI.innerHTML = `
    <button
      class="enquiry-list-fab"
      id="enquiryListFab"
      type="button"
      hidden
    >
      Enquiry List
      <span id="enquiryListCount">0</span>
    </button>

    <div
      class="enquiry-drawer-backdrop"
      id="enquiryDrawerBackdrop"
      hidden
    ></div>

    <aside
      class="enquiry-drawer"
      id="enquiryDrawer"
      aria-hidden="true"
    >
      <div class="enquiry-drawer-header">
        <div>
          <small>WHOLESALE ENQUIRY</small>
          <h3>Your Enquiry List</h3>
        </div>

        <button
          class="enquiry-drawer-close"
          id="closeEnquiryDrawer"
          type="button"
          aria-label="Close enquiry list"
        >
          ×
        </button>
      </div>

      <div
        class="enquiry-drawer-items"
        id="enquiryDrawerItems"
      ></div>

      <div class="enquiry-drawer-footer">

        <button
          class="clear-enquiry-btn"
          id="clearEnquiryList"
          type="button"
        >
          Clear List
        </button>

        <button
          class="send-enquiry-btn"
          id="sendEnquiryList"
          type="button"
        >
          Enquire on WhatsApp ↗
        </button>

      </div>
    </aside>
  `;

  document.body.appendChild(enquiryUI);


  const enquiryFab = document.getElementById("enquiryListFab");
  const enquiryCount = document.getElementById("enquiryListCount");
  const enquiryDrawer = document.getElementById("enquiryDrawer");
  const enquiryBackdrop = document.getElementById("enquiryDrawerBackdrop");
  const enquiryDrawerItems = document.getElementById("enquiryDrawerItems");
  const closeEnquiryDrawer = document.getElementById("closeEnquiryDrawer");
  const clearEnquiryList = document.getElementById("clearEnquiryList");
  const sendEnquiryList = document.getElementById("sendEnquiryList");


  const productIsAdded = (code) =>
    enquiryList.some((item) => item.code === code);


  const saveEnquiryList = () => {
    localStorage.setItem(
      ENQUIRY_STORAGE_KEY,
      JSON.stringify(enquiryList)
    );

    updateEnquiryUI();
  };


  const setDrawerOpen = (open) => {

    enquiryDrawer.classList.toggle("open", open);

    enquiryDrawer.setAttribute(
      "aria-hidden",
      String(!open)
    );

    enquiryBackdrop.hidden = !open;

    document.body.classList.toggle(
      "enquiry-drawer-open",
      open
    );
  };


  const updateEnquiryUI = () => {

    enquiryCount.textContent = String(enquiryList.length);

    enquiryFab.hidden = enquiryList.length === 0;

    if (!enquiryList.length) {

      enquiryDrawerItems.innerHTML = `
        <div class="enquiry-empty">
          <span>ॐ</span>
          <h4>No products added</h4>
          <p>Add products from the catalogue to create a combined enquiry.</p>
        </div>
      `;

      return;
    }


    enquiryDrawerItems.innerHTML = enquiryList.map((item) => `
      <div class="enquiry-list-item">

        <img
          src="${item.image}"
          alt="${item.name}"
        >

        <div class="enquiry-list-item-info">
          <strong>${item.name}</strong>
          <small>${item.code}</small>
        </div>

        <button
          type="button"
          class="remove-enquiry-item"
          data-code="${item.code}"
          aria-label="Remove ${item.name}"
        >
          ×
        </button>

      </div>
    `).join("");


    enquiryDrawerItems
      .querySelectorAll(".remove-enquiry-item")
      .forEach((button) => {

        button.addEventListener("click", () => {

          enquiryList = enquiryList.filter(
            (item) => item.code !== button.dataset.code
          );

          saveEnquiryList();
          renderProducts();

        });

      });
  };


  const addProductToEnquiry = (product) => {

    if (productIsAdded(product.code)) {
      return;
    }

    enquiryList.push({
      name: product.name,
      code: product.code,
      category: product.category,
      image: product.image
    });

    saveEnquiryList();
    renderProducts();

    enquiryFab.classList.remove("enquiry-added-pop");

    void enquiryFab.offsetWidth;

    enquiryFab.classList.add("enquiry-added-pop");
  };


  const sendCombinedEnquiry = () => {

    if (!enquiryList.length) {
      return;
    }

    const productLines = enquiryList.map(
      (item, index) =>
        `${index + 1}. ${item.name} - ${item.code}`
    );

    const message = [
      "Hello Shivay Traders,",
      "",
      "I want to enquire about these wholesale products:",
      "",
      ...productLines,
      "",
      "Please share price and availability."
    ].join("\n");

    window.open(
      waUrl(message),
      "_blank",
      "noopener"
    );
  };


  enquiryFab.addEventListener("click", () => {
    setDrawerOpen(true);
  });


  closeEnquiryDrawer.addEventListener("click", () => {
    setDrawerOpen(false);
  });


  enquiryBackdrop.addEventListener("click", () => {
    setDrawerOpen(false);
  });


  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
      setDrawerOpen(false);
    }

  });


  clearEnquiryList.addEventListener("click", () => {

    if (!enquiryList.length) {
      return;
    }

    enquiryList = [];

    saveEnquiryList();
    renderProducts();
    setDrawerOpen(false);
  });


  sendEnquiryList.addEventListener("click", () => {
    sendCombinedEnquiry();
  });


  /* =========================================
     FILTERS
  ========================================= */

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category))
  ];

  const queryCategory =
    new URLSearchParams(window.location.search)
      .get("category");

  let activeCategory =
    categories.includes(queryCategory)
      ? queryCategory
      : "All";

  let searchTerm = "";


  const createFilterButtons = () => {

    filtersContainer.innerHTML = categories.map((category) => `
      <button
        class="filter-pill ${category === activeCategory ? "active" : ""}"
        type="button"
        data-category="${category}"
      >
        ${category}
      </button>
    `).join("");


    filtersContainer
      .querySelectorAll(".filter-pill")
      .forEach((button) => {

        button.addEventListener("click", () => {

          activeCategory =
            button.dataset.category || "All";

          filtersContainer
            .querySelectorAll(".filter-pill")
            .forEach((item) =>
              item.classList.toggle(
                "active",
                item === button
              )
            );

          renderProducts();

          const url =
            new URL(window.location.href);

          if (activeCategory === "All") {
            url.searchParams.delete("category");
          } else {
            url.searchParams.set(
              "category",
              activeCategory
            );
          }

          window.history.replaceState(
            {},
            "",
            url
          );

        });

      });
  };


  /* =========================================
     PRODUCT CARDS
  ========================================= */

  const renderProducts = () => {

    const filtered = products.filter((product) => {

      const matchesCategory =
        activeCategory === "All" ||
        product.category === activeCategory;

      const haystack =
        `${product.name} ${product.code} ${product.category}`
          .toLowerCase();

      return (
        matchesCategory &&
        haystack.includes(searchTerm.toLowerCase())
      );
    });


    grid.innerHTML = filtered.map((product) => {

      const added =
        productIsAdded(product.code);

      return `
        <article class="catalogue-card reveal visible">

          <div class="catalogue-visual">

            <span class="catalogue-category">
              ${product.category}
            </span>

            <img
              class="product-photo"
              src="${product.image}"
              alt="${product.alt || `${product.name} ${product.code}`}"
              loading="lazy"
              decoding="async"
            >

          </div>


          <div class="catalogue-info">

            <span class="product-code">
              Product Code · ${product.code}
            </span>

            <h3>${product.name}</h3>


            <div class="catalogue-actions">

              <span>Contact for Price</span>

              <div class="catalogue-action-buttons">

                <button
                  class="single-enquiry-btn"
                  type="button"
                  data-action="single-enquiry"
                  data-code="${product.code}"
                >
                  Enquire ↗
                </button>


                <button
                  class="add-enquiry-btn ${added ? "added" : ""}"
                  type="button"
                  data-action="add-enquiry"
                  data-code="${product.code}"
                  ${added ? "disabled" : ""}
                >
                  ${added ? "Added ✓" : "Add to Enquiry +"}
                </button>

              </div>

            </div>

          </div>

        </article>
      `;

    }).join("");


    if (countElement) {

      countElement.textContent =
        `${filtered.length} product${filtered.length === 1 ? "" : "s"}`;

    }


    emptyState.hidden =
      filtered.length !== 0;

    grid.hidden =
      filtered.length === 0;


    grid
      .querySelectorAll('[data-action="single-enquiry"]')
      .forEach((button) => {

        button.addEventListener("click", () => {

          const product = products.find(
            (item) => item.code === button.dataset.code
          );

          if (!product) {
            return;
          }

          openProductEnquiry(
            product.name,
            product.code
          );

        });

      });


    grid
      .querySelectorAll('[data-action="add-enquiry"]')
      .forEach((button) => {

        button.addEventListener("click", () => {

          const product = products.find(
            (item) => item.code === button.dataset.code
          );

          if (!product) {
            return;
          }

          addProductToEnquiry(product);

        });

      });
  };


  const resetAll = () => {

    activeCategory = "All";
    searchTerm = "";

    if (searchInput) {
      searchInput.value = "";
    }

    createFilterButtons();
    renderProducts();

    window.history.replaceState(
      {},
      "",
      window.location.pathname
    );
  };


  searchInput?.addEventListener(
    "input",
    () => {

      searchTerm =
        searchInput.value.trim();

      renderProducts();

    }
  );


  clearFilters?.addEventListener(
    "click",
    resetAll
  );

  resetProducts?.addEventListener(
    "click",
    resetAll
  );


  createFilterButtons();
  updateEnquiryUI();
  renderProducts();
}
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
