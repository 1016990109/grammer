/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
class Highlighter {
  constructor(t, e, i, s, h, o) {
    this._highlightingAreas = []
    this._width = 0
    this._height = 0
    this._currentZIndex = "auto"
    this._lastScrollingTimeStamp = 0
    this._supportsCanvas = !0
    this._touchStartDetails = null
    this._onCEElementTouchStart = t => {
      // t.touches && t.touches[0] && (this._touchStartDetails = {
      //   timestamp: Date.now(),
      //   x: t.touches[0].clientX,
      //   y: t.touches[0].clientY
      // })
    }
    this._onCEEElementTouchEnd = t => {
      // if (!t.changedTouches || 1 !== t.changedTouches.length) return;
      // if (!this._touchStartDetails) return;
      // const e = Date.now() - this._touchStartDetails.timestamp;
      // if (this._touchStartDetails = null, e > 300) return;
      // const i = t.changedTouches[0];
      // this._handleClickDebounce.call(t, i.clientX, i.clientY, !0)
    }
    this._onCEElementClick = t => {
      this._handleClickDebounce(t, t.clientX, t.clientY, !1)
    }
    this._handleClick = (t, e, i, s = !1) => {
      if (this._isMirror && t.stopImmediatePropagation(), !this._container) return;
      if (this._isHighlightingDisabled) return;
      // 判断鼠标位置是否在errorCard中
      const errCard = document.querySelector("#flappy-card")
      let isInCard = false
      if (errCard) {
        if (e + 10 >= errCard.offsetLeft &&
          e - 10 <= errCard.offsetLeft + errCard.clientWidth &&
          i + 10 >= errCard.offsetTop &&
          i - 10 <= errCard.offsetTop + errCard.clientHeight
        ) {
          isInCard = true;
        }
      }
      this._domMeasurement.clearCache();
      let h = {x: e, y: i};
      h = this._toElementCoordinates(h, this._element);
      let o = this._highlightedBlocks.length;
      for (; o--;) {
        const e = this._highlightedBlocks[o];
        if (!e.textBoxes) continue;
        const i = e.textBoxes.find((t => isPointInsideRect(t, h)));
        if (i) {
          const h = {highlighter: this, blockId: e.id, clickedBox: this._toPageCoordinates(i, this._element)};
          return void (dispatchCustomEvent(document, Highlighter.eventNames.blockClicked, h) && s && t.preventDefault())
        }
      }
      if (!isInCard) {
        return void (dispatchCustomEvent(document, Highlighter.eventNames.blockCanceled, h) && s && t.preventDefault())
      } else {
        t.preventDefault()
      }
    }
    this._handleClickDebounce = debounce(this._handleClick.bind(this), 300, {
      trailing: true
    })
    this._inputArea = t
    this._inputAreaWrapper = e
    this._element = i
    this._isMirror = s
    this._tweaks = h
    this._clickEvent = o
    this._highlightedText = ""
    this._highlightedBlocks = []
    this._supportsCanvas = this._tweaks.supportsCanvas()
    this._domMeasurement = new DomMeasurement(t.ownerDocument)
    this._onScrollableElementScroll = this._onScrollableElementScroll.bind(this)
    this._onContentChanged = this._onContentChanged.bind(this)
    this._redrawDebounce = new Debounce(this._redraw.bind(this), 250, 500)
    this._enableHighlightingDebounce = new Debounce(this.enableHighlighting.bind(this), this._tweaks.scrollingThrottleLimit || 0)
    this._tweaks.addScrollEventListener(this._onScrollableElementScroll)
    if ("standalone" === EnvironmentAdapter.getType() && BrowserDetector.isIOSTouchDevice()) {
      // 移动端
      this._element.addEventListener("touchstart", this._onCEElementTouchStart, !0)
      this._element.addEventListener("touchend", this._onCEEElementTouchEnd, !0)
    } else {
      this._element.addEventListener('mousemove', this._onCEElementClick, !0)
      // google docs 添加滚动的事件，使得卡片会自动消失
      const docsView = document.querySelector(".kix-appview-editor")
      if (docsView) {
        docsView.addEventListener('scroll', () => {
          return void (dispatchCustomEvent(document, Highlighter.eventNames.blockCanceled, h) && s && t.preventDefault())
        })
      }
      this._element.addEventListener(this._clickEvent, this._onCEElementClick, !0)
      this._element.addEventListener(Mirror.eventNames.click, this._onCEElementClick, !0)
      this._contentChangedObserver = this._tweaks.createMutationObserver(this._onContentChanged)
    }
    const n = ["style"];
    this._tweaks.attributeMutations && n.push(...this._tweaks.attributeMutations), s || n.push("class", "size", "face", "align");
    const r = {
      attributes: !0,
      attributeFilter: n,
      attributeOldValue: !1,
      characterData: !0,
      characterDataOldValue: !1,
      childList: !0,
      subtree: void 0 === this._tweaks.observeSubtreeMutations ? !s : this._tweaks.observeSubtreeMutations
    };
    this._contentChangedObserver.observe(this._element, r), window.ResizeObserver && (this._ceElementResizeObserver = new window.ResizeObserver((() => this._render())), this._ceElementResizeObserver.observe(this._element)), this._renderInterval = setAnimationFrameInterval(this._render.bind(this), config.RENDER_INTERVAL), this._render()
  }

  throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function () {
      previous = options.leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function () {
      var now = Date.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

  _toPageCoordinates(t, e) {
    const i = this._domMeasurement.getPaddingBox(e), s = this._getScrollPosition(!1),
      h = this._domMeasurement.getScaleFactor(e), o = this._domMeasurement.getZoom(e),
      n = Math.round((t.top - s.top) * h.y * o + i.top), r = Math.round((t.left - s.left) * h.x * o + i.left),
      a = Math.round(t.width * h.x * o), l = Math.round(t.height * h.y * o);
    return {top: n, right: r + a, bottom: n + l, left: r, width: a, height: l}
  }

  _toElementCoordinates(t, e) {
    const i = this._domMeasurement.getPaddingBox(e, !1), s = this._getScrollPosition(),
      h = this._domMeasurement.getScaleFactor(e), o = this._domMeasurement.getZoom(e);
    return {x: Math.round((t.x - i.left + s.left) / h.x / o), y: Math.round((t.y - i.top + s.top) / h.y / o)}
  }

  _getScrollPosition(t = !0, e = t, i = !0) {
    if (this._isMirror) {
      let i = 0, s = 0;
      return t ? (i = e ? +this._element.dataset.ltScrollTopScaledAndZoomed : +this._element.dataset.ltScrollTopScaled, s = e ? +this._element.dataset.ltScrollLeftScaledAndZoomed : +this._element.dataset.ltScrollLeftScaled) : (i = +this._element.dataset.ltScrollTop, s = +this._element.dataset.ltScrollLeft), {
        top: i,
        left: s
      }
    }
    return i && this._domMeasurement.clearCache(), this._tweaks.getScrollPosition(this._domMeasurement, t, e)
  }

  _render(t = !1) {
    if (!this._element.parentElement || !this._inputArea.parentElement) return;
    this._domMeasurement.clearCache();
    const e = this._inputArea.ownerDocument, i = this._tweaks.getTargetElement();
    if (!i.parentNode) return;
    if (!this._container && (this._container = createContainerElement(e, Highlighter.CONTAINER_ELEMENT_NAME), this._container.style.display = "none", isCKEditor(this._inputArea) && this._container.setAttribute("data-cke-temp", "1"), this._wrapper = e.createElement("lt-div"), this._wrapper.setAttribute("spellcheck", "false"), this._wrapper.className = "lt-highlighter__wrapper", this._scrollElement = e.createElement("lt-div"), this._scrollElement.className = "lt-highlighter__scroll-element", this._wrapper.appendChild(this._scrollElement), this._container.appendChild(this._wrapper), i.parentElement)) {
      const t = this._domMeasurement.getStyle(i.parentElement, "display");
      "grid" !== t && "inline-grid" !== t || this._container.classList.add("lt-highlighter--grid-item")
    }
    const s = {};
    if (this._inputArea === e.body && e.scrollingElement === e.documentElement && "BackCompat" !== e.compatMode) {
      const t = this._domMeasurement.getStyles(this._inputArea, ["overflow-x", "overflow-y"]);
      s["overflow-x"] = "hidden" === t["overflow-x"] ? "hidden" : "visible", s["overflow-y"] = "hidden" === t["overflow-y"] ? "hidden" : "visible"
    }
    const h = this._tweaks.getVisibleBox(this._domMeasurement);
    s.width = h.width + "px", s.height = h.height + "px";
    const o = this._domMeasurement.getStyles(this._element, ["transform", "transform-origin", "zoom"]);
    s.transform = o.transform, s["transform-origin"] = o["transform-origin"], s.zoom = o.zoom, this._domMeasurement.setStyles(this._wrapper, s, !0);
    const n = this._isMirror ? this._inputArea : i, r = this._tweaks.getZIndex(n, this._domMeasurement);
    r !== this._currentZIndex && ("auto" !== r && r > 0 ? (this._currentZIndex = r, this._domMeasurement.setStyles(this._container, {"z-index": String(r)}, !0)) : "auto" !== this._currentZIndex && (this._currentZIndex = "auto", this._domMeasurement.setStyles(this._container, {"z-index": "auto"}, !0))), this._applyScrolling(), i.parentNode && i.previousElementSibling !== this._container && i.parentNode.insertBefore(this._container, i);
    const a = this._domMeasurement.getPaddingBox(this._wrapper, !0, !1), l = h.top - a.top;
    if (Math.abs(l) > .05) {
      const t = this._domMeasurement.getScaleFactor(this._inputArea.parentElement);
      let e = parseFloat(this._domMeasurement.getStyle(this._wrapper, "margin-top"));
      e += l / t.y, this._domMeasurement.setStyles(this._wrapper, {"margin-top": e + "px"}, !0)
    }
    const c = h.left - a.left;
    if (Math.abs(c) > .05) {
      const t = this._domMeasurement.getScaleFactor(this._inputArea.parentElement);
      let e = parseFloat(this._domMeasurement.getStyle(this._wrapper, "margin-left"));
      e += c / t.x, this._domMeasurement.setStyles(this._wrapper, {"margin-left": e + "px"}, !0)
    }
    const g = this._tweaks.getScrollableElementSize(this._domMeasurement);
    if (this._width !== g.width || this._height !== g.height) {
      this._width = g.width, this._height = g.height;
      const e = this._width - h.width;
      e < 1 && e > 0 && (this._width = h.width);
      const i = this._height - h.height;
      i < 1 && i > 0 && (this._height = h.height), this._domMeasurement.setStyles(this._scrollElement, {
        width: this._width + "px",
        height: this._height + "px"
      }, !0), this._updateHighlightedAreas(), t ? this._redraw(!1) : this._throttledRedraw(!1)
    }
  }

  _updateHighlightedAreas() {
    const t = [];
    for (let e = 0; e < this._width; e += Highlighter.CANVAS_MAX_WIDTH) for (let i = 0; i < this._height; i += Highlighter.CANVAS_MAX_HEIGHT) {
      const s = {
        top: i,
        right: e + Highlighter.CANVAS_MAX_WIDTH,
        bottom: i + Highlighter.CANVAS_MAX_HEIGHT,
        left: e,
        width: Highlighter.CANVAS_MAX_WIDTH,
        height: Highlighter.CANVAS_MAX_HEIGHT
      };
      let h = this._highlightingAreas.find((t => isRectsEqual(t.cell, s)));
      if (!h) {
        const t = this._inputArea.ownerDocument.createElement("canvas");
        if (t.className = "lt-highlighter__canvas", t.width = 0, t.height = 0, this._domMeasurement.setStyles(t, {display: "none"}), h = {
          cell: s,
          canvas: t,
          context: t.getContext("2d"),
          drawnItems: new Map
        }, !this._supportsCanvas) {
          const t = this._inputArea.ownerDocument.createElement("img");
          t.className = "lt-highlighter__canvas", t.width = 0, t.height = 0, this._domMeasurement.setStyles(t, {display: "none"}), h.image = t
        }
      }
      t.push(h)
    }
    for (const e of this._highlightingAreas) {
      const i = e.image || e.canvas;
      !t.includes(e) && i.parentElement && i.parentElement.removeChild(i)
    }
    this._highlightingAreas = t
  }

  _throttledRedraw(t = !0) {
    this._inputAreaWrapper.getText().length > config.MAX_TEXT_LENGTH_PERFORMANCE_DEGRADATION ? this._redrawDebounce.call(t) : this._redraw(t)
  }

  _redraw(t = !0) {
    if (t && this._domMeasurement.clearCache(), !this._highlightingAreas.length) return;
    this._highlightedText = this._inputAreaWrapper.getText();
    const e = this._getScrollPosition(!0, !1, !1), i = this._tweaks.getScrollableElementSize(this._domMeasurement);
    for (const t of this._highlightedBlocks) t.textRanges = this._inputAreaWrapper.getTextRanges(t.offset, t.length), t.textBoxes = this._tweaks.getTextBoxes(this._domMeasurement, t.textRanges, this._element, e), t.textBoxes.forEach((t => {
      const e = t.width < 10 ? 3 : 1;
      t.left = Math.max(0, t.left - e), t.right = Math.min(i.width, t.right + e), t.width = t.right - t.left, t.top = Math.max(0, t.top), t.bottom = Math.min(i.height, t.bottom), t.height = t.bottom - t.top
    }));
    const s = [];
    for (const t of this._highlightedBlocks) for (const e of t.textBoxes) {
      if (t.simulateSelection && s.push({
        top: e.bottom - Highlighter.LINE_WIDTH / 2,
        right: e.right,
        bottom: e.bottom + Highlighter.LINE_WIDTH / 2,
        left: e.left,
        width: e.width,
        height: Highlighter.LINE_WIDTH,
        color: t.underlineColor,
        textBox: e
      }), t.isEmphasized) {
        const i = e.bottom - Highlighter.LINE_WIDTH / 2;
        s.push({
          top: e.top,
          right: e.right,
          bottom: i,
          left: e.left,
          width: e.width,
          height: i - e.top,
          color: t.backgroundColor,
          textBox: e
        })
      }
      if (t.isUnderlined) {
        let h = e.bottom - Highlighter.LINE_WIDTH / 2, o = e.bottom + Highlighter.LINE_WIDTH / 2;
        o > i.height && (h -= 1, o -= 1)
        s.push({
          top: h,
          right: e.right,
          bottom: o,
          left: e.left,
          width: e.width,
          height: Highlighter.LINE_WIDTH,
          color: t.underlineColor,
          dashed: !t.isEmphasized,
          textBox: e
        })
      }
    }
    for (const t of this._highlightingAreas) {
      const e = s.filter(isRectsIntersect.bind(null, t.cell));
      if (!e.length) {
        delete t.canvasBox, t.drawnItems.clear();
        const e = t.image || t.canvas;
        e.parentElement && e.parentElement.removeChild(e);
        continue
      }
      let i = {top: Number.MAX_VALUE, right: 0, bottom: 0, left: Number.MAX_VALUE, width: 0, height: 0};
      for (const t of e) {
        i.top = Math.min(i.top, t.top, t.textBox.top)
        i.right = Math.max(i.right, t.right, t.textBox.right)
        i.bottom = Math.max(i.bottom, t.bottom, t.textBox.bottom)
        i.left = Math.min(i.left, t.left, t.textBox.left)
      }
      i.top = Math.max(t.cell.top, i.top)
      i.right = Math.min(t.cell.right, i.right)
      i.bottom = Math.min(t.cell.bottom, i.bottom)
      i.left = Math.max(t.cell.left, i.left)
      i.width = i.right - i.left
      i.height = i.bottom - i.top;
      const h = !t.canvasBox || t.canvasBox.width < i.width || t.canvasBox.height < i.height || t.canvasBox.width * t.canvasBox.height / (i.width * i.height) >= 2,
        o = !h && !isRectContainsRect(t.canvasBox, i);
      if (h) {
        const e = !t.canvasBox || t.canvasBox.top !== i.top || t.canvasBox.left !== i.left;
        t.canvas.width = i.width, t.canvas.height = i.height, t.image && (t.image.width = i.width, t.image.height = i.height), t.canvasBox = i, t.drawnItems.clear();
        const s = t.image || t.canvas;
        e && this._domMeasurement.setStyles(s, {
          top: t.canvasBox.top + "px",
          left: t.canvasBox.left + "px"
        }, !0), s.parentElement || this._scrollElement.appendChild(s)
      } else if (o) {
        const e = t.image || t.canvas;
        t.canvasBox.top = i.top, t.canvasBox.right = i.left + t.canvasBox.width, t.canvasBox.bottom = i.top + t.canvasBox.height, t.canvasBox.left = i.left, this._domMeasurement.setStyles(e, {
          top: t.canvasBox.top + "px",
          left: t.canvasBox.left + "px"
        }, !0)
      }
      let n = new Map;
      for (const i of e) {
        const e = Math.max(i.left - t.canvasBox.left, 0), s = Math.min(i.right - t.canvasBox.left, t.canvasBox.width),
          h = Math.max(i.top - t.canvasBox.top, 0), o = Math.min(i.bottom - t.canvasBox.top, t.canvasBox.height),
          r = s - e, a = o - h,
          l = {top: h, right: s, bottom: o, left: e, width: r, height: a, color: i.color, dashed: i.dashed},
          c = {x: e, y: h, w: r, h: a, c: i.color};
        n.set(JSON.stringify(c), l)
      }
      let r = [], a = !1;
      for (const [e, i] of n) t.drawnItems.delete(e) || (r.push(i), a = !0);
      let l = Array.from(t.drawnItems.values());
      const c = l.length;
      c > 0 && (a = !0);
      if (c > 20 && (t.canvas.width = t.canvasBox.width, r = Array.from(n.values()), l = []), t.drawnItems = n, !a) continue;
      const g = Array.from(n.values());
      for (const e of l) {
        t.context.clearRect(e.left, e.top, e.width, e.height);
        for (const t of g) {
          if (isRectsIntersect(t, e)) {
            const i = Math.max(t.top, e.top), s = Math.min(t.right, e.right), h = Math.min(t.bottom, e.bottom),
              o = Math.max(t.left, e.left), n = h - i;
            if (0 === s - o || 0 === n) continue;
            const a = {
              top: i,
              right: s,
              bottom: h,
              left: o,
              width: s - o,
              height: h - i,
              color: t.color,
              dashed: t.dashed
            };
            if (!r.some((t => t.color === a.color && isRectsEqual(t, a)))) {
              r.push(a)
            }
          }
        }
      }
      for (const t of r) {
        let e = !1;
        for (const i of g) {
          if (!e) {
            e = t === i;
            continue
          }
          if (isRectsIntersect(i, t)) {
            const e = Math.max(i.top, t.top), s = Math.min(i.right, t.right), h = Math.min(i.bottom, t.bottom),
              o = Math.max(i.left, t.left);
            r.push({
              top: e,
              right: s,
              bottom: h,
              left: o,
              width: s - o,
              height: h - e,
              color: i.color,
              dashed: i.dashed,
            })
          }
        }
      }
      const step = 2;// 每次画的像素点
      for (const e of r) {
        if (e.height > 2) {
          // 背景色加动画
          if (false) {
            // requestAnimationFrame 实现
            let j = 0, delay = 1
            let time, frame = -1
            const loop = (timestamp) => {
              if (!time) {
                time = timestamp
              }
              const seg = Math.floor((timestamp - time) / delay);
              if (seg > frame) {
                frame = seg
                t.context.fillStyle = e.color
                t.context.fillRect(e.left + j, e.top, 1, e.height);
                j++
              }
              if (j <= e.width) {
                requestAnimationFrame(loop)
              }
            }
            window.requestAnimationFrame(loop)
          } else {
            // setTimeout
            let j = 0
            const loop = () => {
              t.context.fillStyle = e.color
              t.context.fillRect(e.left + j, e.top, 1, e.height);
              j++
              if (j < e.width) {
                requestAnimationFrame(loop)
              }
            }
            window.requestAnimationFrame(loop)
          }
        } else {
          // if (e.dashed) {
          t.context.lineWidth = 2;
          t.context.setLineDash([4, 2]);
          t.context.strokeStyle = e.color
          t.context.moveTo(e.left, e.top + 2);
          t.context.lineTo(e.left + e.width, e.top + 2);
          t.context.stroke();
          // } else {
          //   t.context.fillStyle = e.color
          //   t.context.fillRect(e.left, e.top, e.width, e.height)
          // }
        }
      }
      t.image && (t.image.src = t.canvas.toDataURL())
    }
  }

  _applyScrolling() {
    const t = this._getScrollPosition(!1), e = -t.top + "px", i = -t.left + "px";
    this._domMeasurement.setStyles(this._scrollElement, {top: e, left: i}, !0)
  }

  _onScrollableElementScroll() {
    if (!this._container) return;
    const t = Date.now(),
      e = this._isHighlightingDisabled || !!this._tweaks.scrollingThrottleLimit && t - this._lastScrollingTimeStamp < this._tweaks.scrollingThrottleLimit;
    this._lastScrollingTimeStamp = t, e ? (this.disableHighlighting(), this._enableHighlightingDebounce.call()) : window.requestAnimationFrame((() => {
      this._applyScrolling()
    }))
  }

  _onContentChanged(t) {
    if (!this._container) return;
    const e = this._inputAreaWrapper.getText(), i = t.some((t => {
      if ("attributes" === t.type) return !0;
      if (this._isMirror && !this._tweaks.observeSubtreeMutations) return !1;
      if (Array.from(t.addedNodes || []).some((t => t.nodeType === document.ELEMENT_NODE))) return !0;
      return !!Array.from(t.removedNodes || []).some((t => t.nodeType === document.ELEMENT_NODE))
    }));
    (this._highlightedText !== e || i) && this._throttledRedraw()
  }

  disableHighlighting() {
    this._isHighlightingDisabled || (this._isHighlightingDisabled = !0, this._wrapper && this._wrapper.classList.add("lt-highlighter__wrapper-invisible"))
  }

  enableHighlighting() {
    this._isHighlightingDisabled && (this._isHighlightingDisabled = !1, this._wrapper && (this._redraw(), this._wrapper.classList.remove("lt-highlighter__wrapper-invisible")))
  }

  highlight(t = [], e = !1) {
    this._highlightedBlocks = t, e ? this._redraw() : this._throttledRedraw()
  }

  getTextBoxes(t) {
    const e = this._highlightedBlocks.find((e => e.id === t));
    return e && e.textBoxes ? e.textBoxes.map((t => this._toPageCoordinates(t, this._element))) : []
  }

  destroy() {
    this._tweaks.removeScrollEventListener(this._onScrollableElementScroll)
    this._element.removeEventListener(this._clickEvent, this._onCEElementClick, !0)
    this._element.removeEventListener(Mirror.eventNames.click, this._onCEElementClick)
    this._element.removeEventListener("touchstart", this._onCEElementTouchStart, !0)
    this._element.removeEventListener("touchend", this._onCEEElementTouchEnd, !0)
    this._element.removeEventListener("mousemove", this._onCEEElementTouchEnd, !0)
    this._contentChangedObserver.disconnect()
    this._renderInterval && this._renderInterval.destroy()
    this._container && this._container.remove()
    this._ceElementResizeObserver && this._ceElementResizeObserver.disconnect()
    this._redrawDebounce.cancelCall(), this._enableHighlightingDebounce.cancelCall()
    this._domMeasurement.clearCache()
  }
}

Highlighter.CONTAINER_ELEMENT_NAME = "lt-highlighter"
Highlighter.CANVAS_MAX_WIDTH = 1024
Highlighter.CANVAS_MAX_HEIGHT = 1024
Highlighter.LINE_WIDTH = 2
Highlighter.eventNames = {
  blockClicked: "lt-highlighter.blockClicked",
  blockCanceled: "lt-highlighter.blockCanceled",
};