class Score {
  constructor(t, e, s) {
    this._className = t, this._parentElement = e, this._toolTip = s, this._document = e.ownerDocument, this._render()
  }

  _render() {
    this._element = this._document.createElement("lt-div"), this._element.classList.add("lt-score", "lt-score--" + this._className), this._element.setAttribute("data-lt-prevent-focus", ""), this._parentElement.appendChild(this._element), this._progressLabel = this._document.createElement("lt-span"), this._progressLabel.classList.add("lt-score__label"), this._progressLabel.setAttribute("data-lt-prevent-focus", ""), this._progressLabel.textContent = "0";
    const t = this._document.createElement("lt-div");
    t.classList.add("lt-icon__tooltip", "lt-icon__tooltip--" + this._toolTip.position, "lt-icon__tooltip--" + this._className), t.textContent = this._toolTip.label, this._element.appendChild(t), this._element.appendChild(this._progressLabel)
  }

  setScore(t) {
    Math.PI;
    t > 0 ? (this._progressLabel.textContent = t.toString(), this._updateProgress(t), this._element.classList.remove("lt-score--hidden")) : this._element.classList.add("lt-score--hidden")
  }

  _updateProgress(t) {
    let e = "", s = "";
    if (t < 50) {
      e = "linear-gradient(90deg, #DEE3ED 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0))", s = "linear-gradient(" + (90 + 3.6 * t) + "deg, #1976F0 50%, #DEE3ED 50%, #DEE3ED)"
    } else {
      e = "linear-gradient(" + (3.6 * (t - 50) - 90) + "deg, #1976F0 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0))", s = "linear-gradient(270deg, #1976F0 50%, #DEE3ED 50%, #DEE3ED)"
    }
    this._element.setAttribute("style", "background-image: " + e + ", " + s + " !important")
  }
}