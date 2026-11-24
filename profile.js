/* Signed-in account profile, preferences, and security controls. */
(() => {
  const DEFAULT_PREFERENCES = {
    accent: "emerald",
    compactCards: false,
    reduceMotion: false,
    autoFillListingContact: true
  };
  const ACCENTS = {
    emerald: { 50: "#ecfdf5", 100: "#d1fae5", 400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857", 900: "#064e3b" },
    blue: { 50: "#eff6ff", 100: "#dbeafe", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 900: "#1e3a8a" },
    violet: { 50: "#f5f3ff", 100: "#ede9fe", 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9", 900: "#4c1d95" },
    rose: { 50: "#fff1f2", 100: "#ffe4e6", 400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c", 900: "#881337" },
    amber: { 50: "#fffbeb", 100: "#fef3c7", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309", 900: "#78350f" }
  };
  const DEFAULT_PROFILE = {
    full_name: "", phone: "", agency: "", location: "", bio: "", website: "",
    avatar_path: null, default_city: "Nairobi", default_purpose: "rent", preferences: DEFAULT_PREFERENCES
  };

  let profileState = null;
  let avatarSignedUrl = "";
  let pendingAvatar = null;
  let pendingAvatarUrl = "";
  let removeAvatar = false;
  let loadSequence = 0;
  let avatarPreviewObjectUrl = "";
  const modal = document.getElementById("profile-modal");

  function notify(message, type = "info") {
    if (typeof window.showToast === "function") window.showToast(message, type);
    else console.info(message);
  }

  function normalizeProfile(profile) {
    return {
      ...DEFAULT_PROFILE,
      ...(profile || {}),
      preferences: { ...DEFAULT_PREFERENCES, ...(profile?.preferences || {}) }
    };
  }

  function setStatus(id, message = "", isError = false) {
    const element = document.getElementById(id);
    if (!element) return;
    element.textContent = message;
    element.classList.toggle("is-error", !!isError);
  }

  function getInitial(profile = profileState) {
    const value = profile?.full_name || window.currentUser?.email || "U";
    return String(value).trim().charAt(0).toUpperCase() || "U";
  }

  function setAvatarTarget(imageId, fallbackId, url, profile = profileState) {
    const image = document.getElementById(imageId);
    const fallback = document.getElementById(fallbackId);
    if (!image || !fallback) return;
    if (url) {
      image.src = url;
      image.classList.remove("hidden");
      fallback.classList.add("hidden");
      image.onerror = () => {
        image.classList.add("hidden");
        fallback.classList.remove("hidden");
      };
    } else {
      image.removeAttribute("src");
      image.classList.add("hidden");
      fallback.textContent = getInitial(profile);
      fallback.classList.remove("hidden");
    }
  }

  function updateAvatarViews(url = avatarSignedUrl) {
    setAvatarTarget("profile-avatar-img", "profile-avatar-fallback", pendingAvatarUrl || (removeAvatar ? "" : url));
    setAvatarTarget("profile-header-avatar-img", "profile-header-avatar-fallback", removeAvatar ? "" : url);
  }

  function ensureHeaderButton() {
    if (!window.profileRepo?.configured || document.getElementById("profile-open-button")) return;
    const actions = document.querySelector(".site-header-actions");
    if (!actions) return;
    const button = document.createElement("button");
    button.id = "profile-open-button";
    button.type = "button";
    button.className = "hidden min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition";
    button.setAttribute("aria-label", "Open my profile");
    button.title = "My profile";
    button.innerHTML = '<span class="profile-header-avatar"><img id="profile-header-avatar-img" class="hidden" alt="" /><span id="profile-header-avatar-fallback">U</span></span><span class="hidden sm:inline">Profile</span>';
    button.addEventListener("click", openProfileModal);
    const listButton = actions.querySelector('button[aria-label="List a property"]');
    actions.insertBefore(button, listButton || null);
  }

  function setHeaderState(user) {
    const button = document.getElementById("profile-open-button");
    if (!button) return;
    button.classList.toggle("hidden", !user);
    button.classList.toggle("inline-flex", !!user);
    button.title = user?.email || "My profile";
    button.setAttribute("aria-label", user ? `Open profile for ${user.email}` : "Open my profile");
    if (!user) setAvatarTarget("profile-header-avatar-img", "profile-header-avatar-fallback", "", null);
    else updateAvatarViews();
  }

  function applyPreferences(value = {}) {
    const preferences = { ...DEFAULT_PREFERENCES, ...(value || {}) };
    const accentName = Object.hasOwn(ACCENTS, preferences.accent) ? preferences.accent : "emerald";
    const palette = ACCENTS[accentName];
    const root = document.documentElement;
    root.dataset.profileAccent = accentName;
    root.classList.toggle("profile-compact", preferences.compactCards === true);
    root.classList.toggle("profile-reduced-motion", preferences.reduceMotion === true);
    Object.entries(palette).forEach(([step, color]) => root.style.setProperty(`--profile-accent-${step}`, color));

    let themeStyle = document.getElementById("profile-accent-overrides");
    if (!themeStyle) {
      themeStyle = document.createElement("style");
      themeStyle.id = "profile-accent-overrides";
      document.head.appendChild(themeStyle);
    }
    const rules = [];
    for (const [name, colors] of Object.entries(ACCENTS)) {
      const prefix = `html[data-profile-accent="${name}"]`;
      for (const [step, color] of Object.entries(colors)) {
        rules.push(`${prefix} .bg-brand-${step}{background-color:${color}!important}`);
        rules.push(`${prefix} .text-brand-${step}{color:${color}!important}`);
        rules.push(`${prefix} .border-brand-${step}{border-color:${color}!important}`);
        rules.push(`${prefix} .ring-brand-${step}{--tw-ring-color:${color}!important}`);
      }
      rules.push(`${prefix} .hover\\:bg-brand-700:hover{background-color:${colors[700]}!important}`);
      rules.push(`${prefix} .hover\\:bg-brand-600:hover{background-color:${colors[600]}!important}`);
      rules.push(`${prefix} .hover\\:bg-brand-500:hover{background-color:${colors[500]}!important}`);
      rules.push(`${prefix} .hover\\:text-brand-700:hover{color:${colors[700]}!important}`);
      rules.push(`${prefix} .hover\\:text-brand-600:hover{color:${colors[600]}!important}`);
      rules.push(`${prefix} .focus\\:ring-brand-500:focus{--tw-ring-color:${colors[500]}!important}`);
    }
    themeStyle.textContent = rules.join("\n");
  }

  function populateProfileForms(profile, user) {
    document.getElementById("profile-full-name").value = profile.full_name || "";
    document.getElementById("profile-phone").value = profile.phone || "";
    document.getElementById("profile-agency").value = profile.agency || "";
    document.getElementById("profile-location").value = profile.location || "";
    document.getElementById("profile-website").value = profile.website || "";
    document.getElementById("profile-bio").value = profile.bio || "";
    document.getElementById("profile-default-city").value = profile.default_city || "Nairobi";
    document.getElementById("profile-default-purpose").value = profile.default_purpose === "sale" ? "sale" : "rent";
    const preferences = profile.preferences;
    document.getElementById("profile-accent").value = Object.hasOwn(ACCENTS, preferences.accent) ? preferences.accent : "emerald";
    document.getElementById("profile-autofill-contact").checked = preferences.autoFillListingContact !== false;
    document.getElementById("profile-compact-cards").checked = preferences.compactCards === true;
    document.getElementById("profile-reduce-motion").checked = preferences.reduceMotion === true;
    document.getElementById("profile-current-email").textContent = user?.email || "Email unavailable";
    document.getElementById("profile-avatar-input").value = "";
    setStatus("profile-details-status");
    setStatus("profile-preferences-status");
    setStatus("profile-email-status");
    setStatus("profile-password-status");
    renderAvatarRemoveButton();
  }

  function clearProfileForms(user = null) {
    ["profile-details-form", "profile-preferences-form", "profile-email-form", "profile-password-form"].forEach((id) => {
      document.getElementById(id)?.reset();
    });
    populateProfileForms(normalizeProfile(null), user);
    updateAvatarViews("");
  }

  function renderAvatarRemoveButton() {
    const button = document.getElementById("profile-avatar-remove");
    if (button) button.classList.toggle("hidden", !pendingAvatar && !profileState?.avatar_path);
  }

  function setTab(name) {
    document.querySelectorAll("[data-profile-tab]").forEach((button) => {
      const active = button.dataset.profileTab === name;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.tabIndex = active ? 0 : -1;
    });
    document.querySelectorAll("[data-profile-panel]").forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.profilePanel !== name);
    });
  }

  async function openProfileModal() {
    if (!window.profileRepo?.configured) {
      notify("Profile management is available when Supabase is connected.");
      return;
    }
    if (!window.currentUser) {
      window.requireSupabaseAuth?.();
      return;
    }
    const user = window.currentUser;
    const sequence = ++loadSequence;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("profile-modal-open");
    setTab("details");
    const saveButtons = ["profile-details-save", "profile-preferences-save"].map((id) => document.getElementById(id));
    saveButtons.forEach((button) => { button.disabled = true; });
    setStatus("profile-details-status", "Loading your profile…");
    try {
      const loaded = normalizeProfile(await window.profileRepo.get(user.id));
      if (sequence !== loadSequence || window.currentUser?.id !== user.id) return;
      const signedUrl = loaded.avatar_path ? await window.profileRepo.avatarUrl(loaded.avatar_path, user.id).catch(() => "") : "";
      if (sequence !== loadSequence || window.currentUser?.id !== user.id) return;
      profileState = loaded;
      window.currentProfile = loaded;
      avatarSignedUrl = signedUrl;
      populateProfileForms(loaded, user);
      applyPreferences(loaded.preferences);
      updateAvatarViews(avatarSignedUrl);
      setHeaderState(user);
      if (!loaded.full_name) document.getElementById("profile-details-status").textContent = "Add your name and save to finish setting up your profile.";
    } catch (error) {
      setStatus("profile-details-status", `Could not load your profile: ${error.message}`, true);
    } finally {
      saveButtons.forEach((button) => { button.disabled = false; });
    }
    document.getElementById("profile-full-name").focus();
  }

  function closeProfileModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("profile-modal-open");
    if (avatarPreviewObjectUrl) URL.revokeObjectURL(avatarPreviewObjectUrl);
    avatarPreviewObjectUrl = "";
    pendingAvatar = null;
    pendingAvatarUrl = "";
    removeAvatar = false;
    updateAvatarViews();
    renderAvatarRemoveButton();
  }

  function getProfileFormData() {
    return {
      ...profileState,
      full_name: document.getElementById("profile-full-name").value.trim(),
      phone: document.getElementById("profile-phone").value.trim(),
      agency: document.getElementById("profile-agency").value.trim(),
      location: document.getElementById("profile-location").value.trim(),
      website: document.getElementById("profile-website").value.trim(),
      bio: document.getElementById("profile-bio").value.trim()
    };
  }

  async function saveProfileDetails(event) {
    event.preventDefault();
    const user = window.currentUser;
    if (!user || !profileState || profileState.id !== user.id) return;
    const button = document.getElementById("profile-details-save");
    const oldPath = profileState.avatar_path;
    let uploadedAvatar = null;
    button.disabled = true;
    setStatus("profile-details-status", "Saving…");
    try {
      const payload = getProfileFormData();
      if (pendingAvatar) {
        uploadedAvatar = await window.profileRepo.uploadAvatar(pendingAvatar, user.id);
        payload.avatar_path = uploadedAvatar.path;
      } else if (removeAvatar) payload.avatar_path = null;
      if (window.currentUser?.id !== user.id) throw new Error("Your account changed. Reopen your profile and try again.");
      const saved = normalizeProfile(await window.profileRepo.save(payload, user.id));
      if (window.currentUser?.id !== user.id) return;
      const savedAvatarUrl = uploadedAvatar?.url || (saved.avatar_path ? await window.profileRepo.avatarUrl(saved.avatar_path, user.id).catch(() => "") : "");
      if (window.currentUser?.id !== user.id) return;
      if (oldPath && oldPath !== saved.avatar_path) await window.profileRepo.removeAvatar(oldPath, user.id).catch(() => {});
      if (window.currentUser?.id !== user.id) return;
      profileState = saved;
      window.currentProfile = saved;
      avatarSignedUrl = savedAvatarUrl;
      if (avatarPreviewObjectUrl) URL.revokeObjectURL(avatarPreviewObjectUrl);
      avatarPreviewObjectUrl = "";
      pendingAvatar = null;
      pendingAvatarUrl = "";
      removeAvatar = false;
      populateProfileForms(saved, window.currentUser);
      updateAvatarViews(avatarSignedUrl);
      setHeaderState(window.currentUser);
      notify("Profile saved.", "success");
    } catch (error) {
      if (uploadedAvatar?.path && window.currentUser?.id === user.id) await window.profileRepo.removeAvatar(uploadedAvatar.path, user.id).catch(() => {});
      setStatus("profile-details-status", error.message || "Could not save your profile.", true);
    } finally {
      button.disabled = false;
      renderAvatarRemoveButton();
    }
  }

  async function savePreferences(event) {
    event.preventDefault();
    const user = window.currentUser;
    if (!user || !profileState || profileState.id !== user.id) return;
    const button = document.getElementById("profile-preferences-save");
    button.disabled = true;
    setStatus("profile-preferences-status", "Saving…");
    try {
      const preferences = {
        ...profileState.preferences,
        accent: Object.hasOwn(ACCENTS, document.getElementById("profile-accent").value) ? document.getElementById("profile-accent").value : "emerald",
        autoFillListingContact: document.getElementById("profile-autofill-contact").checked,
        compactCards: document.getElementById("profile-compact-cards").checked,
        reduceMotion: document.getElementById("profile-reduce-motion").checked
      };
      const payload = {
        ...profileState,
        default_city: document.getElementById("profile-default-city").value,
        default_purpose: document.getElementById("profile-default-purpose").value,
        preferences
      };
      const saved = normalizeProfile(await window.profileRepo.save(payload, user.id));
      if (window.currentUser?.id !== user.id) return;
      profileState = saved;
      window.currentProfile = profileState;
      applyPreferences(profileState.preferences);
      setStatus("profile-preferences-status", "Preferences saved and applied.");
    } catch (error) {
      setStatus("profile-preferences-status", error.message || "Could not save preferences.", true);
    } finally {
      button.disabled = false;
    }
  }

  async function updateEmail(event) {
    event.preventDefault();
    const user = window.currentUser;
    if (!user) return;
    const input = document.getElementById("profile-new-email");
    const current = window.currentUser?.email || "";
    if (!input.value.trim() || input.value.trim().toLowerCase() === current.toLowerCase()) {
      setStatus("profile-email-status", "Enter a different email address.", true);
      return;
    }
    const button = event.submitter;
    if (button) button.disabled = true;
    setStatus("profile-email-status", "Requesting email change…");
    try {
      await window.profileRepo.updateEmail(input.value.trim(), user.id);
      if (window.currentUser?.id !== user.id) return;
      input.value = "";
      setStatus("profile-email-status", "Check the confirmation email(s) from Supabase to complete the change.");
    } catch (error) {
      setStatus("profile-email-status", error.message || "Could not update email.", true);
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function updatePassword(event) {
    event.preventDefault();
    const user = window.currentUser;
    if (!user) return;
    const password = document.getElementById("profile-new-password").value;
    const confirmation = document.getElementById("profile-confirm-password").value;
    if (password.length < 8) {
      setStatus("profile-password-status", "Use at least 8 characters for your new password.", true);
      return;
    }
    if (password !== confirmation) {
      setStatus("profile-password-status", "The new passwords do not match.", true);
      return;
    }
    const button = event.submitter;
    if (button) button.disabled = true;
    setStatus("profile-password-status", "Updating password…");
    try {
      await window.profileRepo.updatePassword(password, user.id);
      if (window.currentUser?.id !== user.id) return;
      event.target.reset();
      setStatus("profile-password-status", "Password updated successfully.");
    } catch (error) {
      setStatus("profile-password-status", error.message || "Could not update password.", true);
    } finally {
      if (button) button.disabled = false;
    }
  }

  function handleAvatarSelection(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
    if (!allowed.has(file.type) || file.size > 2 * 1024 * 1024) {
      event.target.value = "";
      setStatus("profile-details-status", "Choose a JPG, PNG, WEBP, or AVIF image under 2 MB.", true);
      return;
    }
    if (avatarPreviewObjectUrl) URL.revokeObjectURL(avatarPreviewObjectUrl);
    avatarPreviewObjectUrl = URL.createObjectURL(file);
    pendingAvatar = file;
    pendingAvatarUrl = avatarPreviewObjectUrl;
    removeAvatar = false;
    updateAvatarViews();
    renderAvatarRemoveButton();
    setStatus("profile-details-status", "Photo selected. Save your profile to upload it.");
  }

  function removeCurrentAvatar() {
    if (avatarPreviewObjectUrl) URL.revokeObjectURL(avatarPreviewObjectUrl);
    avatarPreviewObjectUrl = "";
    pendingAvatar = null;
    pendingAvatarUrl = "";
    removeAvatar = true;
    document.getElementById("profile-avatar-input").value = "";
    updateAvatarViews("");
    renderAvatarRemoveButton();
    setStatus("profile-details-status", "Photo will be removed when you save your profile.");
  }

  async function handleAuthChange(event) {
    const user = event.detail?.user || null;
    const sequence = ++loadSequence;
    if (!user) {
      profileState = null;
      avatarSignedUrl = "";
      window.currentProfile = null;
      applyPreferences(DEFAULT_PREFERENCES);
      setHeaderState(null);
      if (modal && !modal.classList.contains("hidden")) closeProfileModal();
      clearProfileForms(null);
      return;
    }
    if (profileState?.id !== user.id) {
      profileState = null;
      avatarSignedUrl = "";
      window.currentProfile = null;
      applyPreferences(DEFAULT_PREFERENCES);
      if (modal && !modal.classList.contains("hidden")) closeProfileModal();
      clearProfileForms(user);
    }
    setHeaderState(user);
    try {
      const loaded = normalizeProfile(await window.profileRepo.get(user.id));
      if (sequence !== loadSequence || window.currentUser?.id !== user.id) return;
      const signedUrl = loaded.avatar_path ? await window.profileRepo.avatarUrl(loaded.avatar_path, user.id).catch(() => "") : "";
      if (sequence !== loadSequence || window.currentUser?.id !== user.id) return;
      profileState = loaded;
      window.currentProfile = loaded;
      avatarSignedUrl = signedUrl;
      applyPreferences(loaded.preferences);
      updateAvatarViews(avatarSignedUrl);
      setHeaderState(user);
      if (modal && !modal.classList.contains("hidden")) populateProfileForms(loaded, user);
    } catch (error) {
      if (sequence === loadSequence) console.warn("Profile could not be loaded", error);
    }
  }

  function initializeProfileUI() {
    ensureHeaderButton();
    document.querySelectorAll("[data-profile-tab]").forEach((button) => button.addEventListener("click", () => setTab(button.dataset.profileTab)));
    document.getElementById("profile-close").addEventListener("click", closeProfileModal);
    document.getElementById("profile-details-form").addEventListener("submit", saveProfileDetails);
    document.getElementById("profile-preferences-form").addEventListener("submit", savePreferences);
    document.getElementById("profile-email-form").addEventListener("submit", updateEmail);
    document.getElementById("profile-password-form").addEventListener("submit", updatePassword);
    document.getElementById("profile-avatar-input").addEventListener("change", handleAvatarSelection);
    document.getElementById("profile-avatar-remove").addEventListener("click", removeCurrentAvatar);
    document.getElementById("profile-sign-out").addEventListener("click", async (event) => {
      const button = event.currentTarget;
      button.disabled = true;
      try {
        await window.profileRepo.signOut();
        closeProfileModal();
      } catch (error) {
        notify(error.message || "Could not sign out.", "error");
      } finally {
        button.disabled = false;
      }
    });
    document.getElementById("profile-manage-listings").addEventListener("click", () => {
      closeProfileModal();
      window.switchPortal?.("dashboard");
    });
    document.getElementById("profile-full-name").addEventListener("input", () => {
      if (!pendingAvatar && !profileState?.avatar_path) updateAvatarViews("");
    });
    modal.addEventListener("click", (event) => { if (event.target === modal) closeProfileModal(); });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) closeProfileModal();
    });
    window.addEventListener("supabase-auth-change", handleAuthChange);
    window.openProfileModal = openProfileModal;
    window.closeProfileModal = closeProfileModal;
    if (window.currentUser) handleAuthChange({ detail: { user: window.currentUser } });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeProfileUI, { once: true });
  else initializeProfileUI();
})();
