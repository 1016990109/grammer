{
  const t = document.createElement("style");
  let n = "-win";
  navigator.userAgent.includes("Mac OS") && (n = "-mac"), t.textContent = `\n\tbody,\n\ttextarea,\n\tbutton,\n\tinput,\n\tselect {\n\t\tfont-family: 'LanguageTool${n}', sans-serif;\n\t}\n\t`, document.head.appendChild(t)
}