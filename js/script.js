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
    const categories = ["All", ...new Set(products.map((product) => product.category))];
    const queryCategory = new URLSearchParams(window.location.search).get("category");
    let activeCategory = categories.includes(queryCategory) ? queryCategory : "All";
    let searchTerm = "";

    const createFilterButtons = () => {
      filtersContainer.innerHTML = categories.map((category) => `
        <button class="filter-pill ${category === activeCategory ? "active" : ""}" type="button" data-category="${category}">${category}</button>
      `).join("");

      filtersContainer.querySelectorAll(".filter-pill").forEach((button) => {
        button.addEventListener("click", () => {
          activeCategory = button.dataset.category || "All";
          filtersContainer.querySelectorAll(".filter-pill").forEach((item) => item.classList.toggle("active", item === button));
          renderProducts();
          const url = new URL(window.location.href);
          if (activeCategory === "All") url.searchParams.delete("category");
          else url.searchParams.set("category", activeCategory);
          window.history.replaceState({}, "", url);
        });
      });
    };

    const renderProducts = () => {
      const filtered = products.filter((product) => {
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        const haystack = `${product.name} ${product.code} ${product.category}`.toLowerCase();
        return matchesCategory && haystack.includes(searchTerm.toLowerCase());
      });

      grid.innerHTML = filtered.map((product) => `
        <article class="catalogue-card reveal visible">
          <div class="catalogue-visual">
            <span class="catalogue-category">${product.category}</span>
            <div class="product-placeholder" aria-label="Product image placeholder"><span>${product.symbol}</span></div>
          </div>
          <div class="catalogue-info">
            <span class="product-code">Product Code · ${product.code}</span>
            <h3>${product.name}</h3>
            <div class="catalogue-actions">
              <span>Contact for Price</span>
              <button type="button" data-name="${product.name}" data-code="${product.code}">Enquire ↗</button>
            </div>
          </div>
        </article>
      `).join("");

      countElement.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"}`;
      emptyState.hidden = filtered.length !== 0;
      grid.hidden = filtered.length === 0;

      grid.querySelectorAll(".catalogue-actions button").forEach((button) => {
        button.addEventListener("click", () => openProductEnquiry(button.dataset.name, button.dataset.code));
      });
    };

    const resetAll = () => {
      activeCategory = "All";
      searchTerm = "";
      if (searchInput) searchInput.value = "";
      createFilterButtons();
      renderProducts();
      window.history.replaceState({}, "", window.location.pathname);
    };

    searchInput?.addEventListener("input", () => {
      searchTerm = searchInput.value.trim();
      renderProducts();
    });
    clearFilters?.addEventListener("click", resetAll);
    resetProducts?.addEventListener("click", resetAll);

    createFilterButtons();
    renderProducts();
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
