/* ---------- Tabs del menú (menu.html) ---------- */

(function () {
  window.MB = window.MB || {};

  MB.initMenuTabs = function () {
    var tabs = document.querySelectorAll(".menu-tab");
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var target = tab.getAttribute("data-target");
        tabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        document.querySelectorAll(".menu-group").forEach(function (group) {
          group.classList.toggle("is-active", group.id === target);
        });
      });
    });
  };
})();
