!function () {
  if (!(window.parent !== window)) return;
  const n = document.createElement("script");
  n.textContent = '\n        var __origExecCommand = document.execCommand;\n        document.execCommand = function(command) {\n            if (command === "print") { this.defaultView.print(); return true; }\n            return __origExecCommand.apply(this, arguments);\n        }', (document.head || document.documentElement).appendChild(n), setTimeout((() => {
    n.remove()
  }), 0)
}();