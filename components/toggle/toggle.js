class Toggle{constructor(t,e,l,s){this._className=t,this._label=e,this._info=l,this._parentElement=s,this._document=s.ownerDocument,this._render()}_render(){this._element=this._document.createElement("lt-div"),this._element.setAttribute("data-lt-prevent-focus",""),this._element.classList.add("lt-toggle-item","lt-toggle--"+this._className,"lt-icon__"+this._className),this._parentElement.appendChild(this._element);const t=this._document.createElement("lt-div");t.classList.add("lt-toggle-item__title","lt-toggle-item__title--"+this._className);const e=this._document.createElement("lt-span");e.classList.add("lt-toggle-item__title__label"),e.textContent=this._label,t.appendChild(e),this._info&&(this._infoElement=this._document.createElement("lt-span"),this._infoElement.classList.add("lt-toggle-item__title__info"),this._infoElement.textContent=this._info,t.appendChild(this._infoElement)),this._element.appendChild(t);const l=this._document.createElement("lt-div");l.classList.add("lt-toggle-item__toggle","lt-toggle-item__toggle--"+this._className),this._element.appendChild(l);const s=this._document.createElement("lt-div");s.classList.add("lt-toggle-item__toggle__dot"),l.appendChild(s)}set(t){t?this._element.classList.add("lt-toggle-item---checked"):this._element.classList.remove("lt-toggle-item---checked")}setInfo(t){this._infoElement.textContent=t}getElement(){return this._element}}