/* Saved property searches and in-app new-listing match counts. */
(() => {
  const modal = document.getElementById("saved-searches-modal");
  const list = document.getElementById("saved-searches-list");
  const form = document.getElementById("saved-search-form");
  const nameInput = document.getElementById("saved-search-name");
  const status = document.getElementById("saved-search-status");
  const badge = document.getElementById("saved-search-count");
  let savedSearches = [];

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function readCurrentCriteria() {
    return {
      purpose: currentPurpose,
      city: filterLocation.value,
      type: filterType.value,
      maxPrice: filterPrice.value === "all" ? null : Number(filterPrice.value),
      keyword: filterKeyword.value.trim().slice(0, 120),
      hideOccupied: filterHideOccupied.checked,
      sort: sortSelect.value
    };
  }

  function normalizeCriteria(value = {}) {
    const purpose = ["all", "rent", "sale"].includes(value.purpose) ? value.purpose : "all";
    const cityOptions = new Set(Array.from(filterLocation.options, (option) => option.value));
    const typeOptions = new Set(Array.from(filterType.options, (option) => option.value));
    const priceOptions = new Set(Array.from(filterPrice.options, (option) => option.value));
    const sort = ["featured", "price-asc", "price-desc"].includes(value.sort) ? value.sort : "featured";
    const priceValue = value.maxPrice == null ? "all" : String(value.maxPrice);
    return {
      purpose,
      city: cityOptions.has(value.city) ? value.city : "all",
      type: typeOptions.has(value.type) ? value.type : "all",
      maxPrice: priceOptions.has(priceValue) && priceValue !== "all" ? Number(priceValue) : null,
      keyword: String(value.keyword || "").trim().slice(0, 120),
      hideOccupied: value.hideOccupied !== false,
      sort
    };
  }

  function describeCriteria(value) {
    const criteria = normalizeCriteria(value);
    const parts = [];
    if (criteria.purpose !== "all") parts.push(criteria.purpose === "rent" ? "For rent" : "For sale");
    if (criteria.city !== "all") parts.push(criteria.city);
    if (criteria.type !== "all") parts.push(criteria.type);
    if (criteria.maxPrice) parts.push(`up to ${formatKES(criteria.maxPrice)}`);
    if (criteria.keyword) parts.push(`“${criteria.keyword}”`);
    return parts.join(" · ") || "All new available property listings";
  }

  function matchesCriteria(property, value) {
    const criteria = normalizeCriteria(value);
    if (criteria.hideOccupied && (property.status || "available") === "occupied") return false;
    if (criteria.purpose !== "all" && property.purpose !== criteria.purpose) return false;
    if (criteria.city !== "all" && property.city !== criteria.city) return false;
    if (criteria.type !== "all" && property.type !== criteria.type) return false;
    if (criteria.maxPrice && Number(property.price) > criteria.maxPrice) return false;
    if (criteria.keyword) {
      const searchable = `${property.title} ${property.city} ${property.neighborhood} ${property.type} ${(property.amenities || []).join(" ")}`.toLowerCase();
      if (!searchable.includes(criteria.keyword.toLowerCase())) return false;
    }
    return true;
  }

  function countNewMatches(alert) {
    const since = Date.parse(alert.updated_at || alert.created_at);
    if (!Number.isFinite(since)) return 0;
    return properties.filter((property) => {
      const createdAt = Date.parse(property.createdAt || "");
      return Number.isFinite(createdAt) && createdAt > since && matchesCriteria(property, alert.criteria);
    }).length;
  }

  function setStatus(message = "", isError = false) {
    status.textContent = message;
    status.classList.toggle("text-rose-600", isError);
    status.classList.toggle("text-slate-500", !isError);
  }

  function updateBadge() {
    const totalNew = savedSearches.filter((alert) => alert.enabled).reduce((sum, alert) => sum + countNewMatches(alert), 0);
    badge.textContent = totalNew > 9 ? "9+" : String(totalNew);
    badge.classList.toggle("hidden", totalNew === 0);
    badge.classList.toggle("flex", totalNew > 0);
    badge.title = `${totalNew} new matches across your saved searches`;
  }

  function renderSavedSearches() {
    updateBadge();
    if (!savedSearches.length) {
      list.innerHTML = '<div class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center"><p class="font-bold text-slate-700">No saved searches yet</p><p class="mt-1 text-sm text-slate-500">Save your current filters to keep them on this account.</p></div>';
      return;
    }
    list.innerHTML = savedSearches.map((alert) => {
      const matches = alert.enabled ? countNewMatches(alert) : 0;
      const savedDate = new Date(alert.created_at);
      const savedLabel = Number.isNaN(savedDate.getTime()) ? "" : `Saved ${savedDate.toLocaleDateString()}`;
      return `<article class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-bold text-slate-900">${escapeHtml(alert.name)}</h3>
              ${matches ? `<span class="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-extrabold text-emerald-800">${matches} new ${matches === 1 ? "match" : "matches"}</span>` : ""}
              ${!alert.enabled ? '<span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">Paused</span>' : ""}
            </div>
            <p class="mt-1 text-sm text-slate-600">${escapeHtml(describeCriteria(alert.criteria))}</p>
            <p class="mt-1 text-xs text-slate-400">${escapeHtml(savedLabel)} · ${alert.enabled ? "Checks new listings in-app" : "Alert paused"}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" data-alert-action="apply" data-alert-id="${escapeHtml(alert.id)}" class="rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white hover:bg-brand-700">Apply</button>
            <button type="button" data-alert-action="toggle" data-alert-id="${escapeHtml(alert.id)}" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">${alert.enabled ? "Pause" : "Resume"}</button>
            <button type="button" data-alert-action="delete" data-alert-id="${escapeHtml(alert.id)}" class="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50">Delete</button>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  async function loadSavedSearches() {
    if (!window.savedSearchRepo?.configured || !window.currentUser) return;
    try {
      savedSearches = await window.savedSearchRepo.list();
      renderSavedSearches();
      setStatus("");
    } catch (error) {
      savedSearches = [];
      updateBadge();
      setStatus(`Could not load saved searches: ${error.message}`, true);
    }
  }

  async function openSavedSearches() {
    if (!window.savedSearchRepo?.configured) {
      showToast("Saved searches require the connected Supabase project.", "info");
      return;
    }
    if (!window.currentUser) {
      await window.requireSupabaseAuth();
      showToast("Sign in, then open Saved Searches again to save them to your account.", "info");
      return;
    }
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("saved-searches-open");
    setStatus("Loading your saved searches…");
    await refreshPropertiesFromSupabase();
    await loadSavedSearches();
  }

  function closeSavedSearches() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("saved-searches-open");
  }

  async function saveCurrentSearch() {
    if (!window.savedSearchRepo?.configured) {
      showToast("Saved searches require the connected Supabase project.", "info");
      return;
    }
    if (!window.currentUser) {
      await window.requireSupabaseAuth();
      showToast("Sign in, then select Save this search again.", "info");
      return;
    }
    nameInput.value = describeCriteria(readCurrentCriteria()).replace(/[“”]/g, "").slice(0, 80);
    await openSavedSearches();
    nameInput.focus();
  }

  async function saveSearch(event) {
    event.preventDefault();
    if (!window.currentUser) {
      setStatus("Sign in to save a search to your account.", true);
      return;
    }
    const name = nameInput.value.trim().slice(0, 80) || describeCriteria(readCurrentCriteria()).slice(0, 80);
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    setStatus("Saving your search…");
    try {
      await window.savedSearchRepo.create({ name, criteria: readCurrentCriteria() });
      nameInput.value = "";
      await loadSavedSearches();
      setStatus("Saved to your account. New matches will appear here when listings refresh.");
    } catch (error) {
      setStatus(`Could not save this search: ${error.message}`, true);
    } finally {
      submit.disabled = false;
    }
  }

  function applyAlert(alert) {
    if (currentPortal !== "marketplace") switchPortal("marketplace");
    if (showFavoritesOnly) toggleFavoritesView();
    const criteria = normalizeCriteria(alert.criteria);
    filterLocation.value = criteria.city;
    filterType.value = criteria.type;
    filterPrice.value = criteria.maxPrice ? String(criteria.maxPrice) : "all";
    filterKeyword.value = criteria.keyword;
    filterHideOccupied.checked = criteria.hideOccupied;
    sortSelect.value = criteria.sort;
    quickFilter(criteria.purpose);
    renderProperties();
    closeSavedSearches();
    document.getElementById("listings-section").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Showing listings for your saved search", "success");
  }

  async function handleAlertAction(event) {
    const button = event.target.closest("[data-alert-action]");
    if (!button) return;
    const alert = savedSearches.find((item) => item.id === button.dataset.alertId);
    if (!alert) return;
    const action = button.dataset.alertAction;
    if (action === "apply") {
      applyAlert(alert);
      return;
    }
    button.disabled = true;
    try {
      if (action === "toggle") {
        await window.savedSearchRepo.setEnabled(alert.id, !alert.enabled);
        showToast(alert.enabled ? "Alert paused" : "Alert resumed", "success");
      } else if (action === "delete") {
        if (!window.confirm(`Delete “${alert.name}” from your saved searches?`)) return;
        await window.savedSearchRepo.remove(alert.id);
        showToast("Saved search deleted", "success");
      }
      await loadSavedSearches();
    } catch (error) {
      setStatus(`Could not update this saved search: ${error.message}`, true);
    } finally {
      button.disabled = false;
    }
  }

  window.openSavedSearches = openSavedSearches;
  window.closeSavedSearches = closeSavedSearches;
  window.saveCurrentSearch = saveCurrentSearch;
  form.addEventListener("submit", saveSearch);
  list.addEventListener("click", handleAlertAction);
  document.getElementById("saved-searches-close").addEventListener("click", closeSavedSearches);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeSavedSearches(); });
  window.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.classList.contains("hidden")) closeSavedSearches(); });
  window.addEventListener("supabase-auth-change", async () => {
    savedSearches = [];
    updateBadge();
    if (!window.currentUser) {
      list.innerHTML = "";
      setStatus("Sign in to view your saved searches.");
    } else {
      await refreshPropertiesFromSupabase();
      await loadSavedSearches();
    }
  });
  window.addEventListener("focus", async () => {
    if (!window.propertyRepo?.configured || !window.currentUser) return;
    await refreshPropertiesFromSupabase();
    await loadSavedSearches();
  });
})();
