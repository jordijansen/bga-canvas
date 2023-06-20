/*! dom-to-image-more 26-04-2023 */
!function (u) {
    "use strict";
    var f = function () { var e = 0; return { escape: function (e) { return e.replace(/([.*+?^${}()|[]\/\\])/g, "\\$1"); }, isDataUrl: function (e) { return -1 !== e.search(/^(data:)/); }, canvasToBlob: function (t) { if (t.toBlob)
            return new Promise(function (e) { t.toBlob(e); }); return function (r) { return new Promise(function (e) { var t = s(r.toDataURL().split(",")[1]), n = t.length, o = new Uint8Array(n); for (var e_1 = 0; e_1 < n; e_1++)
            o[e_1] = t.charCodeAt(e_1); e(new Blob([o], { type: "image/png" })); }); }(t); }, resolveUrl: function (e, t) { var n = document.implementation.createHTMLDocument(), o = n.createElement("base"), r = (n.head.appendChild(o), n.createElement("a")); return n.body.appendChild(r), o.href = t, r.href = e, r.href; }, getAndEncode: function (u) { var e = c.impl.urlCache.find(function (e) { return e.url === u; }); e || (e = { url: u, promise: null }, c.impl.urlCache.push(e)); null === e.promise && (c.impl.options.cacheBust && (u += (/\?/.test(u) ? "&" : "?") + (new Date).getTime()), e.promise = new Promise(function (t) { var e = c.impl.options.httpTimeout, n = new XMLHttpRequest; n.onreadystatechange = function () { if (4 === n.readyState)
            if (200 !== n.status)
                o ? t(o) : i("cannot fetch resource: ".concat(u, ", status: ") + n.status);
            else {
                var e_2 = new FileReader;
                e_2.onloadend = function () { t(e_2.result); }, e_2.readAsDataURL(n.response);
            } }, n.ontimeout = function () { o ? t(o) : i("timeout of ".concat(e, "ms occured while fetching resource: ") + u); }, n.responseType = "blob", n.timeout = e, c.impl.options.useCredentials && (n.withCredentials = !0), n.open("GET", u, !0), n.send(); var o; var r; function i(e) { console.error(e), t(""); } c.impl.options.imagePlaceholder && (r = c.impl.options.imagePlaceholder.split(/,/)) && r[1] && (o = r[1]); })); return e.promise; }, uid: function () { return "u" + ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4) + e++; }, delay: function (n) { return function (t) { return new Promise(function (e) { setTimeout(function () { e(t); }, n); }); }; }, asArray: function (t) { var n = [], o = t.length; for (var e_3 = 0; e_3 < o; e_3++)
            n.push(t[e_3]); return n; }, escapeXhtml: function (e) { return e.replace(/%/g, "%25").replace(/#/g, "%23").replace(/\n/g, "%0A"); }, makeImage: function (o) { return "data:," !== o ? new Promise(function (e, t) { var n = new Image; c.impl.options.useCredentials && (n.crossOrigin = "use-credentials"), n.onload = function () { window && window.requestAnimationFrame ? window.requestAnimationFrame(function () { e(n); }) : e(n); }, n.onerror = t, n.src = o; }) : Promise.resolve(); }, width: function (e) { var t = i(e, "width"); if (!isNaN(t))
            return t; var t = i(e, "border-left-width"), n = i(e, "border-right-width"); return e.scrollWidth + t + n; }, height: function (e) { var t = i(e, "height"); if (!isNaN(t))
            return t; var t = i(e, "border-top-width"), n = i(e, "border-bottom-width"); return e.scrollHeight + t + n; }, getWindow: t, isElement: r, isElementHostForOpenShadowRoot: function (e) { return r(e) && null !== e.shadowRoot; }, isShadowRoot: n, isInShadowRoot: o, isHTMLElement: function (e) { return e instanceof t(e).HTMLElement; }, isHTMLCanvasElement: function (e) { return e instanceof t(e).HTMLCanvasElement; }, isHTMLInputElement: function (e) { return e instanceof t(e).HTMLInputElement; }, isHTMLImageElement: function (e) { return e instanceof t(e).HTMLImageElement; }, isHTMLLinkElement: function (e) { return e instanceof t(e).HTMLLinkElement; }, isHTMLScriptElement: function (e) { return e instanceof t(e).HTMLScriptElement; }, isHTMLStyleElement: function (e) { return e instanceof t(e).HTMLStyleElement; }, isHTMLTextAreaElement: function (e) { return e instanceof t(e).HTMLTextAreaElement; }, isShadowSlotElement: function (e) { return o(e) && e instanceof t(e).HTMLSlotElement; }, isSVGElement: function (e) { return e instanceof t(e).SVGElement; }, isSVGRectElement: function (e) { return e instanceof t(e).SVGRectElement; }, isDimensionMissing: function (e) { return isNaN(e) || e <= 0; } }; function t(e) { e = e ? e.ownerDocument : void 0; return (e ? e.defaultView : void 0) || u || window; } function n(e) { return e instanceof t(e).ShadowRoot; } function o(e) { return null !== e && Object.prototype.hasOwnProperty.call(e, "getRootNode") && n(e.getRootNode()); } function r(e) { return e instanceof t(e).Element; } function i(t, n) { if (t.nodeType === a) {
        var e_4 = h(t).getPropertyValue(n);
        if ("px" === e_4.slice(-2))
            return e_4 = e_4.slice(0, -2), parseFloat(e_4);
    } return NaN; } }(), r = function () { var o = /url\(['"]?([^'"]+?)['"]?\)/g; return { inlineAll: function (t, o, r) { if (!e(t))
            return Promise.resolve(t); return Promise.resolve(t).then(n).then(function (e) { var n = Promise.resolve(t); return e.forEach(function (t) { n = n.then(function (e) { return i(e, t, o, r); }); }), n; }); }, shouldProcess: e, impl: { readUrls: n, inline: i } }; function e(e) { return -1 !== e.search(o); } function n(e) { for (var t, n = []; null !== (t = o.exec(e));)
        n.push(t[1]); return n.filter(function (e) { return !f.isDataUrl(e); }); } function i(n, o, t, e) { return Promise.resolve(o).then(function (e) { return t ? f.resolveUrl(e, t) : e; }).then(e || f.getAndEncode).then(function (e) { return n.replace((t = o, new RegExp("(url\\(['\"]?)(".concat(f.escape(t), ")(['\"]?\\))"), "g")), "$1".concat(e, "$3")); var t; }); } }(), e = { resolveAll: function () { return t().then(function (e) { return Promise.all(e.map(function (e) { return e.resolve(); })); }).then(function (e) { return e.join("\n"); }); }, impl: { readAll: t } };
    function t() { return Promise.resolve(f.asArray(document.styleSheets)).then(function (e) { var n = []; return e.forEach(function (t) { if (Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(t), "cssRules"))
        try {
            f.asArray(t.cssRules || []).forEach(n.push.bind(n));
        }
        catch (e) {
            console.error("domtoimage: Error while reading CSS rules from " + t.href, e.toString());
        } }), n; }).then(function (e) { return e.filter(function (e) { return e.type === CSSRule.FONT_FACE_RULE; }).filter(function (e) { return r.shouldProcess(e.style.getPropertyValue("src")); }); }).then(function (e) { return e.map(t); }); function t(t) { return { resolve: function () { var e = (t.parentStyleSheet || {}).href; return r.inlineAll(t.cssText, e); }, src: function () { return t.style.getPropertyValue("src"); } }; } }
    var n = { inlineAll: function t(e) { if (!f.isElement(e))
            return Promise.resolve(e); return n(e).then(function () { return f.isHTMLImageElement(e) ? o(e).inline() : Promise.all(f.asArray(e.childNodes).map(function (e) { return t(e); })); }); function n(o) { var e = ["background", "background-image"], t = e.map(function (t) { var e = o.style.getPropertyValue(t), n = o.style.getPropertyPriority(t); return e ? r.inlineAll(e).then(function (e) { o.style.setProperty(t, e, n); }) : Promise.resolve(); }); return Promise.all(t).then(function () { return o; }); } }, impl: { newImage: o } };
    function o(n) { return { inline: function (e) { if (f.isDataUrl(n.src))
            return Promise.resolve(); return Promise.resolve(n.src).then(e || f.getAndEncode).then(function (t) { return new Promise(function (e) { n.onload = e, n.onerror = e, n.src = t; }); }); } }; }
    var l = { copyDefaultStyles: !0, imagePlaceholder: void 0, cacheBust: !1, useCredentials: !1, httpTimeout: 3e4, styleCaching: "strict" }, c = { toSvg: m, toPng: function (e, t) { return i(e, t).then(function (e) { return e.toDataURL(); }); }, toJpeg: function (e, t) { return i(e, t).then(function (e) { return e.toDataURL("image/jpeg", (t ? t.quality : void 0) || 1); }); }, toBlob: function (e, t) { return i(e, t).then(f.canvasToBlob); }, toPixelData: function (t, e) { return i(t, e).then(function (e) { return e.getContext("2d").getImageData(0, 0, f.width(t), f.height(t)).data; }); }, toCanvas: i, impl: { fontFaces: e, images: n, util: f, inliner: r, urlCache: [], options: {} } }, a = ("object" == typeof exports && "object" == typeof module ? module.exports = c : u.domtoimage = c, ("undefined" != typeof Node ? Node.ELEMENT_NODE : void 0) || 1), h = (void 0 !== u ? u.getComputedStyle : void 0) || ("undefined" != typeof window ? window.getComputedStyle : void 0) || globalThis.getComputedStyle, s = (void 0 !== u ? u.atob : void 0) || ("undefined" != typeof window ? window.atob : void 0) || globalThis.atob;
    function m(e, r) { var t = c.impl.util.getWindow(e); var n = r = r || {}; void 0 === n.copyDefaultStyles ? c.impl.options.copyDefaultStyles = l.copyDefaultStyles : c.impl.options.copyDefaultStyles = n.copyDefaultStyles, void 0 === n.imagePlaceholder ? c.impl.options.imagePlaceholder = l.imagePlaceholder : c.impl.options.imagePlaceholder = n.imagePlaceholder, void 0 === n.cacheBust ? c.impl.options.cacheBust = l.cacheBust : c.impl.options.cacheBust = n.cacheBust, void 0 === n.useCredentials ? c.impl.options.useCredentials = l.useCredentials : c.impl.options.useCredentials = n.useCredentials, void 0 === n.httpTimeout ? c.impl.options.httpTimeout = l.httpTimeout : c.impl.options.httpTimeout = n.httpTimeout, void 0 === n.styleCaching ? c.impl.options.styleCaching = l.styleCaching : c.impl.options.styleCaching = n.styleCaching; var i = []; return Promise.resolve(e).then(function (e) { if (e.nodeType === a)
        return e; var t = e, n = e.parentNode, o = document.createElement("span"); return n.replaceChild(o, t), o.append(e), i.push({ parent: n, child: t, wrapper: o }), o; }).then(function (e) { return function l(t, a, r, s) { var e = a.filter; if (t === d || f.isHTMLScriptElement(t) || f.isHTMLStyleElement(t) || f.isHTMLLinkElement(t) || null !== r && e && !e(t))
        return Promise.resolve(); return Promise.resolve(t).then(n).then(function (e) { return i(e, o(t)); }).then(function (e) { return u(e, t); }); function n(e) { return f.isHTMLCanvasElement(e) ? f.makeImage(e.toDataURL()) : e.cloneNode(!1); } function o(e) { return f.isElementHostForOpenShadowRoot(e) ? e.shadowRoot : e; } function i(t, e) { var n = i(e); var o = Promise.resolve(); if (0 !== n.length) {
        var u_1 = h(r(e));
        f.asArray(n).forEach(function (e) { o = o.then(function () { return l(e, a, u_1, s).then(function (e) { e && t.appendChild(e); }); }); });
    } return o.then(function () { return t; }); function r(e) { return f.isShadowRoot(e) ? e.host : e; } function i(e) { return f.isShadowSlotElement(e) ? e.assignedNodes() : e.childNodes; } } function u(s, c) { return !f.isElement(s) || f.isShadowSlotElement(c) ? Promise.resolve(s) : Promise.resolve().then(e).then(t).then(n).then(o).then(function () { return s; }); function e() { function o(e, t) { t.font = e.font, t.fontFamily = e.fontFamily, t.fontFeatureSettings = e.fontFeatureSettings, t.fontKerning = e.fontKerning, t.fontSize = e.fontSize, t.fontStretch = e.fontStretch, t.fontStyle = e.fontStyle, t.fontVariant = e.fontVariant, t.fontVariantCaps = e.fontVariantCaps, t.fontVariantEastAsian = e.fontVariantEastAsian, t.fontVariantLigatures = e.fontVariantLigatures, t.fontVariantNumeric = e.fontVariantNumeric, t.fontVariationSettings = e.fontVariationSettings, t.fontWeight = e.fontWeight; } function e(e, t) { var n = h(e); n.cssText ? (t.style.cssText = n.cssText, o(n, t.style)) : (y(a, e, n, r, t), null === r && (["inset-block", "inset-block-start", "inset-block-end"].forEach(function (e) { return t.style.removeProperty(e); }), ["left", "right", "top", "bottom"].forEach(function (e) { t.style.getPropertyValue(e) && t.style.setProperty(e, "0px"); }))); } e(c, s); } function t() { var l = f.uid(); function t(r) { var i = h(c, r), u = i.getPropertyValue("content"); if ("" !== u && "none" !== u) {
        var t_1 = s.getAttribute("class") || "", n_1 = (s.setAttribute("class", t_1 + " " + l), document.createElement("style"));
        function e() { var e = ".".concat(l, ":") + r, t = (i.cssText ? n : o)(); return document.createTextNode(e + "{".concat(t, "}")); function n() { return "".concat(i.cssText, " content: ").concat(u, ";"); } function o() { var e = f.asArray(i).map(t).join("; "); return e + ";"; function t(e) { var t = i.getPropertyValue(e), n = i.getPropertyPriority(e) ? " !important" : ""; return e + ": " + t + n; } } }
        n_1.appendChild(e()), s.appendChild(n_1);
    } } [":before", ":after"].forEach(function (e) { t(e); }); } function n() { f.isHTMLTextAreaElement(c) && (s.innerHTML = c.value), f.isHTMLInputElement(c) && s.setAttribute("value", c.value); } function o() { f.isSVGElement(s) && (s.setAttribute("xmlns", "http://www.w3.org/2000/svg"), f.isSVGRectElement(s)) && ["width", "height"].forEach(function (e) { var t = s.getAttribute(e); t && s.style.setProperty(e, t); }); } } }(e, r, null, t); }).then(p).then(g).then(function (t) { r.bgcolor && (t.style.backgroundColor = r.bgcolor); r.width && (t.style.width = r.width + "px"); r.height && (t.style.height = r.height + "px"); r.style && Object.keys(r.style).forEach(function (e) { t.style[e] = r.style[e]; }); var e = null; "function" == typeof r.onclone && (e = r.onclone(t)); return Promise.resolve(e).then(function () { return t; }); }).then(function (e) { var n = r.width || f.width(e), o = r.height || f.height(e); return Promise.resolve(e).then(function (e) { return e.setAttribute("xmlns", "http://www.w3.org/1999/xhtml"), (new XMLSerializer).serializeToString(e); }).then(f.escapeXhtml).then(function (e) { var t = (f.isDimensionMissing(n) ? ' width="100%"' : " width=\"".concat(n, "\"")) + (f.isDimensionMissing(o) ? ' height="100%"' : " height=\"".concat(o, "\"")); return "<svg xmlns=\"http://www.w3.org/2000/svg\"".concat((f.isDimensionMissing(n) ? "" : " width=\"".concat(n, "\"")) + (f.isDimensionMissing(o) ? "" : " height=\"".concat(o, "\"")), "><foreignObject").concat(t, ">").concat(e, "</foreignObject></svg>"); }).then(function (e) { return "data:image/svg+xml;charset=utf-8," + e; }); }).then(function (e) { for (; 0 < i.length;) {
        var t = i.pop();
        t.parent.replaceChild(t.child, t.wrapper);
    } return e; }).then(function (e) { return c.impl.urlCache = [], function () { d && (document.body.removeChild(d), d = null); w && clearTimeout(w); w = setTimeout(function () { w = null, E = {}; }, 2e4); }(), e; }); }
    function i(r, i) { return m(r, i = i || {}).then(f.makeImage).then(function (e) { var t = "number" != typeof i.scale ? 1 : i.scale, n = function (e, t) { var n = i.width || f.width(e), o = i.height || f.height(e); f.isDimensionMissing(n) && (n = f.isDimensionMissing(o) ? 300 : 2 * o); f.isDimensionMissing(o) && (o = n / 2); e = document.createElement("canvas"); e.width = n * t, e.height = o * t, i.bgcolor && ((t = e.getContext("2d")).fillStyle = i.bgcolor, t.fillRect(0, 0, e.width, e.height)); return e; }(r, t), o = n.getContext("2d"); return o.msImageSmoothingEnabled = !1, o.imageSmoothingEnabled = !1, e && (o.scale(t, t), o.drawImage(e, 0, 0)), n; }); }
    var d = null;
    function p(n) { return e.resolveAll().then(function (e) { var t; return "" !== e && (t = document.createElement("style"), n.appendChild(t), t.appendChild(document.createTextNode(e))), n; }); }
    function g(e) { return n.inlineAll(e).then(function () { return e; }); }
    function y(e, t, i, u, n) { var l = c.impl.options.copyDefaultStyles ? function (t, e) { var e = function (e) { var t = []; do {
        if (e.nodeType === a) {
            var n = e.tagName;
            if (t.push(n), v.includes(n))
                break;
        }
    } while (e = e.parentNode, e); return t; }(e), n = function (e) { return ("relaxed" !== t.styleCaching ? e : e.filter(function (e, t, n) { return 0 === t || t === n.length - 1; })).join(">"); }(e); if (E[n])
        return E[n]; var o = function () { if (d)
        return d.contentWindow; var e = document.characterSet || "UTF-8", t = document.doctype, t = t ? ("<!DOCTYPE ".concat(n(t.name), " ").concat(n(t.publicId), " ") + n(t.systemId)).trim() + ">" : ""; return (d = document.createElement("iframe")).id = "domtoimage-sandbox-" + f.uid(), d.style.visibility = "hidden", d.style.position = "fixed", document.body.appendChild(d), function (e, t, n, o) { try {
        return e.contentWindow.document.write(t + "<html><head><meta charset='".concat(n, "'><title>").concat(o, "</title></head><body></body></html>")), e.contentWindow;
    }
    catch (e) { } var r = document.createElement("meta"); r.setAttribute("charset", n); try {
        var i = document.implementation.createHTMLDocument(o), u = (i.head.appendChild(r), t + i.documentElement.outerHTML);
        return e.setAttribute("srcdoc", u), e.contentWindow;
    }
    catch (e) { } return e.contentDocument.head.appendChild(r), e.contentDocument.title = o, e.contentWindow; }(d, t, e, "domtoimage-sandbox"); function n(e) { var t; return e ? ((t = document.createElement("div")).innerText = e, t.innerHTML) : ""; } }(), e = function (e, t) { var n = e.body; do {
        var o = t.pop(), o = e.createElement(o);
        n.appendChild(o), n = o;
    } while (0 < t.length); return n.textContent = "​", n; }(o.document, e), o = function (e, t) { var n = {}, o = e.getComputedStyle(t); return f.asArray(o).forEach(function (e) { n[e] = "width" === e || "height" === e ? "auto" : o.getPropertyValue(e); }), n; }(o, e); return function (e) { do {
        var t = e.parentElement;
        null !== t && t.removeChild(e), e = t;
    } while (e && "BODY" !== e.tagName); }(e), E[n] = o; }(e, t) : {}, s = n.style; f.asArray(i).forEach(function (e) { var t, n = i.getPropertyValue(e), o = l[e], r = u ? u.getPropertyValue(e) : void 0; (n !== o || u && n !== r) && (o = i.getPropertyPriority(e), r = s, n = n, o = o, t = 0 <= ["background-clip"].indexOf(e = e), o ? (r.setProperty(e, n, o), t && r.setProperty("-webkit-" + e, n, o)) : (r.setProperty(e, n), t && r.setProperty("-webkit-" + e, n))); }); }
    var w = null, E = {};
    var v = ["ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "DETAILS", "DIALOG", "DD", "DIV", "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HGROUP", "HR", "LI", "MAIN", "NAV", "OL", "P", "PRE", "SECTION", "SVG", "TABLE", "UL", "math", "svg", "BODY", "HEAD", "HTML"];
}(this);
//# sourceMappingURL=dom-to-image-more.min.js.map
var isDebug = window.location.host == 'studio.boardgamearena.com' || window.location.hash.indexOf('debug') > -1;
var log = isDebug ? console.log.bind(window.console) : function () { };
define([
    "dojo", "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock"
], function (dojo, declare) {
    return declare("bgagame.canvas", ebg.core.gamegui, new Canvas());
});
var DEFAULT_ZOOM_LEVELS = [0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
var ZoomManager = /** @class */ (function () {
    /**
     * Place the settings.element in a zoom wrapper and init zoomControls.
     *
     * @param settings: a `ZoomManagerSettings` object
     */
    function ZoomManager(settings) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        this.settings = settings;
        if (!settings.element) {
            throw new DOMException('You need to set the element to wrap in the zoom element');
        }
        this._zoomLevels = (_a = settings.zoomLevels) !== null && _a !== void 0 ? _a : DEFAULT_ZOOM_LEVELS;
        this._zoom = this.settings.defaultZoom || 1;
        if (this.settings.localStorageZoomKey) {
            var zoomStr = localStorage.getItem(this.settings.localStorageZoomKey);
            if (zoomStr) {
                this._zoom = Number(zoomStr);
            }
        }
        this.wrapper = document.createElement('div');
        this.wrapper.id = 'bga-zoom-wrapper';
        this.wrapElement(this.wrapper, settings.element);
        this.wrapper.appendChild(settings.element);
        settings.element.classList.add('bga-zoom-inner');
        if ((_b = settings.smooth) !== null && _b !== void 0 ? _b : true) {
            settings.element.dataset.smooth = 'true';
            settings.element.addEventListener('transitionend', function () { return _this.zoomOrDimensionChanged(); });
        }
        if ((_d = (_c = settings.zoomControls) === null || _c === void 0 ? void 0 : _c.visible) !== null && _d !== void 0 ? _d : true) {
            this.initZoomControls(settings);
        }
        if (this._zoom !== 1) {
            this.setZoom(this._zoom);
        }
        window.addEventListener('resize', function () {
            var _a;
            _this.zoomOrDimensionChanged();
            if ((_a = _this.settings.autoZoom) === null || _a === void 0 ? void 0 : _a.expectedWidth) {
                _this.setAutoZoom();
            }
        });
        if (window.ResizeObserver) {
            new ResizeObserver(function () { return _this.zoomOrDimensionChanged(); }).observe(settings.element);
        }
        if ((_e = this.settings.autoZoom) === null || _e === void 0 ? void 0 : _e.expectedWidth) {
            this.setAutoZoom();
        }
    }
    Object.defineProperty(ZoomManager.prototype, "zoom", {
        /**
         * Returns the zoom level
         */
        get: function () {
            return this._zoom;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ZoomManager.prototype, "zoomLevels", {
        /**
         * Returns the zoom levels
         */
        get: function () {
            return this._zoomLevels;
        },
        enumerable: false,
        configurable: true
    });
    ZoomManager.prototype.setAutoZoom = function () {
        var _this = this;
        var _a, _b, _c;
        var zoomWrapperWidth = document.getElementById('bga-zoom-wrapper').clientWidth;
        if (!zoomWrapperWidth) {
            setTimeout(function () { return _this.setAutoZoom(); }, 200);
            return;
        }
        var expectedWidth = (_a = this.settings.autoZoom) === null || _a === void 0 ? void 0 : _a.expectedWidth;
        var newZoom = this.zoom;
        while (newZoom > this._zoomLevels[0] && newZoom > ((_c = (_b = this.settings.autoZoom) === null || _b === void 0 ? void 0 : _b.minZoomLevel) !== null && _c !== void 0 ? _c : 0) && zoomWrapperWidth / newZoom < expectedWidth) {
            newZoom = this._zoomLevels[this._zoomLevels.indexOf(newZoom) - 1];
        }
        if (this._zoom == newZoom) {
            if (this.settings.localStorageZoomKey) {
                localStorage.setItem(this.settings.localStorageZoomKey, '' + this._zoom);
            }
        }
        else {
            this.setZoom(newZoom);
        }
    };
    /**
     * Sets the available zoomLevels and new zoom to the provided values.
     * @param zoomLevels the new array of zoomLevels that can be used.
     * @param newZoom if provided the zoom will be set to this value, if not the last element of the zoomLevels array will be set as the new zoom
     */
    ZoomManager.prototype.setZoomLevels = function (zoomLevels, newZoom) {
        if (!zoomLevels || zoomLevels.length <= 0) {
            return;
        }
        this._zoomLevels = zoomLevels;
        var zoomIndex = newZoom && zoomLevels.includes(newZoom) ? this._zoomLevels.indexOf(newZoom) : this._zoomLevels.length - 1;
        this.setZoom(this._zoomLevels[zoomIndex]);
    };
    /**
     * Set the zoom level. Ideally, use a zoom level in the zoomLevels range.
     * @param zoom zool level
     */
    ZoomManager.prototype.setZoom = function (zoom) {
        var _a, _b, _c, _d;
        if (zoom === void 0) { zoom = 1; }
        this._zoom = zoom;
        if (this.settings.localStorageZoomKey) {
            localStorage.setItem(this.settings.localStorageZoomKey, '' + this._zoom);
        }
        var newIndex = this._zoomLevels.indexOf(this._zoom);
        (_a = this.zoomInButton) === null || _a === void 0 ? void 0 : _a.classList.toggle('disabled', newIndex === this._zoomLevels.length - 1);
        (_b = this.zoomOutButton) === null || _b === void 0 ? void 0 : _b.classList.toggle('disabled', newIndex === 0);
        this.settings.element.style.transform = zoom === 1 ? '' : "scale(".concat(zoom, ")");
        (_d = (_c = this.settings).onZoomChange) === null || _d === void 0 ? void 0 : _d.call(_c, this._zoom);
        this.zoomOrDimensionChanged();
    };
    /**
     * Call this method for the browsers not supporting ResizeObserver, everytime the table height changes, if you know it.
     * If the browsert is recent enough (>= Safari 13.1) it will just be ignored.
     */
    ZoomManager.prototype.manualHeightUpdate = function () {
        if (!window.ResizeObserver) {
            this.zoomOrDimensionChanged();
        }
    };
    /**
     * Everytime the element dimensions changes, we update the style. And call the optional callback.
     */
    ZoomManager.prototype.zoomOrDimensionChanged = function () {
        var _a, _b;
        this.settings.element.style.width = "".concat(this.wrapper.getBoundingClientRect().width / this._zoom, "px");
        this.wrapper.style.height = "".concat(this.settings.element.getBoundingClientRect().height, "px");
        (_b = (_a = this.settings).onDimensionsChange) === null || _b === void 0 ? void 0 : _b.call(_a, this._zoom);
    };
    /**
     * Simulates a click on the Zoom-in button.
     */
    ZoomManager.prototype.zoomIn = function () {
        if (this._zoom === this._zoomLevels[this._zoomLevels.length - 1]) {
            return;
        }
        var newIndex = this._zoomLevels.indexOf(this._zoom) + 1;
        this.setZoom(newIndex === -1 ? 1 : this._zoomLevels[newIndex]);
    };
    /**
     * Simulates a click on the Zoom-out button.
     */
    ZoomManager.prototype.zoomOut = function () {
        if (this._zoom === this._zoomLevels[0]) {
            return;
        }
        var newIndex = this._zoomLevels.indexOf(this._zoom) - 1;
        this.setZoom(newIndex === -1 ? 1 : this._zoomLevels[newIndex]);
    };
    /**
     * Changes the color of the zoom controls.
     */
    ZoomManager.prototype.setZoomControlsColor = function (color) {
        if (this.zoomControls) {
            this.zoomControls.dataset.color = color;
        }
    };
    /**
     * Set-up the zoom controls
     * @param settings a `ZoomManagerSettings` object.
     */
    ZoomManager.prototype.initZoomControls = function (settings) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        this.zoomControls = document.createElement('div');
        this.zoomControls.id = 'bga-zoom-controls';
        this.zoomControls.dataset.position = (_b = (_a = settings.zoomControls) === null || _a === void 0 ? void 0 : _a.position) !== null && _b !== void 0 ? _b : 'top-right';
        this.zoomOutButton = document.createElement('button');
        this.zoomOutButton.type = 'button';
        this.zoomOutButton.addEventListener('click', function () { return _this.zoomOut(); });
        if ((_c = settings.zoomControls) === null || _c === void 0 ? void 0 : _c.customZoomOutElement) {
            settings.zoomControls.customZoomOutElement(this.zoomOutButton);
        }
        else {
            this.zoomOutButton.classList.add("bga-zoom-out-icon");
        }
        this.zoomInButton = document.createElement('button');
        this.zoomInButton.type = 'button';
        this.zoomInButton.addEventListener('click', function () { return _this.zoomIn(); });
        if ((_d = settings.zoomControls) === null || _d === void 0 ? void 0 : _d.customZoomInElement) {
            settings.zoomControls.customZoomInElement(this.zoomInButton);
        }
        else {
            this.zoomInButton.classList.add("bga-zoom-in-icon");
        }
        this.zoomControls.appendChild(this.zoomOutButton);
        this.zoomControls.appendChild(this.zoomInButton);
        this.wrapper.appendChild(this.zoomControls);
        this.setZoomControlsColor((_f = (_e = settings.zoomControls) === null || _e === void 0 ? void 0 : _e.color) !== null && _f !== void 0 ? _f : 'black');
    };
    /**
     * Wraps an element around an existing DOM element
     * @param wrapper the wrapper element
     * @param element the existing element
     */
    ZoomManager.prototype.wrapElement = function (wrapper, element) {
        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
    };
    return ZoomManager;
}());
var BgaAnimation = /** @class */ (function () {
    function BgaAnimation(animationFunction, settings) {
        this.animationFunction = animationFunction;
        this.settings = settings;
        this.played = null;
        this.result = null;
        this.playWhenNoAnimation = false;
    }
    return BgaAnimation;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Just use playSequence from animationManager
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function attachWithAnimation(animationManager, animation) {
    var _a;
    var settings = animation.settings;
    var element = settings.animation.settings.element;
    var fromRect = element.getBoundingClientRect();
    settings.animation.settings.fromRect = fromRect;
    settings.attachElement.appendChild(element);
    (_a = settings.afterAttach) === null || _a === void 0 ? void 0 : _a.call(settings, element, settings.attachElement);
    return animationManager.play(settings.animation);
}
var BgaAttachWithAnimation = /** @class */ (function (_super) {
    __extends(BgaAttachWithAnimation, _super);
    function BgaAttachWithAnimation(settings) {
        var _this = _super.call(this, attachWithAnimation, settings) || this;
        _this.playWhenNoAnimation = true;
        return _this;
    }
    return BgaAttachWithAnimation;
}(BgaAnimation));
/**
 * Just use playSequence from animationManager
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function cumulatedAnimations(animationManager, animation) {
    return animationManager.playSequence(animation.settings.animations);
}
var BgaCumulatedAnimation = /** @class */ (function (_super) {
    __extends(BgaCumulatedAnimation, _super);
    function BgaCumulatedAnimation(settings) {
        var _this = _super.call(this, cumulatedAnimations, settings) || this;
        _this.playWhenNoAnimation = true;
        return _this;
    }
    return BgaCumulatedAnimation;
}(BgaAnimation));
/**
 * Just does nothing for the duration
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function pauseAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a;
        var settings = animation.settings;
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        setTimeout(function () { return success(); }, duration);
    });
    return promise;
}
var BgaPauseAnimation = /** @class */ (function (_super) {
    __extends(BgaPauseAnimation, _super);
    function BgaPauseAnimation(settings) {
        return _super.call(this, pauseAnimation, settings) || this;
    }
    return BgaPauseAnimation;
}(BgaAnimation));
/**
 * Show the element at the center of the screen
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function showScreenCenterAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c;
        var settings = animation.settings;
        var element = settings.element;
        var elementBR = element.getBoundingClientRect();
        var xCenter = (elementBR.left + elementBR.right) / 2;
        var yCenter = (elementBR.top + elementBR.bottom) / 2;
        var x = xCenter - (window.innerWidth / 2);
        var y = yCenter - (window.innerHeight / 2);
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        element.style.zIndex = "".concat((_b = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _b !== void 0 ? _b : 10);
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms linear");
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_c = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _c !== void 0 ? _c : 0, "deg)");
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaShowScreenCenterAnimation = /** @class */ (function (_super) {
    __extends(BgaShowScreenCenterAnimation, _super);
    function BgaShowScreenCenterAnimation(settings) {
        return _super.call(this, showScreenCenterAnimation, settings) || this;
    }
    return BgaShowScreenCenterAnimation;
}(BgaAnimation));
/**
 * Linear slide of the element from origin to destination.
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function slideAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d;
        var settings = animation.settings;
        var element = settings.element;
        var _e = getDeltaCoordinates(element, settings), x = _e.x, y = _e.y;
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        element.style.zIndex = "".concat((_b = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _b !== void 0 ? _b : 10);
        element.style.transition = null;
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_c = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _c !== void 0 ? _c : 0, "deg)");
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionCancel);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms linear");
        element.offsetHeight;
        element.style.transform = (_d = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _d !== void 0 ? _d : null;
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaSlideAnimation = /** @class */ (function (_super) {
    __extends(BgaSlideAnimation, _super);
    function BgaSlideAnimation(settings) {
        return _super.call(this, slideAnimation, settings) || this;
    }
    return BgaSlideAnimation;
}(BgaAnimation));
/**
 * Linear slide of the element from origin to destination.
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function slideToAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d;
        var settings = animation.settings;
        var element = settings.element;
        var _e = getDeltaCoordinates(element, settings), x = _e.x, y = _e.y;
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        element.style.zIndex = "".concat((_b = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _b !== void 0 ? _b : 10);
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms linear");
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_c = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _c !== void 0 ? _c : 0, "deg) scale(").concat((_d = settings.scale) !== null && _d !== void 0 ? _d : 1, ")");
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaSlideToAnimation = /** @class */ (function (_super) {
    __extends(BgaSlideToAnimation, _super);
    function BgaSlideToAnimation(settings) {
        return _super.call(this, slideToAnimation, settings) || this;
    }
    return BgaSlideToAnimation;
}(BgaAnimation));
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var AnimationManager = /** @class */ (function () {
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `AnimationManagerSettings` object
     */
    function AnimationManager(game, settings) {
        this.game = game;
        this.settings = settings;
        this.zoomManager = settings === null || settings === void 0 ? void 0 : settings.zoomManager;
        if (!game) {
            throw new Error('You must set your game as the first parameter of AnimationManager');
        }
    }
    AnimationManager.prototype.getZoomManager = function () {
        return this.zoomManager;
    };
    /**
     * Set the zoom manager, to get the scale of the current game.
     *
     * @param zoomManager the zoom manager
     */
    AnimationManager.prototype.setZoomManager = function (zoomManager) {
        this.zoomManager = zoomManager;
    };
    AnimationManager.prototype.getSettings = function () {
        return this.settings;
    };
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    AnimationManager.prototype.animationsActive = function () {
        return document.visibilityState !== 'hidden' && !this.game.instantaneousMode;
    };
    /**
     * Plays an animation if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @param animation the animation to play
     * @returns the animation promise.
     */
    AnimationManager.prototype.play = function (animation) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __awaiter(this, void 0, void 0, function () {
            var settings, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        animation.played = animation.playWhenNoAnimation || this.animationsActive();
                        if (!animation.played) return [3 /*break*/, 2];
                        settings = animation.settings;
                        (_a = settings.animationStart) === null || _a === void 0 ? void 0 : _a.call(settings, animation);
                        (_b = settings.element) === null || _b === void 0 ? void 0 : _b.classList.add((_c = settings.animationClass) !== null && _c !== void 0 ? _c : 'bga-animations_animated');
                        animation.settings = __assign(__assign({}, animation.settings), { duration: (_e = (_d = this.settings) === null || _d === void 0 ? void 0 : _d.duration) !== null && _e !== void 0 ? _e : 500, scale: (_g = (_f = this.zoomManager) === null || _f === void 0 ? void 0 : _f.zoom) !== null && _g !== void 0 ? _g : undefined });
                        _m = animation;
                        return [4 /*yield*/, animation.animationFunction(this, animation)];
                    case 1:
                        _m.result = _o.sent();
                        (_j = (_h = animation.settings).animationEnd) === null || _j === void 0 ? void 0 : _j.call(_h, animation);
                        (_k = settings.element) === null || _k === void 0 ? void 0 : _k.classList.remove((_l = settings.animationClass) !== null && _l !== void 0 ? _l : 'bga-animations_animated');
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, Promise.resolve(animation)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Plays multiple animations in parallel.
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playParallel = function (animations) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(animations.map(function (animation) { return _this.play(animation); }))];
            });
        });
    };
    /**
     * Plays multiple animations in sequence (the second when the first ends, ...).
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playSequence = function (animations) {
        return __awaiter(this, void 0, void 0, function () {
            var result, others;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!animations.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.play(animations[0])];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.playSequence(animations.slice(1))];
                    case 2:
                        others = _a.sent();
                        return [2 /*return*/, __spreadArray([result], others, true)];
                    case 3: return [2 /*return*/, Promise.resolve([])];
                }
            });
        });
    };
    /**
     * Plays multiple animations with a delay between each animation start.
     *
     * @param animations the animations to play
     * @param delay the delay (in ms)
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playWithDelay = function (animations, delay) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                promise = new Promise(function (success) {
                    var promises = [];
                    var _loop_1 = function (i) {
                        setTimeout(function () {
                            promises.push(_this.play(animations[i]));
                            if (i == animations.length - 1) {
                                Promise.all(promises).then(function (result) {
                                    success(result);
                                });
                            }
                        }, i * delay);
                    };
                    for (var i = 0; i < animations.length; i++) {
                        _loop_1(i);
                    }
                });
                return [2 /*return*/, promise];
            });
        });
    };
    /**
     * Attach an element to a parent, then play animation from element's origin to its new position.
     *
     * @param animation the animation function
     * @param attachElement the destination parent
     * @returns a promise when animation ends
     */
    AnimationManager.prototype.attachWithAnimation = function (animation, attachElement) {
        var attachWithAnimation = new BgaAttachWithAnimation({
            animation: animation,
            attachElement: attachElement
        });
        return this.play(attachWithAnimation);
    };
    return AnimationManager;
}());
function shouldAnimate(settings) {
    var _a;
    return document.visibilityState !== 'hidden' && !((_a = settings === null || settings === void 0 ? void 0 : settings.game) === null || _a === void 0 ? void 0 : _a.instantaneousMode);
}
/**
 * Return the x and y delta, based on the animation settings;
 *
 * @param settings an `AnimationSettings` object
 * @returns a promise when animation ends
 */
function getDeltaCoordinates(element, settings) {
    var _a;
    if (!settings.fromDelta && !settings.fromRect && !settings.fromElement) {
        throw new Error("[bga-animation] fromDelta, fromRect or fromElement need to be set");
    }
    var x = 0;
    var y = 0;
    if (settings.fromDelta) {
        x = settings.fromDelta.x;
        y = settings.fromDelta.y;
    }
    else {
        var originBR = (_a = settings.fromRect) !== null && _a !== void 0 ? _a : settings.fromElement.getBoundingClientRect();
        // TODO make it an option ?
        var originalTransform = element.style.transform;
        element.style.transform = '';
        var destinationBR = element.getBoundingClientRect();
        element.style.transform = originalTransform;
        x = (destinationBR.left + destinationBR.right) / 2 - (originBR.left + originBR.right) / 2;
        y = (destinationBR.top + destinationBR.bottom) / 2 - (originBR.top + originBR.bottom) / 2;
    }
    if (settings.scale) {
        x /= settings.scale;
        y /= settings.scale;
    }
    return { x: x, y: y };
}
function logAnimation(animationManager, animation) {
    var settings = animation.settings;
    var element = settings.element;
    if (element) {
        console.log(animation, settings, element, element.getBoundingClientRect(), element.style.transform);
    }
    else {
        console.log(animation, settings);
    }
    return Promise.resolve(false);
}
/**
 * The abstract stock. It shouldn't be used directly, use stocks that extends it.
 */
var CardStock = /** @class */ (function () {
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    function CardStock(manager, element, settings) {
        this.manager = manager;
        this.element = element;
        this.settings = settings;
        this.cards = [];
        this.selectedCards = [];
        this.selectionMode = 'none';
        manager.addStock(this);
        element === null || element === void 0 ? void 0 : element.classList.add('card-stock' /*, this.constructor.name.split(/(?=[A-Z])/).join('-').toLowerCase()* doesn't work in production because of minification */);
        this.bindClick();
        this.sort = settings === null || settings === void 0 ? void 0 : settings.sort;
    }
    /**
     * @returns the cards on the stock
     */
    CardStock.prototype.getCards = function () {
        return this.cards.slice();
    };
    /**
     * @returns if the stock is empty
     */
    CardStock.prototype.isEmpty = function () {
        return !this.cards.length;
    };
    /**
     * @returns the selected cards
     */
    CardStock.prototype.getSelection = function () {
        return this.selectedCards.slice();
    };
    /**
     * @returns the selected cards
     */
    CardStock.prototype.isSelected = function (card) {
        var _this = this;
        return this.selectedCards.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
    };
    /**
     * @param card a card
     * @returns if the card is present in the stock
     */
    CardStock.prototype.contains = function (card) {
        var _this = this;
        return this.cards.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
    };
    /**
     * @param card a card in the stock
     * @returns the HTML element generated for the card
     */
    CardStock.prototype.getCardElement = function (card) {
        return this.manager.getCardElement(card);
    };
    /**
     * Checks if the card can be added. By default, only if it isn't already present in the stock.
     *
     * @param card the card to add
     * @param settings the addCard settings
     * @returns if the card can be added
     */
    CardStock.prototype.canAddCard = function (card, settings) {
        return !this.contains(card);
    };
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    CardStock.prototype.addCard = function (card, animation, settings) {
        var _this = this;
        var _a, _b, _c;
        if (!this.canAddCard(card, settings)) {
            return Promise.resolve(false);
        }
        var promise;
        // we check if card is in a stock
        var originStock = this.manager.getCardStock(card);
        var index = this.getNewCardIndex(card);
        var settingsWithIndex = __assign({ index: index }, (settings !== null && settings !== void 0 ? settings : {}));
        var updateInformations = (_a = settingsWithIndex.updateInformations) !== null && _a !== void 0 ? _a : true;
        if (originStock === null || originStock === void 0 ? void 0 : originStock.contains(card)) {
            var element = this.getCardElement(card);
            promise = this.moveFromOtherStock(card, element, __assign(__assign({}, animation), { fromStock: originStock }), settingsWithIndex);
            if (!updateInformations) {
                element.dataset.side = ((_b = settingsWithIndex === null || settingsWithIndex === void 0 ? void 0 : settingsWithIndex.visible) !== null && _b !== void 0 ? _b : this.manager.isCardVisible(card)) ? 'front' : 'back';
            }
        }
        else if ((animation === null || animation === void 0 ? void 0 : animation.fromStock) && animation.fromStock.contains(card)) {
            var element = this.getCardElement(card);
            promise = this.moveFromOtherStock(card, element, animation, settingsWithIndex);
        }
        else {
            var element = this.manager.createCardElement(card, ((_c = settingsWithIndex === null || settingsWithIndex === void 0 ? void 0 : settingsWithIndex.visible) !== null && _c !== void 0 ? _c : this.manager.isCardVisible(card)));
            promise = this.moveFromElement(card, element, animation, settingsWithIndex);
        }
        if (settingsWithIndex.index !== null && settingsWithIndex.index !== undefined) {
            this.cards.splice(index, 0, card);
        }
        else {
            this.cards.push(card);
        }
        if (updateInformations) { // after splice/push
            this.manager.updateCardInformations(card);
        }
        if (!promise) {
            console.warn("CardStock.addCard didn't return a Promise");
            promise = Promise.resolve(false);
        }
        if (this.selectionMode !== 'none') {
            // make selectable only at the end of the animation
            promise.then(function () { var _a; return _this.setSelectableCard(card, (_a = settingsWithIndex.selectable) !== null && _a !== void 0 ? _a : true); });
        }
        return promise;
    };
    CardStock.prototype.getNewCardIndex = function (card) {
        if (this.sort) {
            var otherCards = this.getCards();
            for (var i = 0; i < otherCards.length; i++) {
                var otherCard = otherCards[i];
                if (this.sort(card, otherCard) < 0) {
                    return i;
                }
            }
            return otherCards.length;
        }
        else {
            return undefined;
        }
    };
    CardStock.prototype.addCardElementToParent = function (cardElement, settings) {
        var _a;
        var parent = (_a = settings === null || settings === void 0 ? void 0 : settings.forceToElement) !== null && _a !== void 0 ? _a : this.element;
        if ((settings === null || settings === void 0 ? void 0 : settings.index) === null || (settings === null || settings === void 0 ? void 0 : settings.index) === undefined || !parent.children.length || (settings === null || settings === void 0 ? void 0 : settings.index) >= parent.children.length) {
            parent.appendChild(cardElement);
        }
        else {
            parent.insertBefore(cardElement, parent.children[settings.index]);
        }
    };
    CardStock.prototype.moveFromOtherStock = function (card, cardElement, animation, settings) {
        var promise;
        var element = animation.fromStock.contains(card) ? this.manager.getCardElement(card) : animation.fromStock.element;
        var fromRect = element.getBoundingClientRect();
        this.addCardElementToParent(cardElement, settings);
        this.removeSelectionClassesFromElement(cardElement);
        promise = this.animationFromElement(cardElement, fromRect, {
            originalSide: animation.originalSide,
            rotationDelta: animation.rotationDelta,
            animation: animation.animation,
        });
        // in the case the card was move inside the same stock we don't remove it
        if (animation.fromStock && animation.fromStock != this) {
            animation.fromStock.removeCard(card);
        }
        if (!promise) {
            console.warn("CardStock.moveFromOtherStock didn't return a Promise");
            promise = Promise.resolve(false);
        }
        return promise;
    };
    CardStock.prototype.moveFromElement = function (card, cardElement, animation, settings) {
        var promise;
        this.addCardElementToParent(cardElement, settings);
        if (animation) {
            if (animation.fromStock) {
                promise = this.animationFromElement(cardElement, animation.fromStock.element.getBoundingClientRect(), {
                    originalSide: animation.originalSide,
                    rotationDelta: animation.rotationDelta,
                    animation: animation.animation,
                });
                animation.fromStock.removeCard(card);
            }
            else if (animation.fromElement) {
                promise = this.animationFromElement(cardElement, animation.fromElement.getBoundingClientRect(), {
                    originalSide: animation.originalSide,
                    rotationDelta: animation.rotationDelta,
                    animation: animation.animation,
                });
            }
        }
        else {
            promise = Promise.resolve(false);
        }
        if (!promise) {
            console.warn("CardStock.moveFromElement didn't return a Promise");
            promise = Promise.resolve(false);
        }
        return promise;
    };
    /**
     * Add an array of cards to the stock.
     *
     * @param cards the cards to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @param shift if number, the number of milliseconds between each card. if true, chain animations
     */
    CardStock.prototype.addCards = function (cards, animation, settings, shift) {
        if (shift === void 0) { shift = false; }
        return __awaiter(this, void 0, void 0, function () {
            var promises, result, others, _loop_2, i, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.manager.animationsActive()) {
                            shift = false;
                        }
                        promises = [];
                        if (!(shift === true)) return [3 /*break*/, 4];
                        if (!cards.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.addCard(cards[0], animation, settings)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.addCards(cards.slice(1), animation, settings, shift)];
                    case 2:
                        others = _a.sent();
                        return [2 /*return*/, result || others];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        if (typeof shift === 'number') {
                            _loop_2 = function (i) {
                                setTimeout(function () { return promises.push(_this.addCard(cards[i], animation, settings)); }, i * shift);
                            };
                            for (i = 0; i < cards.length; i++) {
                                _loop_2(i);
                            }
                        }
                        else {
                            promises = cards.map(function (card) { return _this.addCard(card, animation, settings); });
                        }
                        _a.label = 5;
                    case 5: return [4 /*yield*/, Promise.all(promises)];
                    case 6:
                        results = _a.sent();
                        return [2 /*return*/, results.some(function (result) { return result; })];
                }
            });
        });
    };
    /**
     * Remove a card from the stock.
     *
     * @param card the card to remove
     * @param settings a `RemoveCardSettings` object
     */
    CardStock.prototype.removeCard = function (card, settings) {
        if (this.contains(card) && this.element.contains(this.getCardElement(card))) {
            this.manager.removeCard(card, settings);
        }
        this.cardRemoved(card, settings);
    };
    /**
     * Notify the stock that a card is removed.
     *
     * @param card the card to remove
     * @param settings a `RemoveCardSettings` object
     */
    CardStock.prototype.cardRemoved = function (card, settings) {
        var _this = this;
        var index = this.cards.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
        if (this.selectedCards.find(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); })) {
            this.unselectCard(card);
        }
    };
    /**
     * Remove a set of card from the stock.
     *
     * @param cards the cards to remove
     * @param settings a `RemoveCardSettings` object
     */
    CardStock.prototype.removeCards = function (cards, settings) {
        var _this = this;
        cards.forEach(function (card) { return _this.removeCard(card, settings); });
    };
    /**
     * Remove all cards from the stock.
     * @param settings a `RemoveCardSettings` object
     */
    CardStock.prototype.removeAll = function (settings) {
        var _this = this;
        var cards = this.getCards(); // use a copy of the array as we iterate and modify it at the same time
        cards.forEach(function (card) { return _this.removeCard(card, settings); });
    };
    /**
     * Set if the stock is selectable, and if yes if it can be multiple.
     * If set to 'none', it will unselect all selected cards.
     *
     * @param selectionMode the selection mode
     * @param selectableCards the selectable cards (all if unset). Calls `setSelectableCards` method
     */
    CardStock.prototype.setSelectionMode = function (selectionMode, selectableCards) {
        var _this = this;
        if (selectionMode !== this.selectionMode) {
            this.unselectAll(true);
        }
        this.cards.forEach(function (card) { return _this.setSelectableCard(card, selectionMode != 'none'); });
        this.element.classList.toggle('bga-cards_selectable-stock', selectionMode != 'none');
        this.selectionMode = selectionMode;
        if (selectionMode === 'none') {
            this.getCards().forEach(function (card) { return _this.removeSelectionClasses(card); });
        }
        else {
            this.setSelectableCards(selectableCards !== null && selectableCards !== void 0 ? selectableCards : this.getCards());
        }
    };
    CardStock.prototype.setSelectableCard = function (card, selectable) {
        if (this.selectionMode === 'none') {
            return;
        }
        var element = this.getCardElement(card);
        var selectableCardsClass = this.getSelectableCardClass();
        var unselectableCardsClass = this.getUnselectableCardClass();
        if (selectableCardsClass) {
            element.classList.toggle(selectableCardsClass, selectable);
        }
        if (unselectableCardsClass) {
            element.classList.toggle(unselectableCardsClass, !selectable);
        }
        if (!selectable && this.isSelected(card)) {
            this.unselectCard(card, true);
        }
    };
    /**
     * Set the selectable class for each card.
     *
     * @param selectableCards the selectable cards. If unset, all cards are marked selectable. Default unset.
     */
    CardStock.prototype.setSelectableCards = function (selectableCards) {
        var _this = this;
        if (this.selectionMode === 'none') {
            return;
        }
        var selectableCardsIds = (selectableCards !== null && selectableCards !== void 0 ? selectableCards : this.getCards()).map(function (card) { return _this.manager.getId(card); });
        this.cards.forEach(function (card) {
            return _this.setSelectableCard(card, selectableCardsIds.includes(_this.manager.getId(card)));
        });
    };
    /**
     * Set selected state to a card.
     *
     * @param card the card to select
     */
    CardStock.prototype.selectCard = function (card, silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        if (this.selectionMode == 'none') {
            return;
        }
        var element = this.getCardElement(card);
        var selectableCardsClass = this.getSelectableCardClass();
        if (!element.classList.contains(selectableCardsClass)) {
            return;
        }
        if (this.selectionMode === 'single') {
            this.cards.filter(function (c) { return _this.manager.getId(c) != _this.manager.getId(card); }).forEach(function (c) { return _this.unselectCard(c, true); });
        }
        var selectedCardsClass = this.getSelectedCardClass();
        element.classList.add(selectedCardsClass);
        this.selectedCards.push(card);
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), card);
        }
    };
    /**
     * Set unselected state to a card.
     *
     * @param card the card to unselect
     */
    CardStock.prototype.unselectCard = function (card, silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        var element = this.getCardElement(card);
        var selectedCardsClass = this.getSelectedCardClass();
        element.classList.remove(selectedCardsClass);
        var index = this.selectedCards.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
        if (index !== -1) {
            this.selectedCards.splice(index, 1);
        }
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), card);
        }
    };
    /**
     * Select all cards
     */
    CardStock.prototype.selectAll = function (silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        if (this.selectionMode == 'none') {
            return;
        }
        this.cards.forEach(function (c) { return _this.selectCard(c, true); });
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), null);
        }
    };
    /**
     * Unelect all cards
     */
    CardStock.prototype.unselectAll = function (silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        var cards = this.getCards(); // use a copy of the array as we iterate and modify it at the same time
        cards.forEach(function (c) { return _this.unselectCard(c, true); });
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), null);
        }
    };
    CardStock.prototype.bindClick = function () {
        var _this = this;
        var _a;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (event) {
            var cardDiv = event.target.closest('.card');
            if (!cardDiv) {
                return;
            }
            var card = _this.cards.find(function (c) { return _this.manager.getId(c) == cardDiv.id; });
            if (!card) {
                return;
            }
            _this.cardClick(card);
        });
    };
    CardStock.prototype.cardClick = function (card) {
        var _this = this;
        var _a;
        if (this.selectionMode != 'none') {
            var alreadySelected = this.selectedCards.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
            if (alreadySelected) {
                this.unselectCard(card);
            }
            else {
                this.selectCard(card);
            }
        }
        (_a = this.onCardClick) === null || _a === void 0 ? void 0 : _a.call(this, card);
    };
    /**
     * @param element The element to animate. The element is added to the destination stock before the animation starts.
     * @param fromElement The HTMLElement to animate from.
     */
    CardStock.prototype.animationFromElement = function (element, fromRect, settings) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var side, cardSides_1, animation, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        side = element.dataset.side;
                        if (settings.originalSide && settings.originalSide != side) {
                            cardSides_1 = element.getElementsByClassName('card-sides')[0];
                            cardSides_1.style.transition = 'none';
                            element.dataset.side = settings.originalSide;
                            setTimeout(function () {
                                cardSides_1.style.transition = null;
                                element.dataset.side = side;
                            });
                        }
                        animation = settings.animation;
                        if (animation) {
                            animation.settings.element = element;
                            animation.settings.fromRect = fromRect;
                        }
                        else {
                            animation = new BgaSlideAnimation({ element: element, fromRect: fromRect });
                        }
                        return [4 /*yield*/, this.manager.animationManager.play(animation)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, (_a = result === null || result === void 0 ? void 0 : result.played) !== null && _a !== void 0 ? _a : false];
                }
            });
        });
    };
    /**
     * Set the card to its front (visible) or back (not visible) side.
     *
     * @param card the card informations
     */
    CardStock.prototype.setCardVisible = function (card, visible, settings) {
        this.manager.setCardVisible(card, visible, settings);
    };
    /**
     * Flips the card.
     *
     * @param card the card informations
     */
    CardStock.prototype.flipCard = function (card, settings) {
        this.manager.flipCard(card, settings);
    };
    /**
     * @returns the class to apply to selectable cards. Use class from manager is unset.
     */
    CardStock.prototype.getSelectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectableCardClass) === undefined ? this.manager.getSelectableCardClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectableCardClass;
    };
    /**
     * @returns the class to apply to selectable cards. Use class from manager is unset.
     */
    CardStock.prototype.getUnselectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.unselectableCardClass) === undefined ? this.manager.getUnselectableCardClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.unselectableCardClass;
    };
    /**
     * @returns the class to apply to selected cards. Use class from manager is unset.
     */
    CardStock.prototype.getSelectedCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectedCardClass) === undefined ? this.manager.getSelectedCardClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectedCardClass;
    };
    CardStock.prototype.removeSelectionClasses = function (card) {
        this.removeSelectionClassesFromElement(this.getCardElement(card));
    };
    CardStock.prototype.removeSelectionClassesFromElement = function (cardElement) {
        var selectableCardsClass = this.getSelectableCardClass();
        var unselectableCardsClass = this.getUnselectableCardClass();
        var selectedCardsClass = this.getSelectedCardClass();
        cardElement.classList.remove(selectableCardsClass, unselectableCardsClass, selectedCardsClass);
    };
    return CardStock;
}());
/**
 * A stock with manually placed cards
 */
var ManualPositionStock = /** @class */ (function (_super) {
    __extends(ManualPositionStock, _super);
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    function ManualPositionStock(manager, element, settings, updateDisplay) {
        var _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        _this.updateDisplay = updateDisplay;
        element.classList.add('manual-position-stock');
        return _this;
    }
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    ManualPositionStock.prototype.addCard = function (card, animation, settings) {
        var promise = _super.prototype.addCard.call(this, card, animation, settings);
        this.updateDisplay(this.element, this.getCards(), card, this);
        return promise;
    };
    ManualPositionStock.prototype.cardRemoved = function (card) {
        _super.prototype.cardRemoved.call(this, card);
        this.updateDisplay(this.element, this.getCards(), card, this);
    };
    return ManualPositionStock;
}(CardStock));
var AllVisibleDeck = /** @class */ (function (_super) {
    __extends(AllVisibleDeck, _super);
    function AllVisibleDeck(manager, element, settings) {
        var _this = this;
        var _a;
        _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('all-visible-deck');
        var cardWidth = _this.manager.getCardWidth();
        var cardHeight = _this.manager.getCardHeight();
        if (cardWidth && cardHeight) {
            _this.element.style.setProperty('--width', "".concat(cardWidth, "px"));
            _this.element.style.setProperty('--height', "".concat(cardHeight, "px"));
        }
        else {
            throw new Error("You need to set cardWidth and cardHeight in the card manager to use Deck.");
        }
        element.style.setProperty('--shift', (_a = settings.shift) !== null && _a !== void 0 ? _a : '3px');
        return _this;
    }
    AllVisibleDeck.prototype.addCard = function (card, animation, settings) {
        var promise;
        var order = this.cards.length;
        promise = _super.prototype.addCard.call(this, card, animation, settings);
        var cardId = this.manager.getId(card);
        var cardDiv = document.getElementById(cardId);
        cardDiv.style.setProperty('--order', '' + order);
        this.element.style.setProperty('--tile-count', '' + this.cards.length);
        return promise;
    };
    /**
     * Set opened state. If true, all cards will be entirely visible.
     *
     * @param opened indicate if deck must be always opened. If false, will open only on hover/touch
     */
    AllVisibleDeck.prototype.setOpened = function (opened) {
        this.element.classList.toggle('opened', opened);
    };
    AllVisibleDeck.prototype.cardRemoved = function (card) {
        var _this = this;
        _super.prototype.cardRemoved.call(this, card);
        this.cards.forEach(function (c, index) {
            var cardId = _this.manager.getId(c);
            var cardDiv = document.getElementById(cardId);
            cardDiv.style.setProperty('--order', '' + index);
        });
        this.element.style.setProperty('--tile-count', '' + this.cards.length);
    };
    return AllVisibleDeck;
}(CardStock));
/**
 * A stock to make cards disappear (to automatically remove discarded cards, or to represent a bag)
 */
var VoidStock = /** @class */ (function (_super) {
    __extends(VoidStock, _super);
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    function VoidStock(manager, element) {
        var _this = _super.call(this, manager, element) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('void-stock');
        return _this;
    }
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardToVoidStockSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    VoidStock.prototype.addCard = function (card, animation, settings) {
        var _this = this;
        var _a;
        var promise = _super.prototype.addCard.call(this, card, animation, settings);
        // center the element
        var cardElement = this.getCardElement(card);
        var originalLeft = cardElement.style.left;
        var originalTop = cardElement.style.top;
        cardElement.style.left = "".concat((this.element.clientWidth - cardElement.clientWidth) / 2, "px");
        cardElement.style.top = "".concat((this.element.clientHeight - cardElement.clientHeight) / 2, "px");
        if (!promise) {
            console.warn("VoidStock.addCard didn't return a Promise");
            promise = Promise.resolve(false);
        }
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.remove) !== null && _a !== void 0 ? _a : true) {
            return promise.then(function (result) {
                _this.removeCard(card);
                return result;
            });
        }
        else {
            cardElement.style.left = originalLeft;
            cardElement.style.top = originalTop;
            return promise;
        }
    };
    return VoidStock;
}(CardStock));
/**
 * A basic stock for a list of cards, based on flex.
 */
var LineStock = /** @class */ (function (_super) {
    __extends(LineStock, _super);
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `LineStockSettings` object
     */
    function LineStock(manager, element, settings) {
        var _this = this;
        var _a, _b, _c, _d;
        _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('line-stock');
        element.dataset.center = ((_a = settings === null || settings === void 0 ? void 0 : settings.center) !== null && _a !== void 0 ? _a : true).toString();
        element.style.setProperty('--wrap', (_b = settings === null || settings === void 0 ? void 0 : settings.wrap) !== null && _b !== void 0 ? _b : 'wrap');
        element.style.setProperty('--direction', (_c = settings === null || settings === void 0 ? void 0 : settings.direction) !== null && _c !== void 0 ? _c : 'row');
        element.style.setProperty('--gap', (_d = settings === null || settings === void 0 ? void 0 : settings.gap) !== null && _d !== void 0 ? _d : '8px');
        return _this;
    }
    return LineStock;
}(CardStock));
/**
 * A stock with fixed slots (some can be empty)
 */
var SlotStock = /** @class */ (function (_super) {
    __extends(SlotStock, _super);
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `SlotStockSettings` object
     */
    function SlotStock(manager, element, settings) {
        var _this = this;
        var _a, _b;
        _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        _this.slotsIds = [];
        _this.slots = [];
        element.classList.add('slot-stock');
        _this.mapCardToSlot = settings.mapCardToSlot;
        _this.slotsIds = (_a = settings.slotsIds) !== null && _a !== void 0 ? _a : [];
        _this.slotClasses = (_b = settings.slotClasses) !== null && _b !== void 0 ? _b : [];
        _this.slotsIds.forEach(function (slotId) {
            _this.createSlot(slotId);
        });
        return _this;
    }
    SlotStock.prototype.createSlot = function (slotId) {
        var _a;
        this.slots[slotId] = document.createElement("div");
        this.slots[slotId].dataset.slotId = slotId;
        this.element.appendChild(this.slots[slotId]);
        (_a = this.slots[slotId].classList).add.apply(_a, __spreadArray(['slot'], this.slotClasses, true));
    };
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardToSlotSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    SlotStock.prototype.addCard = function (card, animation, settings) {
        var _a, _b;
        var slotId = (_a = settings === null || settings === void 0 ? void 0 : settings.slot) !== null && _a !== void 0 ? _a : (_b = this.mapCardToSlot) === null || _b === void 0 ? void 0 : _b.call(this, card);
        if (slotId === undefined) {
            throw new Error("Impossible to add card to slot : no SlotId. Add slotId to settings or set mapCardToSlot to SlotCard constructor.");
        }
        if (!this.slots[slotId]) {
            throw new Error("Impossible to add card to slot \"".concat(slotId, "\" : slot \"").concat(slotId, "\" doesn't exists."));
        }
        var newSettings = __assign(__assign({}, settings), { forceToElement: this.slots[slotId] });
        return _super.prototype.addCard.call(this, card, animation, newSettings);
    };
    /**
     * Change the slots ids. Will empty the stock before re-creating the slots.
     *
     * @param slotsIds the new slotsIds. Will replace the old ones.
     */
    SlotStock.prototype.setSlotsIds = function (slotsIds) {
        var _this = this;
        if (slotsIds.length == this.slotsIds.length && slotsIds.every(function (slotId, index) { return _this.slotsIds[index] === slotId; })) {
            // no change
            return;
        }
        this.removeAll();
        this.element.innerHTML = '';
        this.slotsIds = slotsIds !== null && slotsIds !== void 0 ? slotsIds : [];
        this.slotsIds.forEach(function (slotId) {
            _this.createSlot(slotId);
        });
    };
    SlotStock.prototype.canAddCard = function (card, settings) {
        var _a, _b;
        if (!this.contains(card)) {
            return true;
        }
        else {
            var currentCardSlot = this.getCardElement(card).closest('.slot').dataset.slotId;
            var slotId = (_a = settings === null || settings === void 0 ? void 0 : settings.slot) !== null && _a !== void 0 ? _a : (_b = this.mapCardToSlot) === null || _b === void 0 ? void 0 : _b.call(this, card);
            return currentCardSlot != slotId;
        }
    };
    /**
     * Swap cards inside the slot stock.
     *
     * @param cards the cards to swap
     * @param settings for `updateInformations` and `selectable`
     */
    SlotStock.prototype.swapCards = function (cards, settings) {
        var _this = this;
        if (!this.mapCardToSlot) {
            throw new Error('You need to define SlotStock.mapCardToSlot to use SlotStock.swapCards');
        }
        var promises = [];
        var elements = cards.map(function (card) { return _this.manager.getCardElement(card); });
        var elementsRects = elements.map(function (element) { return element.getBoundingClientRect(); });
        var cssPositions = elements.map(function (element) { return element.style.position; });
        // we set to absolute so it doesn't mess with slide coordinates when 2 div are at the same place
        elements.forEach(function (element) { return element.style.position = 'absolute'; });
        cards.forEach(function (card, index) {
            var _a, _b;
            var cardElement = elements[index];
            var promise;
            var slotId = (_a = _this.mapCardToSlot) === null || _a === void 0 ? void 0 : _a.call(_this, card);
            _this.slots[slotId].appendChild(cardElement);
            cardElement.style.position = cssPositions[index];
            var cardIndex = _this.cards.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
            if (cardIndex !== -1) {
                _this.cards.splice(cardIndex, 1, card);
            }
            if ((_b = settings === null || settings === void 0 ? void 0 : settings.updateInformations) !== null && _b !== void 0 ? _b : true) { // after splice/push
                _this.manager.updateCardInformations(card);
            }
            _this.removeSelectionClassesFromElement(cardElement);
            promise = _this.animationFromElement(cardElement, elementsRects[index], {});
            if (!promise) {
                console.warn("CardStock.animationFromElement didn't return a Promise");
                promise = Promise.resolve(false);
            }
            promise.then(function () { var _a; return _this.setSelectableCard(card, (_a = settings === null || settings === void 0 ? void 0 : settings.selectable) !== null && _a !== void 0 ? _a : true); });
            promises.push(promise);
        });
        return Promise.all(promises);
    };
    return SlotStock;
}(LineStock));
var SlideAndBackAnimation = /** @class */ (function (_super) {
    __extends(SlideAndBackAnimation, _super);
    function SlideAndBackAnimation(manager, element, tempElement) {
        var distance = (manager.getCardWidth() + manager.getCardHeight()) / 2;
        var angle = Math.random() * Math.PI * 2;
        var fromDelta = {
            x: distance * Math.cos(angle),
            y: distance * Math.sin(angle),
        };
        return _super.call(this, {
            animations: [
                new BgaSlideToAnimation({ element: element, fromDelta: fromDelta, duration: 250 }),
                new BgaSlideAnimation({ element: element, fromDelta: fromDelta, duration: 250, animationEnd: tempElement ? (function () { return element.remove(); }) : undefined }),
            ]
        }) || this;
    }
    return SlideAndBackAnimation;
}(BgaCumulatedAnimation));
/**
 * Abstract stock to represent a deck. (pile of cards, with a fake 3d effect of thickness). *
 * Needs cardWidth and cardHeight to be set in the card manager.
 */
var Deck = /** @class */ (function (_super) {
    __extends(Deck, _super);
    function Deck(manager, element, settings) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        _this = _super.call(this, manager, element) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('deck');
        var cardWidth = _this.manager.getCardWidth();
        var cardHeight = _this.manager.getCardHeight();
        if (cardWidth && cardHeight) {
            _this.element.style.setProperty('--width', "".concat(cardWidth, "px"));
            _this.element.style.setProperty('--height', "".concat(cardHeight, "px"));
        }
        else {
            throw new Error("You need to set cardWidth and cardHeight in the card manager to use Deck.");
        }
        _this.thicknesses = (_a = settings.thicknesses) !== null && _a !== void 0 ? _a : [0, 2, 5, 10, 20, 30];
        _this.setCardNumber((_b = settings.cardNumber) !== null && _b !== void 0 ? _b : 52);
        _this.autoUpdateCardNumber = (_c = settings.autoUpdateCardNumber) !== null && _c !== void 0 ? _c : true;
        _this.autoRemovePreviousCards = (_d = settings.autoRemovePreviousCards) !== null && _d !== void 0 ? _d : true;
        var shadowDirection = (_e = settings.shadowDirection) !== null && _e !== void 0 ? _e : 'bottom-right';
        var shadowDirectionSplit = shadowDirection.split('-');
        var xShadowShift = shadowDirectionSplit.includes('right') ? 1 : (shadowDirectionSplit.includes('left') ? -1 : 0);
        var yShadowShift = shadowDirectionSplit.includes('bottom') ? 1 : (shadowDirectionSplit.includes('top') ? -1 : 0);
        _this.element.style.setProperty('--xShadowShift', '' + xShadowShift);
        _this.element.style.setProperty('--yShadowShift', '' + yShadowShift);
        if (settings.topCard) {
            _this.addCard(settings.topCard, undefined);
        }
        else if (settings.cardNumber > 0) {
            console.warn("Deck is defined with ".concat(settings.cardNumber, " cards but no top card !"));
        }
        if (settings.counter && ((_f = settings.counter.show) !== null && _f !== void 0 ? _f : true)) {
            if (settings.cardNumber === null || settings.cardNumber === undefined) {
                throw new Error("You need to set cardNumber if you want to show the counter");
            }
            else {
                _this.createCounter((_g = settings.counter.position) !== null && _g !== void 0 ? _g : 'bottom', (_h = settings.counter.extraClasses) !== null && _h !== void 0 ? _h : 'round', settings.counter.counterId);
                if ((_j = settings.counter) === null || _j === void 0 ? void 0 : _j.hideWhenEmpty) {
                    _this.element.querySelector('.bga-cards_deck-counter').classList.add('hide-when-empty');
                }
            }
        }
        _this.setCardNumber((_k = settings.cardNumber) !== null && _k !== void 0 ? _k : 52);
        return _this;
    }
    Deck.prototype.createCounter = function (counterPosition, extraClasses, counterId) {
        var left = counterPosition.includes('right') ? 100 : (counterPosition.includes('left') ? 0 : 50);
        var top = counterPosition.includes('bottom') ? 100 : (counterPosition.includes('top') ? 0 : 50);
        this.element.style.setProperty('--bga-cards-deck-left', "".concat(left, "%"));
        this.element.style.setProperty('--bga-cards-deck-top', "".concat(top, "%"));
        this.element.insertAdjacentHTML('beforeend', "\n            <div ".concat(counterId ? "id=\"".concat(counterId, "\"") : '', " class=\"bga-cards_deck-counter ").concat(extraClasses, "\"></div>\n        "));
    };
    /**
     * Get the the cards number.
     *
     * @returns the cards number
     */
    Deck.prototype.getCardNumber = function () {
        return this.cardNumber;
    };
    /**
     * Set the the cards number.
     *
     * @param cardNumber the cards number
     */
    Deck.prototype.setCardNumber = function (cardNumber, topCard) {
        var _this = this;
        if (topCard === void 0) { topCard = null; }
        if (topCard) {
            this.addCard(topCard);
        }
        this.cardNumber = cardNumber;
        this.element.dataset.empty = (this.cardNumber == 0).toString();
        var thickness = 0;
        this.thicknesses.forEach(function (threshold, index) {
            if (_this.cardNumber >= threshold) {
                thickness = index;
            }
        });
        this.element.style.setProperty('--thickness', "".concat(thickness, "px"));
        var counterDiv = this.element.querySelector('.bga-cards_deck-counter');
        if (counterDiv) {
            counterDiv.innerHTML = "".concat(cardNumber);
        }
    };
    Deck.prototype.addCard = function (card, animation, settings) {
        var _this = this;
        var _a, _b;
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _a !== void 0 ? _a : this.autoUpdateCardNumber) {
            this.setCardNumber(this.cardNumber + 1);
        }
        var promise = _super.prototype.addCard.call(this, card, animation, settings);
        if ((_b = settings === null || settings === void 0 ? void 0 : settings.autoRemovePreviousCards) !== null && _b !== void 0 ? _b : this.autoRemovePreviousCards) {
            promise.then(function () {
                var previousCards = _this.getCards().slice(0, -1); // remove last cards
                _this.removeCards(previousCards, { autoUpdateCardNumber: false });
            });
        }
        return promise;
    };
    Deck.prototype.cardRemoved = function (card, settings) {
        var _a;
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _a !== void 0 ? _a : this.autoUpdateCardNumber) {
            this.setCardNumber(this.cardNumber - 1);
        }
        _super.prototype.cardRemoved.call(this, card, settings);
    };
    Deck.prototype.getTopCard = function () {
        var cards = this.getCards();
        return cards.length ? cards[cards.length - 1] : null;
    };
    /**
     * Shows a shuffle animation on the deck
     *
     * @param animatedCardsMax number of animated cards for shuffle animation.
     * @param fakeCardSetter a function to generate a fake card for animation. Required if the card id is not based on a numerci `id` field, or if you want to set custom card back
     * @returns promise when animation ends
     */
    Deck.prototype.shuffle = function (animatedCardsMax, fakeCardSetter) {
        if (animatedCardsMax === void 0) { animatedCardsMax = 10; }
        return __awaiter(this, void 0, void 0, function () {
            var animatedCards, elements, i, newCard, newElement;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.manager.animationsActive()) {
                            return [2 /*return*/, Promise.resolve(false)]; // we don't execute as it's just visual temporary stuff
                        }
                        animatedCards = Math.min(10, animatedCardsMax, this.getCardNumber());
                        if (!(animatedCards > 1)) return [3 /*break*/, 2];
                        elements = [this.getCardElement(this.getTopCard())];
                        for (i = elements.length; i <= animatedCards; i++) {
                            newCard = {};
                            if (fakeCardSetter) {
                                fakeCardSetter(newCard, i);
                            }
                            else {
                                newCard.id = -100000 + i;
                            }
                            newElement = this.manager.createCardElement(newCard, false);
                            newElement.dataset.tempCardForShuffleAnimation = 'true';
                            this.element.prepend(newElement);
                            elements.push(newElement);
                        }
                        return [4 /*yield*/, this.manager.animationManager.playWithDelay(elements.map(function (element) { return new SlideAndBackAnimation(_this.manager, element, element.dataset.tempCardForShuffleAnimation == 'true'); }), 50)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2: return [2 /*return*/, Promise.resolve(false)];
                }
            });
        });
    };
    return Deck;
}(CardStock));
var CardManager = /** @class */ (function () {
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `CardManagerSettings` object
     */
    function CardManager(game, settings) {
        var _a;
        this.game = game;
        this.settings = settings;
        this.stocks = [];
        this.updateFrontTimeoutId = [];
        this.updateBackTimeoutId = [];
        this.animationManager = (_a = settings.animationManager) !== null && _a !== void 0 ? _a : new AnimationManager(game);
    }
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    CardManager.prototype.animationsActive = function () {
        return this.animationManager.animationsActive();
    };
    CardManager.prototype.addStock = function (stock) {
        this.stocks.push(stock);
    };
    /**
     * @param card the card informations
     * @return the id for a card
     */
    CardManager.prototype.getId = function (card) {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.settings).getId) === null || _b === void 0 ? void 0 : _b.call(_a, card)) !== null && _c !== void 0 ? _c : "card-".concat(card.id);
    };
    CardManager.prototype.createCardElement = function (card, visible) {
        var _a, _b, _c, _d, _e, _f;
        if (visible === void 0) { visible = true; }
        var id = this.getId(card);
        var side = visible ? 'front' : 'back';
        if (this.getCardElement(card)) {
            throw new Error('This card already exists ' + JSON.stringify(card));
        }
        var element = document.createElement("div");
        element.id = id;
        element.dataset.side = '' + side;
        element.innerHTML = "\n            <div class=\"card-sides\">\n                <div id=\"".concat(id, "-front\" class=\"card-side front\">\n                </div>\n                <div id=\"").concat(id, "-back\" class=\"card-side back\">\n                </div>\n            </div>\n        ");
        element.classList.add('card');
        document.body.appendChild(element);
        (_b = (_a = this.settings).setupDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element);
        (_d = (_c = this.settings).setupFrontDiv) === null || _d === void 0 ? void 0 : _d.call(_c, card, element.getElementsByClassName('front')[0]);
        (_f = (_e = this.settings).setupBackDiv) === null || _f === void 0 ? void 0 : _f.call(_e, card, element.getElementsByClassName('back')[0]);
        document.body.removeChild(element);
        return element;
    };
    /**
     * @param card the card informations
     * @return the HTML element of an existing card
     */
    CardManager.prototype.getCardElement = function (card) {
        return document.getElementById(this.getId(card));
    };
    /**
     * Remove a card.
     *
     * @param card the card to remove
     * @param settings a `RemoveCardSettings` object
     */
    CardManager.prototype.removeCard = function (card, settings) {
        var _a;
        var id = this.getId(card);
        var div = document.getElementById(id);
        if (!div) {
            return false;
        }
        div.id = "deleted".concat(id);
        div.remove();
        // if the card is in a stock, notify the stock about removal
        (_a = this.getCardStock(card)) === null || _a === void 0 ? void 0 : _a.cardRemoved(card, settings);
        return true;
    };
    /**
     * Returns the stock containing the card.
     *
     * @param card the card informations
     * @return the stock containing the card
     */
    CardManager.prototype.getCardStock = function (card) {
        return this.stocks.find(function (stock) { return stock.contains(card); });
    };
    /**
     * Return if the card passed as parameter is suppose to be visible or not.
     * Use `isCardVisible` from settings if set, else will check if `card.type` is defined
     *
     * @param card the card informations
     * @return the visiblility of the card (true means front side should be displayed)
     */
    CardManager.prototype.isCardVisible = function (card) {
        var _a, _b, _c, _d;
        return (_c = (_b = (_a = this.settings).isCardVisible) === null || _b === void 0 ? void 0 : _b.call(_a, card)) !== null && _c !== void 0 ? _c : ((_d = card.type) !== null && _d !== void 0 ? _d : false);
    };
    /**
     * Set the card to its front (visible) or back (not visible) side.
     *
     * @param card the card informations
     * @param visible if the card is set to visible face. If unset, will use isCardVisible(card)
     * @param settings the flip params (to update the card in current stock)
     */
    CardManager.prototype.setCardVisible = function (card, visible, settings) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var element = this.getCardElement(card);
        if (!element) {
            return;
        }
        var isVisible = visible !== null && visible !== void 0 ? visible : this.isCardVisible(card);
        element.dataset.side = isVisible ? 'front' : 'back';
        var stringId = JSON.stringify(this.getId(card));
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.updateFront) !== null && _a !== void 0 ? _a : true) {
            if (this.updateFrontTimeoutId[stringId]) { // make sure there is not a delayed animation that will overwrite the last flip request
                clearTimeout(this.updateFrontTimeoutId[stringId]);
                delete this.updateFrontTimeoutId[stringId];
            }
            var updateFrontDelay = (_b = settings === null || settings === void 0 ? void 0 : settings.updateFrontDelay) !== null && _b !== void 0 ? _b : 500;
            if (!isVisible && updateFrontDelay > 0 && this.animationsActive()) {
                this.updateFrontTimeoutId[stringId] = setTimeout(function () { var _a, _b; return (_b = (_a = _this.settings).setupFrontDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element.getElementsByClassName('front')[0]); }, updateFrontDelay);
            }
            else {
                (_d = (_c = this.settings).setupFrontDiv) === null || _d === void 0 ? void 0 : _d.call(_c, card, element.getElementsByClassName('front')[0]);
            }
        }
        if ((_e = settings === null || settings === void 0 ? void 0 : settings.updateBack) !== null && _e !== void 0 ? _e : false) {
            if (this.updateBackTimeoutId[stringId]) { // make sure there is not a delayed animation that will overwrite the last flip request
                clearTimeout(this.updateBackTimeoutId[stringId]);
                delete this.updateBackTimeoutId[stringId];
            }
            var updateBackDelay = (_f = settings === null || settings === void 0 ? void 0 : settings.updateBackDelay) !== null && _f !== void 0 ? _f : 0;
            if (isVisible && updateBackDelay > 0 && this.animationsActive()) {
                this.updateBackTimeoutId[stringId] = setTimeout(function () { var _a, _b; return (_b = (_a = _this.settings).setupBackDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element.getElementsByClassName('back')[0]); }, updateBackDelay);
            }
            else {
                (_h = (_g = this.settings).setupBackDiv) === null || _h === void 0 ? void 0 : _h.call(_g, card, element.getElementsByClassName('back')[0]);
            }
        }
        if ((_j = settings === null || settings === void 0 ? void 0 : settings.updateData) !== null && _j !== void 0 ? _j : true) {
            // card data has changed
            var stock = this.getCardStock(card);
            var cards = stock.getCards();
            var cardIndex = cards.findIndex(function (c) { return _this.getId(c) === _this.getId(card); });
            if (cardIndex !== -1) {
                stock.cards.splice(cardIndex, 1, card);
            }
        }
    };
    /**
     * Flips the card.
     *
     * @param card the card informations
     * @param settings the flip params (to update the card in current stock)
     */
    CardManager.prototype.flipCard = function (card, settings) {
        var element = this.getCardElement(card);
        var currentlyVisible = element.dataset.side === 'front';
        this.setCardVisible(card, !currentlyVisible, settings);
    };
    /**
     * Update the card informations. Used when a card with just an id (back shown) should be revealed, with all data needed to populate the front.
     *
     * @param card the card informations
     */
    CardManager.prototype.updateCardInformations = function (card, settings) {
        var newSettings = __assign(__assign({}, (settings !== null && settings !== void 0 ? settings : {})), { updateData: true });
        this.setCardVisible(card, undefined, newSettings);
    };
    /**
     * @returns the card with set in the settings (undefined if unset)
     */
    CardManager.prototype.getCardWidth = function () {
        var _a;
        return (_a = this.settings) === null || _a === void 0 ? void 0 : _a.cardWidth;
    };
    /**
     * @returns the card height set in the settings (undefined if unset)
     */
    CardManager.prototype.getCardHeight = function () {
        var _a;
        return (_a = this.settings) === null || _a === void 0 ? void 0 : _a.cardHeight;
    };
    /**
     * @returns the class to apply to selectable cards. Default 'bga-cards_selectable-card'.
     */
    CardManager.prototype.getSelectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectableCardClass) === undefined ? 'bga-cards_selectable-card' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectableCardClass;
    };
    /**
     * @returns the class to apply to selectable cards. Default 'bga-cards_disabled-card'.
     */
    CardManager.prototype.getUnselectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.unselectableCardClass) === undefined ? 'bga-cards_disabled-card' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.unselectableCardClass;
    };
    /**
     * @returns the class to apply to selected cards. Default 'bga-cards_selected-card'.
     */
    CardManager.prototype.getSelectedCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectedCardClass) === undefined ? 'bga-cards_selected-card' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectedCardClass;
    };
    return CardManager;
}());
function sortFunction() {
    var sortedFields = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sortedFields[_i] = arguments[_i];
    }
    return function (a, b) {
        for (var i = 0; i < sortedFields.length; i++) {
            var direction = 1;
            var field = sortedFields[i];
            if (field[0] == '-') {
                direction = -1;
                field = field.substring(1);
            }
            else if (field[0] == '+') {
                field = field.substring(1);
            }
            var type = typeof a[field];
            if (type === 'string') {
                var compare = a[field].localeCompare(b[field]);
                if (compare !== 0) {
                    return compare;
                }
            }
            else if (type === 'number') {
                var compare = (a[field] - b[field]) * direction;
                if (compare !== 0) {
                    return compare * direction;
                }
            }
        }
        return 0;
    };
}
var determineMaxZoomLevel = function () {
    var bodycoords = dojo.marginBox("canvas-overall");
    var contentWidth = bodycoords.w;
    var rowWidth = BOARD_WIDTH;
    if (contentWidth >= rowWidth) {
        return 1;
    }
    return contentWidth / rowWidth;
};
var getZoomLevels = function (maxZoomLevels) {
    var increments = maxZoomLevels / 5;
    return [increments, increments * 2, increments * 3, increments * 4, maxZoomLevels];
};
var AutoZoomManager = /** @class */ (function (_super) {
    __extends(AutoZoomManager, _super);
    function AutoZoomManager(elementId) {
        var _this = this;
        var zoomLevels = getZoomLevels(determineMaxZoomLevel());
        _this = _super.call(this, {
            element: document.getElementById(elementId),
            smooth: true,
            zoomLevels: zoomLevels,
            defaultZoom: zoomLevels[zoomLevels.length - 1],
            zoomControls: {
                color: 'black',
            },
            onDimensionsChange: function (zoom) {
                if (_this) {
                    var newMaxZoomLevel = determineMaxZoomLevel();
                    var currentMaxZoomLevel = _this.zoomLevels[_this.zoomLevels.length - 1];
                    if (newMaxZoomLevel != currentMaxZoomLevel) {
                        _this.setZoomLevels(getZoomLevels(newMaxZoomLevel), newMaxZoomLevel);
                    }
                }
            },
        }) || this;
        return _this;
    }
    return AutoZoomManager;
}(ZoomManager));
var CounterVoidStock = /** @class */ (function (_super) {
    __extends(CounterVoidStock, _super);
    function CounterVoidStock(manager, setting) {
        var _this = _super.call(this, manager, document.createElement("div")) || this;
        _this.manager = manager;
        _this.setting = setting;
        var targetElement = document.getElementById(setting.targetElement);
        if (!targetElement) {
            console.warn('targetElement not found');
            return _this;
        }
        var wrapperElement = document.createElement("div");
        wrapperElement.classList.add("counter-void-stock-wrapper");
        if (setting.setupWrapper) {
            setting.setupWrapper(wrapperElement);
        }
        var iconElement = document.createElement("div");
        iconElement.classList.add("counter-void-stock-icon");
        if (setting.setupIcon) {
            setting.setupIcon(iconElement);
        }
        wrapperElement.appendChild(iconElement);
        var counterElement = document.createElement("div");
        counterElement.classList.add("counter-void-stock-counter");
        counterElement.id = setting.counterId;
        if (setting.setupCounter) {
            setting.setupCounter(counterElement);
        }
        wrapperElement.appendChild(counterElement);
        _this.element.classList.add("counter-void-stock-stock");
        if (setting.setupStock) {
            setting.setupStock(_this.element);
        }
        wrapperElement.appendChild(_this.element);
        targetElement.appendChild(wrapperElement);
        _this.counter = setting.counter;
        _this.counter.create(setting.counterId);
        _this.counter.setValue(setting.initialCounterValue);
        return _this;
    }
    CounterVoidStock.prototype.create = function (nodeId) { };
    CounterVoidStock.prototype.getValue = function () { return this.counter.getValue(); };
    CounterVoidStock.prototype.incValue = function (by) { this.counter.incValue(by); };
    CounterVoidStock.prototype.decValue = function (by) { this.counter.setValue(this.counter.getValue() - by); };
    CounterVoidStock.prototype.setValue = function (value) { this.counter.setValue(value); };
    CounterVoidStock.prototype.toValue = function (value) { this.counter.toValue(value); };
    CounterVoidStock.prototype.disable = function () { this.counter.disable(); };
    return CounterVoidStock;
}(VoidStock));
var ArtCardManager = /** @class */ (function (_super) {
    __extends(ArtCardManager, _super);
    function ArtCardManager(canvasGame) {
        var _this = _super.call(this, canvasGame, {
            getId: function (card) { return "canvas-art-card-".concat(card.id); },
            setupDiv: function (card, div) {
                div.classList.add('canvas-art-card');
                div.dataset.id = '' + card.id;
            },
            setupFrontDiv: function (card, div) {
                div.id = "".concat(_this.getId(card), "-front");
                div.classList.add('art-card');
                div.classList.add('art-card-' + card.type_arg);
                div.dataset.type = '' + card.type_arg;
            },
            isCardVisible: function (card) { return !!card.type; },
            cardWidth: CARD_WIDTH,
            cardHeight: CARD_HEIGHT,
        }) || this;
        _this.canvasGame = canvasGame;
        _this.playerHand = {};
        _this.paintings = {};
        return _this;
    }
    ArtCardManager.prototype.setUp = function (gameData) {
        var _this = this;
        this.deck = new Deck(this, $('art-card-deck'), {
            cardNumber: 60,
            topCard: { id: -1 }
        });
        this.display = new SlotStock(this, $('art-card-display'), {
            mapCardToSlot: function (card) { return "art-card-display-slot-".concat(card.location_arg); },
            slotClasses: ['art-card-display-slot'],
            slotsIds: ['art-card-display-slot-1', 'art-card-display-slot-2', 'art-card-display-slot-3', 'art-card-display-slot-4', 'art-card-display-slot-5']
        });
        for (var playersKey in gameData.players) {
            this.playerHand[Number(playersKey)] = new LineStock(this, $("player-hand-".concat(playersKey)), {});
            this.playerHand[Number(playersKey)].addCards(gameData.players[playersKey].handCards);
        }
        gameData.displayCards.forEach(function (card) {
            _this.display.addCard(card);
            dojo.place("<div id=\"inspiration-token-card-stock-".concat(card.id, "\" class=\"inspiration-token-card-stock\"></div>"), _this.getCardElement(card).getAttribute("id"));
        });
    };
    ArtCardManager.prototype.takeCard = function (playerId, card) {
        return this.playerHand[playerId].addCard(card);
    };
    ArtCardManager.prototype.enterDisplaySelectMode = function (availableCards) {
        var _this = this;
        this.display.setSelectionMode('single');
        this.display.setSelectableCards(availableCards);
        this.display.onSelectionChange = function (selection) {
            _this.unsetDisplayCostIndicator();
            if (selection.length === 1) {
                _this.display.getCards()
                    .filter(function (card) { return card.location_arg < selection[0].location_arg; })
                    .map(function (card) { return _this.getCardElement(card); })
                    .forEach(function (card) { return card.classList.add('cost-indicator'); });
            }
        };
    };
    ArtCardManager.prototype.exitDisplaySelectMode = function () {
        this.display.setSelectionMode('none');
        this.display.onSelectionChange = undefined;
        this.unsetDisplayCostIndicator();
    };
    ArtCardManager.prototype.unsetDisplayCostIndicator = function () {
        var _this = this;
        this.display.getCards()
            .map(function (card) { return _this.getCardElement(card); })
            .forEach(function (card) { return card.classList.remove('cost-indicator'); });
    };
    ArtCardManager.prototype.getSelectedDisplayCardId = function () {
        var selection = this.display.getSelection();
        if (selection && selection.length === 1) {
            return this.display.getSelection()[0].id;
        }
        return null;
    };
    ArtCardManager.prototype.updateDisplayCards = function (displayCards) {
        var _this = this;
        return this.display.addCards(displayCards.slice(0, -1))
            .then(function () {
            var card = displayCards[displayCards.length - 1];
            var promise = _this.display.addCard(card, { fromStock: _this.deck });
            dojo.place("<div id=\"inspiration-token-card-stock-".concat(card.id, "\" class=\"inspiration-token-card-stock\"></div>"), _this.getCardElement(card).getAttribute("id"));
            return promise;
        });
    };
    ArtCardManager.prototype.createPaintingStock = function (id, elementId, cards) {
        dojo.place("<div id=\"".concat(elementId, "-art\"></div>"), elementId);
        this.paintings[id] = new LineStock(this, $(elementId + "-art"), {});
        this.paintings[id].addCards(cards);
    };
    return ArtCardManager;
}(CardManager));
var BackgroundCardManager = /** @class */ (function (_super) {
    __extends(BackgroundCardManager, _super);
    function BackgroundCardManager(canvasGame) {
        var _this = _super.call(this, canvasGame, {
            getId: function (card) { return "canvas-background-card-".concat(card.id); },
            setupDiv: function (card, div) {
                div.classList.add('canvas-background-card');
                div.dataset.id = '' + card.id;
            },
            setupFrontDiv: function (card, div) {
                div.id = "".concat(_this.getId(card), "-front");
                div.classList.add('background-card');
                div.classList.add('background-card-' + card.type);
                div.dataset.type = '' + card.type;
            },
            isCardVisible: function (card) { return !!card.type; },
            cardWidth: CARD_WIDTH,
            cardHeight: CARD_HEIGHT,
        }) || this;
        _this.canvasGame = canvasGame;
        _this.players = {};
        _this.paintings = {};
        return _this;
    }
    BackgroundCardManager.prototype.setUp = function (gameData) {
        // for (const playersKey in gameData.players) {
        //     const player = gameData.players[playersKey];
        //
        //     this.players[Number(playersKey)] = new LineStock<Card>(this, $(`player-background-${playersKey}`), {})
        //     player.backgroundCards.forEach(card => this.moveCardToPlayerHand(Number(playersKey), card))
        //
        // }
    };
    BackgroundCardManager.prototype.moveCardToPlayerHand = function (playerId, card) {
        return this.players[playerId].addCard(card);
    };
    BackgroundCardManager.prototype.createPaintingStock = function (id, elementId, card) {
        dojo.place("<div id=\"".concat(elementId, "-background\"></div>"), elementId);
        this.paintings[id] = new LineStock(this, $($(elementId + "-background")), {});
        this.paintings[id].addCard(card);
    };
    return BackgroundCardManager;
}(CardManager));
var ScoringCardManager = /** @class */ (function (_super) {
    __extends(ScoringCardManager, _super);
    function ScoringCardManager(canvasGame) {
        var _this = _super.call(this, canvasGame, {
            getId: function (card) { return "canvas-scoring-card-".concat(card.id); },
            setupDiv: function (card, div) {
                div.classList.add('canvas-scoring-card');
                div.dataset.id = '' + card.id;
            },
            setupFrontDiv: function (card, div) {
                div.id = "".concat(_this.getId(card), "-front");
                div.dataset.type = '' + card.type_arg;
            },
            setupBackDiv: function (card, div) {
                div.id = "".concat(_this.getId(card), "-back");
                div.dataset.type = '' + card.type_arg;
            },
            cardWidth: CARD_WIDTH,
            cardHeight: CARD_HEIGHT,
        }) || this;
        _this.canvasGame = canvasGame;
        return _this;
    }
    ScoringCardManager.prototype.setUp = function (gameData) {
        var _this = this;
        this.display = new SlotStock(this, $('scoring-card-display'), {
            mapCardToSlot: function (card) { return "scoring-card-display-slot-".concat(card.location); },
            slotClasses: ['scoring-card-display-slot'],
            slotsIds: ['scoring-card-display-slot-red', 'scoring-card-display-slot-green', 'scoring-card-display-slot-blue', 'scoring-card-display-slot-purple', 'scoring-card-display-slot-grey'],
        });
        this.display.onCardClick = function (card) { return _this.flipCard(card); };
        gameData.scoringCards.forEach(function (card) { return _this.display.addCard(card); });
    };
    return ScoringCardManager;
}(CardManager));
var InspirationTokenManager = /** @class */ (function (_super) {
    __extends(InspirationTokenManager, _super);
    function InspirationTokenManager(canvasGame) {
        var _this = _super.call(this, canvasGame, {
            getId: function (token) { return "canvas-inspiration-token-".concat(token.id); },
            setupDiv: function (token, div) {
                div.classList.add('canvas-inspiration-token');
                div.dataset.id = '' + token.id;
            },
            cardWidth: INSPIRATION_TOKEN_WIDTH,
            cardHeight: INSPIRATION_TOKEN_HEIGHT,
        }) || this;
        _this.canvasGame = canvasGame;
        _this.players = {};
        _this.cards = {};
        return _this;
    }
    InspirationTokenManager.prototype.setUp = function (gameData) {
        for (var playersKey in gameData.players) {
            this.players[Number(playersKey)] = new CounterVoidStock(this, {
                counter: new ebg.counter(),
                targetElement: "canvas-counters-".concat(playersKey),
                counterId: "canvas-inspiration-token-counter-".concat(playersKey),
                initialCounterValue: gameData.players[playersKey].inspirationTokens.length,
                setupIcon: function (element) { element.classList.add("canvas-inspiration-token-2d"); }
            });
        }
        this.placeOnCards(gameData.displayInspirationTokens);
    };
    InspirationTokenManager.prototype.placeOnCards = function (tokens, playerId) {
        var _this = this;
        var promises = [];
        tokens.forEach(function (token) {
            if (!_this.cards[token.location_arg]) {
                _this.cards[token.location_arg] = new LineStock(_this, $("inspiration-token-card-stock-".concat(token.location_arg)), {});
            }
            var animation = playerId ? { fromStock: _this.players[playerId] } : {};
            promises.push(_this.cards[token.location_arg].addCard(token, animation));
        });
        if (playerId) {
            this.players[playerId].decValue(tokens.length);
        }
        return Promise.all(promises);
    };
    InspirationTokenManager.prototype.moveToPlayer = function (playerId, tokens) {
        this.players[playerId].incValue(tokens.length);
        return this.players[playerId].addCards(tokens);
    };
    return InspirationTokenManager;
}(CardManager));
var RibbonManager = /** @class */ (function (_super) {
    __extends(RibbonManager, _super);
    function RibbonManager(canvasGame) {
        var _this = _super.call(this, canvasGame, {
            getId: function (token) { return "canvas-ribbon-token-".concat(token.id); },
            setupDiv: function (token, div) {
                div.classList.add('canvas-ribbon');
                div.classList.add('large');
                div.dataset.type = '' + token.type;
            },
            cardWidth: RIBBON_TOKEN_WIDTH,
            cardHeight: RIBBON_TOKEN_HEIGHT,
        }) || this;
        _this.canvasGame = canvasGame;
        _this.players = {};
        return _this;
    }
    RibbonManager.prototype.setUp = function (gameData) {
        for (var playersKey in gameData.players) {
            var player = gameData.players[playersKey];
            this.players[Number(playersKey)] = {};
            this.createRibbonCounterVoidStock(player, 'red');
            this.createRibbonCounterVoidStock(player, 'green');
            this.createRibbonCounterVoidStock(player, 'blue');
            this.createRibbonCounterVoidStock(player, 'purple');
            this.createRibbonCounterVoidStock(player, 'grey');
        }
    };
    RibbonManager.prototype.updateRibbonCounters = function (playerId, painting, paintingRibbons) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _i, ribbonType, nrOfRibbons, tokens, i, element;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = paintingRibbons;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 4];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3 /*break*/, 3];
                        ribbonType = _c;
                        nrOfRibbons = paintingRibbons[ribbonType];
                        this.players[playerId][ribbonType].incValue(paintingRibbons[ribbonType]);
                        tokens = [];
                        for (i = 0; i < nrOfRibbons; i++) {
                            tokens.push(this.mockRibbonToken(ribbonType));
                        }
                        element = document.querySelector("#player-finished-painting-".concat(painting.id));
                        return [4 /*yield*/, this.players[playerId][ribbonType].addCards(tokens, { fromElement: element })];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RibbonManager.prototype.mockRibbonToken = function (type) {
        return { id: RibbonManager.ribbonTokenId++, type: type };
    };
    RibbonManager.prototype.createRibbonCounterVoidStock = function (player, ribbonType) {
        this.players[player.id][ribbonType] = new CounterVoidStock(this, {
            counter: new ebg.counter(),
            targetElement: "canvas-counters-".concat(player.id),
            counterId: "canvas-ribbon-counter-".concat(player.id, "-").concat(ribbonType),
            initialCounterValue: player.ribbons[ribbonType],
            setupIcon: function (element) {
                element.classList.add("canvas-ribbon");
                element.dataset.type = ribbonType;
            }
        });
    };
    RibbonManager.ribbonTokenId = 0;
    return RibbonManager;
}(CardManager));
var PaintingManager = /** @class */ (function () {
    function PaintingManager(canvasGame) {
        this.canvasGame = canvasGame;
        this.completePaintingMode = {
            backgroundCards: [],
            artCards: [],
            painting: {
                backgroundCard: undefined,
                artCards: []
            },
        };
    }
    PaintingManager.prototype.setUp = function (gameData) {
        var _this = this;
        for (var playersKey in gameData.players) {
            var player = gameData.players[playersKey];
            player.paintings.forEach(function (painting) { return _this.createPainting(painting, false); });
        }
    };
    PaintingManager.prototype.createPainting = function (painting, showAnimation) {
        var targetElementId = "player-finished-paintings-".concat(painting.playerId);
        var paintingElementId = "player-finished-painting-".concat(painting.id);
        var cardsWrapperId = "".concat(paintingElementId, "-cards-wrapper");
        dojo.place("<div id=\"".concat(paintingElementId, "\" class=\"canvas-painting\">\n                            <div id=\"").concat(cardsWrapperId, "\" class=\"canvas-painting-cards-wrapper\"></div>\n                         </div>"), showAnimation ? 'canvas-table' : targetElementId);
        this.canvasGame.backgroundCardManager.createPaintingStock(painting.id, cardsWrapperId, painting.backgroundCard);
        this.canvasGame.artCardManager.createPaintingStock(painting.id, cardsWrapperId, painting.artCards);
        var element = $(paintingElementId);
        if (showAnimation) {
            return this.canvasGame.animationManager.play(new BgaCumulatedAnimation({ animations: [
                    new BgaAttachWithAnimation({
                        animation: new BgaSlideAnimation({ element: element, transitionTimingFunction: 'ease-out' }),
                        attachElement: document.getElementById('canvas-show-painting-overlay')
                    }),
                    new BgaPauseAnimation({ element: element }),
                ] }));
        }
        else {
            this.addPaintingToPngButton(painting, paintingElementId);
            return Promise.resolve();
        }
    };
    PaintingManager.prototype.addPaintingToPngButton = function (painting, paintingElementId) {
        var _this = this;
        dojo.place("<a id=\"save-painting-".concat(painting.id, "\" class=\"bgabutton bgabutton_blue\"><i class=\"fa fa-heart\" aria-hidden=\"true\"></i></a>"), paintingElementId);
        dojo.connect($("save-painting-".concat(painting.id)), 'onclick', function () { return _this.paintingToPng(painting); });
    };
    PaintingManager.prototype.enterCompletePaintingMode = function (backgroundCards, artCards) {
        var _this = this;
        this.completePaintingMode = {
            backgroundCards: backgroundCards,
            artCards: artCards,
            painting: {
                backgroundCard: backgroundCards[0],
                artCards: artCards.slice(0, 3)
            }
        };
        dojo.place(this.createCompletePaintingPickerElement(), 'complete-painting');
        dojo.place(this.createCompletePaintingPreviewElement(), 'complete-painting');
        dojo.place(this.createBackgroundSlot(this.completePaintingMode.backgroundCards.length), 'art-cards-picker-top-text', 'before');
        dojo.place(this.createBackgroundElement(this.completePaintingMode.painting.backgroundCard), 'complete-painting-background-card-slot');
        dojo.connect($('change-background-button'), 'onclick', function () { return _this.changeBackgroundCard(); });
        var _loop_3 = function (i) {
            dojo.place(this_1.createArtCardSlot(i), 'art-cards-picker-top-text', 'before');
            dojo.place(this_1.createArtCardElement(this_1.completePaintingMode.painting.artCards[i - 1]), "complete-painting-art-card-slot-".concat(i));
            dojo.connect($("art-card-move-left-".concat(i)), 'onclick', function () { return _this.moveArtCard('left', i); });
            dojo.connect($("art-card-move-right-".concat(i)), 'onclick', function () { return _this.moveArtCard('right', i); });
            dojo.connect($("art-card-change-".concat(i)), 'onclick', function () { return _this.changeArtCard(i); });
        };
        var this_1 = this;
        for (var i = 1; i <= 3; i++) {
            _loop_3(i);
        }
        this.updateUnusedCards();
        this.updatePreview();
    };
    PaintingManager.prototype.changeBackgroundCard = function () {
        var newBackgroundCardIndex = this.completePaintingMode.backgroundCards.indexOf(this.completePaintingMode.painting.backgroundCard) + 1;
        if (newBackgroundCardIndex >= this.completePaintingMode.backgroundCards.length) {
            newBackgroundCardIndex = 0;
        }
        var newBackgroundCard = this.completePaintingMode.backgroundCards[newBackgroundCardIndex];
        if (newBackgroundCard) {
            dojo.place(this.createBackgroundElement(newBackgroundCard), 'complete-painting-background-card-slot', 'only');
            this.completePaintingMode.painting.backgroundCard = newBackgroundCard;
        }
        this.updatePreview();
    };
    PaintingManager.prototype.moveArtCard = function (direction, i) {
        var newIndex = direction === 'left' ? i - 1 : i + 1;
        var newPositionCard = this.completePaintingMode.painting.artCards[newIndex - 1];
        var oldPositionCard = this.completePaintingMode.painting.artCards[i - 1];
        dojo.place(this.createArtCardElement(newPositionCard), "complete-painting-art-card-slot-".concat(i), 'only');
        this.completePaintingMode.painting.artCards[i - 1] = newPositionCard;
        dojo.place(this.createArtCardElement(oldPositionCard), "complete-painting-art-card-slot-".concat(newIndex), 'only');
        this.completePaintingMode.painting.artCards[newIndex - 1] = oldPositionCard;
        this.updatePreview();
    };
    PaintingManager.prototype.changeArtCard = function (i) {
        var currentCard = this.completePaintingMode.painting.artCards[i - 1];
        var currentCardIndex = this.completePaintingMode.artCards.indexOf(currentCard);
        var searchIndex = currentCardIndex + 1;
        var newCard = undefined;
        while (!newCard) {
            if (this.completePaintingMode.artCards.length === searchIndex) {
                searchIndex = 0;
            }
            if (!this.completePaintingMode.painting.artCards.includes(this.completePaintingMode.artCards[searchIndex])) {
                newCard = this.completePaintingMode.artCards[searchIndex];
            }
            searchIndex = searchIndex + 1;
        }
        dojo.place(this.createArtCardElement(newCard), "complete-painting-art-card-slot-".concat(i), 'only');
        this.completePaintingMode.painting.artCards[i - 1] = newCard;
        this.updateUnusedCards();
        this.updatePreview();
    };
    PaintingManager.prototype.exitCompletePaintingMode = function () {
        dojo.empty('complete-painting');
    };
    PaintingManager.prototype.enterHighlightPaintingMode = function (player) {
        var overlayId = $('canvas-show-painting-overlay');
        dojo.empty(overlayId);
        dojo.addClass(overlayId, 'overlay-visible');
        dojo.place("<div class=\"title-wrapper\"><div class=\"title color-".concat(player.color, "\"><h1>").concat(player.name).concat(_("'s Completed Painting"), "</h1></div></div>"), overlayId);
    };
    PaintingManager.prototype.exitHighlightPaintingMode = function () {
        var overlayId = $('canvas-show-painting-overlay');
        dojo.removeClass(overlayId, 'overlay-visible');
    };
    PaintingManager.prototype.createCompletePaintingPickerElement = function () {
        return "\n            <div id=\"complete-painting-picker-wrapper\">\n                <div class=\"title-wrapper\"><div class=\"title\"><h1>".concat(_("Art Picker"), "</h1></div></div>\n                <div id=\"art-cards-picker\">\n                    <div id=\"art-cards-picker-bottom-text\"><h1>").concat(_("Bottom"), "</h1></div>\n                    <div id=\"art-cards-picker-top-text\"><h1>").concat(_("Top"), "</h1></div>\n                </div> \n                <div class=\"title-wrapper\"><div class=\"title\"><h1>").concat(_("Unused Cards"), "</h1></div></div>\n                <div id=\"art-cards-picker-unused\">\n                    \n                </div> \n            </div>\n        ");
    };
    PaintingManager.prototype.createCompletePaintingPreviewElement = function () {
        return "\n            <div id=\"complete-painting-preview\">\n                <div class=\"title-wrapper\"><div class=\"title secondary\"><h1>".concat(_("Painting Preview"), "</h1></div></div>\n                <div id=\"complete-painting-preview-scoring\"></div>\n                <div id=\"complete-painting-preview-slot-wrapper\">\n                    <div id=\"complete-painting-preview-slot\" class=\"canvas-painting\"></div>   \n                </div>  \n            </div>\n        ");
    };
    PaintingManager.prototype.createArtCardSlot = function (id) {
        return "\n            <div>\n                <div class=\"top-button-wrapper button-wrapper\"><a id=\"art-card-move-left-".concat(id, "\" class=\"bgabutton bgabutton_blue\" style=\"visibility: ").concat(id === 1 ? 'hidden' : 'visible', ";\"><i class=\"fa fa-arrow-left\" aria-hidden=\"true\"></i></a></div>\n                <div id=\"complete-painting-art-card-slot-").concat(id, "\" class=\"complete-painting-art-card-slot\"></div>\n                <div class=\"center-button-wrapper button-wrapper\"><a id=\"art-card-change-").concat(id, "\" class=\"bgabutton bgabutton_blue\" style=\"visibility: ").concat(this.completePaintingMode.artCards.length <= 3 ? 'hidden' : 'visible', ";\"><i class=\"fa fa-refresh\" aria-hidden=\"true\"></i></a></div>\n                <div class=\"bottom-button-wrapper button-wrapper\"><a id=\"art-card-move-right-").concat(id, "\" class=\"bgabutton bgabutton_blue\" style=\"visibility: ").concat(id === 3 ? 'hidden' : 'visible', ";\"><i class=\"fa fa-arrow-right\" aria-hidden=\"true\"></i></a></div>\n            </div>\n        ");
    };
    PaintingManager.prototype.createBackgroundSlot = function (nrOfBackgroundCards) {
        return "\n            <div>\n                <div class=\"top-button-wrapper button-wrapper\"><a id=\"change-background-button\" class=\"bgabutton bgabutton_blue ".concat(nrOfBackgroundCards <= 1 ? 'disabled' : '', "\"><i class=\"fa fa-refresh\" aria-hidden=\"true\"></i></a></div>\n                <div id=\"complete-painting-background-card-slot\" class=\"complete-painting-art-card-slot\"></div>\n            </div>\n        ");
    };
    PaintingManager.prototype.createBackgroundElement = function (card, postfix) {
        if (postfix === void 0) { postfix = 'clone'; }
        var clone = this.canvasGame.backgroundCardManager.createCardElement(card);
        clone.id = "".concat(clone.id, "-").concat(postfix);
        return clone;
    };
    PaintingManager.prototype.createArtCardElement = function (card, postfix) {
        if (postfix === void 0) { postfix = 'clone'; }
        var clone = this.canvasGame.artCardManager.getCardElement(card).cloneNode(true);
        clone.id = "".concat(clone.id, "-").concat(postfix);
        return clone;
    };
    PaintingManager.prototype.updateUnusedCards = function () {
        var _this = this;
        dojo.empty($("art-cards-picker-unused"));
        this.completePaintingMode.artCards
            .filter(function (card) { return !_this.completePaintingMode.painting.artCards.includes(card); })
            .forEach(function (card) {
            dojo.place(_this.createArtCardElement(card), "art-cards-picker-unused");
        });
    };
    PaintingManager.prototype.updatePreview = function () {
        this.createPaintingElement(this.completePaintingMode.painting.backgroundCard, this.completePaintingMode.painting.artCards, 'complete-painting-preview-slot', 'large');
        this.canvasGame.takeNoLockAction('scorePainting', {
            painting: JSON.stringify({
                backgroundCardId: this.completePaintingMode.painting.backgroundCard.id,
                artCardIds: this.completePaintingMode.painting.artCards.map(function (card) { return card.id; })
            })
        });
    };
    PaintingManager.prototype.updatePreviewScore = function (args) {
        dojo.empty($('complete-painting-preview-scoring'));
        Object.entries(args).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            dojo.place("<span class=\"complete-painting-preview-scoring-ribbon\"><span>".concat(value, "</span><span class=\"canvas-ribbon\" data-type=\"").concat(key, "\"></span></span>"), 'complete-painting-preview-scoring');
        });
    };
    PaintingManager.prototype.confirmPainting = function () {
        dojo.destroy('complete-painting-picker-wrapper');
        this.canvasGame.takeAction('completePainting', {
            painting: JSON.stringify({
                backgroundCardId: this.completePaintingMode.painting.backgroundCard.id,
                artCardIds: this.completePaintingMode.painting.artCards.map(function (card) { return card.id; })
            })
        });
    };
    PaintingManager.prototype.createPaintingElement = function (backgroundCard, artCards, node, size, copyright) {
        if (size === void 0) { size = 'normal'; }
        if (copyright === void 0) { copyright = false; }
        var paintingId = "canvas-painting-".concat(backgroundCard.id, "-preview");
        dojo.place("<div id=\"".concat(paintingId, "\" class=\"canvas-painting ").concat(size, "\"></div>"), node, 'only');
        var cardsWrapperId = "".concat(paintingId, "-cards-wrapper");
        dojo.place("<div id=\"".concat(cardsWrapperId, "\" class=\"canvas-painting-cards-wrapper\"></div>"), paintingId);
        dojo.place("<div class=\"background-card background-card-".concat(backgroundCard.type, "\"></div>"), cardsWrapperId);
        artCards.forEach(function (card) { dojo.place("<div class=\"art-card art-card-".concat(card.type_arg, "\"></div>"), cardsWrapperId); });
        if (copyright) {
            dojo.place('<div id="canvas-copyright">#CanvasPainting<br/>&#169; Road To Infamy Games<br/>Play Canvas on BoardGameArena.com</div>', paintingId);
        }
        return paintingId;
    };
    PaintingManager.prototype.paintingToPng = function (painting) {
        var dialogId = 'share-painting-' + painting.id;
        var dialogContentId = 'share-painting-' + painting.id + '-content';
        var myDlg = new ebg.popindialog();
        myDlg.create(dialogId);
        myDlg.setTitle(_("Share your painting!"));
        myDlg.setContent("<div id=\"".concat(dialogContentId, "\" class=\"share-painting-dialog-content\"><div class=\"lds-ellipsis\"><div></div><div></div><div></div><div></div></div></div>"));
        myDlg.show();
        var elementId = this.createPaintingElement(painting.backgroundCard, painting.artCards, 'html2canvas-result', 'large', true);
        var el = document.getElementById(elementId);
        // @ts-ignore
        domtoimage
            .toPng(el)
            .then(function (dataUrl) {
            // dojo.empty('html2canvas-result')
            dojo.place("<img src=\"".concat(dataUrl, "\" />"), dialogContentId, 'only');
            dojo.place("<span>".concat(_("Share your #CanvasPainting with the world by clicking the button below"), "</span>"), dialogContentId);
            dojo.place("<a id=\"share-painting-".concat(painting.id, "\" class=\"bgabutton bgabutton_blue\"><i class=\"fa fa-share\" aria-hidden=\"true\"></i></a>"), dialogContentId);
            dojo.connect($("share-painting-".concat(painting.id)), 'onclick', function () {
                // @ts-ignore
                domtoimage
                    .toBlob(el)
                    .then(function (blob) {
                    return __awaiter(this, void 0, void 0, function () {
                        var fileName, data, a, url, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    fileName = "my-canvas-painting-".concat(new Date().getTime(), ".png");
                                    data = {
                                        files: [
                                            new File([blob], fileName, {
                                                type: blob.type,
                                            }),
                                        ],
                                        title: 'Canvas Painting'
                                    };
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 5, , 6]);
                                    if (!(navigator.canShare && navigator.canShare(data))) return [3 /*break*/, 3];
                                    return [4 /*yield*/, navigator.share(data)];
                                case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    a = document.createElement('a');
                                    url = window.URL.createObjectURL(blob);
                                    a.href = url;
                                    a.download = fileName;
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                    a.remove();
                                    _a.label = 4;
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    err_1 = _a.sent();
                                    console.error(err_1.name, err_1.message);
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    });
                })
                    .catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });
            });
        })
            .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
    };
    return PaintingManager;
}());
var PlayerManager = /** @class */ (function () {
    function PlayerManager(game) {
        this.game = game;
        this.ribbonCounters = {};
    }
    PlayerManager.prototype.setUp = function (gameData) {
        var playerAreas = [];
        for (var playerId in gameData.players) {
            var player = gameData.players[playerId];
            var playerArea = this.createPlayerArea(player);
            if (Number(player.id) === this.game.getPlayerId()) {
                playerAreas.unshift(playerArea);
            }
            else {
                playerAreas.push(playerArea);
            }
            this.createPlayerPanels(player);
        }
        playerAreas.forEach(function (playerArea) { return dojo.place(playerArea, "player-areas"); });
    };
    PlayerManager.prototype.createPlayerArea = function (player) {
        return "<div id=\"player-area-".concat(player.id, "\" class=\"player-area whiteblock\">\n                    <div class=\"title-wrapper\"><div class=\"title color-").concat(player.color, "\"><h1>").concat(player.name).concat(_("'s Art Collection"), "</h1></div></div>\n                    <div id=\"player-inspiration-tokens-").concat(player.id, "\"></div>\n                    <div class=\"title-wrapper\"><div class=\"title color-").concat(player.color, "\"><h1>").concat(_("Hand Cards"), "</h1></div></div>\n                    <div id=\"player-hand-").concat(player.id, "\" class=\"player-hand\"></div>\n                    <div class=\"title-wrapper\"><div class=\"title color-").concat(player.color, "\"><h1>").concat(_("Finished Paintings"), "</h1></div></div>\n                    <div id=\"player-finished-paintings-").concat(player.id, "\" class=\"player-finished-paintings\"></div>\n                </div>");
    };
    PlayerManager.prototype.createPlayerPanels = function (player) {
        var html = "<div id=\"canvas-counters-".concat(player.id, "\" class=\"canvas-counters\" ></div>");
        dojo.place(html, "player_board_".concat(player.id));
    };
    return PlayerManager;
}());
var ZOOM_LEVELS = [0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
var BOARD_WIDTH = 2000;
var ANIMATION_MS = 800;
var TOOLTIP_DELAY = document.body.classList.contains('touch-device') ? 1500 : undefined;
var LOCAL_STORAGE_ZOOM_KEY = 'Canvas-zoom';
var CARD_WIDTH = 250;
var CARD_HEIGHT = 425;
var INSPIRATION_TOKEN_WIDTH = 60;
var INSPIRATION_TOKEN_HEIGHT = 52;
var RIBBON_TOKEN_WIDTH = 88;
var RIBBON_TOKEN_HEIGHT = 140;
var Canvas = /** @class */ (function () {
    function Canvas() {
    }
    /*
        setup:

        This method must set up the game user interface according to current game situation specified
        in parameters.

        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)

        "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
    */
    Canvas.prototype.setup = function (gamedatas) {
        log("Starting game setup");
        log('gamedatas', gamedatas);
        this.zoomManager = new AutoZoomManager('canvas-table');
        this.animationManager = new AnimationManager(this, { duration: ANIMATION_MS });
        this.playerManager = new PlayerManager(this);
        this.artCardManager = new ArtCardManager(this);
        this.backgroundCardManager = new BackgroundCardManager(this);
        this.scoringCardManager = new ScoringCardManager(this);
        this.inspirationTokenManager = new InspirationTokenManager(this);
        this.paintingManager = new PaintingManager(this);
        this.ribbonManager = new RibbonManager(this);
        this.scoringCardManager.setUp(gamedatas);
        this.playerManager.setUp(gamedatas);
        this.backgroundCardManager.setUp(gamedatas);
        this.artCardManager.setUp(gamedatas);
        this.inspirationTokenManager.setUp(gamedatas);
        this.paintingManager.setUp(gamedatas);
        this.ribbonManager.setUp(gamedatas);
        this.setupNotifications();
        log("Ending game setup");
    };
    ///////////////////////////////////////////////////
    //// Game & client states
    // onEnteringState: this method is called each time we are entering into a new game state.
    //                  You can use this method to perform some user interface changes at this moment.
    //
    Canvas.prototype.onEnteringState = function (stateName, args) {
        log('Entering state: ' + stateName, args.args);
        switch (stateName) {
            case 'takeArtCard':
                this.onEnteringTakeArtCard(args.args);
                break;
            case 'completePainting':
                this.onEnteringCompletePainting(args.args);
                break;
        }
    };
    Canvas.prototype.onEnteringTakeArtCard = function (args) {
        if (this.isCurrentPlayerActive()) {
            this.artCardManager.enterDisplaySelectMode(args.availableCards);
        }
    };
    Canvas.prototype.onEnteringCompletePainting = function (args) {
        if (this.isCurrentPlayerActive()) {
            this.paintingManager.enterCompletePaintingMode(args.backgroundCards, args.artCards);
        }
    };
    Canvas.prototype.onLeavingState = function (stateName) {
        log('Leaving state: ' + stateName);
        switch (stateName) {
            case 'takeArtCard':
                this.onLeavingTakeArtCard();
                break;
            case 'completePainting':
                this.onLeavingCompletePainting();
                break;
        }
    };
    Canvas.prototype.onLeavingTakeArtCard = function () {
        if (this.isCurrentPlayerActive()) {
            this.artCardManager.exitDisplaySelectMode();
        }
    };
    Canvas.prototype.onLeavingCompletePainting = function () {
        if (this.isCurrentPlayerActive()) {
            this.paintingManager.exitCompletePaintingMode();
        }
    };
    // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
    //                        action status bar (ie: the HTML links in the status bar).
    //
    Canvas.prototype.onUpdateActionButtons = function (stateName, args) {
        var _this = this;
        if (this.isCurrentPlayerActive() && !this.isReadOnly()) {
            switch (stateName) {
                case 'playerTurn':
                    if (args.availableActions.includes('takeArtCard')) {
                        this.addActionButton('chooseActionTakeArtCard', _("Take an Art Card"), function () { return _this.chooseAction('takeArtCard'); });
                    }
                    if (args.availableActions.includes('completePainting')) {
                        this.addActionButton('chooseActionCompletePainting', _("Complete Painting"), function () { return _this.chooseAction('completePainting'); });
                    }
                    break;
                case 'takeArtCard':
                    this.addActionButton('confirmTakeArtCard', _("Confirm"), function () { return _this.confirmTakeArtCard(); });
                    this.addActionButton('cancelAction', _("Cancel"), function () { return _this.cancelAction(); }, null, null, 'gray');
                    break;
                case 'completePainting':
                    this.addActionButton('confirmCompletePainting', _("Confirm"), function () { return _this.confirmCompletePainting(); });
                    this.addActionButton('cancelAction', _("Cancel"), function () { return _this.cancelAction(); }, null, null, 'gray');
                    break;
            }
            if ([].includes(stateName) && args.canCancelMoves) {
                this.addActionButton('undoLastMoves', _("Undo last moves"), function () { return _this.undoLastMoves(); }, null, null, 'gray');
            }
        }
    };
    Canvas.prototype.chooseAction = function (chosenAction) {
        this.takeAction('chooseAction', { chosenAction: chosenAction });
    };
    Canvas.prototype.cancelAction = function () {
        this.takeAction('cancelAction', {});
    };
    Canvas.prototype.confirmTakeArtCard = function () {
        var cardId = this.artCardManager.getSelectedDisplayCardId();
        this.takeAction('takeArtCard', { cardId: cardId });
    };
    Canvas.prototype.confirmCompletePainting = function () {
        this.paintingManager.confirmPainting();
    };
    Canvas.prototype.undoLastMoves = function () {
        this.takeAction('undoLastMoves');
    };
    Canvas.prototype.wrapInConfirm = function (runnable) {
        if (this.isAskForConfirmation()) {
            this.confirmationDialog(_("This action can not be undone. Are you sure?"), function () {
                runnable();
            });
        }
        else {
            runnable();
        }
    };
    ///////////////////////////////////////////////////
    //// Utility methods
    ///////////////////////////////////////////////////
    Canvas.prototype.isReadOnly = function () {
        return this.isSpectator || typeof g_replayFrom != 'undefined' || g_archive_mode;
    };
    Canvas.prototype.getPlayerId = function () {
        return Number(this.player_id);
    };
    Canvas.prototype.getPlayer = function (playerId) {
        return Object.values(this.gamedatas.players).find(function (player) { return Number(player.id) == playerId; });
    };
    Canvas.prototype.takeAction = function (action, data) {
        data = data || {};
        data.lock = true;
        this.ajaxcall("/canvas/canvas/".concat(action, ".html"), data, this, function () { });
    };
    Canvas.prototype.takeNoLockAction = function (action, data) {
        data = data || {};
        this.ajaxcall("/canvas/canvas/".concat(action, ".html"), data, this, function () { });
    };
    Canvas.prototype.setTooltip = function (id, html) {
        this.addTooltipHtml(id, html, TOOLTIP_DELAY);
    };
    Canvas.prototype.setTooltipToClass = function (className, html) {
        this.addTooltipHtmlToClass(className, html, TOOLTIP_DELAY);
    };
    Canvas.prototype.setScore = function (playerId, score) {
        var _a;
        (_a = this.scoreCtrl[playerId]) === null || _a === void 0 ? void 0 : _a.toValue(score);
    };
    Canvas.prototype.isAskForConfirmation = function () {
        return true; // For now always ask for confirmation, might make this a preference later on.
    };
    ///////////////////////////////////////////////////
    //// Reaction to cometD notifications
    /*
        setupNotifications:

        In this method, you associate each of your game notifications with your local method to handle it.

        Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                your pylos.game.php file.

    */
    Canvas.prototype.setupNotifications = function () {
        var _this = this;
        log('notifications subscriptions setup');
        var notifs = [
            ['artCardTaken', undefined],
            ['displayRefilled', undefined],
            ['paintingScored', 1],
            ['paintingCompleted', undefined]
        ];
        notifs.forEach(function (notif) {
            dojo.subscribe(notif[0], _this, function (notifDetails) {
                log("notif_".concat(notif[0]), notifDetails.args);
                var promise = _this["notif_".concat(notif[0])](notifDetails.args);
                // tell the UI notification ends
                promise === null || promise === void 0 ? void 0 : promise.then(function () { return _this.notifqueue.onSynchronousNotificationEnd(); });
            });
            // make all notif as synchronous
            _this.notifqueue.setSynchronous(notif[0], notif[1]);
        });
    };
    Canvas.prototype.notif_artCardTaken = function (args) {
        var _this = this;
        this.artCardManager.exitDisplaySelectMode();
        return this.inspirationTokenManager.placeOnCards(args.inspirationTokensPlaced, args.playerId)
            .then(function () { return _this.inspirationTokenManager.moveToPlayer(args.playerId, args.inspirationTokensTaken); })
            .then(function () { return _this.artCardManager.takeCard(args.playerId, args.cardTaken); });
    };
    Canvas.prototype.notif_displayRefilled = function (args) {
        return this.artCardManager.updateDisplayCards(args.displayCards);
    };
    Canvas.prototype.notif_paintingScored = function (args) {
        this.paintingManager.updatePreviewScore(args);
    };
    Canvas.prototype.notif_paintingCompleted = function (args) {
        var _this = this;
        this.paintingManager.exitCompletePaintingMode();
        this.paintingManager.enterHighlightPaintingMode(this.getPlayer(args.playerId));
        return this.paintingManager.createPainting(args.painting, true)
            .then(function () { return _this.ribbonManager.updateRibbonCounters(args.playerId, args.painting, args.paintingRibbons); })
            .then(function () { return _this.paintingManager.exitHighlightPaintingMode(); })
            .then(function () { return _this.animationManager.play(new BgaAttachWithAnimation({
            animation: new BgaSlideAnimation({ element: $("player-finished-painting-".concat(args.painting.id)), transitionTimingFunction: 'ease-out' }),
            attachElement: document.getElementById("player-finished-paintings-".concat(args.playerId))
        })); })
            .then(function () { return _this.paintingManager.addPaintingToPngButton(args.painting, "player-finished-painting-".concat(args.painting.id)); });
    };
    Canvas.prototype.format_string_recursive = function (log, args) {
        var _this = this;
        try {
            if (log && args && !args.processed) {
                Object.keys(args).forEach(function (argKey) {
                    if (argKey.startsWith('ribbonIcons')) {
                        var ribbons_1 = [];
                        Object.keys(args[argKey]).forEach(function (key) {
                            for (var i = 0; i < args[argKey][key]; i++) {
                                ribbons_1.push(_this.getRibbonIcon(key));
                            }
                        });
                        args[argKey] = ribbons_1.join('');
                    }
                });
            }
        }
        catch (e) {
            console.error(log, args, "Exception thrown", e.stack);
        }
        return this.inherited(arguments);
    };
    Canvas.prototype.getRibbonIcon = function (type) {
        return "<span class=\"canvas-ribbon small\" data-type=\"".concat(type, "\" style=\"margin: 0 2px\"></span>");
    };
    return Canvas;
}());
