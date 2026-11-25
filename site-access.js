/* Require Supabase Auth before exposing any Kejani Hub interface. */
(function () {
  const gate = document.getElementById("auth-gate");
  const signInButton = document.getElementById("auth-gate-signin");
  const status = document.getElementById("auth-gate-status");
  let authFormOpened = false;

  function openAuthForm() {
    const modal = document.getElementById("supabase-auth-modal");
    if (!window.supabaseReady || !modal) {
      status.textContent = "Sign-in is unavailable because this site has no active Supabase configuration.";
      signInButton.disabled = true;
      return;
    }
    modal.classList.remove("hidden");
    authFormOpened = true;
    window.setTimeout(() => document.getElementById("supabase-email")?.focus(), 0);
  }

  function syncAccess() {
    const isAuthenticated = Boolean(window.currentUser?.id);
    document.body.classList.toggle("auth-required", !isAuthenticated);
    gate.classList.toggle("hidden", isAuthenticated);

    const modal = document.getElementById("supabase-auth-modal");
    if (isAuthenticated) {
      authFormOpened = false;
      modal?.classList.add("hidden");
      return;
    }

    if (!window.supabaseReady) {
      status.textContent = "Sign-in is unavailable because this site has no active Supabase configuration.";
      signInButton.disabled = true;
      return;
    }

    signInButton.disabled = false;
    signInButton.title = "Sign in or create a Kejani Hub account";
    if (window.authSessionResolved) {
      status.textContent = "A signed-in account is required to continue.";
      if (!authFormOpened) openAuthForm();
    } else {
      status.textContent = "Checking your sign-in status…";
    }
  }

  signInButton.addEventListener("click", openAuthForm);
  window.addEventListener("supabase-auth-change", syncAccess);
  syncAccess();
})();
