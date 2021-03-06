class Select {
  constructor(e, t, s) {
    this._className = e, this._parentElement = t, this._select = s, this._document = t.ownerDocument, this._currentSelection = this._document.createElement("lt-span"), this._render()
  }

  _render() {
    this._selectorWrapper = this._document.createElement("lt-div"), this._selectorWrapper.classList.add("lt-dialog__selector-wrapper", "lt-dialog__selector-wrapper--" + this._className, "lt-icon__chevron_down"), this._parentElement.appendChild(this._selectorWrapper), this._currentSelection.classList.add("lt-dialog__current-selection", "lt-dialog__current-selection--" + this._className), this._selectorWrapper.appendChild(this._currentSelection), this._select.classList.add("lt-dialog__selector", "lt-dialog__selector--" + this._className), this._selectorWrapper.appendChild(this._select)
  }

  setActive(e, t, s) {
    this._currentSelection.textContent = e || "", this._select.value = t, new DomMeasurement(this._document).setStyles(this._currentSelection, s)
  }

  addOption(e) {
    this._select.prepend(e)
  }

  updateOptionLable(e, t) {
    this._select.querySelectorAll("option[value=" + e + "]")[0].textContent = t
  }

  getSelect() {
    return this._select
  }

  getValue() {
    return this._select.value
  }

  toggleHighlight(e) {
    this._selectorWrapper.classList.toggle("lt-dialog__selector-wrapper--highlight", e)
  }
}