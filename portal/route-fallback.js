(() => {
  const base = "__BASE_PATH__";
  if (!location.pathname.startsWith(base)) return;
  const app = location.pathname.slice(base.length).split("/")[0];
  if (app !== "LocalDesign" && app !== "LocalCut") return;
  const route = location.pathname + location.search + location.hash;
  location.replace(
    `${base}${app}/?__localapps_route=${encodeURIComponent(route)}`,
  );
})();
