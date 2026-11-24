// City Coordinates Fallback for Newly Listed Properties
const kenyaCityCoords = {
  Nairobi: [-1.2921, 36.8219],
  Mombasa: [-4.0435, 39.6682],
  Kisumu: [-0.0917, 34.7680],
  Nakuru: [-0.3031, 36.0800],
  Eldoret: [0.5143, 35.2698],
  Kiambu: [-1.1714, 36.8356],
  Migori: [-1.0634, 34.4731]
};

const STORAGE_KEY_PROPERTIES = "nyumbahub_properties_v1";
const STORAGE_KEY_FAVS = "nyumbahub_favs";

// Initial Kenyan Real Estate Dataset
const defaultProperties = [
  {
    id: 1,
    title: "Executive 2 Bedroom Apartment + DSQ",
    purpose: "rent",
    type: "Apartment",
    status: "available",
    city: "Nairobi",
    neighborhood: "Kilimani, Argwings Kodhek Rd",
    lat: -1.2906,
    lng: 36.7875,
    price: 85000,
    beds: 2,
    baths: 3,
    size: "1,450 sq ft",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
    amenities: ["Borehole", "Full Backup Generator", "High-Speed Lifts", "24/7 CCTV & Guard"],
    agent: "Savannah Crest Realtors",
    phone: "254712345678",
    featured: true,
    description: "Spacious modern apartment in the heart of Kilimani, 5 minutes walk to Yaya Centre. Features an open-plan fitted kitchen, master ensuite, self-contained DSQ, and reliable borehole water."
  },
  {
    id: 2,
    title: "Modern Executive Bedsitter (Studio)",
    purpose: "rent",
    type: "Bedsitter / Studio",
    status: "available",
    city: "Nairobi",
    neighborhood: "Roysambu, Thika Road",
    lat: -1.2185,
    lng: 36.8869,
    price: 14000,
    beds: 0,
    baths: 1,
    size: "380 sq ft",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    amenities: ["Token Meter", "24/7 Water Supply", "Biometric Gate", "Free Wi-Fi"],
    agent: "MetroLink Hostels & Homes",
    phone: "254722111222",
    featured: true,
    description: "Clean, newly built studio apartment near TRM Mall along Thika Superhighway. Includes inbuilt wardrobes, instant hot shower, prepaid KPLC token meter, and rooftop laundry area."
  },
  {
    id: 3,
    title: "4 Bedroom Coastal Villa with Pool",
    purpose: "sale",
    type: "Townhouse / Villa",
    status: "available",
    city: "Mombasa",
    neighborhood: "Nyali, Links Road",
    lat: -4.0226,
    lng: 39.7138,
    price: 38500000,
    beds: 4,
    baths: 5,
    size: "3,600 sq ft",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
    amenities: ["Swimming Pool", "Solar Water Heating", "Gated Compound", "Beach Access"],
    agent: "Pwani Prime Estates",
    phone: "254733444555",
    featured: true,
    description: "Luxurious coastal residence in serene Nyali. All bedrooms ensuite, spacious balconies with sea breeze, manicured garden, and proximity to Nyali Centre and international schools."
  },
  {
    id: 4,
    title: "3 Bedroom Master Ensuite Bungalow",
    purpose: "rent",
    type: "Bungalow",
    status: "available",
    city: "Kisumu",
    neighborhood: "Milimani",
    lat: -0.1065,
    lng: 34.7523,
    price: 55000,
    beds: 3,
    baths: 2,
    size: "1,900 sq ft",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80",
    amenities: ["Own Compound", "Cabro Paved", "Backup Water Tanks", "Electric Fence"],
    agent: "Lakeview Properties Kisumu",
    phone: "254700987654",
    featured: false,
    description: "Quiet own-compound bungalow in Milimani, Kisumu. Features a spacious living and dining area, modern kitchen pantry, shaded carport for 3 vehicles, and lush green lawn."
  },
  {
    id: 5,
    title: "1/8 Acre Prime Residential Plot (Ready Title)",
    purpose: "sale",
    type: "Land / Plot",
    status: "available",
    city: "Kiambu",
    neighborhood: "Ruiru, Kamakis (Eastern Bypass)",
    lat: -1.1682,
    lng: 36.9685,
    price: 3200000,
    beds: 0,
    baths: 0,
    size: "50 x 100 ft",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",
    amenities: ["Freehold Title Deed", "Water & Electricity on Site", "Red Soil", "Controlled Estate"],
    agent: "Amani Land & Housing",
    phone: "254711223344",
    featured: true,
    description: "Well-drained red soil 50x100 plot located 2.5km off the Eastern Bypass at Kamakis. Ideal for immediate residential development with graded access roads and individual freehold title."
  },
  {
    id: 6,
    title: "Newly Built 2 Bedroom Apartment",
    purpose: "rent",
    type: "Apartment",
    status: "available",
    city: "Migori",
    neighborhood: "Suna Central, Near Migori-Isebania Hwy",
    lat: -1.0634,
    lng: 34.4731,
    price: 18000,
    beds: 2,
    baths: 2,
    size: "1,100 sq ft",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    amenities: ["Borehole Water", "Perimeter Wall", "Ample Parking", "Tarmac Access"],
    agent: "South Nyanza Homes",
    phone: "254799887766",
    featured: false,
    description: "Modern, secure 2-bedroom apartment conveniently located near Migori town centre. Features tiled floors, spacious balconies, reliable borehole water, and 24-hour security guard."
  },
  {
    id: 7,
    title: "3 Bedroom Townhouse in Gated Community",
    purpose: "sale",
    type: "Townhouse / Villa",
    status: "available",
    city: "Nakuru",
    neighborhood: "Section 58",
    lat: -0.2896,
    lng: 36.0928,
    price: 12500000,
    beds: 3,
    baths: 3,
    size: "2,200 sq ft",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    amenities: ["Gated Court", "Solar Backup", "Kids Play Area", "2 Parking Slots"],
    agent: "Rift Valley Realty",
    phone: "254720555666",
    featured: false,
    description: "Contemporary townhouse in Nakuru's prestigious Section 58. Close to hospitals, shopping malls, and schools with clean freehold documentation."
  },
  {
    id: 8,
    title: "1 Bedroom Modern Apartment",
    purpose: "rent",
    type: "Apartment",
    status: "available",
    city: "Eldoret",
    neighborhood: "Elgon View",
    lat: 0.5021,
    lng: 35.2845,
    price: 22000,
    beds: 1,
    baths: 1,
    size: "720 sq ft",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    amenities: ["Reliable Water", "Secure Gate", "Prepaid Token", "Balcony"],
    agent: "Uasin Gishu Rentals",
    phone: "254715667788",
    featured: false,
    description: "Serene 1-bedroom apartment in Elgon View, Eldoret. Quiet neighborhood, well-lit compound, and easy access to town."
  }
];

function loadSavedProperties() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROPERTIES);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.length ? parsed : [...defaultProperties];
  } catch {
    return [...defaultProperties];
  }
}

async function refreshPropertiesFromSupabase() {
  if (!window.propertyRepo?.configured) return;
  try {
    const remote = await window.propertyRepo.list();
    if (remote) {
      const demo = defaultProperties.map((item) => ({ ...item, id: -Number(item.id) }));
      properties = [...demo, ...remote];
      renderProperties();
      if (currentPortal === "dashboard") renderDashboard();
    }
  } catch (error) {
    console.error("Could not load Supabase property listings:", error);
    showToast(`Could not load live listings: ${error.message}`, "error");
  }
}

function clearImagePreviewUrls() {
  imagePreviewObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  imagePreviewObjectUrls = [];
}

function renderPropertyImagePreview() {
  clearImagePreviewUrls();
  if (!imagePreview) return;
  imagePreview.replaceChildren();
  const selectedFiles = Array.from(newImagesInput?.files || []);
  const entries = [
    ...currentPropertyImages.map((url) => ({ url, label: "Current photo" })),
    ...selectedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      imagePreviewObjectUrls.push(url);
      return { url, label: file.name };
    })
  ];
  entries.forEach(({ url, label }) => {
    const card = document.createElement("div");
    card.className = "overflow-hidden rounded-xl border border-slate-200 bg-white";
    const img = document.createElement("img");
    img.src = url;
    img.alt = label;
    img.className = "w-full rounded-t-xl object-cover";
    img.loading = "lazy";
    const caption = document.createElement("p");
    caption.className = "truncate px-2 py-1.5 text-[11px] font-medium text-slate-500";
    caption.textContent = label;
    card.append(img, caption);
    imagePreview.appendChild(card);
  });
  if (!entries.length) {
    const hint = document.createElement("p");
    hint.className = "col-span-full text-xs text-slate-500";
    hint.textContent = "No photos selected yet. You can add photos now or edit the listing later.";
    imagePreview.appendChild(hint);
  }
}

function clearImageDraft() {
  clearImagePreviewUrls();
  currentPropertyImages = [];
  if (newImagesInput) newImagesInput.value = "";
  renderPropertyImagePreview();
}

async function collectListingImages() {
  const files = Array.from(newImagesInput?.files || []);
  if (!files.length) return [...currentPropertyImages];
  if (!window.propertyRepo?.configured) throw new Error("Connect Supabase to upload and save property photos.");
  const uploaded = await window.propertyRepo.uploadImages(files);
  return [...uploaded, ...currentPropertyImages];
}

async function saveRemoteProperty(property) {
  if (!window.propertyRepo?.configured) {
    saveProperties();
    return property;
  }
  if (!(await window.requireSupabaseAuth())) return null;
  try {
    return await window.propertyRepo.save(property);
  } catch (error) {
    showToast(`Could not save listing: ${error.message}`, "error");
    return null;
  }
}

function saveProperties() {
  localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(properties));
}

// Application State
let properties = loadSavedProperties();
let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY_FAVS) || "[]").map(String);
let compareList = [];
let showFavoritesOnly = false;
let currentPurpose = "all";
let currentViewMode = "grid";
let currentPortal = "marketplace";
let dashboardStatusFilter = "all";

// Leaflet Map Instances
let mapInstance = null;
let markerLayerGroup = null;

// DOM Elements
const marketplaceView = document.getElementById("marketplace-view");
const dashboardView = document.getElementById("dashboard-view");
const propertyGrid = document.getElementById("property-grid");
const emptyState = document.getElementById("empty-state");
const resultsCount = document.getElementById("results-count");
const listingsHeading = document.getElementById("listings-heading");
const resetFiltersBtn = document.getElementById("reset-filters-btn");
const favCountBadge = document.getElementById("fav-count");
const compareCountBadge = document.getElementById("compare-count");
const newImagesInput = document.getElementById("new-images");
const imagePreview = document.getElementById("property-image-preview");
let currentPropertyImages = [];
let imagePreviewObjectUrls = [];
const MAX_LISTING_IMAGES = 5;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

const filterLocation = document.getElementById("filter-location");
const filterType = document.getElementById("filter-type");
const filterPrice = document.getElementById("filter-price");
const filterKeyword = document.getElementById("filter-keyword");
const filterHideOccupied = document.getElementById("filter-hide-occupied");
const sortSelect = document.getElementById("sort-select");

// Format Currency in KES
function formatKES(amount) {
  return "KES " + Number(amount).toLocaleString("en-KE");
}

function formatShortKES(amount) {
  if (amount >= 1000000) {
    return "KES " + (amount / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (amount >= 1000) {
    return "KES " + Math.round(amount / 1000) + "K";
  }
  return "KES " + amount;
}

// ==========================================
// PORTAL SWITCHING (MARKETPLACE vs DASHBOARD)
// ==========================================
function switchPortal(portal) {
  if (portal === "dashboard" && window.propertyRepo?.configured && !window.currentUser) {
    window.requireSupabaseAuth();
    return;
  }
  currentPortal = portal;
  const navDashBtn = document.getElementById("nav-dashboard-btn");

  if (portal === "dashboard") {
    marketplaceView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    navDashBtn.classList.add("bg-brand-600", "text-white");
    navDashBtn.classList.remove("bg-slate-100", "text-slate-800");
    renderDashboard();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    dashboardView.classList.add("hidden");
    marketplaceView.classList.remove("hidden");
    navDashBtn.classList.remove("bg-brand-600", "text-white");
    navDashBtn.classList.add("bg-slate-100", "text-slate-800");
    renderProperties();
    if (currentViewMode === "map" && mapInstance) {
      setTimeout(() => {
        mapInstance.invalidateSize();
        renderMapMarkers(getFilteredProperties());
      }, 80);
    }
  }
}

// ==========================================
// LANDLORD & AGENT DASHBOARD LOGIC
// ==========================================
function renderDashboard() {
  const dashboardProperties = window.propertyRepo?.configured
    ? properties.filter((p) => p.ownerId && p.ownerId === window.currentUser?.id)
    : properties;
  const totalCount = dashboardProperties.length;
  const availableCount = dashboardProperties.filter((p) => (p.status || "available") === "available").length;
  const occupiedCount = totalCount - availableCount;
  const monthlyRentalPotential = dashboardProperties
    .filter((p) => p.purpose === "rent")
    .reduce((sum, p) => sum + Number(p.price || 0), 0);

  document.getElementById("dashboard-stats").innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Portfolio Units</p>
      <p class="text-2xl font-extrabold text-slate-900 mt-1.5">${totalCount}</p>
      <p class="text-xs text-slate-500 mt-1">Across ${new Set(dashboardProperties.map((p) => p.city)).size} Kenyan towns</p>
    </div>
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <p class="text-xs font-bold uppercase tracking-wider text-emerald-600">Available Now</p>
      <p class="text-2xl font-extrabold text-slate-900 mt-1.5">${availableCount}</p>
      <p class="text-xs text-slate-500 mt-1">Visible on marketplace</p>
    </div>
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <p class="text-xs font-bold uppercase tracking-wider text-amber-600">Occupied / Taken</p>
      <p class="text-2xl font-extrabold text-slate-900 mt-1.5">${occupiedCount}</p>
      <p class="text-xs text-slate-500 mt-1">Tenanted or reserved units</p>
    </div>
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <p class="text-xs font-bold uppercase tracking-wider text-brand-700">Monthly Rent Volume</p>
      <p class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1.5">${formatKES(monthlyRentalPotential)}</p>
      <p class="text-xs text-slate-500 mt-1">Combined active/listed rentals</p>
    </div>
  `;

  const searchTerm = (document.getElementById("dash-search")?.value || "").trim().toLowerCase();
  const rows = dashboardProperties.filter((prop) => {
    const status = prop.status || "available";
    if (dashboardStatusFilter === "available" && status !== "available") return false;
    if (dashboardStatusFilter === "occupied" && status !== "occupied") return false;
    if (searchTerm) {
      const hay = `${prop.title} ${prop.city} ${prop.neighborhood} ${prop.agent} ${prop.type}`.toLowerCase();
      if (!hay.includes(searchTerm)) return false;
    }
    return true;
  });

  const tbody = document.getElementById("dashboard-table-body");
  if (rows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="py-10 px-5 text-center text-sm text-slate-500">
          No properties match your current dashboard filter.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = rows
    .map((prop) => {
      const isOccupied = (prop.status || "available") === "occupied";
      return `
        <tr class="hover:bg-slate-50/80 transition">
          <td class="py-3.5 px-5">
            <div class="flex items-center gap-3">
              <img src="${prop.image || prop.images?.[0] || ""}" alt="${prop.title}" class="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0" />
              <div>
                <p class="font-bold text-slate-900 line-clamp-1">${prop.title}</p>
                <p class="text-xs text-slate-500">${prop.type} • ${prop.purpose === "rent" ? "Monthly Rent" : "For Sale"}</p>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-4 text-xs sm:text-sm text-slate-700">
            <span class="font-bold">${prop.city}</span><br />
            <span class="text-xs text-slate-500">${prop.neighborhood}</span>
          </td>
          <td class="py-3.5 px-4 text-xs sm:text-sm text-slate-700">
            <span class="font-semibold">${prop.agent}</span><br />
            <span class="text-xs text-slate-500">+${prop.phone}</span>
          </td>
          <td class="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
            ${formatKES(prop.price)}<span class="text-xs font-normal text-slate-400">${prop.purpose === "rent" ? "/mo" : ""}</span>
          </td>
          <td class="py-3.5 px-4 whitespace-nowrap">
            <button onclick="toggleOccupancyStatus('${prop.id}')" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition ${
              isOccupied
                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
            }" title="Click to toggle status">
              <i class="fa-solid ${isOccupied ? "fa-lock" : "fa-circle-check"}"></i>
              ${isOccupied ? "Occupied / Taken" : "Available"}
            </button>
          </td>
          <td class="py-3.5 px-5 text-right whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5">
              <button onclick="openEditModal('${prop.id}')" class="p-2 rounded-lg text-slate-600 hover:text-brand-700 hover:bg-brand-50 transition" title="Edit Property">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button onclick="deleteProperty('${prop.id}')" class="p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition" title="Delete Listing">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function setDashboardFilter(filter) {
  dashboardStatusFilter = filter;
  document.querySelectorAll(".dash-filter-btn").forEach((btn) => {
    const active = btn.dataset.dashFilter === filter;
    btn.classList.toggle("bg-slate-900", active);
    btn.classList.toggle("text-white", active);
    btn.classList.toggle("bg-slate-100", !active);
    btn.classList.toggle("text-slate-600", !active);
  });
  renderDashboard();
}

async function toggleOccupancyStatus(id) {
  const prop = properties.find((p) => String(p.id) === String(id));
  if (!prop) return;
  const updated = { ...prop, status: (prop.status || "available") === "available" ? "occupied" : "available" };
  if (window.propertyRepo?.configured) {
    if (!(await window.requireSupabaseAuth())) return;
    try { await window.propertyRepo.save(updated); }
    catch (error) { showToast(`Could not update listing: ${error.message}`, "error"); return; }
  }
  Object.assign(prop, updated);
  if (!window.propertyRepo?.configured) saveProperties();
  renderDashboard(); renderProperties();
  showToast(`${prop.title} marked as ${prop.status === "occupied" ? "Occupied / Taken" : "Available"}`, "success");
}

async function deleteProperty(id) {
  const target = properties.find((p) => String(p.id) === String(id));
  if (!target) return;
  if (window.propertyRepo?.configured) {
    if (!(await window.requireSupabaseAuth())) return;
    try { await window.propertyRepo.remove(target.id); }
    catch (error) { showToast(`Could not delete listing: ${error.message}`, "error"); return; }
  }
  properties = properties.filter((p) => String(p.id) !== String(id));
  favorites = favorites.filter((favId) => String(favId) !== String(id));
  compareList = compareList.filter((cmpId) => cmpId !== id);
  if (!window.propertyRepo?.configured) saveProperties();
  localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favorites));
  updateFavBadge();
  updateCompareUI();
  renderDashboard();
  renderProperties();
  showToast(`Deleted "${target.title}"`, "info");
}

function resetDemoProperties() {
  if (window.propertyRepo?.configured) return;
  properties = [...defaultProperties];
  saveProperties();
  renderDashboard();
  renderProperties();
  showToast("Restored default sample listings", "success");
}

// ==========================================
// FAVORITES & COMPARISON
// ==========================================
function updateFavBadge() {
  if (favorites.length > 0) {
    favCountBadge.textContent = favorites.length;
    favCountBadge.classList.remove("hidden");
  } else {
    favCountBadge.classList.add("hidden");
  }
}

function toggleFavorite(event, id) {
  event.stopPropagation();
  id = String(id);
  const index = favorites.indexOf(id);
  if (index === -1) {
    favorites.push(id);
    showToast("Saved to your favorites", "success");
  } else {
    favorites.splice(index, 1);
    showToast("Removed from favorites", "info");
  }
  localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favorites));
  updateFavBadge();
  renderProperties();
}

function toggleFavoritesView() {
  if (currentPortal !== "marketplace") switchPortal("marketplace");
  showFavoritesOnly = !showFavoritesOnly;
  const favBtn = document.getElementById("favorites-btn");
  if (showFavoritesOnly) {
    favBtn.classList.add("text-rose-500", "bg-rose-50");
    listingsHeading.textContent = "Your Saved Properties";
  } else {
    favBtn.classList.remove("text-rose-500", "bg-rose-50");
    listingsHeading.textContent = "Featured Properties";
  }
  renderProperties();
}

function toggleCompare(event, id) {
  event.stopPropagation();
  id = String(id);
  const idx = compareList.indexOf(id);

  if (idx !== -1) {
    compareList.splice(idx, 1);
    showToast("Removed from comparison", "info");
  } else {
    if (compareList.length >= 3) {
      showToast("You can compare up to 3 properties at once", "info");
      return;
    }
    compareList.push(id);
    showToast("Added to comparison", "success");
  }

  updateCompareUI();
  renderProperties();
}

function removeFromCompare(id) {
  compareList = compareList.filter((item) => String(item) !== String(id));
  updateCompareUI();
  renderProperties();
  if (!document.getElementById("compare-modal").classList.contains("hidden")) {
    if (compareList.length === 0) closeCompareModal();
    else openCompareModal();
  }
}

function clearCompare() {
  compareList = [];
  updateCompareUI();
  renderProperties();
}

function updateCompareUI() {
  const tray = document.getElementById("compare-tray");
  const trayItems = document.getElementById("compare-tray-items");
  const trayCount = document.getElementById("tray-count");

  if (compareList.length > 0) {
    compareCountBadge.textContent = compareList.length;
    compareCountBadge.classList.remove("hidden");
    tray.classList.remove("hidden");
    trayCount.textContent = compareList.length;

    trayItems.innerHTML = compareList
      .map((id) => {
        const prop = properties.find((p) => String(p.id) === String(id));
        if (!prop) return "";
        return `
          <div class="flex items-center gap-2 bg-slate-800 border border-slate-700 pl-2 pr-1.5 py-1 rounded-lg text-xs">
            <img src="${prop.image || prop.images?.[0] || ""}" class="w-5 h-5 rounded object-cover" alt="" />
            <span class="max-w-[110px] truncate font-semibold">${prop.title}</span>
            <button onclick="removeFromCompare('${prop.id}')" class="text-slate-400 hover:text-rose-400 px-1">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        `;
      })
      .join("");
  } else {
    compareCountBadge.classList.add("hidden");
    tray.classList.add("hidden");
  }
}

function openCompareModal() {
  if (compareList.length === 0) {
    showToast("Select at least 1 property using the scale icon to compare", "info");
    return;
  }

  const selectedProps = compareList
    .map((id) => properties.find((p) => String(p.id) === String(id)))
    .filter(Boolean);

  const modal = document.getElementById("compare-modal");
  const container = document.getElementById("compare-modal-content");

  const hasAmenity = (prop, keyword) =>
    prop.amenities.some((a) => a.toLowerCase().includes(keyword.toLowerCase()));

  const checkBadge = (bool) =>
    bool
      ? `<span class="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-bold"><i class="fa-solid fa-check"></i> Yes</span>`
      : `<span class="inline-flex items-center gap-1 text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-semibold"><i class="fa-solid fa-minus"></i> Not listed</span>`;

  container.innerHTML = `
    <table class="w-full text-left border-collapse min-w-[600px]">
      <thead>
        <tr>
          <th class="w-44 p-3 text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-200 align-bottom">
            Property Specs
          </th>
          ${selectedProps
            .map(
              (p) => `
              <th class="p-3 border-b border-slate-200 align-top">
                <div class="relative rounded-xl overflow-hidden h-32 mb-2.5 bg-slate-100">
                  <img src="${p.image || p.images?.[0] || ""}" alt="${p.title}" class="w-full h-full object-cover" />
                  <button onclick="removeFromCompare('${p.id}')" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/75 text-white hover:bg-rose-600 text-xs flex items-center justify-center transition" title="Remove">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
                <h4 class="font-extrabold text-sm text-slate-900 line-clamp-2">${p.title}</h4>
              </th>
            `
            )
            .join("")}
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100 text-sm">
        <tr class="bg-slate-50/70">
          <td class="p-3 font-bold text-slate-600">Price</td>
          ${selectedProps
            .map(
              (p) => `
              <td class="p-3 font-extrabold text-brand-700 text-base">
                ${formatKES(p.price)} <span class="text-xs font-normal text-slate-500">${p.purpose === "rent" ? "/mo" : "(Sale)"}</span>
              </td>
            `
            )
            .join("")}
        </tr>
        <tr>
          <td class="p-3 font-bold text-slate-600">Availability</td>
          ${selectedProps
            .map((p) => {
              const occupied = (p.status || "available") === "occupied";
              return `<td class="p-3"><span class="text-xs font-bold px-2.5 py-1 rounded-full ${occupied ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}">${occupied ? "Occupied" : "Available"}</span></td>`;
            })
            .join("")}
        </tr>
        <tr>
          <td class="p-3 font-bold text-slate-600">Location</td>
          ${selectedProps
            .map((p) => `<td class="p-3 text-slate-700 font-medium">${p.neighborhood}, <strong>${p.city}</strong></td>`)
            .join("")}
        </tr>
        <tr>
          <td class="p-3 font-bold text-slate-600">Bedrooms / Baths</td>
          ${selectedProps
            .map((p) =>
              p.type === "Land / Plot"
                ? `<td class="p-3 text-slate-500">N/A (Plot)</td>`
                : `<td class="p-3 text-slate-700 font-semibold">${p.beds === 0 ? "Studio" : p.beds + " Bed"} • ${p.baths} Bath</td>`
            )
            .join("")}
        </tr>
        <tr>
          <td class="p-3 font-bold text-slate-600">Water / Borehole</td>
          ${selectedProps.map((p) => `<td class="p-3">${checkBadge(hasAmenity(p, "water") || hasAmenity(p, "borehole"))}</td>`).join("")}
        </tr>
        <tr>
          <td class="p-3 font-bold text-slate-600">Backup Power / Solar</td>
          ${selectedProps.map((p) => `<td class="p-3">${checkBadge(hasAmenity(p, "generator") || hasAmenity(p, "solar"))}</td>`).join("")}
        </tr>
        <tr>
          <td class="p-3 font-bold text-slate-600">Security / Gated</td>
          ${selectedProps
            .map((p) => `<td class="p-3">${checkBadge(hasAmenity(p, "security") || hasAmenity(p, "gated") || hasAmenity(p, "fence") || hasAmenity(p, "guard"))}</td>`)
            .join("")}
        </tr>
        <tr class="bg-slate-50">
          <td class="p-3 font-bold text-slate-600">Direct Action</td>
          ${selectedProps
            .map(
              (p) => `
              <td class="p-3">
                <a href="${buildWhatsAppLink(p)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition">
                  <i class="fa-brands fa-whatsapp text-sm"></i> Inquire Now
                </a>
              </td>
            `
            )
            .join("")}
        </tr>
      </tbody>
    </table>
  `;

  modal.classList.remove("hidden");
}

function closeCompareModal() {
  document.getElementById("compare-modal").classList.add("hidden");
}

// ==========================================
// INTERACTIVE KENYA MAP VIEW (LEAFLET.JS)
// ==========================================
function switchViewMode(mode) {
  currentViewMode = mode;
  const mapContainer = document.getElementById("map-view-container");
  const btnGrid = document.getElementById("btn-grid-view");
  const btnMap = document.getElementById("btn-map-view");

  if (mode === "map") {
    mapContainer.classList.remove("hidden");
    propertyGrid.classList.add("hidden");
    btnMap.classList.add("bg-white", "text-slate-900", "shadow-sm");
    btnMap.classList.remove("text-slate-600");
    btnGrid.classList.remove("bg-white", "text-slate-900", "shadow-sm");
    btnGrid.classList.add("text-slate-600");

    initMapIfNeeded();
    setTimeout(() => {
      mapInstance.invalidateSize();
      renderMapMarkers(getFilteredProperties());
    }, 100);
  } else {
    mapContainer.classList.add("hidden");
    propertyGrid.classList.remove("hidden");
    btnGrid.classList.add("bg-white", "text-slate-900", "shadow-sm");
    btnGrid.classList.remove("text-slate-600");
    btnMap.classList.remove("bg-white", "text-slate-900", "shadow-sm");
    btnMap.classList.add("text-slate-600");
    renderProperties();
  }
}

function initMapIfNeeded() {
  if (mapInstance) return;

  mapInstance = L.map("kenya-map").setView([-0.5, 36.8], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(mapInstance);

  markerLayerGroup = L.layerGroup().addTo(mapInstance);
}

function renderMapMarkers(filteredList) {
  if (!mapInstance || !markerLayerGroup) return;

  markerLayerGroup.clearLayers();
  if (filteredList.length === 0) return;

  const bounds = [];

  filteredList.forEach((prop) => {
    const lat = prop.lat || kenyaCityCoords[prop.city]?.[0] || -1.2921;
    const lng = prop.lng || kenyaCityCoords[prop.city]?.[1] || 36.8219;
    bounds.push([lat, lng]);

    const priceTag = formatShortKES(prop.price);
    const customIcon = L.divIcon({
      className: "",
      html: `<div class="price-pin ${prop.purpose}">${priceTag}</div>`,
      iconSize: [80, 28],
      iconAnchor: [40, 14]
    });

    const isOccupied = (prop.status || "available") === "occupied";
    const popupHtml = `
      <div>
        <img src="${prop.image || prop.images?.[0] || ""}" alt="${prop.title}" style="width:100%;height:115px;object-fit:cover;" />
        <div style="padding:10px 12px;">
          <div style="font-size:10px;font-weight:800;color:#059669;text-transform:uppercase;">${prop.city} • ${prop.type}${isOccupied ? " • OCCUPIED" : ""}</div>
          <div style="font-size:13px;font-weight:800;color:#0f172a;margin-top:2px;line-height:1.25;">${prop.title}</div>
          <div style="font-size:13px;font-weight:800;color:#047857;margin-top:4px;">
            ${formatKES(prop.price)}${prop.purpose === "rent" ? "/mo" : ""}
          </div>
          <button onclick="openDetailsModal('${prop.id}')" style="margin-top:8px;width:100%;background:#0f172a;color:#fff;border:none;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;">
            View Full Details
          </button>
        </div>
      </div>
    `;

    L.marker([lat, lng], { icon: customIcon })
      .bindPopup(popupHtml)
      .addTo(markerLayerGroup);
  });

  if (bounds.length === 1) {
    mapInstance.setView(bounds[0], 13);
  } else {
    mapInstance.fitBounds(bounds, { padding: [45, 45] });
  }
}

// ==========================================
// FILTERING, RENDERING & ADD/EDIT MODAL
// ==========================================
function buildWhatsAppLink(property) {
  const purposeText = property.purpose === "rent" ? "renting" : "buying";
  const priceText = property.purpose === "rent" ? `${formatKES(property.price)}/month` : formatKES(property.price);
  const message = `Habari ${property.agent}, I saw "${property.title}" in ${property.neighborhood}, ${property.city} (${priceText}) on NyumbaHub Kenya. I am interested in ${purposeText} and would like to schedule a viewing.`;
  return `https://wa.me/${property.phone}?text=${encodeURIComponent(message)}`;
}

function getFilteredProperties() {
  const location = filterLocation.value;
  const type = filterType.value;
  const maxPrice = filterPrice.value;
  const keyword = filterKeyword.value.trim().toLowerCase();
  const hideOccupied = filterHideOccupied.checked;
  const sortBy = sortSelect.value;

  const hasActiveFilters =
    currentPurpose !== "all" ||
    location !== "all" ||
    type !== "all" ||
    maxPrice !== "all" ||
    keyword !== "" ||
    showFavoritesOnly ||
    !hideOccupied;

  resetFiltersBtn.classList.toggle("hidden", !hasActiveFilters);

  let filtered = properties.filter((item) => {
    const status = item.status || "available";
    if (hideOccupied && status === "occupied" && !showFavoritesOnly) return false;
    if (showFavoritesOnly && !favorites.includes(item.id)) return false;
    if (currentPurpose !== "all" && item.purpose !== currentPurpose) return false;
    if (location !== "all" && item.city !== location) return false;
    if (type !== "all" && item.type !== type) return false;
    if (maxPrice !== "all" && item.price > Number(maxPrice)) return false;

    if (keyword) {
      const searchableText = `${item.title} ${item.city} ${item.neighborhood} ${item.type} ${item.amenities.join(" ")}`.toLowerCase();
      if (!searchableText.includes(keyword)) return false;
    }

    return true;
  });

  if (sortBy === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return filtered;
}

function renderProperties() {
  const filtered = getFilteredProperties();
  resultsCount.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? "property" : "properties"}`;

  if (currentViewMode === "map") {
    renderMapMarkers(filtered);
  }

  if (filtered.length === 0) {
    propertyGrid.innerHTML = "";
    if (currentViewMode === "grid") {
      emptyState.classList.remove("hidden");
    }
    return;
  }

  emptyState.classList.add("hidden");

  propertyGrid.innerHTML = filtered
    .map((prop) => {
      const isFav = favorites.includes(String(prop.id));
      const isCompared = compareList.includes(String(prop.id));
      const isOccupied = (prop.status || "available") === "occupied";
      const badgeClass = prop.purpose === "rent" ? "bg-brand-600 text-white" : "bg-amber-500 text-slate-950";
      const badgeLabel = prop.purpose === "rent" ? "For Rent" : "For Sale";
      const priceSuffix = prop.purpose === "rent" ? `<span class="text-xs font-normal text-slate-500">/mo</span>` : "";

      const specsHtml =
        prop.type === "Land / Plot"
          ? `<span class="flex items-center gap-1.5"><i class="fa-solid fa-vector-square text-slate-400"></i> ${prop.size}</span>`
          : `
            <span class="flex items-center gap-1.5"><i class="fa-solid fa-bed text-slate-400"></i> ${prop.beds === 0 ? "Studio" : prop.beds + " Bed"}</span>
            <span class="flex items-center gap-1.5"><i class="fa-solid fa-bath text-slate-400"></i> ${prop.baths} Bath</span>
            <span class="flex items-center gap-1.5"><i class="fa-solid fa-ruler-combined text-slate-400"></i> ${prop.size}</span>
          `;

      return `
        <article onclick="openDetailsModal('${prop.id}')" class="property-card bg-white rounded-2xl border ${isCompared ? "border-brand-500 ring-2 ring-brand-500/30" : "border-slate-200/80"} overflow-hidden shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between ${isOccupied ? "opacity-80" : ""}">
          <div>
            <div class="relative h-56 overflow-hidden bg-slate-200">
              <img src="${prop.image || prop.images?.[0] || ""}" alt="${prop.title}" class="w-full h-full object-cover" loading="lazy" />
              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide shadow-sm ${badgeClass}">
                  ${badgeLabel}
                </span>
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/75 text-white backdrop-blur-sm">
                  ${prop.type}
                </span>
                ${
                  isOccupied
                    ? `<span class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-sm">Occupied</span>`
                    : ""
                }
              </div>

              <div class="absolute top-3 right-3 flex items-center gap-1.5">
                <button onclick="toggleCompare(event, '${prop.id}')" class="w-9 h-9 rounded-full ${isCompared ? "bg-brand-600 text-white" : "bg-white/90 hover:bg-white text-slate-700"} flex items-center justify-center shadow-sm transition" title="Compare property">
                  <i class="fa-solid fa-scale-balanced text-xs"></i>
                </button>
                <button onclick="toggleFavorite(event, '${prop.id}')" class="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-sm transition" title="Save property">
                  <i class="${isFav ? "fa-solid fa-heart text-rose-500" : "fa-regular fa-heart"}"></i>
                </button>
              </div>

              <div class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow">
                <span class="font-extrabold text-base text-slate-900">${formatKES(prop.price)}</span>${priceSuffix}
              </div>
            </div>

            <div class="p-5">
              <p class="text-xs font-bold text-brand-600 uppercase tracking-wider flex items-center gap-1">
                <i class="fa-solid fa-location-dot"></i> ${prop.city} • ${prop.neighborhood}
              </p>
              <h3 class="mt-1.5 font-bold text-lg text-slate-900 line-clamp-1">${prop.title}</h3>

              <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                ${specsHtml}
              </div>

              <div class="mt-3.5 flex flex-wrap gap-1.5">
                ${prop.amenities
                  .slice(0, 3)
                  .map((amenity) => `<span class="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">${amenity}</span>`)
                  .join("")}
              </div>
            </div>
          </div>

          <div class="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-500 truncate max-w-[150px]">
              <i class="fa-solid fa-circle-check text-brand-500 mr-1"></i>${prop.agent}
            </span>
            <a href="${buildWhatsAppLink(prop)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg transition">
              <i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp
            </a>
          </div>
        </article>
      `;
    })
    .join("");
}

function openDetailsModal(id) {
  const prop = properties.find((p) => String(p.id) === String(id));
  if (!prop) return;

  const modal = document.getElementById("details-modal");
  const content = document.getElementById("details-modal-content");
  const priceSuffix = prop.purpose === "rent" ? " / month" : "";
  const isCompared = compareList.includes(String(prop.id));
  const isOccupied = (prop.status || "available") === "occupied";
  const propertyPhotos = Array.isArray(prop.images) && prop.images.length ? prop.images : [prop.image].filter(Boolean);
  const mainPhoto = propertyPhotos[0] || "";

  content.innerHTML = `
    <div class="relative h-64 sm:h-80 bg-slate-200">
      <img id="details-main-photo" src="${mainPhoto}" alt="${prop.title}" class="w-full h-full object-cover" />
      <button onclick="closeDetailsModal()" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>
      <div class="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-xl shadow-lg">
        <span class="text-xl font-extrabold text-slate-900">${formatKES(prop.price)}</span>
        <span class="text-xs font-semibold text-slate-500">${priceSuffix}</span>
      </div>
    </div>
    ${propertyPhotos.length > 1 ? `<div class="flex gap-2 overflow-x-auto border-b border-slate-100 p-3" aria-label="Property photos">${propertyPhotos.map((url, index) => `<button type="button" data-photo-url="${url}" aria-label="View property photo ${index + 1}" class="h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${index === 0 ? "border-brand-600" : "border-transparent"}"><img src="${url}" alt="" class="h-full w-full object-cover" /></button>`).join("")}</div>` : ""}

    <div class="p-5 sm:p-8">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xs font-bold uppercase tracking-wider text-brand-600">
          <i class="fa-solid fa-location-dot mr-1"></i> ${prop.neighborhood}, ${prop.city}
        </span>
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold px-3 py-1 rounded-full ${isOccupied ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}">
            ${isOccupied ? "Occupied / Taken" : "Available"}
          </span>
          <button onclick="toggleCompare(event, '${prop.id}'); openDetailsModal('${prop.id}')" class="text-xs font-bold px-3 py-1 rounded-full ${isCompared ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"} transition">
            <i class="fa-solid fa-scale-balanced mr-1"></i> ${isCompared ? "Added to Compare" : "Compare"}
          </button>
        </div>
      </div>

      <h2 class="mt-2 text-2xl font-extrabold text-slate-900">${prop.title}</h2>
      <p class="mt-3 text-sm text-slate-600 leading-relaxed">${prop.description}</p>

      <div class="mt-6">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">Features & Amenities</h4>
        <div class="flex flex-wrap gap-2">
          ${prop.amenities
            .map(
              (a) =>
                `<span class="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg">
                  <i class="fa-solid fa-check text-brand-600"></i> ${a}
                </span>`
            )
            .join("")}
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p class="text-xs text-slate-400 font-semibold uppercase">Listed By</p>
          <p class="font-bold text-slate-900">${prop.agent}</p>
          <p class="text-xs text-slate-500">+${prop.phone}</p>
        </div>

        <div class="flex items-center gap-3">
          <a href="tel:+${prop.phone}" class="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-bold text-slate-700 transition">
            <i class="fa-solid fa-phone mr-1.5"></i> Call Agent
          </a>
          <a href="${buildWhatsAppLink(prop)}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-sm transition flex items-center gap-2">
            <i class="fa-brands fa-whatsapp text-base"></i> Book Viewing on WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;

  content.querySelectorAll("[data-photo-url]").forEach((button) => {
    button.addEventListener("click", () => {
      content.querySelector("#details-main-photo").src = button.dataset.photoUrl;
      content.querySelectorAll("[data-photo-url]").forEach((item) => item.classList.toggle("border-brand-600", item === button));
      content.querySelectorAll("[data-photo-url]").forEach((item) => item.classList.toggle("border-transparent", item !== button));
    });
  });
  modal.classList.remove("hidden");
}

function closeDetailsModal() {
  document.getElementById("details-modal").classList.add("hidden");
}

async function openAddModal() {
  if (window.propertyRepo?.configured && !(await window.requireSupabaseAuth())) return;
  document.getElementById("edit-property-id").value = "";
  document.getElementById("property-modal-title").textContent = "List a Property in Kenya";
  document.getElementById("property-submit-btn").textContent = "Publish Listing";
  document.getElementById("add-property-form").reset();
  currentPropertyImages = [];
  renderPropertyImagePreview();
  document.getElementById("new-status").value = "available";
  document.getElementById("add-modal").classList.remove("hidden");
}

async function openEditModal(id) {
  const prop = properties.find((p) => String(p.id) === String(id));
  if (!prop || (window.propertyRepo?.configured && prop.ownerId !== window.currentUser?.id)) return;

  document.getElementById("edit-property-id").value = String(prop.id);
  document.getElementById("property-modal-title").textContent = "Edit Property Listing";
  document.getElementById("property-submit-btn").textContent = "Save Changes";

  document.getElementById("new-title").value = prop.title;
  document.getElementById("new-purpose").value = prop.purpose;
  document.getElementById("new-type").value = prop.type;
  document.getElementById("new-status").value = prop.status || "available";
  document.getElementById("new-city").value = prop.city;
  document.getElementById("new-neighborhood").value = prop.neighborhood;
  document.getElementById("new-price").value = prop.price;
  document.getElementById("new-beds").value = prop.beds;
  document.getElementById("new-baths").value = prop.baths;
  document.getElementById("new-agent").value = prop.agent;
  document.getElementById("new-phone").value = prop.phone;
  document.getElementById("new-amenities").value = (prop.amenities || []).join(", ");
  document.getElementById("new-description").value = prop.description;
  newImagesInput.value = "";
  currentPropertyImages = Array.isArray(prop.images) && prop.images.length
    ? [...prop.images]
    : (prop.image ? [prop.image] : []);
  renderPropertyImagePreview();

  document.getElementById("add-modal").classList.remove("hidden");
}

function closeAddModal() {
  document.getElementById("add-modal").classList.add("hidden");
  document.getElementById("edit-property-id").value = "";
  clearImageDraft();
}

newImagesInput?.addEventListener("change", () => {
  const files = Array.from(newImagesInput.files || []);
  const total = currentPropertyImages.length + files.length;
  const invalidFile = files.find((file) => !ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES);
  if (total > MAX_LISTING_IMAGES) {
    showToast(`A listing can have up to ${MAX_LISTING_IMAGES} photos total.`, "error");
    newImagesInput.value = "";
  } else if (invalidFile) {
    showToast("Use JPG, PNG, WEBP, or AVIF photos under 5 MB each.", "error");
    newImagesInput.value = "";
  }
  renderPropertyImagePreview();
});

// Handle Add / Edit Property Form Submission
document.getElementById("add-property-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (window.propertyRepo?.configured && !(await window.requireSupabaseAuth())) return;

  const editId = document.getElementById("edit-property-id").value;
  const selectedCity = document.getElementById("new-city").value;
  const baseCoords = kenyaCityCoords[selectedCity] || [-1.2921, 36.8219];

  const rawAmenities = document.getElementById("new-amenities").value.trim();
  const amenitiesList = rawAmenities
    ? rawAmenities.split(",").map((item) => item.trim()).filter(Boolean)
    : ["24/7 Security", "Water Available"];

  const cleanPhone = document.getElementById("new-phone").value.replace(/\D/g, "");
  let listingImages;
  try {
    listingImages = await collectListingImages();
  } catch (error) {
    showToast(`Photo upload failed: ${error.message}`, "error");
    return;
  }

  if (editId) {
    const existing = properties.find((p) => String(p.id) === editId);
    if (existing) {
      const cityChanged = existing.city !== selectedCity;
      existing.title = document.getElementById("new-title").value.trim();
      existing.purpose = document.getElementById("new-purpose").value;
      existing.type = document.getElementById("new-type").value;
      existing.status = document.getElementById("new-status").value;
      existing.city = selectedCity;
      existing.neighborhood = document.getElementById("new-neighborhood").value.trim();
      if (cityChanged) {
        existing.lat = baseCoords[0] + (Math.random() - 0.5) * 0.025;
        existing.lng = baseCoords[1] + (Math.random() - 0.5) * 0.025;
      }
      existing.price = Number(document.getElementById("new-price").value);
      existing.beds = Number(document.getElementById("new-beds").value);
      existing.baths = Number(document.getElementById("new-baths").value);
      existing.agent = document.getElementById("new-agent").value.trim();
      existing.phone = cleanPhone;
      existing.amenities = amenitiesList;
      existing.description = document.getElementById("new-description").value.trim();
      existing.images = listingImages;
      if (listingImages.length) existing.image = listingImages[0];

      if (window.propertyRepo?.configured) {
        const saved = await saveRemoteProperty(existing);
        if (!saved) return;
        Object.assign(existing, saved);
      } else saveProperties();
      closeAddModal();
      renderDashboard();
      renderProperties();
      showToast("Property updated successfully!", "success");
      return;
    }
  }

  const newProperty = {
    id: null,
    title: document.getElementById("new-title").value.trim(),
    purpose: document.getElementById("new-purpose").value,
    type: document.getElementById("new-type").value,
    status: document.getElementById("new-status").value,
    city: selectedCity,
    neighborhood: document.getElementById("new-neighborhood").value.trim(),
    lat: baseCoords[0] + (Math.random() - 0.5) * 0.025,
    lng: baseCoords[1] + (Math.random() - 0.5) * 0.025,
    price: Number(document.getElementById("new-price").value),
    beds: Number(document.getElementById("new-beds").value),
    baths: Number(document.getElementById("new-baths").value),
    size: "Standard",
    image: listingImages[0] || "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
    images: listingImages,
    amenities: amenitiesList,
    agent: document.getElementById("new-agent").value.trim(),
    phone: cleanPhone,
    featured: true,
    description: document.getElementById("new-description").value.trim()
  };

  if (window.propertyRepo?.configured) {
    const saved = await saveRemoteProperty(newProperty);
    if (!saved) return;
    properties.unshift(saved);
  } else {
    newProperty.id = Date.now();
    properties.unshift(newProperty);
    saveProperties();
  }
  e.target.reset();
  closeAddModal();
  renderDashboard();
  renderProperties();
  showToast(window.propertyRepo?.configured ? "Property published to Supabase!" : "Property published & saved!", "success");
});

function quickFilter(purpose) {
  currentPurpose = purpose;
  showFavoritesOnly = false;
  document.querySelectorAll(".purpose-tab").forEach((btn) => {
    const isActive = btn.dataset.purpose === purpose;
    btn.classList.toggle("bg-brand-600", isActive);
    btn.classList.toggle("text-white", isActive);
    btn.classList.toggle("text-slate-600", !isActive);
  });
  renderProperties();
}

function filterByCity(city) {
  filterLocation.value = city;
  showFavoritesOnly = false;
  renderProperties();
  document.getElementById("listings-section").scrollIntoView({ behavior: "smooth" });
}

function resetFilters() {
  currentPurpose = "all";
  showFavoritesOnly = false;
  filterLocation.value = "all";
  filterType.value = "all";
  filterPrice.value = "all";
  filterKeyword.value = "";
  filterHideOccupied.checked = true;
  sortSelect.value = "featured";

  document.querySelectorAll(".purpose-tab").forEach((btn) => {
    const isActive = btn.dataset.purpose === "all";
    btn.classList.toggle("bg-brand-600", isActive);
    btn.classList.toggle("text-white", isActive);
    btn.classList.toggle("text-slate-600", !isActive);
  });

  listingsHeading.textContent = "Featured Properties";
  renderProperties();
}

function showToast(message, type = "success") {
  window.showToast = showToast;
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  const bgColor = type === "success" ? "bg-slate-900 border-brand-500" : "bg-slate-800 border-slate-600";

  toast.className = `toast-item border-l-4 ${bgColor} text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5`;
  toast.innerHTML = `<i class="fa-solid fa-circle-info text-brand-400"></i> <span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Event Listeners
document.querySelectorAll(".purpose-tab").forEach((tab) => {
  tab.addEventListener("click", () => quickFilter(tab.dataset.purpose));
});

[filterLocation, filterType, filterPrice, filterHideOccupied, sortSelect].forEach((el) => {
  el.addEventListener("change", renderProperties);
});

filterKeyword.addEventListener("input", renderProperties);

document.getElementById("dash-search")?.addEventListener("input", renderDashboard);

window.addEventListener("click", (e) => {
  if (e.target.id === "details-modal") closeDetailsModal();
  if (e.target.id === "add-modal") closeAddModal();
  if (e.target.id === "compare-modal") closeCompareModal();
});

// Initialize App
updateFavBadge();
updateCompareUI();
renderProperties();
refreshPropertiesFromSupabase();
window.addEventListener("supabase-auth-change", () => {
  refreshPropertiesFromSupabase();
  if (currentPortal === "dashboard") renderDashboard();
});
if (window.propertyRepo?.configured) {
  const resetButton = document.querySelector('[onclick="resetDemoProperties()"]');
  if (resetButton) resetButton.classList.add("hidden");
}