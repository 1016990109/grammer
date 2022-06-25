class Icon {
  constructor(t, e, i, s, l = !0) {
    this._className = t, this._label = e, this._parentElement = s, this._toolTip = i, this._document = s.ownerDocument, this._render(l)
  }

  _render(t) {
    if (this._element = this._document.createElement("lt-div"), this._element.classList.add("lt-icon", "lt-icon--" + this._className), this._element.classList.toggle("lt-icon--clickable", t), this._element.setAttribute("data-lt-prevent-focus", ""), this._parentElement.appendChild(this._element), this._icon = this._document.createElement("lt-span"), this._icon.classList.add("lt-icon__icon", "lt-icon__" + this._className), this._element.appendChild(this._icon), this._toolTip) {
      const t = this._document.createElement("lt-div");
      t.classList.add("lt-icon__tooltip", "lt-icon__tooltip--" + this._toolTip.position, "lt-icon__tooltip--" + this._className), t.textContent = this._toolTip.label, this._element.appendChild(t)
    }
    if (this._label) {
      const t = this._document.createElement("lt-span");
      t.classList.add("lt-icon__label"), t.textContent = this._label, this._element.appendChild(t)
    }
  }

  setIcon(t) {
    this._icon.className = "", this._icon.classList.add("lt-icon__icon", "lt-icon__" + t)
  }

  getElement() {
    return this._element
  }
}