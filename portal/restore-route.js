(() => {
  const route = new URL(location.href).searchParams.get("__localapps_route");
  if (!route) return;
  try {
    const target = new URL(route, location.origin);
    if (
      target.origin === location.origin &&
      target.pathname.startsWith("__APP_BASE__")
    ) {
      history.replaceState(
        null,
        "",
        target.pathname + target.search + target.hash,
      );
    }
  } catch {
    // Invalid recovery parameters leave the app at its ordinary entry page.
  }
})();
