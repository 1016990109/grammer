!function () {
  const t = "oldceeleldhonbafppcapldpdifcinji";
  document.documentElement.setAttribute("data-lt-ready", "true");
  try {
    window._docs_annotate_canvas_by_ext = t;
    const e = window.chrome;
    window.chrome = window.chrome || {}, window.chrome.runtime = window.chrome.runtime || {};
    const i = window.chrome.runtime.sendMessage;
    window.chrome.runtime.sendMessage = function (o) {
      if (o !== t) return i.apply(this, arguments);
      e || delete window.chrome
    }
  } catch (t) {
  }
  const e = "#dd0000", i = "#4285f4", o = "#fce8e6", n = "#e8f0fe",
    s = /rgba\(31,\s*161,\s*93,\s*0\.|rgba\(255,\s*0,\s*122,\s*0\.|rgba\(0,\s*163,\s*187,\s*0\.|rgba\(119,\s*119,\s*119,\s*0\.|rgba\(19,\s*115,\s*51,\s*0\.|rgba\(184,\s*6,\s*114,\s*0\.|rgba\(147,\s*52,\s*230,\s*0\.|rgba\(163,\s*90,\s*0,\s*0\./i,
    r = document.getElementsByTagName("lt-gdocs-disabled");

  function h() {
    return !!r.length
  }

  const l = document.getElementsByClassName("docs-ruler-face-first-division");

  function c() {
    return !l.length
  }

  let a = !1;
  const d = [];

  function g(t, e, i = {}) {
    var o;
    o = () => {
      const o = new CustomEvent(e, {detail: i, bubbles: !0});
      t.dispatchEvent(o)
    }, a ? o() : d.push(o)
  }

  function u(t, e) {
    return !(t.left > e.right || t.right < e.left || t.top > e.bottom || t.bottom < e.top)
  }

  document.addEventListener("lt-gdocs-init", (() => {
    d.forEach((t => t())), d.length = 0, a = !0
  }));
  const w = CanvasRenderingContext2D.prototype.lineTo;
  CanvasRenderingContext2D.prototype.lineTo = function (t, o) {
    if (!this.strokeStyle || h() || c() || ![e, i].includes(this.strokeStyle.toLowerCase())) {
      if (this.strokeStyle && !h() && s.test(this.strokeStyle)) {
        let {a: e, b: i, c: n, d: s, e: r, f: h} = this.getTransform();
        e /= window.devicePixelRatio, s /= window.devicePixelRatio, r /= window.devicePixelRatio, h /= window.devicePixelRatio;
        const l = t * e + r, c = o * s + h - this.lineWidth / 2;
        this.__ltStrikethroughPoints = this.__ltStrikethroughPoints || [], this.__ltStrikethroughPoints.push({
          left: l,
          top: c,
          bottom: c,
          right: l
        }), this.canvas && g(this.canvas, "lt-strikethroughchange", {strikethroughPoints: this.__ltStrikethroughPoints})
      }
      return w.apply(this, arguments)
    }
  };
  const f = CanvasRenderingContext2D.prototype.fillRect;
  CanvasRenderingContext2D.prototype.fillRect = function (t, e, i, s) {
    if (!this.fillStyle || ![o, n].includes(this.fillStyle.toLowerCase()) || h()) return f.apply(this, arguments)
  };
  const p = CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect = function (t, e, i, o) {
    const n = h();
    if (this.__ltStrikethroughPoints && !n) {
      let {a: n, b: s, c: r, d: h, e: l, f: c} = this.getTransform();
      n /= window.devicePixelRatio, h /= window.devicePixelRatio, l /= window.devicePixelRatio, c /= window.devicePixelRatio;
      const a = e * h + c, d = {top: a, left: t * n + l, bottom: a + o * h, right: a + i * n},
        w = this.__ltStrikethroughPoints.length;
      this.__ltStrikethroughPoints = this.__ltStrikethroughPoints.filter((t => !u(t, d))), w !== this.__ltStrikethroughPoints.length && g(this.canvas, "lt-strikethroughchange", {strikethroughPoints: this.__ltStrikethroughPoints})
    }
    return p.apply(this, arguments)
  }
}();