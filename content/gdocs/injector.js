!function () {
  if (location.href.includes("docs.google.com/document/")) try {
    const e = "oldceeleldhonbafppcapldpdifcinji", t = document.createElement("script");
    t.textContent = `window._docs_annotate_canvas_by_ext='${e}';`, (document.head || document.documentElement).appendChild(t), setTimeout((() => t.remove()));
    const o = document.createElement("script"), n = "object" == typeof browser ? browser : window.chrome;
    o.src = n.runtime.getURL("/content/gdocs/content.js"), o.setAttribute("data-lt-extension-id", n.runtime.id), (document.head || document.documentElement).appendChild(o), o.onload = function () {
      o.remove()
    }
  } catch (e) {
    console.error(e)
  }
}();