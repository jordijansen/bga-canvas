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
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * earth implementation : © Guillaume Benny bennygui@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
var Numbers = /** @class */ (function () {
    function Numbers(game, initialValue, targetIdsOrElements) {
        if (initialValue === void 0) { initialValue = 0; }
        if (targetIdsOrElements === void 0) { targetIdsOrElements = []; }
        this.game = game;
        this.targetIdsOrElements = targetIdsOrElements;
        this.currentValue = initialValue;
        this.targetValue = initialValue;
        this.onFinishStepValues = [];
        this.ensureNumbers();
        this.update();
    }
    Numbers.prototype.addTarget = function (targetIdOrElement) {
        if (this.targetIdsOrElements instanceof Array) {
            this.targetIdsOrElements.push(targetIdOrElement);
        }
        else {
            this.targetIdsOrElements = [this.targetIdsOrElements, targetIdOrElement];
        }
        this.update();
    };
    Numbers.prototype.registerOnFinishStepValues = function (callback) {
        this.onFinishStepValues.push(callback);
    };
    Numbers.prototype.getValue = function () {
        return this.currentValue;
    };
    Numbers.prototype.setValue = function (value) {
        this.currentValue = value;
        this.targetValue = value;
        this.ensureNumbers();
        this.update();
    };
    Numbers.prototype.toValue = function (value, isInstantaneous) {
        if (isInstantaneous === void 0) { isInstantaneous = false; }
        if (isInstantaneous || this.game.instantaneousMode) {
            this.setValue(value);
        }
        else {
            this.targetValue = value;
            this.ensureNumbers();
            this.stepValues(true);
        }
    };
    Numbers.prototype.stepValues = function (firstCall) {
        var _this = this;
        if (firstCall === void 0) { firstCall = false; }
        if (this.currentAtTarget()) {
            this.update();
            if (!firstCall) {
                for (var _i = 0, _a = this.onFinishStepValues; _i < _a.length; _i++) {
                    var callback = _a[_i];
                    callback(this);
                }
            }
            return;
        }
        if (this.currentValue instanceof Array) {
            var newValues = [];
            for (var i = 0; i < this.currentValue.length; ++i) {
                newValues.push(this.stepOneValue(this.currentValue[i], this.targetValue[i]));
            }
            this.currentValue = newValues;
        }
        else {
            this.currentValue = this.stepOneValue(this.currentValue, this.targetValue);
        }
        this.update();
        setTimeout(function () { return _this.stepValues(); }, this.DELAY);
    };
    Numbers.prototype.stepOneValue = function (current, target) {
        if (current === null) {
            current = 0;
        }
        if (target === null) {
            return null;
        }
        var step = Math.ceil(Math.abs(current - target) / this.STEPS);
        return (current + (current < target ? 1 : -1) * step);
    };
    Numbers.prototype.update = function () {
        if (this.targetIdsOrElements instanceof Array) {
            for (var _i = 0, _a = this.targetIdsOrElements; _i < _a.length; _i++) {
                var target = _a[_i];
                this.updateOne(target);
            }
        }
        else {
            this.updateOne(this.targetIdsOrElements);
        }
    };
    Numbers.prototype.updateOne = function (targetIdOrElement) {
        var elem = this.getElement(targetIdOrElement);
        elem.innerHTML = this.format();
    };
    Numbers.prototype.getTargetElements = function () {
        var _this = this;
        if (this.targetIdsOrElements instanceof Array) {
            return this.targetIdsOrElements.map(function (id) { return _this.getElement(id); });
        }
        else {
            return [this.getElement(this.targetIdsOrElements)];
        }
    };
    Numbers.prototype.getTargetElement = function () {
        var elems = this.getTargetElements();
        if (elems.length == 0) {
            return null;
        }
        return elems[0];
    };
    Numbers.prototype.format = function () {
        if (this.currentValue instanceof Array) {
            var formatted = [];
            for (var i = 0; i < this.currentValue.length; ++i) {
                formatted.push(this.formatOne(this.currentValue[i], this.targetValue[i]));
            }
            return this.formatMultiple(formatted);
        }
        else {
            return this.formatOne(this.currentValue, this.targetValue);
        }
    };
    Numbers.prototype.formatOne = function (currentValue, targetValue) {
        var span = document.createElement('span');
        if (currentValue != targetValue) {
            span.classList.add('bx-counter-in-progress');
        }
        span.innerText = (currentValue === null ? '-' : currentValue);
        return span.outerHTML;
    };
    Numbers.prototype.formatMultiple = function (formattedValues) {
        return formattedValues.join('/');
    };
    Numbers.prototype.ensureNumbers = function () {
        var _this = this;
        if (this.currentValue instanceof Array) {
            this.currentValue = this.currentValue.map(function (v) { return _this.ensureOneNumber(v); });
            this.targetValue = this.targetValue.map(function (v) { return _this.ensureOneNumber(v); });
        }
        else {
            this.currentValue = this.ensureOneNumber(this.currentValue);
            this.targetValue = this.ensureOneNumber(this.targetValue);
        }
    };
    Numbers.prototype.ensureOneNumber = function (value) {
        return (value === null ? null : parseInt(value));
    };
    Numbers.prototype.currentAtTarget = function () {
        var _this = this;
        if (this.currentValue instanceof Array) {
            return this.currentValue.every(function (v, i) { return v == _this.targetValue[i]; });
        }
        else {
            return (this.currentValue == this.targetValue);
        }
    };
    Numbers.prototype.getElement = function (targetIdOrElement) {
        if (typeof targetIdOrElement == "string") {
            return document.getElementById(targetIdOrElement);
        }
        return targetIdOrElement;
    };
    return Numbers;
}());
var determineBoardWidth = function () {
    return 2000;
};
var determineMaxZoomLevel = function () {
    var bodycoords = dojo.marginBox("zoom-overall");
    var contentWidth = bodycoords.w;
    var rowWidth = determineBoardWidth();
    return contentWidth / rowWidth;
};
var getZoomLevels = function (maxZoomLevels) {
    var zoomLevels = [];
    if (maxZoomLevels > 1) {
        var maxZoomLevelsAbove1 = maxZoomLevels - 1;
        var increments = (maxZoomLevelsAbove1 / 3);
        zoomLevels = [(increments) + 1, increments + increments + 1, increments + increments + increments + 1];
    }
    zoomLevels = __spreadArray(__spreadArray([], zoomLevels, true), [1, 0.8, 0.6], false);
    return zoomLevels.sort();
};
var AutoZoomManager = /** @class */ (function (_super) {
    __extends(AutoZoomManager, _super);
    function AutoZoomManager(elementId, localStorageKey) {
        var storedZoomLevel = localStorage.getItem(localStorageKey);
        var maxZoomLevel = determineMaxZoomLevel();
        if (storedZoomLevel && Number(storedZoomLevel) > maxZoomLevel) {
            localStorage.removeItem(localStorageKey);
        }
        var zoomLevels = getZoomLevels(determineMaxZoomLevel());
        return _super.call(this, {
            element: document.getElementById(elementId),
            smooth: true,
            zoomLevels: zoomLevels,
            defaultZoom: 1,
            localStorageZoomKey: localStorageKey,
            zoomControls: {
                color: 'black',
                position: 'top-right'
            }
        }) || this;
    }
    return AutoZoomManager;
}(ZoomManager));
var CounterVoidStock = /** @class */ (function (_super) {
    __extends(CounterVoidStock, _super);
    function CounterVoidStock(game, manager, setting) {
        var _this = _super.call(this, manager, document.createElement("div")) || this;
        _this.game = game;
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
        _this.counter = new Numbers(game);
        _this.counter.addTarget(setting.counterId);
        _this.counter.setValue(setting.initialCounterValue);
        return _this;
    }
    CounterVoidStock.prototype.create = function (nodeId) { };
    CounterVoidStock.prototype.getValue = function () { return this.counter.getValue(); };
    CounterVoidStock.prototype.incValue = function (by) { this.counter.setValue(this.counter.getValue() + by); };
    CounterVoidStock.prototype.decValue = function (by) { this.counter.setValue(this.counter.getValue() - by); };
    CounterVoidStock.prototype.setValue = function (value) { this.counter.setValue(value); };
    CounterVoidStock.prototype.toValue = function (value) { this.counter.toValue(value); };
    CounterVoidStock.prototype.disable = function () { };
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
    ArtCardManager.prototype.setUpVincent = function () {
        this.playerHand[Number(-999999)] = new VoidStock(this, $('vincent-card-stock'));
    };
    ArtCardManager.prototype.takeCard = function (playerId, card) {
        this.updateCardInformations(card);
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
        displayCards.forEach(function (card) { return _this.updateCardInformations(card); });
        var promises = [];
        displayCards.slice(0, -1).forEach(function (card) {
            promises.push(_this.animationManager.play(new BgaAttachWithAnimation({
                animation: new BgaSlideAnimation({ element: $(_this.getId(card)), transitionTimingFunction: 'ease-out' }),
                attachElement: document.querySelector("[data-slot-id=\"art-card-display-slot-".concat(card.location_arg, "\"]"))
            })));
        });
        return Promise.all(promises)
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
    ArtCardManager.prototype.getPlayerCards = function (playerId) {
        return this.playerHand[playerId].getCards();
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
        for (var playersKey in gameData.players) {
            var player = gameData.players[playersKey];
            this.players[Number(playersKey)] = new LineStock(this, $("player-background-".concat(playersKey)));
            this.players[Number(playersKey)].addCards(player.backgroundCards);
        }
    };
    BackgroundCardManager.prototype.getPlayerCards = function (playerId) {
        return this.players[playerId].getCards();
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
            setupFrontDiv: function (card, div) { return _this.setupFrontDiv(card, div); },
            setupBackDiv: function (card, div) { return _this.setupBackDiv(card, div); },
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
        gameData.scoringCards.forEach(function (card) { return _this.display.addCard(card).then(function () {
            _this.canvasGame.setTooltip(_this.getId(card), _this.formatDescription(card.description));
        }); });
    };
    ScoringCardManager.prototype.getCardForType = function (type) {
        return this.display.getCards().find(function (card) { return card.location === type; });
    };
    ScoringCardManager.prototype.setupFrontDiv = function (card, div) {
        div.id = "".concat(this.getId(card), "-front");
        div.dataset.type = '' + card.type_arg;
        if (div.getElementsByClassName('scoring-card-title').length === 0) {
            var title = document.createElement('div');
            title.classList.add('scoring-card-title');
            var titleText = document.createTextNode(_(card.name));
            title.appendChild(titleText);
            div.appendChild(title);
        }
    };
    ScoringCardManager.prototype.setupBackDiv = function (card, div) {
        div.id = "".concat(this.getId(card), "-back");
        div.dataset.type = '' + card.type_arg;
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        if (div.getElementsByClassName('scoring-card-clarifications').length === 0) {
            var clarifications = document.createElement('div');
            clarifications.classList.add('scoring-card-clarifications');
            var clarificationsText = document.createTextNode(_("Clarifications"));
            clarifications.appendChild(clarificationsText);
            div.appendChild(clarifications);
            var description = document.createElement('div');
            description.classList.add('scoring-card-description');
            description.innerHTML = this.formatDescription(card.description);
            div.appendChild(description);
            var examples = document.createElement('div');
            examples.classList.add('scoring-card-examples');
            var examplesText = document.createTextNode(_("Examples"));
            examples.appendChild(examplesText);
            div.appendChild(examples);
        }
    };
    ScoringCardManager.prototype.formatDescription = function (description) {
        //@ts-ignore
        return bga_format(_(description), {
            '_': function (t) { return "<span class=\"canvas-element-icon ".concat(t, "\"></span>"); }
        });
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
            this.players[Number(playersKey)] = new CounterVoidStock(this.canvasGame, this, {
                counter: new ebg.counter(),
                targetElement: "canvas-counters-".concat(playersKey),
                counterId: "canvas-inspiration-token-counter-".concat(playersKey),
                initialCounterValue: gameData.players[playersKey].inspirationTokens.length,
                setupIcon: function (element) { element.classList.add("canvas-inspiration-token-2d"); }
            });
        }
        this.placeOnCards(gameData.displayInspirationTokens);
    };
    InspirationTokenManager.prototype.setUpVincent = function (inspirationTokens) {
        this.players[Number(-999999)] = new CounterVoidStock(this.canvasGame, this, {
            counter: new ebg.counter(),
            targetElement: "canvas-counters-vincent",
            counterId: "canvas-inspiration-token-counter-vincent",
            initialCounterValue: inspirationTokens.length,
            setupIcon: function (element) { element.classList.add("canvas-inspiration-token-2d"); }
        });
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
        this.players[Number(player.id)][ribbonType] = new CounterVoidStock(this.canvasGame, this, {
            counter: new ebg.counter(),
            targetElement: "canvas-counters-".concat(player.id),
            counterId: "canvas-ribbon-counter-".concat(player.id, "-").concat(ribbonType),
            initialCounterValue: player.ribbons[ribbonType],
            setupIcon: function (element) {
                element.classList.add("canvas-ribbon");
                element.dataset.type = ribbonType;
            }
        });
        if (Number(player.id) === this.canvasGame.getPlayerId()) {
            var scoringCard = this.canvasGame.scoringCardManager.getCardForType(ribbonType);
            if (scoringCard) {
                var maxRibbonsForScoringCard = Math.max.apply(Math, Object.keys(scoringCard.scoring).map(function (k) { return Number(k); }));
                var id = "current-player-ribbon-counter-".concat(ribbonType);
                dojo.place("<div class=\"current-player-ribbon-counter\"><span id=\"".concat(id, "\"></span>/<span>").concat(maxRibbonsForScoringCard, "</span></div>"), dojo.query("[data-slot-id=\"scoring-card-display-slot-".concat(ribbonType, "\"]"))[0]);
                this.players[Number(player.id)][ribbonType].counter.addTarget(id);
            }
        }
    };
    RibbonManager.ribbonTokenId = 0;
    return RibbonManager;
}(CardManager));
var PaintingManager = /** @class */ (function () {
    function PaintingManager(canvasGame) {
        this.canvasGame = canvasGame;
        this.isCompletePaintingMode = false;
        this.completePaintingMode = {
            backgroundCards: [],
            artCards: [],
            painting: {
                backgroundCard: undefined,
                artCards: [undefined, undefined, undefined]
            },
        };
    }
    PaintingManager.prototype.setUp = function (gameData) {
        var _this = this;
        var _loop_3 = function (playersKey) {
            var player = gameData.players[playersKey];
            player.paintings.forEach(function (painting) { return _this.createPainting(painting, false); });
            if (Number(playersKey) === this_1.canvasGame.getPlayerId()) {
                if (player.draftPainting) {
                    this_1.completePaintingMode.painting.backgroundCard = player.backgroundCards.find(function (card) { return card.id === player.draftPainting.backgroundCardId; });
                    this_1.completePaintingMode.painting.artCards = player.draftPainting.artCardIds.map(function (artCardId) { return artCardId ? player.handCards.find(function (card) { return card.id === artCardId; }) : undefined; });
                }
            }
        };
        var this_1 = this;
        for (var playersKey in gameData.players) {
            _loop_3(playersKey);
        }
    };
    PaintingManager.prototype.createPainting = function (painting, showAnimation) {
        var targetElementId = "player-finished-paintings-".concat(painting.playerId);
        var paintingElementId = "player-finished-painting-".concat(painting.id);
        var cardsWrapperId = "".concat(paintingElementId, "-cards-wrapper");
        var ribbonsWrapperId = "".concat(paintingElementId, "-ribbons-wrapper");
        dojo.place("<div id=\"".concat(paintingElementId, "\" class=\"canvas-painting\">\n                            <div id=\"").concat(ribbonsWrapperId, "\" style=\"color: white;\" class=\"canvas-painting-ribbons\"></div>\n                            <div id=\"").concat(cardsWrapperId, "\" class=\"canvas-painting-cards-wrapper\"></div>\n                         </div>"), showAnimation ? 'canvas-table' : targetElementId);
        Object.entries(painting.ribbons)
            .filter(function (_a) {
            var key = _a[0], value = _a[1];
            return value > 0;
        })
            .forEach(function (_a) {
            var key = _a[0], value = _a[1];
            dojo.place("<span class=\"canvas-painting-ribbons-ribbon\"><span>".concat(value, "</span><span class=\"canvas-ribbon\" data-type=\"").concat(key, "\"></span></span>"), ribbonsWrapperId);
        });
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
        dojo.connect($("save-painting-".concat(painting.id)), 'onclick', function () { return _this.paintingToPng(painting, 4); });
    };
    PaintingManager.prototype.enterCompletePaintingMode = function (backgroundCards, artCards) {
        var _this = this;
        this.isCompletePaintingMode = true;
        this.completePaintingMode.backgroundCards = backgroundCards;
        this.completePaintingMode.artCards = artCards;
        this.completePaintingMode.painting.backgroundCard = this.completePaintingMode.painting.backgroundCard ? this.completePaintingMode.painting.backgroundCard : backgroundCards[0];
        dojo.place(this.createCompletePaintingPickerElement(), 'complete-painting');
        dojo.place(this.createCompletePaintingPreviewElement(), 'complete-painting');
        dojo.place(this.createBackgroundSlot(), 'art-cards-picker-top-text', 'before');
        dojo.place(this.createBackgroundElement(this.completePaintingMode.painting.backgroundCard), 'complete-painting-background-card-slot');
        dojo.connect($('change-background-button'), 'onclick', function () { return _this.changeBackgroundCard(); });
        var _loop_4 = function (i) {
            dojo.place(this_2.createArtCardSlot(i), 'art-cards-picker-top-text', 'before');
            if (this_2.completePaintingMode.painting.artCards[i]) {
                this_2.addCardToPaintingAtPosition(this_2.completePaintingMode.painting.artCards[i], i);
            }
            if (i !== 2) {
                dojo.connect($("art-cards-swap-".concat(i)), 'onclick', function () { return _this.swapArtCards(i); });
            }
        };
        var this_2 = this;
        for (var i = 0; i < 3; i++) {
            _loop_4(i);
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
    PaintingManager.prototype.exitCompletePaintingMode = function () {
        this.isCompletePaintingMode = false;
        dojo.empty('complete-painting');
    };
    PaintingManager.prototype.enterHighlightPaintingMode = function (player) {
        var overlayId = $('canvas-show-painting-overlay');
        dojo.empty(overlayId);
        dojo.addClass(overlayId, 'overlay-visible');
        dojo.place("<div class=\"title-wrapper\"><div class=\"title color-".concat(player.color, "\"><h1>").concat(dojo.string.substitute(_("${playerName}'s Completed Painting"), { playerName: player.name }), "</h1></div></div>"), overlayId);
    };
    PaintingManager.prototype.exitHighlightPaintingMode = function () {
        var overlayId = $('canvas-show-painting-overlay');
        dojo.removeClass(overlayId, 'overlay-visible');
    };
    PaintingManager.prototype.createCompletePaintingPickerElement = function () {
        return "\n            <div id=\"complete-painting-picker-wrapper\">\n                <div class=\"title-wrapper\"><div class=\"title\"><h1>".concat(_("Art Picker"), "</h1></div></div>\n                <div id=\"art-cards-picker\">\n                    <div id=\"art-cards-picker-bottom-text\"><h1>").concat(_("Back"), "</h1></div>\n                    <div id=\"art-cards-picker-top-text\"><h1>").concat(_("Front"), "</h1></div>\n                </div> \n                <div class=\"title-wrapper\"><div class=\"title\"><h1>").concat(_("Unused Cards"), "</h1></div></div>\n                <div id=\"art-cards-picker-unused\">\n                    \n                </div> \n            </div>\n        ");
    };
    PaintingManager.prototype.createCompletePaintingPreviewElement = function () {
        return "\n            <div id=\"complete-painting-preview\">\n                <div class=\"title-wrapper\"><div class=\"title secondary\"><h1>".concat(_("Painting Preview"), "</h1></div></div>\n                <div id=\"complete-painting-preview-scoring\" class=\"canvas-painting-ribbons\"></div>\n                <div id=\"complete-painting-preview-slot-wrapper\">\n                    <div id=\"complete-painting-preview-slot\" class=\"canvas-painting\"></div>   \n                </div>  \n            </div>\n        ");
    };
    PaintingManager.prototype.createArtCardSlot = function (id) {
        return "\n            <div>\n                <div class=\"button-wrapper center-overlap-button-wrapper\">\n                    <a id=\"art-cards-swap-".concat(id, "\" class=\"bgabutton bgabutton_blue\" style=\"").concat(id === 2 ? 'display: none;' : '', "\"><i class=\"fa fa-exchange\" aria-hidden=\"true\"></i></a>\n                </div>\n                <div id=\"complete-painting-art-card-slot-").concat(id, "\" class=\"complete-painting-art-card-slot\"><span>").concat(id + 1, "</span></div>\n            </div>\n        ");
    };
    PaintingManager.prototype.createBackgroundSlot = function () {
        return "\n            <div>\n                <div class=\"center-button-wrapper button-wrapper\"><a id=\"change-background-button\" class=\"bgabutton bgabutton_blue\"><i class=\"fa fa-refresh\" aria-hidden=\"true\"></i></a></div>\n                <div id=\"complete-painting-background-card-slot\" class=\"complete-painting-art-card-slot\"></div>\n            </div>\n        ";
    };
    PaintingManager.prototype.createBackgroundElement = function (card, postfix) {
        if (postfix === void 0) { postfix = 'clone'; }
        console.log(card);
        var clone = this.canvasGame.backgroundCardManager.getCardElement(card).cloneNode(true);
        clone.id = "".concat(clone.id, "-").concat(postfix);
        clone.style = '';
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
            var cardElement = _this.createArtCardElement(card);
            dojo.place(cardElement, "art-cards-picker-unused");
            dojo.connect($(cardElement.id), 'onclick', function () {
                _this.addCardToPainting(card);
                _this.updateUnusedCards();
                _this.updatePreview();
            });
        });
    };
    PaintingManager.prototype.swapArtCards = function (i) {
        var cardInPosition1 = this.completePaintingMode.painting.artCards[i];
        var cardInPosition2 = this.completePaintingMode.painting.artCards[i + 1];
        if (cardInPosition1) {
            this.removeCardFromPainting(cardInPosition1);
        }
        if (cardInPosition2) {
            this.removeCardFromPainting(cardInPosition2);
        }
        if (cardInPosition1) {
            this.addCardToPaintingAtPosition(cardInPosition1, i + 1);
        }
        if (cardInPosition2) {
            this.addCardToPaintingAtPosition(cardInPosition2, i);
        }
        this.updateUnusedCards();
        this.updatePreview();
    };
    PaintingManager.prototype.addCardToPaintingAtPosition = function (card, index) {
        var _this = this;
        this.completePaintingMode.painting.artCards[index] = card;
        var cardElement = this.createArtCardElement(card);
        dojo.place(cardElement, "complete-painting-art-card-slot-".concat(index), 'only');
        dojo.connect($(cardElement.id), 'onclick', function () {
            _this.removeCardFromPainting(card);
            _this.updateUnusedCards();
            _this.updatePreview();
        });
    };
    PaintingManager.prototype.addCardToPainting = function (card) {
        var index = 0;
        for (var i = 0; i < this.completePaintingMode.painting.artCards.length; i++) {
            if (!this.completePaintingMode.painting.artCards[i]) {
                index = i;
                break;
            }
        }
        this.addCardToPaintingAtPosition(card, index);
    };
    PaintingManager.prototype.removeCardFromPainting = function (card) {
        var index = this.completePaintingMode.painting.artCards.indexOf(card);
        this.completePaintingMode.painting.artCards[index] = undefined;
        dojo.place("<span>".concat(index + 1, "</span>"), "complete-painting-art-card-slot-".concat(index), 'only');
    };
    PaintingManager.prototype.updatePreview = function () {
        this.createPaintingElement(this.completePaintingMode.painting.backgroundCard, this.completePaintingMode.painting.artCards, 'complete-painting-preview-slot', 'large');
        var artCardIds = this.completePaintingMode.painting.artCards.map(function (card) { return card ? card.id : null; });
        this.canvasGame.takeNoLockAction('scorePainting', {
            painting: JSON.stringify({
                backgroundCardId: this.completePaintingMode.painting.backgroundCard.id,
                artCardIds: artCardIds
            })
        });
    };
    PaintingManager.prototype.updatePreviewScore = function (args) {
        dojo.empty($('complete-painting-preview-scoring'));
        Object.entries(args).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            dojo.place("<span class=\"canvas-painting-ribbons-ribbon\"><span>".concat(value, "</span><span class=\"canvas-ribbon\" data-type=\"").concat(key, "\"></span></span>"), 'complete-painting-preview-scoring');
        });
    };
    PaintingManager.prototype.confirmPainting = function () {
        var _this = this;
        var artCardIds = this.completePaintingMode.painting.artCards.filter(function (card) { return !!card; }).map(function (card) { return card.id; });
        if (artCardIds.length === 3) {
            dojo.destroy('complete-painting-picker-wrapper');
            this.canvasGame.takeAction('completePainting', {
                painting: JSON.stringify({
                    backgroundCardId: this.completePaintingMode.painting.backgroundCard.id,
                    artCardIds: artCardIds
                })
            }, function () { return _this.completePaintingMode.painting = {
                backgroundCard: undefined,
                artCards: [undefined, undefined, undefined]
            }; });
        }
        else {
            this.canvasGame.showMessage(_("You need to add 3 Art Cards to your painting"), 'error');
        }
    };
    PaintingManager.prototype.createPaintingElement = function (backgroundCard, artCards, node, size, frame, includeCopyright, author) {
        if (size === void 0) { size = 'normal'; }
        if (frame === void 0) { frame = null; }
        if (includeCopyright === void 0) { includeCopyright = true; }
        if (author === void 0) { author = null; }
        var paintingId = "canvas-painting-".concat(backgroundCard.id, "-preview");
        var zIndex = 100;
        dojo.place("<div id=\"".concat(paintingId, "\" class=\"canvas-painting ").concat(size, "\"></div>"), node, 'only');
        var cardsWrapperId = "".concat(paintingId, "-cards-wrapper");
        dojo.place("<div class=\"flex-wrapper\" style=\"padding-right: ".concat(frame === 3 ? '16px' : '0', ";\"><div id=\"").concat(cardsWrapperId, "\" class=\"canvas-painting-cards-wrapper\"></div></div>"), paintingId);
        dojo.place("<div class=\"background-card background-card-".concat(backgroundCard.type, "\" style=\"z-index: ").concat(zIndex++, ";\"></div>"), cardsWrapperId);
        artCards.filter(function (card) { return !!card; }).forEach(function (card) { dojo.place("<div class=\"art-card art-card-".concat(card.type_arg, "\" style=\"z-index: ").concat(zIndex++, ";\"></div>"), cardsWrapperId); });
        if (frame) {
            dojo.place("<div class=\"canvas-frame\" data-type=\"".concat(frame, "\" style=\"z-index: ").concat(zIndex++, ";\"></div>"), node);
        }
        if (author) {
            dojo.place("<div class=\"canvas-frame-author\" style=\"z-index: ".concat(zIndex++, ";\">").concat(author, "</div>"), 'html2canvas-result');
        }
        if (includeCopyright) {
            dojo.place("<div class=\"canvas-copyright\" style=\"z-index: ".concat(zIndex++, "; color: ").concat(frame === 3 ? 'black' : 'white', ";\">&#169; Road To Infamy Games - Play Canvas on BoardGameArena.com</div>"), 'html2canvas-result');
        }
        return paintingId;
    };
    PaintingManager.prototype.paintingToPng = function (painting, frame) {
        var dialogId = 'share-painting-' + painting.id;
        var dialogContentId = 'share-painting-' + painting.id + '-content';
        var myDlg = new ebg.popindialog();
        myDlg.create(dialogId);
        myDlg.setTitle(_("Share your painting!"));
        myDlg.setContent("<div id=\"".concat(dialogContentId, "\" class=\"share-painting-dialog-content\"><div class=\"lds-ellipsis\"><div></div><div></div><div></div><div></div></div></div>"));
        myDlg.show();
        this.createPaintingElement(painting.backgroundCard, painting.artCards, 'html2canvas-result', 'large', frame, true, this.canvasGame.getPlayer(painting.playerId).name);
        // @ts-ignore
        require([g_gamethemeurl + 'modules/html2canvas.js'], function (html2canvas) {
            var _this = this;
            html2canvas(document.querySelector("#html2canvas-result"), { scale: 1, imageTimeout: 0, allowTaint: true, useCORS: true, backgroundColor: null }).then(function (canvas) {
                var fileName = "my-canvas-painting-".concat(new Date().getTime(), ".png");
                var dataUrl = canvas.toDataURL("image/png");
                dojo.empty(dialogContentId);
                dojo.place("<a id=\"change-frame-".concat(painting.id, "\" class=\"bgabutton bgabutton_blue\"><i class=\"fa fa-refresh\" aria-hidden=\"true\"></i></a>"), dialogContentId);
                dojo.place("<img src=\"".concat(dataUrl, "\" crossorigin=\"anonymous\" />"), dialogContentId);
                dojo.place("<span>".concat(_("Share your #CanvasPainting with the world by clicking the buttons below"), "</span>"), dialogContentId);
                dojo.place("<a id=\"download-painting-".concat(painting.id, "\" class=\"bgabutton bgabutton_blue\" href=\"").concat(dataUrl, "\" download=\"").concat(fileName, "\"><i class=\"fa fa-download\" aria-hidden=\"true\"></i></a>"), dialogContentId);
                dojo.place("<a id=\"share-painting-".concat(painting.id, "\" class=\"bgabutton bgabutton_blue\"><i class=\"fa fa-share\" aria-hidden=\"true\"></i></a>"), dialogContentId);
                dojo.connect($("change-frame-".concat(painting.id)), 'onclick', function () { return __awaiter(_this, void 0, void 0, function () {
                    var nextFrameIndex;
                    return __generator(this, function (_a) {
                        nextFrameIndex = frame + 1;
                        nextFrameIndex = nextFrameIndex > 4 ? 1 : nextFrameIndex;
                        this.paintingToPng(painting, nextFrameIndex);
                        return [2 /*return*/];
                    });
                }); });
                // Share Button
                dojo.connect($("share-painting-".concat(painting.id)), 'onclick', function () { return __awaiter(_this, void 0, void 0, function () {
                    var blob, data, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.asBlob(dataUrl)];
                            case 1:
                                blob = _a.sent();
                                data = {
                                    files: [
                                        new File([blob], fileName, {
                                            type: blob.type,
                                        }),
                                    ],
                                    title: 'Canvas Painting',
                                    text: 'Look at my #CanvasPainting. Play Canvas on BoardGameArena.com'
                                };
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 6, , 7]);
                                if (!(navigator.canShare && navigator.canShare(data))) return [3 /*break*/, 4];
                                return [4 /*yield*/, navigator.share(data)];
                            case 3:
                                _a.sent();
                                return [3 /*break*/, 5];
                            case 4:
                                document.getElementById("download-painting-".concat(painting.id)).click();
                                _a.label = 5;
                            case 5: return [3 /*break*/, 7];
                            case 6:
                                err_1 = _a.sent();
                                console.error(err_1.name, err_1.message);
                                return [3 /*break*/, 7];
                            case 7: return [2 /*return*/];
                        }
                    });
                }); });
            });
        }.bind(this));
    };
    PaintingManager.prototype.asBlob = function (dataUrl) {
        return new Promise(function (resolve) {
            var binaryString = atob(dataUrl.split(',')[1]);
            var length = binaryString.length;
            var binaryArray = new Uint8Array(length);
            for (var i = 0; i < length; i++) {
                binaryArray[i] = binaryString.charCodeAt(i);
            }
            resolve(new Blob([binaryArray], {
                type: 'image/png',
            }));
        });
    };
    return PaintingManager;
}());
var PlayerManager = /** @class */ (function () {
    function PlayerManager(game) {
        this.game = game;
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
    PlayerManager.prototype.createVincentPlayerPanel = function () {
        var lastPlayerId = null;
        for (var playersKey in this.game.gamedatas.players) {
            if (Object.keys(this.game.gamedatas.players).length === Number(this.game.gamedatas.players[playersKey].playerNo)) {
                lastPlayerId = this.game.gamedatas.players[playersKey].id;
            }
        }
        dojo.place("<div id=\"overall_vincent_board\" class=\"player-board\" style=\"height: auto;\">\n                                    <div class=\"player_board_inner\">\n                                            <h1 style=\"text-align: center;\">Vincent</h1>\n                                            <div class=\"player_board_content\">\n                                                ".concat(this.createCanvasCounterWrapper('vincent'), "\n                                                <div id=\"vincent-card-stock\"></div>\n                                            </div>\n                                    </div>\n                                </div>"), "overall_player_board_".concat(lastPlayerId), 'after');
    };
    PlayerManager.prototype.createSoloScoreToBeatPanel = function (soloScoreToBeat) {
        dojo.place("<div id=\"overall-solo-score-to-beat\" class=\"player-board\" style=\"height: auto;\">\n                                    <div class=\"player_board_inner\">\n                                            <div class=\"player_board_content\">\n                                                <h1 style=\"text-align: center;\">".concat(_('Goal Score'), "</h1>\n                                                <span class=\"canvas-score-crosshair\">").concat(soloScoreToBeat, "</span>\n                                            </div>\n                                    </div>\n                                </div>"), "player_boards", 'first');
    };
    PlayerManager.prototype.createPlayerArea = function (player) {
        return "<div id=\"player-area-".concat(player.id, "\" class=\"player-area whiteblock\">\n                    <div class=\"title-wrapper\"><div class=\"title color-").concat(player.color, "\"><h1>").concat(dojo.string.substitute(_("${playerName}'s Art Collection"), { playerName: player.name }), "</h1></div></div>\n                    <div id=\"player-inspiration-tokens-").concat(player.id, "\"></div>\n                    <div class=\"title-wrapper\"><div class=\"title color-").concat(player.color, "\"><h1>").concat(_("Hand Cards"), "</h1></div></div>\n                    <div id=\"player-hand-").concat(player.id, "\" class=\"player-hand\"></div>\n                    <div class=\"title-wrapper\"><div class=\"title color-").concat(player.color, "\"><h1>").concat(_("Finished Paintings"), "</h1></div></div>\n                    <div id=\"player-finished-paintings-").concat(player.id, "\" class=\"player-finished-paintings\"></div>\n                    <div id=\"player-background-").concat(player.id, "\" style=\"display: none;\"></div>\n                </div>");
    };
    PlayerManager.prototype.createPlayerPanels = function (player) {
        dojo.place(this.createCanvasCounterWrapper(player.id), "player_board_".concat(player.id));
    };
    PlayerManager.prototype.createCanvasCounterWrapper = function (id) {
        return "<div id=\"canvas-counters-".concat(id, "\" class=\"canvas-counters\" ></div>");
    };
    return PlayerManager;
}());
var ANIMATION_MS = 800;
var TOOLTIP_DELAY = document.body.classList.contains('touch-device') ? 1500 : undefined;
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
        this.zoomManager = new AutoZoomManager('canvas-table', 'canvas-zoom-level');
        this.animationManager = new AnimationManager(this, { duration: ANIMATION_MS });
        this.scoringCardManager = new ScoringCardManager(this);
        this.playerManager = new PlayerManager(this);
        this.artCardManager = new ArtCardManager(this);
        this.backgroundCardManager = new BackgroundCardManager(this);
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
        if (!this.isReadOnly() && this.isCurrentPlayerActive()) {
            if (!this.paintingManager.isCompletePaintingMode) {
                this.toggleCompletePaintingTool();
            }
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
            this.paintingManager.exitCompletePaintingMode();
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
        if (this.isCurrentPlayerActive()) {
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
                    if (args.availableActions.length > 1) {
                        this.addActionButton('cancelAction', _("Cancel"), function () { return _this.cancelAction(); }, null, null, 'gray');
                    }
                    break;
                case 'completePainting':
                    this.addActionButton('confirmCompletePainting', _("Confirm"), function () { return _this.confirmCompletePainting(); });
                    if (args.availableActions.length > 1) {
                        this.addActionButton('cancelAction', _("Cancel"), function () { return _this.cancelAction(); }, null, null, 'gray');
                    }
                    break;
            }
            if ([].includes(stateName) && args.canCancelMoves) {
                this.addActionButton('undoLastMoves', _("Undo last moves"), function () { return _this.undoLastMoves(); }, null, null, 'gray');
            }
        }
        if (!(this.isCurrentPlayerActive() && stateName == 'completePainting')) {
            this.addActionButton('toggleCompletePaintingTool', _("Show/Hide Complete Painting Tool"), function () { return _this.toggleCompletePaintingTool(); }, null, null, 'gray');
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
    Canvas.prototype.toggleCompletePaintingTool = function () {
        if (this.paintingManager.isCompletePaintingMode) {
            this.paintingManager.exitCompletePaintingMode();
        }
        else {
            this.paintingManager.enterCompletePaintingMode(this.backgroundCardManager.getPlayerCards(this.getPlayerId()), this.artCardManager.getPlayerCards(this.getPlayerId()));
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
    Canvas.prototype.takeAction = function (action, data, onComplete) {
        if (onComplete === void 0) { onComplete = function () { }; }
        data = data || {};
        data.lock = true;
        this.ajaxcall("/canvas/canvas/".concat(action, ".html"), data, this, onComplete);
    };
    Canvas.prototype.takeNoLockAction = function (action, data, onComplete) {
        if (onComplete === void 0) { onComplete = function () { }; }
        data = data || {};
        this.ajaxcall("/canvas/canvas/".concat(action, ".html"), data, this, onComplete);
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
        if (this.paintingManager.isCompletePaintingMode) {
            this.paintingManager.updatePreviewScore(args);
        }
    };
    Canvas.prototype.notif_paintingCompleted = function (args) {
        var _this = this;
        if (args.playerId === this.getPlayerId()) {
            this.paintingManager.exitCompletePaintingMode();
        }
        this.paintingManager.enterHighlightPaintingMode(this.getPlayer(args.playerId));
        return this.paintingManager.createPainting(args.painting, true)
            .then(function () { return _this.ribbonManager.updateRibbonCounters(args.playerId, args.painting, args.paintingRibbons); })
            .then(function () { return _this.paintingManager.exitHighlightPaintingMode(); })
            .then(function () { return _this.animationManager.play(new BgaAttachWithAnimation({
            animation: new BgaSlideAnimation({ element: $("player-finished-painting-".concat(args.painting.id)), transitionTimingFunction: 'ease-out' }),
            attachElement: document.getElementById("player-finished-paintings-".concat(args.playerId))
        })); })
            .then(function () {
            _this.paintingManager.addPaintingToPngButton(args.painting, "player-finished-painting-".concat(args.painting.id));
            _this.setScore(args.playerId, args.playerScore);
        });
    };
    Canvas.prototype.updatePlayerOrdering = function () {
        this.inherited(arguments);
        if (this.gamedatas.vincent.active) {
            this.playerManager.createVincentPlayerPanel();
            this.inspirationTokenManager.setUpVincent(this.gamedatas.vincent.inspirationTokens);
            this.artCardManager.setUpVincent();
        }
        if (this.gamedatas.soloScoreToBeat) {
            this.playerManager.createSoloScoreToBeatPanel(this.gamedatas.soloScoreToBeat);
        }
    };
    Canvas.prototype.format_string_recursive = function (log, args) {
        var _this = this;
        try {
            if (log && args && !args.processed) {
                Object.keys(args).forEach(function (argKey) {
                    if (argKey.startsWith('ribbonIcons') && typeof args[argKey] == 'object') {
                        var ribbons_1 = [];
                        Object.keys(args[argKey]).forEach(function (key) {
                            for (var i = 0; i < args[argKey][key]; i++) {
                                ribbons_1.push(_this.getRibbonIcon(key));
                            }
                        });
                        args[argKey] = ribbons_1.join('');
                    }
                    else if (argKey.startsWith('inspiration_tokens') && typeof args[argKey] == 'number') {
                        args[argKey] = _this.getInspirationTokenIcon(args[argKey]);
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
    Canvas.prototype.getInspirationTokenIcon = function (number) {
        return "".concat(number, "<span class=\"canvas-inspiration-token-2d\" style=\"margin-left: 4px; margin-right: 2px;\"></span>");
    };
    return Canvas;
}());
