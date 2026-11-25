/* Supabase browser integration for NyumbaHub.
 * Property reads require an authenticated session; listing mutations require an owner.
 */
(function () {
  const config = window.SUPABASE_CONFIG || {};
  const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(config.url || "") &&
    !!config.anonKey && !String(config.anonKey).includes("YOUR_");
  const client = configured && window.supabase
    ? window.supabase.createClient(config.url, config.anonKey)
    : null;

  window.currentUser = null;
  window.supabaseReady = !!client;
  window.authSessionResolved = !client;

  function announceAuthChange(user) {
    window.currentUser = user || null;
    window.authSessionResolved = true;
    window.dispatchEvent(new CustomEvent("supabase-auth-change", { detail: { user: window.currentUser } }));
    updateAuthButton();
  }

  function toast(message, type = "info") {
    if (typeof window.showToast === "function") window.showToast(message, type);
    else console.info(message);
  }

  async function requireAuth() {
    if (!client) {
      toast("Add your Supabase Project URL and anon/publishable key in supabase-config.js first.", "info");
      return false;
    }
    if (window.currentUser) return true;
    document.getElementById("supabase-auth-modal")?.classList.remove("hidden");
    return false;
  }

  function createAuthUI() {
    if (document.getElementById("supabase-auth-modal")) return;
    const button = document.createElement("button");
    button.id = "supabase-auth-button";
    button.className = "px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition";
    button.type = "button";
    button.addEventListener("click", async () => {
      if (window.currentUser) {
        const { error } = await client.auth.signOut();
        if (error) toast(error.message, "error");
      } else document.getElementById("supabase-auth-modal").classList.remove("hidden");
    });
    document.querySelector("header .flex.items-center.gap-2")?.prepend(button);

    const modal = document.createElement("div");
    modal.id = "supabase-auth-modal";
    modal.className = "fixed inset-0 z-[60] hidden bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4";
    modal.innerHTML = `
      <section class="bg-white rounded-2xl max-h-[90vh] max-w-md w-full overflow-y-auto p-6 sm:p-8 shadow-2xl">
        <div class="flex items-center justify-between mb-2">
          <h2 id="supabase-auth-title" class="text-xl font-extrabold text-slate-900">Sign in to NyumbaHub</h2>
          <button type="button" id="supabase-auth-close" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200">×</button>
        </div>
        <p id="supabase-auth-description" class="text-sm text-slate-500 mb-5">Sign in to browse listings and use the marketplace.</p>
        <form id="supabase-auth-form" class="space-y-3">
          <label id="supabase-name-wrap" class="hidden block text-xs font-bold text-slate-600">Full name
            <input id="supabase-name" type="text" maxlength="80" autocomplete="name" class="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
          </label>
          <label id="supabase-phone-wrap" class="hidden block text-xs font-bold text-slate-600">Phone number (optional)
            <input id="supabase-phone" type="tel" maxlength="32" autocomplete="tel" class="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
          </label>
          <label class="block text-xs font-bold text-slate-600">Email
            <input id="supabase-email" type="email" required autocomplete="email" class="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
          </label>
          <label class="block text-xs font-bold text-slate-600">Password
            <input id="supabase-password" type="password" required minlength="6" autocomplete="current-password" class="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
          </label>
          <label id="supabase-confirm-wrap" class="hidden block text-xs font-bold text-slate-600">Confirm password
            <input id="supabase-password-confirm" type="password" minlength="6" autocomplete="new-password" class="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm" />
          </label>
          <p id="supabase-auth-feedback" class="hidden text-sm" role="status" aria-live="polite"></p>
          <div class="space-y-3 pt-2">
            <button id="supabase-auth-submit" type="submit" class="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Sign in</button>
            <button id="supabase-auth-mode-toggle" type="button" class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold hover:bg-slate-50">Create account</button>
          </div>
        </form>
      </section>`;
    document.body.appendChild(modal);
    document.getElementById("supabase-auth-close").addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (event) => { if (event.target === modal) modal.classList.add("hidden"); });

    const form = document.getElementById("supabase-auth-form");
    const emailInput = document.getElementById("supabase-email");
    const passwordInput = document.getElementById("supabase-password");
    const nameInput = document.getElementById("supabase-name");
    const phoneInput = document.getElementById("supabase-phone");
    const confirmInput = document.getElementById("supabase-password-confirm");
    const feedback = document.getElementById("supabase-auth-feedback");
    const submitButton = document.getElementById("supabase-auth-submit");
    const modeToggle = document.getElementById("supabase-auth-mode-toggle");
    let authMode = "signin";

    function setAuthMode(mode) {
      authMode = mode;
      const creatingAccount = mode === "signup";
      document.getElementById("supabase-auth-title").textContent = creatingAccount ? "Create your NyumbaHub account" : "Sign in to NyumbaHub";
      document.getElementById("supabase-auth-description").textContent = creatingAccount
        ? "Enter your details below. You must create an account and sign in before accessing the site."
        : "Sign in to browse listings and use the marketplace.";
      document.getElementById("supabase-name-wrap").classList.toggle("hidden", !creatingAccount);
      document.getElementById("supabase-phone-wrap").classList.toggle("hidden", !creatingAccount);
      document.getElementById("supabase-confirm-wrap").classList.toggle("hidden", !creatingAccount);
      nameInput.required = creatingAccount;
      confirmInput.required = creatingAccount;
      passwordInput.autocomplete = creatingAccount ? "new-password" : "current-password";
      submitButton.textContent = creatingAccount ? "Create account" : "Sign in";
      modeToggle.textContent = creatingAccount ? "I already have an account — sign in" : "Create account";
      feedback.classList.add("hidden");
      feedback.textContent = "";
    }

    function showFeedback(message, type = "error") {
      feedback.textContent = message;
      feedback.className = `text-sm ${type === "error" ? "text-rose-600" : "text-emerald-700"}`;
    }

    setAuthMode("signin");
    modeToggle.addEventListener("click", () => setAuthMode(authMode === "signin" ? "signup" : "signin"));
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const mode = authMode;
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const fullName = nameInput.value.trim();
      if (mode === "signup" && !fullName) {
        showFeedback("Enter your full name to create an account.");
        nameInput.focus();
        return;
      }
      if (mode === "signup" && password !== confirmInput.value) {
        showFeedback("The passwords do not match.");
        confirmInput.focus();
        return;
      }

      feedback.classList.add("hidden");
      submitButton.disabled = true;
      submitButton.textContent = mode === "signup" ? "Creating account…" : "Signing in…";
      try {
        const result = mode === "signup"
          ? await client.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, phone: phoneInput.value.trim() } }
          })
          : await client.auth.signInWithPassword({ email, password });
        if (result.error) {
          showFeedback(result.error.message);
          return;
        }
        if (mode === "signup" && !result.data.session) {
          setAuthMode("signin");
          emailInput.value = email;
          showFeedback("Your details were submitted. Check your email to confirm the account, then sign in.", "success");
          return;
        }
        modal.classList.add("hidden");
        toast(mode === "signup" ? "Account created and signed in." : "Signed in successfully.", "success");
      } catch (error) {
        showFeedback(error.message || "Could not complete authentication. Please try again.");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = authMode === "signup" ? "Create account" : "Sign in";
      }
    });
  }

  function updateAuthButton() {
    const button = document.getElementById("supabase-auth-button");
    if (!button) return;
    button.textContent = window.currentUser ? "Sign out" : "Landlord sign in";
    button.title = window.currentUser?.email || "Sign in to manage listings";
  }

  function requireProfileOwner(expectedUserId, action) {
    if (!client) throw new Error("Supabase is not configured.");
    const user = window.currentUser;
    if (!user) throw new Error(`Please sign in to ${action}.`);
    if (expectedUserId && user.id !== expectedUserId) {
      throw new Error("Your account changed. Please reopen your profile and try again.");
    }
    return user;
  }

  function assertProfileOwnerStillCurrent(user) {
    if (window.currentUser?.id !== user.id) {
      throw new Error("Your account changed. Please reopen your profile and try again.");
    }
  }

  const profileRepo = {
    configured,
    async get(expectedUserId) {
      const user = requireProfileOwner(expectedUserId, "view your profile");
      const { data, error } = await client.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      assertProfileOwnerStillCurrent(user);
      return data || {
        id: user.id,
        full_name: user.user_metadata?.full_name || "",
        phone: user.user_metadata?.phone || "", agency: "", location: "", bio: "", website: "", avatar_path: null,
        default_city: "Nairobi", default_purpose: "rent",
        preferences: { accent: "emerald", compactCards: false, reduceMotion: false, autoFillListingContact: true }
      };
    },
    async save(profile, expectedUserId) {
      const user = requireProfileOwner(expectedUserId, "save your profile");
      const payload = {
        id: user.id,
        full_name: String(profile.full_name || "").trim().slice(0, 80),
        phone: String(profile.phone || "").trim().slice(0, 32),
        agency: String(profile.agency || "").trim().slice(0, 100),
        location: String(profile.location || "").trim().slice(0, 100),
        bio: String(profile.bio || "").trim().slice(0, 500),
        website: String(profile.website || "").trim().slice(0, 200),
        avatar_path: profile.avatar_path || null,
        default_city: String(profile.default_city || "Nairobi").slice(0, 60),
        default_purpose: profile.default_purpose === "sale" ? "sale" : "rent",
        preferences: profile.preferences && typeof profile.preferences === "object" ? profile.preferences : {},
        updated_at: new Date().toISOString()
      };
      const { data, error } = await client.from("profiles").upsert(payload, { onConflict: "id" }).select().single();
      if (error) throw error;
      assertProfileOwnerStillCurrent(user);
      return data;
    },
    async uploadAvatar(file, expectedUserId) {
      const user = requireProfileOwner(expectedUserId, "upload an avatar");
      const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
      if (!allowed.has(file.type) || file.size > 2 * 1024 * 1024) {
        throw new Error("Choose a JPG, PNG, WEBP, or AVIF image under 2 MB.");
      }
      const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" })[file.type];
      const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const bucket = client.storage.from("user-avatars");
      const { data, error } = await bucket.upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
      if (error) throw error;
      try {
        assertProfileOwnerStillCurrent(user);
        const { data: signed, error: signedError } = await bucket.createSignedUrl(data.path, 12 * 60 * 60);
        if (signedError) throw signedError;
        assertProfileOwnerStillCurrent(user);
        return { path: data.path, url: signed.signedUrl };
      } catch (error) {
        await bucket.remove([data.path]);
        throw error;
      }
    },
    async avatarUrl(path, expectedUserId) {
      if (!path) return "";
      const user = requireProfileOwner(expectedUserId, "view your profile photo");
      const { data, error } = await client.storage.from("user-avatars").createSignedUrl(path, 12 * 60 * 60);
      if (error) throw error;
      assertProfileOwnerStillCurrent(user);
      return data.signedUrl;
    },
    async removeAvatar(path, expectedUserId) {
      if (!path) return;
      const user = requireProfileOwner(expectedUserId, "remove your profile photo");
      const { error } = await client.storage.from("user-avatars").remove([path]);
      if (error) throw error;
      assertProfileOwnerStillCurrent(user);
    },
    async updateEmail(email, expectedUserId) {
      const user = requireProfileOwner(expectedUserId, "change your email");
      const { data, error } = await client.auth.updateUser({ email });
      if (error) throw error;
      assertProfileOwnerStillCurrent(user);
      return data;
    },
    async updatePassword(password, expectedUserId) {
      const user = requireProfileOwner(expectedUserId, "change your password");
      const { data, error } = await client.auth.updateUser({ password });
      if (error) throw error;
      assertProfileOwnerStillCurrent(user);
      return data;
    },
    async signOut() {
      if (!client) return;
      const { error } = await client.auth.signOut();
      if (error) throw error;
    }
  };

  window.profileRepo = profileRepo;

  const propertyRepo = {
    configured,
    async list() {
      if (!client) return null;
      const { data, error } = await client.from("properties").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((row) => ({
        id: row.id, ownerId: row.user_id, title: row.title, purpose: row.purpose, type: row.type,
        status: row.status, city: row.city, neighborhood: row.neighborhood, lat: row.lat, lng: row.lng,
        createdAt: row.created_at,
        price: Number(row.price), beds: row.beds, baths: row.baths, size: row.size, image: row.image, images: row.images || (row.image ? [row.image] : []),
        amenities: row.amenities || [], agent: row.agent, phone: row.phone, featured: row.featured,
        description: row.description
      }));
    },
    async uploadImages(files) {
      if (!client) throw new Error("Supabase is not configured.");
      if (!window.currentUser) throw new Error("Please sign in before uploading photos.");
      const uploadedPaths = [];
      const publicUrls = [];
      try {
        for (const file of files) {
          const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80) || "photo";
          const path = `${window.currentUser.id}/${crypto.randomUUID()}-${safeName}`;
          const { data, error } = await client.storage.from("property-images").upload(path, file, {
            cacheControl: "3600", upsert: false, contentType: file.type
          });
          if (error) throw error;
          uploadedPaths.push(data.path);
          publicUrls.push(client.storage.from("property-images").getPublicUrl(data.path).data.publicUrl);
        }
        return publicUrls;
      } catch (error) {
        if (uploadedPaths.length) await client.storage.from("property-images").remove(uploadedPaths);
        throw error;
      }
    },
    async save(property) {
      if (!client) return null;
      if (!window.currentUser) throw new Error("Please sign in to manage listings.");
      const row = {
        user_id: window.currentUser.id, title: property.title, purpose: property.purpose,
        type: property.type, status: property.status || "available", city: property.city,
        neighborhood: property.neighborhood, lat: property.lat, lng: property.lng,
        price: property.price, beds: property.beds || 0, baths: property.baths || 0,
        size: property.size || "Standard", image: property.image || "", images: property.images || (property.image ? [property.image] : []), amenities: property.amenities || [],
        agent: property.agent, phone: property.phone, featured: !!property.featured,
        description: property.description
      };
      let query = client.from("properties");
      query = property.id && property.ownerId === window.currentUser.id
        ? query.update(row).eq("id", property.id).select().single()
        : query.insert(row).select().single();
      const { data, error } = await query;
      if (error) throw error;
      return { ...property, id: data.id, ownerId: data.user_id, createdAt: data.created_at };
    },
    async remove(id) {
      if (!client) return null;
      if (!window.currentUser) throw new Error("Please sign in to manage listings.");
      const { error } = await client.from("properties").delete().eq("id", id);
      if (error) throw error;
    }
  };
  window.propertyRepo = propertyRepo;

  const savedSearchRepo = {
    configured,
    async list() {
      const user = requireProfileOwner(null, "view your saved searches");
      const { data, error } = await client.from("property_alerts")
        .select("id,name,criteria,enabled,created_at,updated_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      assertProfileOwnerStillCurrent(user);
      return data || [];
    },
    async create(alert) {
      const user = requireProfileOwner(null, "save a property search");
      const source = alert.criteria && typeof alert.criteria === "object" ? alert.criteria : {};
      const purpose = ["all", "rent", "sale"].includes(source.purpose) ? source.purpose : "all";
      const sort = ["featured", "price-asc", "price-desc"].includes(source.sort) ? source.sort : "featured";
      const city = String(source.city || "all").slice(0, 60);
      const type = String(source.type || "all").slice(0, 60);
      const priceValue = source.maxPrice == null ? "all" : String(source.maxPrice);
      const cityOptions = new Set(Array.from(document.getElementById("filter-location").options, (option) => option.value));
      const typeOptions = new Set(Array.from(document.getElementById("filter-type").options, (option) => option.value));
      const priceOptions = new Set(Array.from(document.getElementById("filter-price").options, (option) => option.value));
      const criteria = {
        purpose,
        city: cityOptions.has(city) ? city : "all",
        type: typeOptions.has(type) ? type : "all",
        maxPrice: priceOptions.has(priceValue) && priceValue !== "all" ? Number(priceValue) : null,
        keyword: String(source.keyword || "").trim().slice(0, 120),
        hideOccupied: source.hideOccupied !== false,
        sort
      };
      const row = {
        user_id: user.id,
        name: String(alert.name || "Saved property search").trim().slice(0, 80),
        criteria,
        enabled: true
      };
      if (!row.name) throw new Error("Enter a name for this saved search.");
      const { data, error } = await client.from("property_alerts").insert(row)
        .select("id,name,criteria,enabled,created_at,updated_at").single();
      if (error) throw error;
      assertProfileOwnerStillCurrent(user);
      return data;
    },
    async setEnabled(id, enabled) {
      const user = requireProfileOwner(null, "update a saved search");
      const { data, error } = await client.from("property_alerts")
        .update({ enabled: !!enabled, updated_at: new Date().toISOString() })
        .eq("id", id).eq("user_id", user.id)
        .select("id").maybeSingle();
      if (error) throw error;
      assertProfileOwnerStillCurrent(user);
      if (!data) throw new Error("Saved search not found or no longer accessible.");
    },
    async remove(id) {
      const user = requireProfileOwner(null, "delete a saved search");
      const { error } = await client.from("property_alerts").delete()
        .eq("id", id).eq("user_id", user.id);
      if (error) throw error;
      assertProfileOwnerStillCurrent(user);
    }
  };
  window.savedSearchRepo = savedSearchRepo;
  window.requireSupabaseAuth = requireAuth;

  if (client) {
    createAuthUI();
    client.auth.getSession()
      .then(({ data }) => announceAuthChange(data?.session?.user))
      .catch(() => announceAuthChange(null));
    client.auth.onAuthStateChange((_event, session) => announceAuthChange(session?.user));
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      const badge = document.createElement("span");
      badge.id = "supabase-setup-notice";
      badge.className = "fixed bottom-4 left-4 z-40 rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900 shadow";
      badge.textContent = "Supabase not configured — using this browser's local demo data";
      document.body.appendChild(badge);
    });
  }
})();
