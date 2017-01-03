(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// https://d3js.org/d3-color/ Version 1.0.1. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reHex3 = /^#([0-9a-f]{3})$/;
  var reHex6 = /^#([0-9a-f]{6})$/;
  var reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;
  var reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
  var reRgbaInteger = /^rgba\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
  var reRgbaPercent = /^rgba\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
  var reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
  var reHslaPercent = /^hsla\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)\s*\)$/;
  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    displayable: function() {
      return this.rgb().displayable();
    },
    toString: function() {
      return this.rgb() + "";
    }
  });

  function color(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
        : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format])
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (0 <= this.r && this.r <= 255)
          && (0 <= this.g && this.g <= 255)
          && (0 <= this.b && this.b <= 255)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    toString: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var deg2rad = Math.PI / 180;
  var rad2deg = 180 / Math.PI;

  var Kn = 18;
  var Xn = 0.950470;
  var Yn = 1;
  var Zn = 1.088830;
  var t0 = 4 / 29;
  var t1 = 6 / 29;
  var t2 = 3 * t1 * t1;
  var t3 = t1 * t1 * t1;
  function labConvert(o) {
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) {
      var h = o.h * deg2rad;
      return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
    }
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var b = rgb2xyz(o.r),
        a = rgb2xyz(o.g),
        l = rgb2xyz(o.b),
        x = xyz2lab((0.4124564 * b + 0.3575761 * a + 0.1804375 * l) / Xn),
        y = xyz2lab((0.2126729 * b + 0.7151522 * a + 0.0721750 * l) / Yn),
        z = xyz2lab((0.0193339 * b + 0.1191920 * a + 0.9503041 * l) / Zn);
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  }

  function lab(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
  }

  function Lab(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Lab, lab, extend(Color, {
    brighter: function(k) {
      return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function(k) {
      return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      y = Yn * lab2xyz(y);
      x = Xn * lab2xyz(x);
      z = Zn * lab2xyz(z);
      return new Rgb(
        xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
        xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
        xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z),
        this.opacity
      );
    }
  }));

  function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  }

  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }

  function xyz2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2xyz(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function hclConvert(o) {
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    var h = Math.atan2(o.b, o.a) * rad2deg;
    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  }

  function hcl(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
  }

  function Hcl(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hcl, hcl, extend(Color, {
    brighter: function(k) {
      return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k), this.opacity);
    },
    darker: function(k) {
      return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k), this.opacity);
    },
    rgb: function() {
      return labConvert(this).rgb();
    }
  }));

  var A = -0.14861;
  var B = +1.78277;
  var C = -0.29227;
  var D = -0.90649;
  var E = +1.97294;
  var ED = E * D;
  var EB = E * B;
  var BC_DA = B * C - D * A;
  function cubehelixConvert(o) {
    if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
        bl = b - l,
        k = (E * (g - l) - C * bl) / D,
        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
        h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
    return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
  }

  function cubehelix(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
  }

  function Cubehelix(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Cubehelix, cubehelix, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
          l = +this.l,
          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
          cosh = Math.cos(h),
          sinh = Math.sin(h);
      return new Rgb(
        255 * (l + a * (A * cosh + B * sinh)),
        255 * (l + a * (C * cosh + D * sinh)),
        255 * (l + a * (E * cosh)),
        this.opacity
      );
    }
  }));

  exports.color = color;
  exports.rgb = rgb;
  exports.hsl = hsl;
  exports.lab = lab;
  exports.hcl = hcl;
  exports.cubehelix = cubehelix;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{}],2:[function(require,module,exports){
// https://d3js.org/d3-dispatch/ Version 1.0.1. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  var noop = {value: function() {}};

  function dispatch() {
    for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
      if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
      _[t] = [];
    }
    return new Dispatch(_);
  }

  function Dispatch(_) {
    this._ = _;
  }

  function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
      return {type: t, name: name};
    });
  }

  Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
      var _ = this._,
          T = parseTypenames(typename + "", _),
          t,
          i = -1,
          n = T.length;

      // If no callback was specified, return the callback of the given type and name.
      if (arguments.length < 2) {
        while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
        return;
      }

      // If a type was specified, set the callback for the given type and name.
      // Otherwise, if a null callback was specified, remove callbacks of the given name.
      if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
      while (++i < n) {
        if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
        else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
      }

      return this;
    },
    copy: function() {
      var copy = {}, _ = this._;
      for (var t in _) copy[t] = _[t].slice();
      return new Dispatch(copy);
    },
    call: function(type, that) {
      if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
      if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
      for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
    }
  };

  function get(type, name) {
    for (var i = 0, n = type.length, c; i < n; ++i) {
      if ((c = type[i]).name === name) {
        return c.value;
      }
    }
  }

  function set(type, name, callback) {
    for (var i = 0, n = type.length; i < n; ++i) {
      if (type[i].name === name) {
        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
      }
    }
    if (callback != null) type.push({name: name, value: callback});
    return type;
  }

  exports.dispatch = dispatch;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{}],3:[function(require,module,exports){
// https://d3js.org/d3-ease/ Version 1.0.1. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  function linear(t) {
    return +t;
  }

  function quadIn(t) {
    return t * t;
  }

  function quadOut(t) {
    return t * (2 - t);
  }

  function quadInOut(t) {
    return ((t *= 2) <= 1 ? t * t : --t * (2 - t) + 1) / 2;
  }

  function cubicIn(t) {
    return t * t * t;
  }

  function cubicOut(t) {
    return --t * t * t + 1;
  }

  function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
  }

  var exponent = 3;

  var polyIn = (function custom(e) {
    e = +e;

    function polyIn(t) {
      return Math.pow(t, e);
    }

    polyIn.exponent = custom;

    return polyIn;
  })(exponent);

  var polyOut = (function custom(e) {
    e = +e;

    function polyOut(t) {
      return 1 - Math.pow(1 - t, e);
    }

    polyOut.exponent = custom;

    return polyOut;
  })(exponent);

  var polyInOut = (function custom(e) {
    e = +e;

    function polyInOut(t) {
      return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
    }

    polyInOut.exponent = custom;

    return polyInOut;
  })(exponent);

  var pi = Math.PI;
  var halfPi = pi / 2;
  function sinIn(t) {
    return 1 - Math.cos(t * halfPi);
  }

  function sinOut(t) {
    return Math.sin(t * halfPi);
  }

  function sinInOut(t) {
    return (1 - Math.cos(pi * t)) / 2;
  }

  function expIn(t) {
    return Math.pow(2, 10 * t - 10);
  }

  function expOut(t) {
    return 1 - Math.pow(2, -10 * t);
  }

  function expInOut(t) {
    return ((t *= 2) <= 1 ? Math.pow(2, 10 * t - 10) : 2 - Math.pow(2, 10 - 10 * t)) / 2;
  }

  function circleIn(t) {
    return 1 - Math.sqrt(1 - t * t);
  }

  function circleOut(t) {
    return Math.sqrt(1 - --t * t);
  }

  function circleInOut(t) {
    return ((t *= 2) <= 1 ? 1 - Math.sqrt(1 - t * t) : Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
  }

  var b1 = 4 / 11;
  var b2 = 6 / 11;
  var b3 = 8 / 11;
  var b4 = 3 / 4;
  var b5 = 9 / 11;
  var b6 = 10 / 11;
  var b7 = 15 / 16;
  var b8 = 21 / 22;
  var b9 = 63 / 64;
  var b0 = 1 / b1 / b1;
  function bounceIn(t) {
    return 1 - bounceOut(1 - t);
  }

  function bounceOut(t) {
    return (t = +t) < b1 ? b0 * t * t : t < b3 ? b0 * (t -= b2) * t + b4 : t < b6 ? b0 * (t -= b5) * t + b7 : b0 * (t -= b8) * t + b9;
  }

  function bounceInOut(t) {
    return ((t *= 2) <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
  }

  var overshoot = 1.70158;

  var backIn = (function custom(s) {
    s = +s;

    function backIn(t) {
      return t * t * ((s + 1) * t - s);
    }

    backIn.overshoot = custom;

    return backIn;
  })(overshoot);

  var backOut = (function custom(s) {
    s = +s;

    function backOut(t) {
      return --t * t * ((s + 1) * t + s) + 1;
    }

    backOut.overshoot = custom;

    return backOut;
  })(overshoot);

  var backInOut = (function custom(s) {
    s = +s;

    function backInOut(t) {
      return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
    }

    backInOut.overshoot = custom;

    return backInOut;
  })(overshoot);

  var tau = 2 * Math.PI;
  var amplitude = 1;
  var period = 0.3;
  var elasticIn = (function custom(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

    function elasticIn(t) {
      return a * Math.pow(2, 10 * --t) * Math.sin((s - t) / p);
    }

    elasticIn.amplitude = function(a) { return custom(a, p * tau); };
    elasticIn.period = function(p) { return custom(a, p); };

    return elasticIn;
  })(amplitude, period);

  var elasticOut = (function custom(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

    function elasticOut(t) {
      return 1 - a * Math.pow(2, -10 * (t = +t)) * Math.sin((t + s) / p);
    }

    elasticOut.amplitude = function(a) { return custom(a, p * tau); };
    elasticOut.period = function(p) { return custom(a, p); };

    return elasticOut;
  })(amplitude, period);

  var elasticInOut = (function custom(a, p) {
    var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);

    function elasticInOut(t) {
      return ((t = t * 2 - 1) < 0
          ? a * Math.pow(2, 10 * t) * Math.sin((s - t) / p)
          : 2 - a * Math.pow(2, -10 * t) * Math.sin((s + t) / p)) / 2;
    }

    elasticInOut.amplitude = function(a) { return custom(a, p * tau); };
    elasticInOut.period = function(p) { return custom(a, p); };

    return elasticInOut;
  })(amplitude, period);

  exports.easeLinear = linear;
  exports.easeQuad = quadInOut;
  exports.easeQuadIn = quadIn;
  exports.easeQuadOut = quadOut;
  exports.easeQuadInOut = quadInOut;
  exports.easeCubic = cubicInOut;
  exports.easeCubicIn = cubicIn;
  exports.easeCubicOut = cubicOut;
  exports.easeCubicInOut = cubicInOut;
  exports.easePoly = polyInOut;
  exports.easePolyIn = polyIn;
  exports.easePolyOut = polyOut;
  exports.easePolyInOut = polyInOut;
  exports.easeSin = sinInOut;
  exports.easeSinIn = sinIn;
  exports.easeSinOut = sinOut;
  exports.easeSinInOut = sinInOut;
  exports.easeExp = expInOut;
  exports.easeExpIn = expIn;
  exports.easeExpOut = expOut;
  exports.easeExpInOut = expInOut;
  exports.easeCircle = circleInOut;
  exports.easeCircleIn = circleIn;
  exports.easeCircleOut = circleOut;
  exports.easeCircleInOut = circleInOut;
  exports.easeBounce = bounceOut;
  exports.easeBounceIn = bounceIn;
  exports.easeBounceOut = bounceOut;
  exports.easeBounceInOut = bounceInOut;
  exports.easeBack = backInOut;
  exports.easeBackIn = backIn;
  exports.easeBackOut = backOut;
  exports.easeBackInOut = backInOut;
  exports.easeElastic = elasticOut;
  exports.easeElasticIn = elasticIn;
  exports.easeElasticOut = elasticOut;
  exports.easeElasticInOut = elasticInOut;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{}],4:[function(require,module,exports){
// https://d3js.org/d3-interpolate/ Version 1.1.1. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-color')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-color'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3));
}(this, function (exports,d3Color) { 'use strict';

  function basis(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0
        + (4 - 6 * t2 + 3 * t3) * v1
        + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
        + t3 * v3) / 6;
  }

  function basis$1(values) {
    var n = values.length - 1;
    return function(t) {
      var i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
          v1 = values[i],
          v2 = values[i + 1],
          v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
          v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  function basisClosed(values) {
    var n = values.length;
    return function(t) {
      var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n),
          v0 = values[(i + n - 1) % n],
          v1 = values[i % n],
          v2 = values[(i + 1) % n],
          v3 = values[(i + 2) % n];
      return basis((t - i / n) * n, v0, v1, v2, v3);
    };
  }

  function constant(x) {
    return function() {
      return x;
    };
  }

  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function hue(a, b) {
    var d = b - a;
    return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant(isNaN(a) ? b : a);
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant(isNaN(a) ? b : a);
  }

  var rgb$1 = (function rgbGamma(y) {
    var color = gamma(y);

    function rgb(start, end) {
      var r = color((start = d3Color.rgb(start)).r, (end = d3Color.rgb(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = color(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb.gamma = rgbGamma;

    return rgb;
  })(1);

  function rgbSpline(spline) {
    return function(colors) {
      var n = colors.length,
          r = new Array(n),
          g = new Array(n),
          b = new Array(n),
          i, color;
      for (i = 0; i < n; ++i) {
        color = d3Color.rgb(colors[i]);
        r[i] = color.r || 0;
        g[i] = color.g || 0;
        b[i] = color.b || 0;
      }
      r = spline(r);
      g = spline(g);
      b = spline(b);
      color.opacity = 1;
      return function(t) {
        color.r = r(t);
        color.g = g(t);
        color.b = b(t);
        return color + "";
      };
    };
  }

  var rgbBasis = rgbSpline(basis$1);
  var rgbBasisClosed = rgbSpline(basisClosed);

  function array(a, b) {
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(nb),
        c = new Array(nb),
        i;

    for (i = 0; i < na; ++i) x[i] = value(a[i], b[i]);
    for (; i < nb; ++i) c[i] = b[i];

    return function(t) {
      for (i = 0; i < na; ++i) c[i] = x[i](t);
      return c;
    };
  }

  function date(a, b) {
    var d = new Date;
    return a = +a, b -= a, function(t) {
      return d.setTime(a + b * t), d;
    };
  }

  function number(a, b) {
    return a = +a, b -= a, function(t) {
      return a + b * t;
    };
  }

  function object(a, b) {
    var i = {},
        c = {},
        k;

    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};

    for (k in b) {
      if (k in a) {
        i[k] = value(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }

    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
  var reB = new RegExp(reA.source, "g");
  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function string(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: number(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  function value(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant(b)
        : (t === "number" ? number
        : t === "string" ? ((c = d3Color.color(b)) ? (b = c, rgb$1) : string)
        : b instanceof d3Color.color ? rgb$1
        : b instanceof Date ? date
        : Array.isArray(b) ? array
        : isNaN(b) ? object
        : number)(a, b);
  }

  function round(a, b) {
    return a = +a, b -= a, function(t) {
      return Math.round(a + b * t);
    };
  }

  var degrees = 180 / Math.PI;

  var identity = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
  };

  function decompose(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
      translateX: e,
      translateY: f,
      rotate: Math.atan2(b, a) * degrees,
      skewX: Math.atan(skewX) * degrees,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var cssNode;
  var cssRoot;
  var cssView;
  var svgNode;
  function parseCss(value) {
    if (value === "none") return identity;
    if (!cssNode) cssNode = document.createElement("DIV"), cssRoot = document.documentElement, cssView = document.defaultView;
    cssNode.style.transform = value;
    value = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue("transform");
    cssRoot.removeChild(cssNode);
    value = value.slice(7, -1).split(",");
    return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
  }

  function parseSvg(value) {
    if (value == null) return identity;
    if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgNode.setAttribute("transform", value);
    if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
    value = value.matrix;
    return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
  }

  function interpolateTransform(parse, pxComma, pxParen, degParen) {

    function pop(s) {
      return s.length ? s.pop() + " " : "";
    }

    function translate(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push("translate(", null, pxComma, null, pxParen);
        q.push({i: i - 4, x: number(xa, xb)}, {i: i - 2, x: number(ya, yb)});
      } else if (xb || yb) {
        s.push("translate(" + xb + pxComma + yb + pxParen);
      }
    }

    function rotate(a, b, s, q) {
      if (a !== b) {
        if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
        q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number(a, b)});
      } else if (b) {
        s.push(pop(s) + "rotate(" + b + degParen);
      }
    }

    function skewX(a, b, s, q) {
      if (a !== b) {
        q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number(a, b)});
      } else if (b) {
        s.push(pop(s) + "skewX(" + b + degParen);
      }
    }

    function scale(xa, ya, xb, yb, s, q) {
      if (xa !== xb || ya !== yb) {
        var i = s.push(pop(s) + "scale(", null, ",", null, ")");
        q.push({i: i - 4, x: number(xa, xb)}, {i: i - 2, x: number(ya, yb)});
      } else if (xb !== 1 || yb !== 1) {
        s.push(pop(s) + "scale(" + xb + "," + yb + ")");
      }
    }

    return function(a, b) {
      var s = [], // string constants and placeholders
          q = []; // number interpolators
      a = parse(a), b = parse(b);
      translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
      rotate(a.rotate, b.rotate, s, q);
      skewX(a.skewX, b.skewX, s, q);
      scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
      a = b = null; // gc
      return function(t) {
        var i = -1, n = q.length, o;
        while (++i < n) s[(o = q[i]).i] = o.x(t);
        return s.join("");
      };
    };
  }

  var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
  var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

  var rho = Math.SQRT2;
  var rho2 = 2;
  var rho4 = 4;
  var epsilon2 = 1e-12;
  function cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
  }

  function sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
  }

  function tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  }

  // p0 = [ux0, uy0, w0]
  // p1 = [ux1, uy1, w1]
  function zoom(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
        ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
        dx = ux1 - ux0,
        dy = uy1 - uy0,
        d2 = dx * dx + dy * dy,
        i,
        S;

    // Special case for u0 ≅ u1.
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      }
    }

    // General case.
    else {
      var d1 = Math.sqrt(d2),
          b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
          b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
          r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
          r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S,
            coshr0 = cosh(r0),
            u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      }
    }

    i.duration = S * 1000;

    return i;
  }

  function hsl$1(hue) {
    return function(start, end) {
      var h = hue((start = d3Color.hsl(start)).h, (end = d3Color.hsl(end)).h),
          s = nogamma(start.s, end.s),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.s = s(t);
        start.l = l(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }
  }

  var hsl$2 = hsl$1(hue);
  var hslLong = hsl$1(nogamma);

  function lab$1(start, end) {
    var l = nogamma((start = d3Color.lab(start)).l, (end = d3Color.lab(end)).l),
        a = nogamma(start.a, end.a),
        b = nogamma(start.b, end.b),
        opacity = nogamma(start.opacity, end.opacity);
    return function(t) {
      start.l = l(t);
      start.a = a(t);
      start.b = b(t);
      start.opacity = opacity(t);
      return start + "";
    };
  }

  function hcl$1(hue) {
    return function(start, end) {
      var h = hue((start = d3Color.hcl(start)).h, (end = d3Color.hcl(end)).h),
          c = nogamma(start.c, end.c),
          l = nogamma(start.l, end.l),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.h = h(t);
        start.c = c(t);
        start.l = l(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }
  }

  var hcl$2 = hcl$1(hue);
  var hclLong = hcl$1(nogamma);

  function cubehelix$1(hue) {
    return (function cubehelixGamma(y) {
      y = +y;

      function cubehelix(start, end) {
        var h = hue((start = d3Color.cubehelix(start)).h, (end = d3Color.cubehelix(end)).h),
            s = nogamma(start.s, end.s),
            l = nogamma(start.l, end.l),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.h = h(t);
          start.s = s(t);
          start.l = l(Math.pow(t, y));
          start.opacity = opacity(t);
          return start + "";
        };
      }

      cubehelix.gamma = cubehelixGamma;

      return cubehelix;
    })(1);
  }

  var cubehelix$2 = cubehelix$1(hue);
  var cubehelixLong = cubehelix$1(nogamma);

  function quantize(interpolator, n) {
    var samples = new Array(n);
    for (var i = 0; i < n; ++i) samples[i] = interpolator(i / (n - 1));
    return samples;
  }

  exports.interpolate = value;
  exports.interpolateArray = array;
  exports.interpolateBasis = basis$1;
  exports.interpolateBasisClosed = basisClosed;
  exports.interpolateDate = date;
  exports.interpolateNumber = number;
  exports.interpolateObject = object;
  exports.interpolateRound = round;
  exports.interpolateString = string;
  exports.interpolateTransformCss = interpolateTransformCss;
  exports.interpolateTransformSvg = interpolateTransformSvg;
  exports.interpolateZoom = zoom;
  exports.interpolateRgb = rgb$1;
  exports.interpolateRgbBasis = rgbBasis;
  exports.interpolateRgbBasisClosed = rgbBasisClosed;
  exports.interpolateHsl = hsl$2;
  exports.interpolateHslLong = hslLong;
  exports.interpolateLab = lab$1;
  exports.interpolateHcl = hcl$2;
  exports.interpolateHclLong = hclLong;
  exports.interpolateCubehelix = cubehelix$2;
  exports.interpolateCubehelixLong = cubehelixLong;
  exports.quantize = quantize;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{"d3-color":1}],5:[function(require,module,exports){
// https://d3js.org/d3-selection/ Version 1.0.2. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, function (exports) { 'use strict';

  var xhtml = "http://www.w3.org/1999/xhtml";

  var namespaces = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };

  function namespace(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
  }

  function creatorInherit(name) {
    return function() {
      var document = this.ownerDocument,
          uri = this.namespaceURI;
      return uri === xhtml && document.documentElement.namespaceURI === xhtml
          ? document.createElement(name)
          : document.createElementNS(uri, name);
    };
  }

  function creatorFixed(fullname) {
    return function() {
      return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
  }

  function creator(name) {
    var fullname = namespace(name);
    return (fullname.local
        ? creatorFixed
        : creatorInherit)(fullname);
  }

  var nextId = 0;

  function local() {
    return new Local;
  }

  function Local() {
    this._ = "@" + (++nextId).toString(36);
  }

  Local.prototype = local.prototype = {
    constructor: Local,
    get: function(node) {
      var id = this._;
      while (!(id in node)) if (!(node = node.parentNode)) return;
      return node[id];
    },
    set: function(node, value) {
      return node[this._] = value;
    },
    remove: function(node) {
      return this._ in node && delete node[this._];
    },
    toString: function() {
      return this._;
    }
  };

  var matcher = function(selector) {
    return function() {
      return this.matches(selector);
    };
  };

  if (typeof document !== "undefined") {
    var element = document.documentElement;
    if (!element.matches) {
      var vendorMatches = element.webkitMatchesSelector
          || element.msMatchesSelector
          || element.mozMatchesSelector
          || element.oMatchesSelector;
      matcher = function(selector) {
        return function() {
          return vendorMatches.call(this, selector);
        };
      };
    }
  }

  var matcher$1 = matcher;

  var filterEvents = {};

  exports.event = null;

  if (typeof document !== "undefined") {
    var element$1 = document.documentElement;
    if (!("onmouseenter" in element$1)) {
      filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
    }
  }

  function filterContextListener(listener, index, group) {
    listener = contextListener(listener, index, group);
    return function(event) {
      var related = event.relatedTarget;
      if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
        listener.call(this, event);
      }
    };
  }

  function contextListener(listener, index, group) {
    return function(event1) {
      var event0 = exports.event; // Events can be reentrant (e.g., focus).
      exports.event = event1;
      try {
        listener.call(this, this.__data__, index, group);
      } finally {
        exports.event = event0;
      }
    };
  }

  function parseTypenames(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
      var name = "", i = t.indexOf(".");
      if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
      return {type: t, name: name};
    });
  }

  function onRemove(typename) {
    return function() {
      var on = this.__on;
      if (!on) return;
      for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
        if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.capture);
        } else {
          on[++i] = o;
        }
      }
      if (++i) on.length = i;
      else delete this.__on;
    };
  }

  function onAdd(typename, value, capture) {
    var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
    return function(d, i, group) {
      var on = this.__on, o, listener = wrap(value, i, group);
      if (on) for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.capture);
          this.addEventListener(o.type, o.listener = listener, o.capture = capture);
          o.value = value;
          return;
        }
      }
      this.addEventListener(typename.type, listener, capture);
      o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
      if (!on) this.__on = [o];
      else on.push(o);
    };
  }

  function selection_on(typename, value, capture) {
    var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

    if (arguments.length < 2) {
      var on = this.node().__on;
      if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
      return;
    }

    on = value ? onAdd : onRemove;
    if (capture == null) capture = false;
    for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
    return this;
  }

  function customEvent(event1, listener, that, args) {
    var event0 = exports.event;
    event1.sourceEvent = exports.event;
    exports.event = event1;
    try {
      return listener.apply(that, args);
    } finally {
      exports.event = event0;
    }
  }

  function sourceEvent() {
    var current = exports.event, source;
    while (source = current.sourceEvent) current = source;
    return current;
  }

  function point(node, event) {
    var svg = node.ownerSVGElement || node;

    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }

    var rect = node.getBoundingClientRect();
    return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
  }

  function mouse(node) {
    var event = sourceEvent();
    if (event.changedTouches) event = event.changedTouches[0];
    return point(node, event);
  }

  function none() {}

  function selector(selector) {
    return selector == null ? none : function() {
      return this.querySelector(selector);
    };
  }

  function selection_select(select) {
    if (typeof select !== "function") select = selector(select);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
        if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          subgroup[i] = subnode;
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function empty() {
    return [];
  }

  function selectorAll(selector) {
    return selector == null ? empty : function() {
      return this.querySelectorAll(selector);
    };
  }

  function selection_selectAll(select) {
    if (typeof select !== "function") select = selectorAll(select);

    for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          subgroups.push(select.call(node, node.__data__, i, group));
          parents.push(node);
        }
      }
    }

    return new Selection(subgroups, parents);
  }

  function selection_filter(match) {
    if (typeof match !== "function") match = matcher$1(match);

    for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
        if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
          subgroup.push(node);
        }
      }
    }

    return new Selection(subgroups, this._parents);
  }

  function sparse(update) {
    return new Array(update.length);
  }

  function selection_enter() {
    return new Selection(this._enter || this._groups.map(sparse), this._parents);
  }

  function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
  }

  EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
    insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
    querySelector: function(selector) { return this._parent.querySelector(selector); },
    querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
  };

  function constant(x) {
    return function() {
      return x;
    };
  }

  var keyPrefix = "$"; // Protect against keys like “__proto__”.

  function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0,
        node,
        groupLength = group.length,
        dataLength = data.length;

    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for (; i < dataLength; ++i) {
      if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Put any non-null nodes that don’t fit into exit.
    for (; i < groupLength; ++i) {
      if (node = group[i]) {
        exit[i] = node;
      }
    }
  }

  function bindKey(parent, group, enter, update, exit, data, key) {
    var i,
        node,
        nodeByKeyValue = {},
        groupLength = group.length,
        dataLength = data.length,
        keyValues = new Array(groupLength),
        keyValue;

    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for (i = 0; i < groupLength; ++i) {
      if (node = group[i]) {
        keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
        if (keyValue in nodeByKeyValue) {
          exit[i] = node;
        } else {
          nodeByKeyValue[keyValue] = node;
        }
      }
    }

    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for (i = 0; i < dataLength; ++i) {
      keyValue = keyPrefix + key.call(parent, data[i], i, data);
      if (node = nodeByKeyValue[keyValue]) {
        update[i] = node;
        node.__data__ = data[i];
        nodeByKeyValue[keyValue] = null;
      } else {
        enter[i] = new EnterNode(parent, data[i]);
      }
    }

    // Add any remaining nodes that were not bound to data to exit.
    for (i = 0; i < groupLength; ++i) {
      if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
        exit[i] = node;
      }
    }
  }

  function selection_data(value, key) {
    if (!value) {
      data = new Array(this.size()), j = -1;
      this.each(function(d) { data[++j] = d; });
      return data;
    }

    var bind = key ? bindKey : bindIndex,
        parents = this._parents,
        groups = this._groups;

    if (typeof value !== "function") value = constant(value);

    for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
      var parent = parents[j],
          group = groups[j],
          groupLength = group.length,
          data = value.call(parent, parent && parent.__data__, j, parents),
          dataLength = data.length,
          enterGroup = enter[j] = new Array(dataLength),
          updateGroup = update[j] = new Array(dataLength),
          exitGroup = exit[j] = new Array(groupLength);

      bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

      // Now connect the enter nodes to their following update node, such that
      // appendChild can insert the materialized enter node before this node,
      // rather than at the end of the parent node.
      for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
        if (previous = enterGroup[i0]) {
          if (i0 >= i1) i1 = i0 + 1;
          while (!(next = updateGroup[i1]) && ++i1 < dataLength);
          previous._next = next || null;
        }
      }
    }

    update = new Selection(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
  }

  function selection_exit() {
    return new Selection(this._exit || this._groups.map(sparse), this._parents);
  }

  function selection_merge(selection) {

    for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
      for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group0[i] || group1[i]) {
          merge[i] = node;
        }
      }
    }

    for (; j < m0; ++j) {
      merges[j] = groups0[j];
    }

    return new Selection(merges, this._parents);
  }

  function selection_order() {

    for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
      for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
        if (node = group[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }

    return this;
  }

  function selection_sort(compare) {
    if (!compare) compare = ascending;

    function compareNode(a, b) {
      return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }

    for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
      for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
        if (node = group[i]) {
          sortgroup[i] = node;
        }
      }
      sortgroup.sort(compareNode);
    }

    return new Selection(sortgroups, this._parents).order();
  }

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function selection_call() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
  }

  function selection_nodes() {
    var nodes = new Array(this.size()), i = -1;
    this.each(function() { nodes[++i] = this; });
    return nodes;
  }

  function selection_node() {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
        var node = group[i];
        if (node) return node;
      }
    }

    return null;
  }

  function selection_size() {
    var size = 0;
    this.each(function() { ++size; });
    return size;
  }

  function selection_empty() {
    return !this.node();
  }

  function selection_each(callback) {

    for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
        if (node = group[i]) callback.call(node, node.__data__, i, group);
      }
    }

    return this;
  }

  function attrRemove(name) {
    return function() {
      this.removeAttribute(name);
    };
  }

  function attrRemoveNS(fullname) {
    return function() {
      this.removeAttributeNS(fullname.space, fullname.local);
    };
  }

  function attrConstant(name, value) {
    return function() {
      this.setAttribute(name, value);
    };
  }

  function attrConstantNS(fullname, value) {
    return function() {
      this.setAttributeNS(fullname.space, fullname.local, value);
    };
  }

  function attrFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttribute(name);
      else this.setAttribute(name, v);
    };
  }

  function attrFunctionNS(fullname, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
      else this.setAttributeNS(fullname.space, fullname.local, v);
    };
  }

  function selection_attr(name, value) {
    var fullname = namespace(name);

    if (arguments.length < 2) {
      var node = this.node();
      return fullname.local
          ? node.getAttributeNS(fullname.space, fullname.local)
          : node.getAttribute(fullname);
    }

    return this.each((value == null
        ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
        ? (fullname.local ? attrFunctionNS : attrFunction)
        : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
  }

  function defaultView(node) {
    return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
        || (node.document && node) // node is a Window
        || node.defaultView; // node is a Document
  }

  function styleRemove(name) {
    return function() {
      this.style.removeProperty(name);
    };
  }

  function styleConstant(name, value, priority) {
    return function() {
      this.style.setProperty(name, value, priority);
    };
  }

  function styleFunction(name, value, priority) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) this.style.removeProperty(name);
      else this.style.setProperty(name, v, priority);
    };
  }

  function selection_style(name, value, priority) {
    var node;
    return arguments.length > 1
        ? this.each((value == null
              ? styleRemove : typeof value === "function"
              ? styleFunction
              : styleConstant)(name, value, priority == null ? "" : priority))
        : defaultView(node = this.node())
            .getComputedStyle(node, null)
            .getPropertyValue(name);
  }

  function propertyRemove(name) {
    return function() {
      delete this[name];
    };
  }

  function propertyConstant(name, value) {
    return function() {
      this[name] = value;
    };
  }

  function propertyFunction(name, value) {
    return function() {
      var v = value.apply(this, arguments);
      if (v == null) delete this[name];
      else this[name] = v;
    };
  }

  function selection_property(name, value) {
    return arguments.length > 1
        ? this.each((value == null
            ? propertyRemove : typeof value === "function"
            ? propertyFunction
            : propertyConstant)(name, value))
        : this.node()[name];
  }

  function classArray(string) {
    return string.trim().split(/^|\s+/);
  }

  function classList(node) {
    return node.classList || new ClassList(node);
  }

  function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
  }

  ClassList.prototype = {
    add: function(name) {
      var i = this._names.indexOf(name);
      if (i < 0) {
        this._names.push(name);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    remove: function(name) {
      var i = this._names.indexOf(name);
      if (i >= 0) {
        this._names.splice(i, 1);
        this._node.setAttribute("class", this._names.join(" "));
      }
    },
    contains: function(name) {
      return this._names.indexOf(name) >= 0;
    }
  };

  function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.add(names[i]);
  }

  function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while (++i < n) list.remove(names[i]);
  }

  function classedTrue(names) {
    return function() {
      classedAdd(this, names);
    };
  }

  function classedFalse(names) {
    return function() {
      classedRemove(this, names);
    };
  }

  function classedFunction(names, value) {
    return function() {
      (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
  }

  function selection_classed(name, value) {
    var names = classArray(name + "");

    if (arguments.length < 2) {
      var list = classList(this.node()), i = -1, n = names.length;
      while (++i < n) if (!list.contains(names[i])) return false;
      return true;
    }

    return this.each((typeof value === "function"
        ? classedFunction : value
        ? classedTrue
        : classedFalse)(names, value));
  }

  function textRemove() {
    this.textContent = "";
  }

  function textConstant(value) {
    return function() {
      this.textContent = value;
    };
  }

  function textFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    };
  }

  function selection_text(value) {
    return arguments.length
        ? this.each(value == null
            ? textRemove : (typeof value === "function"
            ? textFunction
            : textConstant)(value))
        : this.node().textContent;
  }

  function htmlRemove() {
    this.innerHTML = "";
  }

  function htmlConstant(value) {
    return function() {
      this.innerHTML = value;
    };
  }

  function htmlFunction(value) {
    return function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    };
  }

  function selection_html(value) {
    return arguments.length
        ? this.each(value == null
            ? htmlRemove : (typeof value === "function"
            ? htmlFunction
            : htmlConstant)(value))
        : this.node().innerHTML;
  }

  function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
  }

  function selection_raise() {
    return this.each(raise);
  }

  function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
  }

  function selection_lower() {
    return this.each(lower);
  }

  function selection_append(name) {
    var create = typeof name === "function" ? name : creator(name);
    return this.select(function() {
      return this.appendChild(create.apply(this, arguments));
    });
  }

  function constantNull() {
    return null;
  }

  function selection_insert(name, before) {
    var create = typeof name === "function" ? name : creator(name),
        select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
    return this.select(function() {
      return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
  }

  function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }

  function selection_remove() {
    return this.each(remove);
  }

  function selection_datum(value) {
    return arguments.length
        ? this.property("__data__", value)
        : this.node().__data__;
  }

  function dispatchEvent(node, type, params) {
    var window = defaultView(node),
        event = window.CustomEvent;

    if (event) {
      event = new event(type, params);
    } else {
      event = window.document.createEvent("Event");
      if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
      else event.initEvent(type, false, false);
    }

    node.dispatchEvent(event);
  }

  function dispatchConstant(type, params) {
    return function() {
      return dispatchEvent(this, type, params);
    };
  }

  function dispatchFunction(type, params) {
    return function() {
      return dispatchEvent(this, type, params.apply(this, arguments));
    };
  }

  function selection_dispatch(type, params) {
    return this.each((typeof params === "function"
        ? dispatchFunction
        : dispatchConstant)(type, params));
  }

  var root = [null];

  function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
  }

  function selection() {
    return new Selection([[document.documentElement]], root);
  }

  Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: selection_select,
    selectAll: selection_selectAll,
    filter: selection_filter,
    data: selection_data,
    enter: selection_enter,
    exit: selection_exit,
    merge: selection_merge,
    order: selection_order,
    sort: selection_sort,
    call: selection_call,
    nodes: selection_nodes,
    node: selection_node,
    size: selection_size,
    empty: selection_empty,
    each: selection_each,
    attr: selection_attr,
    style: selection_style,
    property: selection_property,
    classed: selection_classed,
    text: selection_text,
    html: selection_html,
    raise: selection_raise,
    lower: selection_lower,
    append: selection_append,
    insert: selection_insert,
    remove: selection_remove,
    datum: selection_datum,
    on: selection_on,
    dispatch: selection_dispatch
  };

  function select(selector) {
    return typeof selector === "string"
        ? new Selection([[document.querySelector(selector)]], [document.documentElement])
        : new Selection([[selector]], root);
  }

  function selectAll(selector) {
    return typeof selector === "string"
        ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
        : new Selection([selector == null ? [] : selector], root);
  }

  function touch(node, touches, identifier) {
    if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

    for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
      if ((touch = touches[i]).identifier === identifier) {
        return point(node, touch);
      }
    }

    return null;
  }

  function touches(node, touches) {
    if (touches == null) touches = sourceEvent().touches;

    for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
      points[i] = point(node, touches[i]);
    }

    return points;
  }

  exports.creator = creator;
  exports.local = local;
  exports.matcher = matcher$1;
  exports.mouse = mouse;
  exports.namespace = namespace;
  exports.namespaces = namespaces;
  exports.select = select;
  exports.selectAll = selectAll;
  exports.selection = selection;
  exports.selector = selector;
  exports.selectorAll = selectorAll;
  exports.touch = touch;
  exports.touches = touches;
  exports.window = defaultView;
  exports.customEvent = customEvent;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
},{}],6:[function(require,module,exports){
// https://d3js.org/d3-timer/ Version 1.0.3. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1000;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof requestAnimationFrame === "function" ? requestAnimationFrame : function(f) { setTimeout(f, 17); };
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(null, e);
    t = t._next;
  }
  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, delay);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

function timeout$1(callback, delay, time) {
  var t = new Timer;
  delay = delay == null ? 0 : +delay;
  t.restart(function(elapsed) {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

function interval$1(callback, delay, time) {
  var t = new Timer, total = delay;
  if (delay == null) return t.restart(callback, delay, time), t;
  delay = +delay, time = time == null ? now() : +time;
  t.restart(function tick(elapsed) {
    elapsed += total;
    t.restart(tick, total += delay, time);
    callback(elapsed);
  }, delay, time);
  return t;
}

exports.now = now;
exports.timer = timer;
exports.timerFlush = timerFlush;
exports.timeout = timeout$1;
exports.interval = interval$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
},{}],7:[function(require,module,exports){
// https://d3js.org/d3-transition/ Version 1.0.2. Copyright 2016 Mike Bostock.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-dispatch'), require('d3-timer'), require('d3-interpolate'), require('d3-color'), require('d3-ease')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-dispatch', 'd3-timer', 'd3-interpolate', 'd3-color', 'd3-ease'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3,global.d3,global.d3));
}(this, (function (exports,d3Selection,d3Dispatch,d3Timer,d3Interpolate,d3Color,d3Ease) { 'use strict';

var emptyOn = d3Dispatch.dispatch("start", "end", "interrupt");
var emptyTween = [];

var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;

function schedule(node, name, id, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id in schedules) return;
  create(node, id, {
    name: name,
    index: index, // For context during callback.
    group: group, // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}

function init(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id]) || schedule.state > CREATED) throw new Error("too late");
  return schedule;
}

function set(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id]) || schedule.state > STARTING) throw new Error("too late");
  return schedule;
}

function get(node, id) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id])) throw new Error("too late");
  return schedule;
}

function create(node, id, self) {
  var schedules = node.__transition,
      tween;

  // Initialize the self timer when the transition is created.
  // Note the actual delay is not known until the first callback!
  schedules[id] = self;
  self.timer = d3Timer.timer(schedule, 0, self.time);

  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start, self.delay, self.time);

    // If the elapsed delay is less than our first sleep, start immediately.
    if (self.delay <= elapsed) start(elapsed - self.delay);
  }

  function start(elapsed) {
    var i, j, n, o;

    // If the state is not SCHEDULED, then we previously errored on start.
    if (self.state !== SCHEDULED) return stop();

    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;

      // While this element already has a starting transition during this frame,
      // defer starting an interrupting transition until that transition has a
      // chance to tick (and possibly end); see d3/d3-transition#54!
      if (o.state === STARTED) return d3Timer.timeout(start);

      // Interrupt the active transition, if any.
      // Dispatch the interrupt event.
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }

      // Cancel any pre-empted transitions. No interrupt event is dispatched
      // because the cancelled transitions never started. Note that this also
      // removes this transition from the pending list!
      else if (+i < id) {
        o.state = ENDED;
        o.timer.stop();
        delete schedules[i];
      }
    }

    // Defer the first tick to end of the current frame; see d3/d3#1576.
    // Note the transition may be canceled after start and before the first tick!
    // Note this must be scheduled before the start event; see d3/d3-transition#16!
    // Assuming this is successful, subsequent callbacks go straight to tick.
    d3Timer.timeout(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });

    // Dispatch the start event.
    // Note this must be done before the tween are initialized.
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return; // interrupted
    self.state = STARTED;

    // Initialize the tween, deleting null tween.
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }

  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
        i = -1,
        n = tween.length;

    while (++i < n) {
      tween[i].call(null, t);
    }

    // Dispatch the end event.
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }

  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id];
    for (var i in schedules) return; // eslint-disable-line no-unused-vars
    delete node.__transition;
  }
}

function interrupt(node, name) {
  var schedules = node.__transition,
      schedule,
      active,
      empty = true,
      i;

  if (!schedules) return;

  name = name == null ? null : name + "";

  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
    active = schedule.state === STARTED;
    schedule.state = ENDED;
    schedule.timer.stop();
    if (active) schedule.on.call("interrupt", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }

  if (empty) delete node.__transition;
}

function selection_interrupt(name) {
  return this.each(function() {
    interrupt(this, name);
  });
}

function tweenRemove(id, name) {
  var tween0, tween1;
  return function() {
    var schedule = set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }

    schedule.tween = tween1;
  };
}

function tweenFunction(id, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error;
  return function() {
    var schedule = set(this, id),
        tween = schedule.tween;

    // If this node shared tween with the previous node,
    // just assign the updated shared tween and we’re done!
    // Otherwise, copy-on-write.
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n) tween1.push(t);
    }

    schedule.tween = tween1;
  };
}

function transition_tween(name, value) {
  var id = this._id;

  name += "";

  if (arguments.length < 2) {
    var tween = get(this.node(), id).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }

  return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
}

function tweenValue(transition, name, value) {
  var id = transition._id;

  transition.each(function() {
    var schedule = set(this, id);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });

  return function(node) {
    return get(node, id).value[name];
  };
}

function interpolate(a, b) {
  var c;
  return (typeof b === "number" ? d3Interpolate.interpolateNumber
      : b instanceof d3Color.color ? d3Interpolate.interpolateRgb
      : (c = d3Color.color(b)) ? (b = c, d3Interpolate.interpolateRgb)
      : d3Interpolate.interpolateString)(a, b);
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, interpolate, value1) {
  var value00,
      interpolate0;
  return function() {
    var value0 = this.getAttribute(name);
    return value0 === value1 ? null
        : value0 === value00 ? interpolate0
        : interpolate0 = interpolate(value00 = value0, value1);
  };
}

function attrConstantNS(fullname, interpolate, value1) {
  var value00,
      interpolate0;
  return function() {
    var value0 = this.getAttributeNS(fullname.space, fullname.local);
    return value0 === value1 ? null
        : value0 === value00 ? interpolate0
        : interpolate0 = interpolate(value00 = value0, value1);
  };
}

function attrFunction(name, interpolate, value) {
  var value00,
      value10,
      interpolate0;
  return function() {
    var value0, value1 = value(this);
    if (value1 == null) return void this.removeAttribute(name);
    value0 = this.getAttribute(name);
    return value0 === value1 ? null
        : value0 === value00 && value1 === value10 ? interpolate0
        : interpolate0 = interpolate(value00 = value0, value10 = value1);
  };
}

function attrFunctionNS(fullname, interpolate, value) {
  var value00,
      value10,
      interpolate0;
  return function() {
    var value0, value1 = value(this);
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    value0 = this.getAttributeNS(fullname.space, fullname.local);
    return value0 === value1 ? null
        : value0 === value00 && value1 === value10 ? interpolate0
        : interpolate0 = interpolate(value00 = value0, value10 = value1);
  };
}

function transition_attr(name, value) {
  var fullname = d3Selection.namespace(name), i = fullname === "transform" ? d3Interpolate.interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
      : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
      : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}

function attrTweenNS(fullname, value) {
  function tween() {
    var node = this, i = value.apply(node, arguments);
    return i && function(t) {
      node.setAttributeNS(fullname.space, fullname.local, i(t));
    };
  }
  tween._value = value;
  return tween;
}

function attrTween(name, value) {
  function tween() {
    var node = this, i = value.apply(node, arguments);
    return i && function(t) {
      node.setAttribute(name, i(t));
    };
  }
  tween._value = value;
  return tween;
}

function transition_attrTween(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  var fullname = d3Selection.namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

function delayFunction(id, value) {
  return function() {
    init(this, id).delay = +value.apply(this, arguments);
  };
}

function delayConstant(id, value) {
  return value = +value, function() {
    init(this, id).delay = value;
  };
}

function transition_delay(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? delayFunction
          : delayConstant)(id, value))
      : get(this.node(), id).delay;
}

function durationFunction(id, value) {
  return function() {
    set(this, id).duration = +value.apply(this, arguments);
  };
}

function durationConstant(id, value) {
  return value = +value, function() {
    set(this, id).duration = value;
  };
}

function transition_duration(value) {
  var id = this._id;

  return arguments.length
      ? this.each((typeof value === "function"
          ? durationFunction
          : durationConstant)(id, value))
      : get(this.node(), id).duration;
}

function easeConstant(id, value) {
  if (typeof value !== "function") throw new Error;
  return function() {
    set(this, id).ease = value;
  };
}

function transition_ease(value) {
  var id = this._id;

  return arguments.length
      ? this.each(easeConstant(id, value))
      : get(this.node(), id).ease;
}

function transition_filter(match) {
  if (typeof match !== "function") match = d3Selection.matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Transition(subgroups, this._parents, this._name, this._id);
}

function transition_merge(transition) {
  if (transition._id !== this._id) throw new Error;

  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Transition(merges, this._parents, this._name, this._id);
}

function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0) t = t.slice(0, i);
    return !t || t === "start";
  });
}

function onFunction(id, name, listener) {
  var on0, on1, sit = start(name) ? init : set;
  return function() {
    var schedule = sit(this, id),
        on = schedule.on;

    // If this node shared a dispatch with the previous node,
    // just assign the updated shared dispatch and we’re done!
    // Otherwise, copy-on-write.
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

    schedule.on = on1;
  };
}

function transition_on(name, listener) {
  var id = this._id;

  return arguments.length < 2
      ? get(this.node(), id).on.on(name)
      : this.each(onFunction(id, name, listener));
}

function removeFunction(id) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id) return;
    if (parent) parent.removeChild(this);
  };
}

function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}

function transition_select(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = d3Selection.selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id, i, subgroup, get(node, id));
      }
    }
  }

  return new Transition(subgroups, this._parents, name, id);
}

function transition_selectAll(select) {
  var name = this._name,
      id = this._id;

  if (typeof select !== "function") select = d3Selection.selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
          if (child = children[k]) {
            schedule(child, name, id, k, children, inherit);
          }
        }
        subgroups.push(children);
        parents.push(node);
      }
    }
  }

  return new Transition(subgroups, parents, name, id);
}

var Selection = d3Selection.selection.prototype.constructor;

function transition_selection() {
  return new Selection(this._groups, this._parents);
}

function styleRemove(name, interpolate) {
  var value00,
      value10,
      interpolate0;
  return function() {
    var style = d3Selection.window(this).getComputedStyle(this, null),
        value0 = style.getPropertyValue(name),
        value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
    return value0 === value1 ? null
        : value0 === value00 && value1 === value10 ? interpolate0
        : interpolate0 = interpolate(value00 = value0, value10 = value1);
  };
}

function styleRemoveEnd(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, interpolate, value1) {
  var value00,
      interpolate0;
  return function() {
    var value0 = d3Selection.window(this).getComputedStyle(this, null).getPropertyValue(name);
    return value0 === value1 ? null
        : value0 === value00 ? interpolate0
        : interpolate0 = interpolate(value00 = value0, value1);
  };
}

function styleFunction(name, interpolate, value) {
  var value00,
      value10,
      interpolate0;
  return function() {
    var style = d3Selection.window(this).getComputedStyle(this, null),
        value0 = style.getPropertyValue(name),
        value1 = value(this);
    if (value1 == null) value1 = (this.style.removeProperty(name), style.getPropertyValue(name));
    return value0 === value1 ? null
        : value0 === value00 && value1 === value10 ? interpolate0
        : interpolate0 = interpolate(value00 = value0, value10 = value1);
  };
}

function transition_style(name, value, priority) {
  var i = (name += "") === "transform" ? d3Interpolate.interpolateTransformCss : interpolate;
  return value == null ? this
          .styleTween(name, styleRemove(name, i))
          .on("end.style." + name, styleRemoveEnd(name))
      : this.styleTween(name, typeof value === "function"
          ? styleFunction(name, i, tweenValue(this, "style." + name, value))
          : styleConstant(name, i, value), priority);
}

function styleTween(name, value, priority) {
  function tween() {
    var node = this, i = value.apply(node, arguments);
    return i && function(t) {
      node.style.setProperty(name, i(t), priority);
    };
  }
  tween._value = value;
  return tween;
}

function transition_styleTween(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error;
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}

function transition_text(value) {
  return this.tween("text", typeof value === "function"
      ? textFunction(tweenValue(this, "text", value))
      : textConstant(value == null ? "" : value + ""));
}

function transition_transition() {
  var name = this._name,
      id0 = this._id,
      id1 = newId();

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit = get(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit.time + inherit.delay + inherit.duration,
          delay: 0,
          duration: inherit.duration,
          ease: inherit.ease
        });
      }
    }
  }

  return new Transition(groups, this._parents, name, id1);
}

var id = 0;

function Transition(groups, parents, name, id) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id;
}

function transition(name) {
  return d3Selection.selection().transition(name);
}

function newId() {
  return ++id;
}

var selection_prototype = d3Selection.selection.prototype;

Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease
};

var defaultTiming = {
  time: null, // Set on use.
  delay: 0,
  duration: 250,
  ease: d3Ease.easeCubicInOut
};

function inherit(node, id) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id])) {
    if (!(node = node.parentNode)) {
      return defaultTiming.time = d3Timer.now(), defaultTiming;
    }
  }
  return timing;
}

function selection_transition(name) {
  var id,
      timing;

  if (name instanceof Transition) {
    id = name._id, name = name._name;
  } else {
    id = newId(), (timing = defaultTiming).time = d3Timer.now(), name = name == null ? null : name + "";
  }

  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule(node, name, id, i, group, timing || inherit(node, id));
      }
    }
  }

  return new Transition(groups, this._parents, name, id);
}

d3Selection.selection.prototype.interrupt = selection_interrupt;
d3Selection.selection.prototype.transition = selection_transition;

var root = [null];

function active(node, name) {
  var schedules = node.__transition,
      schedule,
      i;

  if (schedules) {
    name = name == null ? null : name + "";
    for (i in schedules) {
      if ((schedule = schedules[i]).state > SCHEDULED && schedule.name === name) {
        return new Transition([[node]], root, name, +i);
      }
    }
  }

  return null;
}

exports.transition = transition;
exports.active = active;
exports.interrupt = interrupt;

Object.defineProperty(exports, '__esModule', { value: true });

})));
},{"d3-color":1,"d3-dispatch":2,"d3-ease":3,"d3-interpolate":4,"d3-selection":5,"d3-timer":6}],8:[function(require,module,exports){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-transition')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-transition'], factory) :
    (factory((global.venn = global.venn || {}),global.d3,global.d3));
}(this, function (exports,d3Selection,d3Transition) { 'use strict';

    var SMALL = 1e-10;

    /** Returns the intersection area of a bunch of circles (where each circle
     is an object having an x,y and radius property) */
    function intersectionArea(circles, stats) {
        // get all the intersection points of the circles
        var intersectionPoints = getIntersectionPoints(circles);

        // filter out points that aren't included in all the circles
        var innerPoints = intersectionPoints.filter(function (p) {
            return containedInCircles(p, circles);
        });

        var arcArea = 0, polygonArea = 0, arcs = [], i;

        // if we have intersection points that are within all the circles,
        // then figure out the area contained by them
        if (innerPoints.length > 1) {
            // sort the points by angle from the center of the polygon, which lets
            // us just iterate over points to get the edges
            var center = getCenter(innerPoints);
            for (i = 0; i < innerPoints.length; ++i ) {
                var p = innerPoints[i];
                p.angle = Math.atan2(p.x - center.x, p.y - center.y);
            }
            innerPoints.sort(function(a,b) { return b.angle - a.angle;});

            // iterate over all points, get arc between the points
            // and update the areas
            var p2 = innerPoints[innerPoints.length - 1];
            for (i = 0; i < innerPoints.length; ++i) {
                var p1 = innerPoints[i];

                // polygon area updates easily ...
                polygonArea += (p2.x + p1.x) * (p1.y - p2.y);

                // updating the arc area is a little more involved
                var midPoint = {x : (p1.x + p2.x) / 2,
                                y : (p1.y + p2.y) / 2},
                    arc = null;

                for (var j = 0; j < p1.parentIndex.length; ++j) {
                    if (p2.parentIndex.indexOf(p1.parentIndex[j]) > -1) {
                        // figure out the angle halfway between the two points
                        // on the current circle
                        var circle = circles[p1.parentIndex[j]],
                            a1 = Math.atan2(p1.x - circle.x, p1.y - circle.y),
                            a2 = Math.atan2(p2.x - circle.x, p2.y - circle.y);

                        var angleDiff = (a2 - a1);
                        if (angleDiff < 0) {
                            angleDiff += 2*Math.PI;
                        }

                        // and use that angle to figure out the width of the
                        // arc
                        var a = a2 - angleDiff/2,
                            width = distance(midPoint, {
                                x : circle.x + circle.radius * Math.sin(a),
                                y : circle.y + circle.radius * Math.cos(a)
                            });

                        // pick the circle whose arc has the smallest width
                        if ((arc === null) || (arc.width > width)) {
                            arc = { circle : circle,
                                    width : width,
                                    p1 : p1,
                                    p2 : p2};
                        }
                    }
                }

                if (arc !== null) {
                    arcs.push(arc);
                    arcArea += circleArea(arc.circle.radius, arc.width);
                    p2 = p1;
                }
            }
        } else {
            // no intersection points, is either disjoint - or is completely
            // overlapped. figure out which by examining the smallest circle
            var smallest = circles[0];
            for (i = 1; i < circles.length; ++i) {
                if (circles[i].radius < smallest.radius) {
                    smallest = circles[i];
                }
            }

            // make sure the smallest circle is completely contained in all
            // the other circles
            var disjoint = false;
            for (i = 0; i < circles.length; ++i) {
                if (distance(circles[i], smallest) > Math.abs(smallest.radius - circles[i].radius)) {
                    disjoint = true;
                    break;
                }
            }

            if (disjoint) {
                arcArea = polygonArea = 0;

            } else {
                arcArea = smallest.radius * smallest.radius * Math.PI;
                arcs.push({circle : smallest,
                           p1: { x: smallest.x,        y : smallest.y + smallest.radius},
                           p2: { x: smallest.x - SMALL, y : smallest.y + smallest.radius},
                           width : smallest.radius * 2 });
            }
        }

        polygonArea /= 2;
        if (stats) {
            stats.area = arcArea + polygonArea;
            stats.arcArea = arcArea;
            stats.polygonArea = polygonArea;
            stats.arcs = arcs;
            stats.innerPoints = innerPoints;
            stats.intersectionPoints = intersectionPoints;
        }

        return arcArea + polygonArea;
    }

    /** returns whether a point is contained by all of a list of circles */
    function containedInCircles(point, circles) {
        for (var i = 0; i < circles.length; ++i) {
            if (distance(point, circles[i]) > circles[i].radius + SMALL) {
                return false;
            }
        }
        return true;
    }

    /** Gets all intersection points between a bunch of circles */
    function getIntersectionPoints(circles) {
        var ret = [];
        for (var i = 0; i < circles.length; ++i) {
            for (var j = i + 1; j < circles.length; ++j) {
                var intersect = circleCircleIntersection(circles[i],
                                                              circles[j]);
                for (var k = 0; k < intersect.length; ++k) {
                    var p = intersect[k];
                    p.parentIndex = [i,j];
                    ret.push(p);
                }
            }
        }
        return ret;
    }

    function circleIntegral(r, x) {
        var y = Math.sqrt(r * r - x * x);
        return x * y + r * r * Math.atan2(x, y);
    }

    /** Returns the area of a circle of radius r - up to width */
    function circleArea(r, width) {
        return circleIntegral(r, width - r) - circleIntegral(r, -r);
    }

    /** euclidean distance between two points */
    function distance(p1, p2) {
        return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) +
                         (p1.y - p2.y) * (p1.y - p2.y));
    }


    /** Returns the overlap area of two circles of radius r1 and r2 - that
    have their centers separated by distance d. Simpler faster
    circle intersection for only two circles */
    function circleOverlap(r1, r2, d) {
        // no overlap
        if (d >= r1 + r2) {
            return 0;
        }

        // completely overlapped
        if (d <= Math.abs(r1 - r2)) {
            return Math.PI * Math.min(r1, r2) * Math.min(r1, r2);
        }

        var w1 = r1 - (d * d - r2 * r2 + r1 * r1) / (2 * d),
            w2 = r2 - (d * d - r1 * r1 + r2 * r2) / (2 * d);
        return circleArea(r1, w1) + circleArea(r2, w2);
    }

    /** Given two circles (containing a x/y/radius attributes),
    returns the intersecting points if possible.
    note: doesn't handle cases where there are infinitely many
    intersection points (circles are equivalent):, or only one intersection point*/
    function circleCircleIntersection(p1, p2) {
        var d = distance(p1, p2),
            r1 = p1.radius,
            r2 = p2.radius;

        // if to far away, or self contained - can't be done
        if ((d >= (r1 + r2)) || (d <= Math.abs(r1 - r2))) {
            return [];
        }

        var a = (r1 * r1 - r2 * r2 + d * d) / (2 * d),
            h = Math.sqrt(r1 * r1 - a * a),
            x0 = p1.x + a * (p2.x - p1.x) / d,
            y0 = p1.y + a * (p2.y - p1.y) / d,
            rx = -(p2.y - p1.y) * (h / d),
            ry = -(p2.x - p1.x) * (h / d);

        return [{x: x0 + rx, y : y0 - ry },
                {x: x0 - rx, y : y0 + ry }];
    }

    /** Returns the center of a bunch of points */
    function getCenter(points) {
        var center = {x: 0, y: 0};
        for (var i =0; i < points.length; ++i ) {
            center.x += points[i].x;
            center.y += points[i].y;
        }
        center.x /= points.length;
        center.y /= points.length;
        return center;
    }

    /** finds the zeros of a function, given two starting points (which must
     * have opposite signs */
    function bisect(f, a, b, parameters) {
        parameters = parameters || {};
        var maxIterations = parameters.maxIterations || 100,
            tolerance = parameters.tolerance || 1e-10,
            fA = f(a),
            fB = f(b),
            delta = b - a;

        if (fA * fB > 0) {
            throw "Initial bisect points must have opposite signs";
        }

        if (fA === 0) return a;
        if (fB === 0) return b;

        for (var i = 0; i < maxIterations; ++i) {
            delta /= 2;
            var mid = a + delta,
                fMid = f(mid);

            if (fMid * fA >= 0) {
                a = mid;
            }

            if ((Math.abs(delta) < tolerance) || (fMid === 0)) {
                return mid;
            }
        }
        return a + delta;
    }

    // need some basic operations on vectors, rather than adding a dependency,
    // just define here
    function zeros(x) { var r = new Array(x); for (var i = 0; i < x; ++i) { r[i] = 0; } return r; }
    function zerosM(x,y) { return zeros(x).map(function() { return zeros(y); }); }

    function dot(a, b) {
        var ret = 0;
        for (var i = 0; i < a.length; ++i) {
            ret += a[i] * b[i];
        }
        return ret;
    }

    function norm2(a)  {
        return Math.sqrt(dot(a, a));
    }

    function scale(ret, value, c) {
        for (var i = 0; i < value.length; ++i) {
            ret[i] = value[i] * c;
        }
    }

    function weightedSum(ret, w1, v1, w2, v2) {
        for (var j = 0; j < ret.length; ++j) {
            ret[j] = w1 * v1[j] + w2 * v2[j];
        }
    }

    /** minimizes a function using the downhill simplex method */
    function nelderMead(f, x0, parameters) {
        parameters = parameters || {};

        var maxIterations = parameters.maxIterations || x0.length * 200,
            nonZeroDelta = parameters.nonZeroDelta || 1.05,
            zeroDelta = parameters.zeroDelta || 0.001,
            minErrorDelta = parameters.minErrorDelta || 1e-6,
            minTolerance = parameters.minErrorDelta || 1e-5,
            rho = (parameters.rho !== undefined) ? parameters.rho : 1,
            chi = (parameters.chi !== undefined) ? parameters.chi : 2,
            psi = (parameters.psi !== undefined) ? parameters.psi : -0.5,
            sigma = (parameters.sigma !== undefined) ? parameters.sigma : 0.5,
            maxDiff;

        // initialize simplex.
        var N = x0.length,
            simplex = new Array(N + 1);
        simplex[0] = x0;
        simplex[0].fx = f(x0);
        simplex[0].id = 0;
        for (var i = 0; i < N; ++i) {
            var point = x0.slice();
            point[i] = point[i] ? point[i] * nonZeroDelta : zeroDelta;
            simplex[i+1] = point;
            simplex[i+1].fx = f(point);
            simplex[i+1].id = i+1;
        }

        function updateSimplex(value) {
            for (var i = 0; i < value.length; i++) {
                simplex[N][i] = value[i];
            }
            simplex[N].fx = value.fx;
        }

        var sortOrder = function(a, b) { return a.fx - b.fx; };

        var centroid = x0.slice(),
            reflected = x0.slice(),
            contracted = x0.slice(),
            expanded = x0.slice();

        for (var iteration = 0; iteration < maxIterations; ++iteration) {
            simplex.sort(sortOrder);

            if (parameters.history) {
                // copy the simplex (since later iterations will mutate) and
                // sort it to have a consistent order between iterations
                var sortedSimplex = simplex.map(function (x) {
                    var state = x.slice();
                    state.fx = x.fx;
                    state.id = x.id;
                    return state;
                });
                sortedSimplex.sort(function(a,b) { return a.id - b.id; });

                parameters.history.push({x: simplex[0].slice(),
                                         fx: simplex[0].fx,
                                         simplex: sortedSimplex});
            }

            maxDiff = 0;
            for (i = 0; i < N; ++i) {
                maxDiff = Math.max(maxDiff, Math.abs(simplex[0][i] - simplex[1][i]));
            }

            if ((Math.abs(simplex[0].fx - simplex[N].fx) < minErrorDelta) &&
                (maxDiff < minTolerance)) {
                break;
            }

            // compute the centroid of all but the worst point in the simplex
            for (i = 0; i < N; ++i) {
                centroid[i] = 0;
                for (var j = 0; j < N; ++j) {
                    centroid[i] += simplex[j][i];
                }
                centroid[i] /= N;
            }

            // reflect the worst point past the centroid  and compute loss at reflected
            // point
            var worst = simplex[N];
            weightedSum(reflected, 1+rho, centroid, -rho, worst);
            reflected.fx = f(reflected);

            // if the reflected point is the best seen, then possibly expand
            if (reflected.fx < simplex[0].fx) {
                weightedSum(expanded, 1+chi, centroid, -chi, worst);
                expanded.fx = f(expanded);
                if (expanded.fx < reflected.fx) {
                    updateSimplex(expanded);
                }  else {
                    updateSimplex(reflected);
                }
            }

            // if the reflected point is worse than the second worst, we need to
            // contract
            else if (reflected.fx >= simplex[N-1].fx) {
                var shouldReduce = false;

                if (reflected.fx > worst.fx) {
                    // do an inside contraction
                    weightedSum(contracted, 1+psi, centroid, -psi, worst);
                    contracted.fx = f(contracted);
                    if (contracted.fx < worst.fx) {
                        updateSimplex(contracted);
                    } else {
                        shouldReduce = true;
                    }
                } else {
                    // do an outside contraction
                    weightedSum(contracted, 1-psi * rho, centroid, psi*rho, worst);
                    contracted.fx = f(contracted);
                    if (contracted.fx < reflected.fx) {
                        updateSimplex(contracted);
                    } else {
                        shouldReduce = true;
                    }
                }

                if (shouldReduce) {
                    // if we don't contract here, we're done
                    if (sigma >= 1) break;

                    // do a reduction
                    for (i = 1; i < simplex.length; ++i) {
                        weightedSum(simplex[i], 1 - sigma, simplex[0], sigma, simplex[i]);
                        simplex[i].fx = f(simplex[i]);
                    }
                }
            } else {
                updateSimplex(reflected);
            }
        }

        simplex.sort(sortOrder);
        return {fx : simplex[0].fx,
                x : simplex[0]};
    }

    /// searches along line 'pk' for a point that satifies the wolfe conditions
    /// See 'Numerical Optimization' by Nocedal and Wright p59-60
    /// f : objective function
    /// pk : search direction
    /// current: object containing current gradient/loss
    /// next: output: contains next gradient/loss
    /// returns a: step size taken
    function wolfeLineSearch(f, pk, current, next, a, c1, c2) {
        var phi0 = current.fx, phiPrime0 = dot(current.fxprime, pk),
            phi = phi0, phi_old = phi0,
            phiPrime = phiPrime0,
            a0 = 0;

        a = a || 1;
        c1 = c1 || 1e-6;
        c2 = c2 || 0.1;

        function zoom(a_lo, a_high, phi_lo) {
            for (var iteration = 0; iteration < 16; ++iteration) {
                a = (a_lo + a_high)/2;
                weightedSum(next.x, 1.0, current.x, a, pk);
                phi = next.fx = f(next.x, next.fxprime);
                phiPrime = dot(next.fxprime, pk);

                if ((phi > (phi0 + c1 * a * phiPrime0)) ||
                    (phi >= phi_lo)) {
                    a_high = a;

                } else  {
                    if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
                        return a;
                    }

                    if (phiPrime * (a_high - a_lo) >=0) {
                        a_high = a_lo;
                    }

                    a_lo = a;
                    phi_lo = phi;
                }
            }

            return 0;
        }

        for (var iteration = 0; iteration < 10; ++iteration) {
            weightedSum(next.x, 1.0, current.x, a, pk);
            phi = next.fx = f(next.x, next.fxprime);
            phiPrime = dot(next.fxprime, pk);
            if ((phi > (phi0 + c1 * a * phiPrime0)) ||
                (iteration && (phi >= phi_old))) {
                return zoom(a0, a, phi_old);
            }

            if (Math.abs(phiPrime) <= -c2 * phiPrime0) {
                return a;
            }

            if (phiPrime >= 0 ) {
                return zoom(a, a0, phi);
            }

            phi_old = phi;
            a0 = a;
            a *= 2;
        }

        return a;
    }

    function conjugateGradient(f, initial, params) {
        // allocate all memory up front here, keep out of the loop for perfomance
        // reasons
        var current = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
            next = {x: initial.slice(), fx: 0, fxprime: initial.slice()},
            yk = initial.slice(),
            pk, temp,
            a = 1,
            maxIterations;

        params = params || {};
        maxIterations = params.maxIterations || initial.length * 20;

        current.fx = f(current.x, current.fxprime);
        pk = current.fxprime.slice();
        scale(pk, current.fxprime,-1);

        for (var i = 0; i < maxIterations; ++i) {
            a = wolfeLineSearch(f, pk, current, next, a);

            // todo: history in wrong spot?
            if (params.history) {
                params.history.push({x: current.x.slice(),
                                     fx: current.fx,
                                     fxprime: current.fxprime.slice(),
                                     alpha: a});
            }

            if (!a) {
                // faiiled to find point that satifies wolfe conditions.
                // reset direction for next iteration
                scale(pk, current.fxprime, -1);

            } else {
                // update direction using Polak–Ribiere CG method
                weightedSum(yk, 1, next.fxprime, -1, current.fxprime);

                var delta_k = dot(current.fxprime, current.fxprime),
                    beta_k = Math.max(0, dot(yk, next.fxprime) / delta_k);

                weightedSum(pk, beta_k, pk, -1, next.fxprime);

                temp = current;
                current = next;
                next = temp;
            }

            if (norm2(current.fxprime) <= 1e-5) {
                break;
            }
        }

        if (params.history) {
            params.history.push({x: current.x.slice(),
                                 fx: current.fx,
                                 fxprime: current.fxprime.slice(),
                                 alpha: a});
        }

        return current;
    }

    /** given a list of set objects, and their corresponding overlaps.
    updates the (x, y, radius) attribute on each set such that their positions
    roughly correspond to the desired overlaps */
    function venn(areas, parameters) {
        parameters = parameters || {};
        parameters.maxIterations = parameters.maxIterations || 500;
        var initialLayout = parameters.initialLayout || bestInitialLayout;

        // add in missing pairwise areas as having 0 size
        areas = addMissingAreas(areas);

        // initial layout is done greedily
        var circles = initialLayout(areas);

        // transform x/y coordinates to a vector to optimize
        var initial = [], setids = [], setid;
        for (setid in circles) {
            if (circles.hasOwnProperty(setid)) {
                initial.push(circles[setid].x);
                initial.push(circles[setid].y);
                setids.push(setid);
            }
        }

        // optimize initial layout from our loss function
        var totalFunctionCalls = 0;
        var solution = nelderMead(
            function(values) {
                totalFunctionCalls += 1;
                var current = {};
                for (var i = 0; i < setids.length; ++i) {
                    var setid = setids[i];
                    current[setid] = {x: values[2 * i],
                                      y: values[2 * i + 1],
                                      radius : circles[setid].radius,
                                     // size : circles[setid].size
                                     };
                }
                return lossFunction(current, areas);
            },
            initial,
            parameters);

        // transform solution vector back to x/y points
        var positions = solution.x;
        for (var i = 0; i < setids.length; ++i) {
            setid = setids[i];
            circles[setid].x = positions[2 * i];
            circles[setid].y = positions[2 * i + 1];
        }

        return circles;
    }

    var SMALL$1 = 1e-10;

    /** Returns the distance necessary for two circles of radius r1 + r2 to
    have the overlap area 'overlap' */
    function distanceFromIntersectArea(r1, r2, overlap) {
        // handle complete overlapped circles
        if (Math.min(r1, r2) * Math.min(r1,r2) * Math.PI <= overlap + SMALL$1) {
            return Math.abs(r1 - r2);
        }

        return bisect(function(distance) {
            return circleOverlap(r1, r2, distance) - overlap;
        }, 0, r1 + r2);
    }

    /** Missing pair-wise intersection area data can cause problems:
     treating as an unknown means that sets will be laid out overlapping,
     which isn't what people expect. To reflect that we want disjoint sets
     here, set the overlap to 0 for all missing pairwise set intersections */
    function addMissingAreas(areas) {
        areas = areas.slice();

        // two circle intersections that aren't defined
        var ids = [], pairs = {}, i, j, a, b;
        for (i = 0; i < areas.length; ++i) {
            var area = areas[i];
            if (area.sets.length == 1) {
                ids.push(area.sets[0]);
            } else if (area.sets.length == 2) {
                a = area.sets[0];
                b = area.sets[1];
                pairs[[a, b]] = true;
                pairs[[b, a]] = true;
            }
        }
        ids.sort(function(a, b) { return a > b; });

        for (i = 0; i < ids.length; ++i) {
            a = ids[i];
            for (j = i + 1; j < ids.length; ++j) {
                b = ids[j];
                if (!([a, b] in pairs)) {
                    areas.push({'sets': [a, b],
                                'size': 0});
                }
            }
        }
        return areas;
    }

    /// Returns two matrices, one of the euclidean distances between the sets
    /// and the other indicating if there are subset or disjoint set relationships
    function getDistanceMatrices(areas, sets, setids) {
        // initialize an empty distance matrix between all the points
        var distances = zerosM(sets.length, sets.length),
            constraints = zerosM(sets.length, sets.length);

        // compute required distances between all the sets such that
        // the areas match
        areas.filter(function(x) { return x.sets.length == 2; })
            .map(function(current) {
            var left = setids[current.sets[0]],
                right = setids[current.sets[1]],
                r1 = Math.sqrt(sets[left].size / Math.PI),
                r2 = Math.sqrt(sets[right].size / Math.PI),
                distance = distanceFromIntersectArea(r1, r2, current.size);

            distances[left][right] = distances[right][left] = distance;

            // also update constraints to indicate if its a subset or disjoint
            // relationship
            var c = 0;
            if (current.size + 1e-10 >= Math.min(sets[left].size,
                                                 sets[right].size)) {
                c = 1;
            } else if (current.size <= 1e-10) {
                c = -1;
            }
            constraints[left][right] = constraints[right][left] = c;
        });

        return {distances: distances, constraints: constraints};
    }

    /// computes the gradient and loss simulatenously for our constrained MDS optimizer
    function constrainedMDSGradient(x, fxprime, distances, constraints) {
        var loss = 0, i;
        for (i = 0; i < fxprime.length; ++i) {
            fxprime[i] = 0;
        }

        for (i = 0; i < distances.length; ++i) {
            var xi = x[2 * i], yi = x[2 * i + 1];
            for (var j = i + 1; j < distances.length; ++j) {
                var xj = x[2 * j], yj = x[2 * j + 1],
                    dij = distances[i][j],
                    constraint = constraints[i][j];

                var squaredDistance = (xj - xi) * (xj - xi) + (yj - yi) * (yj - yi),
                    distance = Math.sqrt(squaredDistance),
                    delta = squaredDistance - dij * dij;

                if (((constraint > 0) && (distance <= dij)) ||
                    ((constraint < 0) && (distance >= dij))) {
                    continue;
                }

                loss += 2 * delta * delta;

                fxprime[2*i]     += 4 * delta * (xi - xj);
                fxprime[2*i + 1] += 4 * delta * (yi - yj);

                fxprime[2*j]     += 4 * delta * (xj - xi);
                fxprime[2*j + 1] += 4 * delta * (yj - yi);
            }
        }
        return loss;
    }

    /// takes the best working variant of either constrained MDS or greedy
    function bestInitialLayout(areas, params) {
        var initial = greedyLayout(areas, params);

        // greedylayout is sufficient for all 2/3 circle cases. try out
        // constrained MDS for higher order problems, take its output
        // if it outperforms. (greedy is aesthetically better on 2/3 circles
        // since it axis aligns)
        if (areas.length >= 8) {
            var constrained  = constrainedMDSLayout(areas, params),
                constrainedLoss = lossFunction(constrained, areas),
                greedyLoss = lossFunction(initial, areas);

            if (constrainedLoss + 1e-8 < greedyLoss) {
                initial = constrained;
            }
        }
        return initial;
    }

    /// use the constrained MDS variant to generate an initial layout
    function constrainedMDSLayout(areas, params) {
        params = params || {};
        var restarts = params.restarts || 10;

        // bidirectionally map sets to a rowid  (so we can create a matrix)
        var sets = [], setids = {}, i;
        for (i = 0; i < areas.length; ++i ) {
            var area = areas[i];
            if (area.sets.length == 1) {
                setids[area.sets[0]] = sets.length;
                sets.push(area);
            }
        }

        var matrices = getDistanceMatrices(areas, sets, setids),
            distances = matrices.distances,
            constraints = matrices.constraints;

        // keep distances bounded, things get messed up otherwise.
        // TODO: proper preconditioner?
        var norm = norm2(distances.map(norm2))/(distances.length);
        distances = distances.map(function (row) {
            return row.map(function (value) { return value / norm; });});

        var obj = function(x, fxprime) {
            return constrainedMDSGradient(x, fxprime, distances, constraints);
        };

        var best, current;
        for (i = 0; i < restarts; ++i) {
            var initial = zeros(distances.length*2).map(Math.random);

            current = conjugateGradient(obj, initial, params);
            if (!best || (current.fx < best.fx)) {
                best = current;
            }
        }
        var positions = best.x;

        // translate rows back to (x,y,radius) coordinates
        var circles = {};
        for (i = 0; i < sets.length; ++i) {
            var set = sets[i];
            circles[set.sets[0]] = {
                x: positions[2*i] * norm,
                y: positions[2*i + 1] * norm,
                radius:  Math.sqrt(set.size / Math.PI)
            };
        }

        if (params.history) {
            for (i = 0; i < params.history.length; ++i) {
                scale(params.history[i].x, norm);
            }
        }
        return circles;
    }

    /** Lays out a Venn diagram greedily, going from most overlapped sets to
    least overlapped, attempting to position each new set such that the
    overlapping areas to already positioned sets are basically right */
    function greedyLayout(areas) {
        // define a circle for each set
        var circles = {}, setOverlaps = {}, set;
        for (var i = 0; i < areas.length; ++i) {
            var area = areas[i];
            if (area.sets.length == 1) {
                set = area.sets[0];
                circles[set] = {x: 1e10, y: 1e10,
                                rowid: circles.length,
                                size: area.size,
                                radius: Math.sqrt(area.size / Math.PI)};
                setOverlaps[set] = [];
            }
        }
        areas = areas.filter(function(a) { return a.sets.length == 2; });

        // map each set to a list of all the other sets that overlap it
        for (i = 0; i < areas.length; ++i) {
            var current = areas[i];
            var weight = current.hasOwnProperty('weight') ? current.weight : 1.0;
            var left = current.sets[0], right = current.sets[1];

            // completely overlapped circles shouldn't be positioned early here
            if (current.size + SMALL$1 >= Math.min(circles[left].size,
                                                 circles[right].size)) {
                weight = 0;
            }

            setOverlaps[left].push ({set:right, size:current.size, weight:weight});
            setOverlaps[right].push({set:left,  size:current.size, weight:weight});
        }

        // get list of most overlapped sets
        var mostOverlapped = [];
        for (set in setOverlaps) {
            if (setOverlaps.hasOwnProperty(set)) {
                var size = 0;
                for (i = 0; i < setOverlaps[set].length; ++i) {
                    size += setOverlaps[set][i].size * setOverlaps[set][i].weight;
                }

                mostOverlapped.push({set: set, size:size});
            }
        }

        // sort by size desc
        function sortOrder(a,b) {
            return b.size - a.size;
        }
        mostOverlapped.sort(sortOrder);

        // keep track of what sets have been laid out
        var positioned = {};
        function isPositioned(element) {
            return element.set in positioned;
        }

        // adds a point to the output
        function positionSet(point, index) {
            circles[index].x = point.x;
            circles[index].y = point.y;
            positioned[index] = true;
        }

        // add most overlapped set at (0,0)
        positionSet({x: 0, y: 0}, mostOverlapped[0].set);

        // get distances between all points. TODO, necessary?
        // answer: probably not
        // var distances = venn.getDistanceMatrices(circles, areas).distances;
        for (i = 1; i < mostOverlapped.length; ++i) {
            var setIndex = mostOverlapped[i].set,
                overlap = setOverlaps[setIndex].filter(isPositioned);
            set = circles[setIndex];
            overlap.sort(sortOrder);

            if (overlap.length === 0) {
                // this shouldn't happen anymore with addMissingAreas
                throw "ERROR: missing pairwise overlap information";
            }

            var points = [];
            for (var j = 0; j < overlap.length; ++j) {
                // get appropriate distance from most overlapped already added set
                var p1 = circles[overlap[j].set],
                    d1 = distanceFromIntersectArea(set.radius, p1.radius,
                                                   overlap[j].size);

                // sample positions at 90 degrees for maximum aesthetics
                points.push({x : p1.x + d1, y : p1.y});
                points.push({x : p1.x - d1, y : p1.y});
                points.push({y : p1.y + d1, x : p1.x});
                points.push({y : p1.y - d1, x : p1.x});

                // if we have at least 2 overlaps, then figure out where the
                // set should be positioned analytically and try those too
                for (var k = j + 1; k < overlap.length; ++k) {
                    var p2 = circles[overlap[k].set],
                        d2 = distanceFromIntersectArea(set.radius, p2.radius,
                                                       overlap[k].size);

                    var extraPoints = circleCircleIntersection(
                        { x: p1.x, y: p1.y, radius: d1},
                        { x: p2.x, y: p2.y, radius: d2});

                    for (var l = 0; l < extraPoints.length; ++l) {
                        points.push(extraPoints[l]);
                    }
                }
            }

            // we have some candidate positions for the set, examine loss
            // at each position to figure out where to put it at
            var bestLoss = 1e50, bestPoint = points[0];
            for (j = 0; j < points.length; ++j) {
                circles[setIndex].x = points[j].x;
                circles[setIndex].y = points[j].y;
                var loss = lossFunction(circles, areas);
                if (loss < bestLoss) {
                    bestLoss = loss;
                    bestPoint = points[j];
                }
            }

            positionSet(bestPoint, setIndex);
        }

        return circles;
    }

    /** Given a bunch of sets, and the desired overlaps between these sets - computes
    the distance from the actual overlaps to the desired overlaps. Note that
    this method ignores overlaps of more than 2 circles */
    function lossFunction(sets, overlaps) {
        var output = 0;

        function getCircles(indices) {
            return indices.map(function(i) { return sets[i]; });
        }

        for (var i = 0; i < overlaps.length; ++i) {
            var area = overlaps[i], overlap;
            if (area.sets.length == 1) {
                continue;
            } else if (area.sets.length == 2) {
                var left = sets[area.sets[0]],
                    right = sets[area.sets[1]];
                overlap = circleOverlap(left.radius, right.radius,
                                        distance(left, right));
            } else {
                overlap = intersectionArea(getCircles(area.sets));
            }

            var weight = area.hasOwnProperty('weight') ? area.weight : 1.0;
            output += weight * (overlap - area.size) * (overlap - area.size);
        }

        return output;
    }

    // orientates a bunch of circles to point in orientation
    function orientateCircles(circles, orientation, orientationOrder) {
        if (orientationOrder === null) {
            circles.sort(function (a, b) { return b.radius - a.radius; });
        } else {
            circles.sort(orientationOrder);
        }

        var i;
        // shift circles so largest circle is at (0, 0)
        if (circles.length > 0) {
            var largestX = circles[0].x,
                largestY = circles[0].y;

            for (i = 0; i < circles.length; ++i) {
                circles[i].x -= largestX;
                circles[i].y -= largestY;
            }
        }

        // rotate circles so that second largest is at an angle of 'orientation'
        // from largest
        if (circles.length > 1) {
            var rotation = Math.atan2(circles[1].x, circles[1].y) - orientation,
                c = Math.cos(rotation),
                s = Math.sin(rotation), x, y;

            for (i = 0; i < circles.length; ++i) {
                x = circles[i].x;
                y = circles[i].y;
                circles[i].x = c * x - s * y;
                circles[i].y = s * x + c * y;
            }
        }

        // mirror solution if third solution is above plane specified by
        // first two circles
        if (circles.length > 2) {
            var angle = Math.atan2(circles[2].x, circles[2].y) - orientation;
            while (angle < 0) { angle += 2* Math.PI; }
            while (angle > 2*Math.PI) { angle -= 2* Math.PI; }
            if (angle > Math.PI) {
                var slope = circles[1].y / (1e-10 + circles[1].x);
                for (i = 0; i < circles.length; ++i) {
                    var d = (circles[i].x + slope * circles[i].y) / (1 + slope*slope);
                    circles[i].x = 2 * d - circles[i].x;
                    circles[i].y = 2 * d * slope - circles[i].y;
                }
            }
        }
    }

    function disjointCluster(circles) {
        // union-find clustering to get disjoint sets
        circles.map(function(circle) { circle.parent = circle; });

        // path compression step in union find
        function find(circle) {
            if (circle.parent !== circle) {
                circle.parent = find(circle.parent);
            }
            return circle.parent;
        }

        function union(x, y) {
            var xRoot = find(x), yRoot = find(y);
            xRoot.parent = yRoot;
        }

        // get the union of all overlapping sets
        for (var i = 0; i < circles.length; ++i) {
            for (var j = i + 1; j < circles.length; ++j) {
                var maxDistance = circles[i].radius + circles[j].radius;
                if (distance(circles[i], circles[j]) + 1e-10 < maxDistance) {
                    union(circles[j], circles[i]);
                }
            }
        }

        // find all the disjoint clusters and group them together
        var disjointClusters = {}, setid;
        for (i = 0; i < circles.length; ++i) {
            setid = find(circles[i]).parent.setid;
            if (!(setid in disjointClusters)) {
                disjointClusters[setid] = [];
            }
            disjointClusters[setid].push(circles[i]);
        }

        // cleanup bookkeeping
        circles.map(function(circle) { delete circle.parent; });

        // return in more usable form
        var ret = [];
        for (setid in disjointClusters) {
            if (disjointClusters.hasOwnProperty(setid)) {
                ret.push(disjointClusters[setid]);
            }
        }
        return ret;
    }

    function getBoundingBox(circles) {
        var minMax = function(d) {
            var hi = Math.max.apply(null, circles.map(
                                    function(c) { return c[d] + c.radius; } )),
                lo = Math.min.apply(null, circles.map(
                                    function(c) { return c[d] - c.radius;} ));
            return {max:hi, min:lo};
        };

        return {xRange: minMax('x'), yRange: minMax('y')};
    }

    function normalizeSolution(solution, orientation, orientationOrder) {
        if (orientation === null){
            orientation = Math.PI/2;
        }

        // work with a list instead of a dictionary, and take a copy so we
        // don't mutate input
        var circles = [], i, setid;
        for (setid in solution) {
            if (solution.hasOwnProperty(setid)) {
                var previous = solution[setid];
                circles.push({x: previous.x,
                              y: previous.y,
                              radius: previous.radius,
                              setid: setid});
            }
        }

        // get all the disjoint clusters
        var clusters = disjointCluster(circles);

        // orientate all disjoint sets, get sizes
        for (i = 0; i < clusters.length; ++i) {
            orientateCircles(clusters[i], orientation, orientationOrder);
            var bounds = getBoundingBox(clusters[i]);
            clusters[i].size = (bounds.xRange.max - bounds.xRange.min) * (bounds.yRange.max - bounds.yRange.min);
            clusters[i].bounds = bounds;
        }
        clusters.sort(function(a, b) { return b.size - a.size; });

        // orientate the largest at 0,0, and get the bounds
        circles = clusters[0];
        var returnBounds = circles.bounds;

        var spacing = (returnBounds.xRange.max - returnBounds.xRange.min)/50;

        function addCluster(cluster, right, bottom) {
            if (!cluster) return;

            var bounds = cluster.bounds, xOffset, yOffset, centreing;

            if (right) {
                xOffset = returnBounds.xRange.max  - bounds.xRange.min + spacing;
            } else {
                xOffset = returnBounds.xRange.max  - bounds.xRange.max;
                centreing = (bounds.xRange.max - bounds.xRange.min) / 2 -
                            (returnBounds.xRange.max - returnBounds.xRange.min) / 2;
                if (centreing < 0) xOffset += centreing;
            }

            if (bottom) {
                yOffset = returnBounds.yRange.max  - bounds.yRange.min + spacing;
            } else {
                yOffset = returnBounds.yRange.max  - bounds.yRange.max;
                centreing = (bounds.yRange.max - bounds.yRange.min) / 2 -
                            (returnBounds.yRange.max - returnBounds.yRange.min) / 2;
                if (centreing < 0) yOffset += centreing;
            }

            for (var j = 0; j < cluster.length; ++j) {
                cluster[j].x += xOffset;
                cluster[j].y += yOffset;
                circles.push(cluster[j]);
            }
        }

        var index = 1;
        while (index < clusters.length) {
            addCluster(clusters[index], true, false);
            addCluster(clusters[index+1], false, true);
            addCluster(clusters[index+2], true, true);
            index += 3;

            // have one cluster (in top left). lay out next three relative
            // to it in a grid
            returnBounds = getBoundingBox(circles);
        }

        // convert back to solution form
        var ret = {};
        for (i = 0; i < circles.length; ++i) {
            ret[circles[i].setid] = circles[i];
        }
        return ret;
    }

    /** Scales a solution from venn.venn or venn.greedyLayout such that it fits in
    a rectangle of width/height - with padding around the borders. also
    centers the diagram in the available space at the same time */
    function scaleSolution(solution, width, height, padding) {
        var circles = [], setids = [];
        for (var setid in solution) {
            if (solution.hasOwnProperty(setid)) {
                setids.push(setid);
                circles.push(solution[setid]);
            }
        }

        width -= 2*padding;
        height -= 2*padding;

        var bounds = getBoundingBox(circles),
            xRange = bounds.xRange,
            yRange = bounds.yRange,
            xScaling = width  / (xRange.max - xRange.min),
            yScaling = height / (yRange.max - yRange.min),
            scaling = Math.min(yScaling, xScaling),

            // while we're at it, center the diagram too
            xOffset = (width -  (xRange.max - xRange.min) * scaling) / 2,
            yOffset = (height - (yRange.max - yRange.min) * scaling) / 2;

        var scaled = {};
        for (var i = 0; i < circles.length; ++i) {
            var circle = circles[i];
            scaled[setids[i]] = {
                radius: scaling * circle.radius,
                x: padding + xOffset + (circle.x - xRange.min) * scaling,
                y: padding + yOffset + (circle.y - yRange.min) * scaling,
            };
        }

        return scaled;
    }

    /*global console:true*/

    function VennDiagram() {
        var width = 600,
            height = 350,
            padding = 15,
            duration = 1000,
            orientation = Math.PI / 2,
            normalize = true,
            wrap = true,
            styled = true,
            fontSize = null,
            orientationOrder = null,

            // mimic the behaviour of d3.scale.category10 from the previous
            // version of d3
            colourMap = {},

            // so this is the same as d3.schemeCategory10, which is only defined in d3 4.0
            // since we can support older versions of d3 as long as we don't force this,
            // I'm hackily redefining below. TODO: remove this and change to d3.schemeCategory10
            colourScheme = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
            colourIndex = 0,
            colours = function(key) {
                if (key in colourMap) {
                    return colourMap[key];
                }
                var ret = colourMap[key] = colourScheme[colourIndex];
                colourIndex += 1;
                if (colourIndex >= colourScheme.length) {
                    colourIndex = 0;
                }
                return ret;
            },
            layoutFunction = venn;

        function chart(selection) {
            var data = selection.datum();
            var solution = layoutFunction(data);
            if (normalize) {
                solution = normalizeSolution(solution,
                                             orientation,
                                             orientationOrder);
            }
            var circles = scaleSolution(solution, width, height, padding);
            var textCentres = computeTextCentres(circles, data);

            // create svg if not already existing
            selection.selectAll("svg").data([circles]).enter().append("svg");

            var svg = selection.select("svg")
                .attr("width", width)
                .attr("height", height);

            // to properly transition intersection areas, we need the
            // previous circles locations. load from elements
            var previous = {}, hasPrevious = false;
            svg.selectAll(".venn-area path").each(function (d) {
                var path = d3Selection.select(this).attr("d");
                if ((d.sets.length == 1) && path) {
                    hasPrevious = true;
                    previous[d.sets[0]] = circleFromPath(path);
                }
            });

            // interpolate intersection area paths between previous and
            // current paths
            var pathTween = function(d) {
                return function(t) {
                    var c = d.sets.map(function(set) {
                        var start = previous[set], end = circles[set];
                        if (!start) {
                            start = {x : width/2, y : height/2, radius : 1};
                        }
                        if (!end) {
                            end = {x : width/2, y : height/2, radius : 1};
                        }
                        return {'x' : start.x * (1 - t) + end.x * t,
                                'y' : start.y * (1 - t) + end.y * t,
                                'radius' : start.radius * (1 - t) + end.radius * t};
                    });
                    return intersectionAreaPath(c);
                };
            };

            // update data, joining on the set ids
            var nodes = svg.selectAll(".venn-area")
                .data(data, function(d) { return d.sets; });

            // create new nodes
            var enter = nodes.enter()
                .append('g')
                .attr("class", function(d) {
                    return "venn-area venn-" +
                        (d.sets.length == 1 ? "circle" : "intersection");
                })
                .attr("data-venn-sets", function(d) {
                    return d.sets.join("_");
                });

            var enterPath = enter.append("path"),
                enterText = enter.append("text")
                .attr("class", "label")
                .text(function (d) { return label(d); } )
                .attr("text-anchor", "middle")
                .attr("dy", ".35em")
                .attr("x", width/2)
                .attr("y", height/2);


            // apply minimal style if wanted
            if (styled) {
                enterPath.style("fill-opacity", "0")
                    .filter(function (d) { return d.sets.length == 1; } )
                    .style("fill", function(d) { return colours(label(d)); })
                    .style("fill-opacity", ".25");

                enterText
                    .style("fill", function(d) { return d.sets.length == 1 ? colours(label(d)) : "#444"; });
            }

            // update existing, using pathTween if necessary
            var update = selection;
            if (hasPrevious) {
                update = selection.transition("venn").duration(duration);
                update.selectAll("path")
                    .attrTween("d", pathTween);
            } else {
                update.selectAll("path")
                    .attr("d", function(d) {
                        return intersectionAreaPath(d.sets.map(function (set) { return circles[set]; }));
                    });
            }

            var updateText = update.selectAll("text")
                .filter(function (d) { return d.sets in textCentres; })
                .text(function (d) { return label(d); } )
                .attr("x", function(d) { return Math.floor(textCentres[d.sets].x);})
                .attr("y", function(d) { return Math.floor(textCentres[d.sets].y);});

            if (wrap) {
                if (hasPrevious) {
                    // d3 4.0 uses 'on' for events on transitions,
                    // but d3 3.0 used 'each' instead. switch appropiately
                    if ('on' in updateText) {
                        updateText.on("end", wrapText(circles, label));
                    } else {
                        updateText.each("end", wrapText(circles, label));
                    }
                } else {
                    updateText.each(wrapText(circles, label));
                }
            }

            // remove old
            var exit = nodes.exit().transition('venn').duration(duration).remove();
            exit.selectAll("path")
                .attrTween("d", pathTween);

            var exitText = exit.selectAll("text")
                .attr("x", width/2)
                .attr("y", height/2);

            // if we've been passed a fontSize explicitly, use it to
            // transition
            if (fontSize !== null) {
                enterText.style("font-size", "0px");
                updateText.style("font-size", fontSize);
                exitText.style("font-size", "0px");
            }


            return {'circles': circles,
                    'textCentres': textCentres,
                    'nodes': nodes,
                    'enter': enter,
                    'update': update,
                    'exit': exit};
        }

        function label(d) {
            if (d.label) {
                return d.label;
            }
            if (d.sets.length == 1) {
                return '' + d.sets[0];
            }
        }

        chart.wrap = function(_) {
            if (!arguments.length) return wrap;
            wrap = _;
            return chart;
        };

        chart.width = function(_) {
            if (!arguments.length) return width;
            width = _;
            return chart;
        };

        chart.height = function(_) {
            if (!arguments.length) return height;
            height = _;
            return chart;
        };

        chart.padding = function(_) {
            if (!arguments.length) return padding;
            padding = _;
            return chart;
        };

        chart.colours = function(_) {
            if (!arguments.length) return colours;
            colours = _;
            return chart;
        };

        chart.fontSize = function(_) {
            if (!arguments.length) return fontSize;
            fontSize = _;
            return chart;
        };

        chart.duration = function(_) {
            if (!arguments.length) return duration;
            duration = _;
            return chart;
        };

        chart.layoutFunction = function(_) {
            if (!arguments.length) return layoutFunction;
            layoutFunction = _;
            return chart;
        };

        chart.normalize = function(_) {
            if (!arguments.length) return normalize;
            normalize = _;
            return chart;
        };

        chart.styled = function(_) {
            if (!arguments.length) return styled;
            styled = _;
            return chart;
        };

        chart.orientation = function(_) {
            if (!arguments.length) return orientation;
            orientation = _;
            return chart;
        };

        chart.orientationOrder = function(_) {
            if (!arguments.length) return orientationOrder;
            orientationOrder = _;
            return chart;
        };

        return chart;
    }
    // sometimes text doesn't fit inside the circle, if thats the case lets wrap
    // the text here such that it fits
    // todo: looks like this might be merged into d3 (
    // https://github.com/mbostock/d3/issues/1642),
    // also worth checking out is
    // http://engineering.findthebest.com/wrapping-axis-labels-in-d3-js/
    // this seems to be one of those things that should be easy but isn't
    function wrapText(circles, labeller) {
        return function() {
            var text = d3Selection.select(this),
                data = text.datum(),
                width = circles[data.sets[0]].radius || 50,
                label = labeller(data) || '';

                var words = label.split(/\s+/).reverse(),
                maxLines = 3,
                minChars = (label.length + words.length) / maxLines,
                word = words.pop(),
                line = [word],
                joined,
                lineNumber = 0,
                lineHeight = 1.1, // ems
                tspan = text.text(null).append("tspan").text(word);

            while (true) {
                word = words.pop();
                if (!word) break;
                line.push(word);
                joined = line.join(" ");
                tspan.text(joined);
                if (joined.length > minChars && tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").text(word);
                    lineNumber++;
                }
            }

            var initial = 0.35 - lineNumber * lineHeight / 2,
                x = text.attr("x"),
                y = text.attr("y");

            text.selectAll("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", function(d, i) {
                     return (initial + i * lineHeight) + "em";
                });
        };
    }

    function circleMargin(current, interior, exterior) {
        var margin = interior[0].radius - distance(interior[0], current), i, m;
        for (i = 1; i < interior.length; ++i) {
            m = interior[i].radius - distance(interior[i], current);
            if (m <= margin) {
                margin = m;
            }
        }

        for (i = 0; i < exterior.length; ++i) {
            m = distance(exterior[i], current) - exterior[i].radius;
            if (m <= margin) {
                margin = m;
            }
        }
        return margin;
    }

    // compute the center of some circles by maximizing the margin of
    // the center point relative to the circles (interior) after subtracting
    // nearby circles (exterior)
    function computeTextCentre(interior, exterior) {
        // get an initial estimate by sampling around the interior circles
        // and taking the point with the biggest margin
        var points = [], i;
        for (i = 0; i < interior.length; ++i) {
            var c = interior[i];
            points.push({x: c.x, y: c.y});
            points.push({x: c.x + c.radius/2, y: c.y});
            points.push({x: c.x - c.radius/2, y: c.y});
            points.push({x: c.x, y: c.y + c.radius/2});
            points.push({x: c.x, y: c.y - c.radius/2});
        }
        var initial = points[0], margin = circleMargin(points[0], interior, exterior);
        for (i = 1; i < points.length; ++i) {
            var m = circleMargin(points[i], interior, exterior);
            if (m >= margin) {
                initial = points[i];
                margin = m;
            }
        }

        // maximize the margin numerically
        var solution = nelderMead(
                    function(p) { return -1 * circleMargin({x: p[0], y: p[1]}, interior, exterior); },
                    [initial.x, initial.y],
                    {maxIterations:500, minErrorDelta:1e-10}).x;
        var ret = {x: solution[0], y: solution[1]};

        // check solution, fallback as needed (happens if fully overlapped
        // etc)
        var valid = true;
        for (i = 0; i < interior.length; ++i) {
            if (distance(ret, interior[i]) > interior[i].radius) {
                valid = false;
                break;
            }
        }

        for (i = 0; i < exterior.length; ++i) {
            if (distance(ret, exterior[i]) < exterior[i].radius) {
                valid = false;
                break;
            }
        }

        if (!valid) {
            if (interior.length == 1) {
                ret = {x: interior[0].x, y: interior[0].y};
            } else {
                var areaStats = {};
                intersectionArea(interior, areaStats);

                if (areaStats.arcs.length === 0) {
                    ret = {'x': 0, 'y': -1000, disjoint:true};

                } else if (areaStats.arcs.length == 1) {
                    ret = {'x': areaStats.arcs[0].circle.x,
                           'y': areaStats.arcs[0].circle.y};

                } else if (exterior.length) {
                    // try again without other circles
                    ret = computeTextCentre(interior, []);

                } else {
                    // take average of all the points in the intersection
                    // polygon. this should basically never happen
                    // and has some issues:
                    // https://github.com/benfred/venn.js/issues/48#issuecomment-146069777
                    ret = getCenter(areaStats.arcs.map(function (a) { return a.p1; }));
                }
            }
        }

        return ret;
    }

    // given a dictionary of {setid : circle}, returns
    // a dictionary of setid to list of circles that completely overlap it
    function getOverlappingCircles(circles) {
        var ret = {}, circleids = [];
        for (var circleid in circles) {
            circleids.push(circleid);
            ret[circleid] = [];
        }
        for (var i  = 0; i < circleids.length; i++) {
            var a = circles[circleids[i]];
            for (var j = i + 1; j < circleids.length; ++j) {
                var b = circles[circleids[j]],
                    d = distance(a, b);

                if (d + b.radius <= a.radius + 1e-10) {
                    ret[circleids[j]].push(circleids[i]);

                } else if (d + a.radius <= b.radius + 1e-10) {
                    ret[circleids[i]].push(circleids[j]);
                }
            }
        }
        return ret;
    }

    function computeTextCentres(circles, areas) {
        var ret = {}, overlapped = getOverlappingCircles(circles);
        for (var i = 0; i < areas.length; ++i) {
            var area = areas[i].sets, areaids = {}, exclude = {};
            for (var j = 0; j < area.length; ++j) {
                areaids[area[j]] = true;
                var overlaps = overlapped[area[j]];
                // keep track of any circles that overlap this area,
                // and don't consider for purposes of computing the text
                // centre
                for (var k = 0; k < overlaps.length; ++k) {
                    exclude[overlaps[k]] = true;
                }
            }

            var interior = [], exterior = [];
            for (var setid in circles) {
                if (setid in areaids) {
                    interior.push(circles[setid]);
                } else if (!(setid in exclude)) {
                    exterior.push(circles[setid]);
                }
            }
            var centre = computeTextCentre(interior, exterior);
            ret[area] = centre;
            if (centre.disjoint && (areas[i].size > 0)) {
                console.log("WARNING: area " + area + " not represented on screen");
            }
        }
        return  ret;
    }

    // sorts all areas in the venn diagram, so that
    // a particular area is on top (relativeTo) - and
    // all other areas are so that the smallest areas are on top
    function sortAreas(div, relativeTo) {

        // figure out sets that are completly overlapped by relativeTo
        var overlaps = getOverlappingCircles(div.selectAll("svg").datum());
        var exclude = {};
        for (var i = 0; i < relativeTo.sets.length; ++i) {
            var check = relativeTo.sets[i];
            for (var setid in overlaps) {
                var overlap = overlaps[setid];
                for (var j = 0; j < overlap.length; ++j) {
                    if (overlap[j] == check) {
                        exclude[setid] = true;
                        break;
                    }
                }
            }
        }

        // checks that all sets are in exclude;
        function shouldExclude(sets) {
            for (var i = 0; i < sets.length; ++i) {
                if (!(sets[i] in exclude)) {
                    return false;
                }
            }
            return true;
        }

        // need to sort div's so that Z order is correct
        div.selectAll("g").sort(function (a, b) {
            // highest order set intersections first
            if (a.sets.length != b.sets.length) {
                return a.sets.length - b.sets.length;
            }

            if (a == relativeTo) {
                return shouldExclude(b.sets) ? -1 : 1;
            }
            if (b == relativeTo) {
                return shouldExclude(a.sets) ? 1 : -1;
            }

            // finally by size
            return b.size - a.size;
        });
    }

    function circlePath(x, y, r) {
        var ret = [];
        ret.push("\nM", x, y);
        ret.push("\nm", -r, 0);
        ret.push("\na", r, r, 0, 1, 0, r *2, 0);
        ret.push("\na", r, r, 0, 1, 0,-r *2, 0);
        return ret.join(" ");
    }

    // inverse of the circlePath function, returns a circle object from an svg path
    function circleFromPath(path) {
        var tokens = path.split(' ');
        return {'x' : parseFloat(tokens[1]),
                'y' : parseFloat(tokens[2]),
                'radius' : -parseFloat(tokens[4])
                };
    }

    /** returns a svg path of the intersection area of a bunch of circles */
    function intersectionAreaPath(circles) {
        var stats = {};
        intersectionArea(circles, stats);
        var arcs = stats.arcs;

        if (arcs.length === 0) {
            return "M 0 0";

        } else if (arcs.length == 1) {
            var circle = arcs[0].circle;
            return circlePath(circle.x, circle.y, circle.radius);

        } else {
            // draw path around arcs
            var ret = ["\nM", arcs[0].p2.x, arcs[0].p2.y];
            for (var i = 0; i < arcs.length; ++i) {
                var arc = arcs[i], r = arc.circle.radius, wide = arc.width > r;
                ret.push("\nA", r, r, 0, wide ? 1 : 0, 1,
                         arc.p1.x, arc.p1.y);
            }
            return ret.join(" ");
        }
    }

    exports.intersectionArea = intersectionArea;
    exports.circleCircleIntersection = circleCircleIntersection;
    exports.circleOverlap = circleOverlap;
    exports.circleArea = circleArea;
    exports.distance = distance;
    exports.circleIntegral = circleIntegral;
    exports.venn = venn;
    exports.greedyLayout = greedyLayout;
    exports.scaleSolution = scaleSolution;
    exports.normalizeSolution = normalizeSolution;
    exports.bestInitialLayout = bestInitialLayout;
    exports.lossFunction = lossFunction;
    exports.disjointCluster = disjointCluster;
    exports.distanceFromIntersectArea = distanceFromIntersectArea;
    exports.VennDiagram = VennDiagram;
    exports.wrapText = wrapText;
    exports.computeTextCentres = computeTextCentres;
    exports.computeTextCentre = computeTextCentre;
    exports.sortAreas = sortAreas;
    exports.circlePath = circlePath;
    exports.circleFromPath = circleFromPath;
    exports.intersectionAreaPath = intersectionAreaPath;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
},{"d3-selection":5,"d3-transition":7}],9:[function(require,module,exports){
var venn = require("venn.js")

var text1 = "First, consider a circle that contains all plucked intruments and another one that contains all bowed instruments."

var text2 = "Premise 1 tells that whatever instrument Bob plays belongs to the bowed circle. Based on this premise alone, do we have good enough reason to think that Bob does not play the guitar?"

var text3 = "Not quite - since that premise alone does not give us enough information to where guitars would be in this diagram. If, for instance, there are guitars that are both plucked and bowed, then the fact that Bob plays a bowed instrument is not sufficient to rule out the possibility of him playing the guitar."

var text4 =  "This is exactly why the second premise is important: it tells us that guitars are not played with bows. This means that it is impossible for the guitar circle to be inside of the overlapping areas."



// This means that there is no way Bob's choice of instrument would be part of hte guitar circle. In other words, the premises necessitates  that the conclusion: if the premises are true, then the conlucsion has to be true."


  $canvas = $('.animation', '#m1c1s1');
  $canvas2 = $('.animation', '#m1c1s2');

var bobLabel,
    bobLine,
    bobText,
    bowed,
    bowedText,
    guitarCircle,
    guitarText,
    plucked,
    pluckedtext,
    height,
    width,
    radius,
    freezePoint;

$(function(){

  var frame = [];
  var i = 0
  scrollTop = 0
  newScrollTop = 0
  var marginTop = 300
  // d3.select('#t1').style("margin-top", marginTop)

  var startPoint = tp('#t1') - window.innerHeight/2


  $(window).on('scroll',function(){
      newScrollTop = $(window).scrollTop()




    })

  function tp(id){
    return $(id).offset().top + ($(id).height()/2) - (window.innerHeight/2)
  }



  var width
  var height
  var radius
  var scrollAnimationDuration = 200;
  var bowedColor = "#7E8959"

  var pluckedColor = "#C9AC68"

  var guitarColor = "#7E6B71"
  var bobColor = "#B25538"
  var lineScale,
      firstScale,
      vennEulerScale,
      vennOScale,
      vennSScale,
      nums,
      chart,
      moodsChart,
      moodWidth;

  function setDimensions(){
      width = $('main').width()/2
      height = width
      radius = (Math.min(width, height) / 4);
     bowedX = width/3
     bowedY = height/2
     pluckedX = 2*width/3
     pluckedY = height/2
     guitarX = 2.2*width/3;
     guitarY = 1.3*height/2
     bobX = bowedX/2
     bobY = bowedY

     freezePoint = tp('#t1')
     slideDuration = 250

     firstScale = d3.scaleLinear()
                      .domain([startPoint,tp('#t1')-slideDuration])
                      .range([0,0.6])
                      .clamp(true)
     lineYScale = d3.scaleLinear()
                      .domain([tp('#t1'),tp('#t2')-slideDuration])
                      .range([bobY, bobY - 1.2*radius])
                      .clamp(true)
      lineOScale = d3.scaleLinear()
                       .domain([tp('#t2'),tp('#t3')-slideDuration])
                       .range([1, 0])
                       .clamp(true)
     p2TextOScale = d3.scaleLinear()
                      .domain([tp('#t3'),tp('#t4')-slideDuration])
                      .range([0, 0.8])
                      .clamp(true)
    p2LineYScale = d3.scaleLinear()
                     .domain([tp('#t3'),tp('#t4')-slideDuration])
                     .range([bobY - 1.2*radius, bobY - radius/5])
                     .clamp(true)
   p2LineXScale = d3.scaleLinear()
                    .domain([tp('#t3'),tp('#t4')])
                    .range([width*0.7, width/2+radius])
                    .clamp(true)
    cLineYScale = d3.scaleLinear()
                     .domain([tp('#t3'),tp('#t4')-slideDuration])
                     .range([bobY + 1.4*radius, bobY])
                     .clamp(true)
     bobNameScale = d3.scaleLinear()
                      .domain([tp('#t1'),tp('#t2')-slideDuration,tp('#t3')-slideDuration])
                      .range([0, 0.8,0])
                      .clamp(true)
      bobScale = d3.scaleLinear()
                       .domain([tp('#t1'),tp('#t2')-slideDuration])
                       .range([0, 0.7])
                       .clamp(true)
     guitarOScale = d3.scaleLinear()
                      .domain([tp('#t2'),tp('#t3')-slideDuration])
                      .range([0, 0.6])
                      .clamp(true)
    guitarXScale = d3.scaleLinear()
                     .domain([tp('#t3'),tp('#t4')-slideDuration])
                     .range([0, radius])
                     .clamp(true)
    bobXScale = d3.scaleLinear()
                     .domain([tp('#t2'),tp('#t3')-slideDuration])
                     .range([bobX, width/2])
                     .clamp(true)

    vennEulerScale = d3.scaleLinear()
              .domain([tp('#t5')+200, tp('#t6')-slideDuration])
              .range([6,3])
              .clamp(true)

    vennEulerScale2 = d3.scaleLinear()
              .domain([tp('#t5')+200, tp('#t6')-slideDuration])
              .range([6,12])
              .clamp(true)
    vennOScale = d3.scaleLinear()
             .domain([tp('#t5')+200, tp('#t6')-slideDuration])
             .range([0.7,0])
             .clamp(true)
    vennInterScale = d3.scaleLinear()
                   .domain([tp('#t7'), tp('#t8')-slideDuration])
                   .range([0,1])
                   .clamp(true)
   vennGuitarScale = d3.scaleLinear()
                  .domain([tp('#t7'), tp('#t8')-slideDuration])
                  .range([255,130])
                  .clamp(true)
      numScale = d3.scaleLinear()
                     .domain([tp('#t6')+200, tp('#t7')-slideDuration])
                     .range([0,0.7])
                     .clamp(true)

     freezePoint2 = tp('#t5')
     chart = venn.VennDiagram().width(width)
      nums = [
       {"num":"1","dx":width/3, "dy": chart.height()/2},
       {"num":"2","dx":width/2,"dy": chart.height()/2},
       {"num":"3","dx":2*width/3,"dy": chart.height()/2},
       {"num":"4","dx":width*.9,"dy": chart.height()*.1}
     ]


  }
  var svg = d3.select("#m1c1s1 .animation").append("svg")
    .attr("width", width)
    .attr("height", height)

  function Oscale(s,e,max){
    max = (max == null)? 0.7 :max
    output = d3.scaleLinear()
                     .domain([tp(s),tp(e)-slideDuration])
                     .range([0, max])
                     .clamp(true)
      return output(scrollTop)
    }


    function graphicInit(){

        bowedCircle = svg.append('g').attr('class','bigCircles').attr('id','bowedCircle').append("circle").attr("r",radius).attr("cx",bowedX).attr("cy", bowedY).style('fill', bowedColor)
        bowedText =  svg.append('text').attr('class','bigCircles').text('Bowed').attr("dx",bowedX - 40).attr("dy", bowedY + 1.2*radius).style('fill','black')
        pluckedCircle = svg.append('g').attr('class','bigCircles').attr('id','pluckedCircle').append("circle").attr("r",radius).attr("cx",pluckedX).attr("cy", pluckedY).style('fill',pluckedColor)
        pluckedText = svg.append("text").attr('class','bigCircles').text("Plucked").attr("dx",pluckedX - 30).attr("dy", pluckedY + 1.2*radius).style('fill','black')
        d3.selectAll('.bigCircles').transition().style('opacity', 0)
        bobLine = svg.append('g').append('line')
                    .attr('class', 'bobLabel').
                    attr('id', "bobLine")
                      .attr("x1", bobX)
                      .attr("y1",bobY)
                      .attr("x2", bobX)
                      .attr("y2",bobY )
                      .attr("stroke-width", 2)
                      .attr("stroke","black")
        bobText = svg.append('text')
          .text("Premise 1: Bob plays a bowed instrument.")
          .attr('class', "bobLabel")
          .attr('id', "bobName")
          .attr("dx",bobX - 40)
          .attr("dy", bobY - radius-40)
          .style('opacity',0)
        bobCircle = svg.append("g").append("circle").attr('id', 'bob').attr("r",radius/8).attr("cx",bobX).attr("cy",bobY ).style('fill', bobColor).attr('opacity', 0)
        p2text = svg.append('text')
                    .text('Premise 2: no guitar is bowed.').attr("dx",width/2).attr("dy", bobY - 1.3*radius).style('fill','black').style('opacity',0)
        b = [{x: width*0.7 ,y: bobY - 1.2*radius},{x: width*0.7, y: bobY - 1.2*radius}]

        line = d3.line().x(function(d){return d.x}).y(function(d){return d.y})
        p2line = d3.select('#m1c1s1 svg').append('path').attr('d',line(b)).attr('stroke', 'black').attr('stroke-width','2').attr('fill-opacity', 0)
        // bline = d3.line().x(function(c){return d.x}).y(function(d){return d.y})
        conclusionText = svg.append('text')
                    .text('Conclusion: Bob does not play the guitar.').attr("dx",width/2 - radius).attr("dy", bobY + 1.5*radius ).style('fill','black').style('opacity',0)
        c = [{x:width/2 ,y: bobY + 1.4*radius}]
        //
        // line = d3.line().x(function(d){return d.x}).y(function(d){return d.y})
        cline = d3.select('#m1c1s1 svg').append('path').attr('d',line(c)).attr('stroke', 'black').attr('stroke-width','2').attr('fill-opacity', 0)



      guitarCircle = svg
                .append("g").attr('id','guitarStuff').attr('opacity',0)
                .append("circle").attr("r",radius/3).attr("cx",width/2).attr("cy", bobY).style('fill',guitarColor)
      guitarText = d3.select('#guitarStuff').append("text").text("Guitar").attr("dx",width/2).attr("dy", bobY).style('fill','black')



    }

    function resize(){
      setDimensions();
      setSVGsize();
      sticky()
      d3.selectAll('.bigCircles circle').attr('r', radius)
      bowedCircle.attr('r', radius).attr("cx",bowedX).attr("cy", bowedY)
      bowedText.attr("dx",bowedX - 30).attr("dy", bowedY + 1.2*radius)
      pluckedCircle.attr('r', radius).attr("cx",pluckedX).attr("cy", pluckedY)
      pluckedText.attr("dx",pluckedX - 40).attr("dy", pluckedY + 1.2*radius )
        bobLine .attr("x1", bobX)
                 .attr("y1",bobY)
                 .attr("x2", bobX)
                  .attr("y2", lineYScale(scrollTop))
      bobText.attr("dx",bobX - 40)
        .attr("dy", bobY - radius-40)
      guitarText.attr('dy', bobY).attr("dx",width/2)
      // console.log(guitarCircle)
      guitarCircle.attr('cy', bobY).attr("r",radius/3).attr("cx",width/2)
        bobCircle.attr("r",radius/8)
      graphics()
      chart.width(width)


      conclusionText.attr("dx",width/2 - radius).attr("dy", bobY + 1.5*radius )
      c = [{x:width/2 ,y: bobY + 1.4*radius},{x:width/2  ,y: cLineYScale(scrollTop) }]      //
      // line = d3.line().x(function(d){return d.x}).y(function(d){return d.y})
      cline.attr('d',line(c))


      graphics2TextAdd()

      moodWidth = $('#moods .col-md-6').width()
      moodsChart = venn.VennDiagram().width(moodWidth)
      moodsVenn = d3.selectAll("#moods .col-md-6")
            .datum([
              {sets:["S"],size:3},
              {sets:["P"],size:3},
              {sets:["S", "P"],size:1}
                ]).call(moodsChart)


      pnText.transition().duration(1500).attr('dx',moodWidth/2).attr('dy',$('svg','#pa').height()/2)

      paText.transition().duration(1500).attr('dx',moodWidth/4).attr('dy',$('svg','#pa').height()/2)
      $canvas3.html("")
      chart3 = venn.VennDiagram().height(width).width(width).duration(scrollAnimationDuration)
      venn3Init()

    }

    function setSVGsize(){
      $('svg', $canvas)
      .css('width', width)
      .css('height', height)
    }
  setDimensions();
  graphicInit();
// console.log(freezePoint)

  function graphics(){
    b = [{x: width*0.7, y: bobY - 1.2*radius},{x: p2LineXScale(scrollTop) , y: p2LineYScale(scrollTop)}]
    c = [{x:width/2 ,y: bobY + 1.4*radius},{x:width/2  ,y: cLineYScale(scrollTop) }]
    p2line.transition().duration(scrollAnimationDuration).attr('d',line(b))
    cline.transition().duration(scrollAnimationDuration).attr('d',line(c))
    // console.log(firstScale(scrollTop))
    p2text.transition().duration(scrollAnimationDuration).style('opacity',p2TextOScale(scrollTop))
    conclusionText.transition().duration(scrollAnimationDuration).style('opacity',p2TextOScale(scrollTop))
    d3.selectAll('.bigCircles').transition().duration(scrollAnimationDuration).style('opacity', firstScale(scrollTop))
   d3.select("#bobLine")
                 .attr("x1", bobX)
                 .attr("y1",bobY)
                 .attr("x2", bobX)
                  .attr("y2", lineYScale(scrollTop))
    d3.select('#bobName').transition().duration(scrollAnimationDuration)
                  .style('opacity',bobNameScale(scrollTop))
    d3.selectAll('#bobLine').transition().duration(scrollAnimationDuration)
      .style('opacity', lineOScale(scrollTop))

      // console.log("ls" + lineOScale(scrollTop))
   d3.select('#bob').transition().duration(scrollAnimationDuration)
            .style('opacity',bobScale(scrollTop))
            .attr('cx',bobXScale(scrollTop))
            .attr('cy',bobY)
    d3.select('#guitarStuff').style('opacity',guitarOScale(scrollTop))
    d3.select('#guitarStuff').transition().duration(scrollAnimationDuration).attr("transform",'translate(' + guitarXScale(scrollTop) + ')')

  }
//second animation

// var svg2 = d3.select("#m1c1s2 .animation").append("svg")
//   .attr("width", width)
//   .attr("height", height)

  var sets = [ {sets: ['Plucked'], size: 12},
           {sets: ['Guitar'], size: vennEulerScale2(scrollTop)},
         {sets: ['Plucked','Guitar'], size: vennEulerScale(scrollTop)}];



  vennD = d3.select("#m1c1s2 .animation").datum(sets).call(chart)
  $('path','g[data-venn-sets = "Plucked"]').css('fill', "white").css('fill-opacity',0.7).css('stroke', "black").css('stroke-opacity',1).css("stroke-width", 5)
  $('path','g[data-venn-sets = "Guitar"]').css('fill', "white").css('fill-opacity',0.7).css('stroke', "black").css('stroke-opacity',1).css("stroke-width", 5)
  $('path','g[data-venn-sets = "Plucked_Guitar"]').css('fill', "white").css('fill-opacity',0).css("stroke-width", 5)

function graphics2TextAdd(){
  d3.selectAll('.nums').remove()
  d3.selectAll('#X').remove()
  numText = vennD.select('svg').selectAll('text .nums')
      .data(nums,function(d){
        return d})
      .enter()
      .append('text').attr('class','nums').text(function(d){
        return d.num})
      .attr('dx',function(d){return d.dx}).attr('dy', function(d){return d.dy})
      .style('font-size','1.5em')
      .style('opacity',Oscale("#t6","#t7",1))
    xPos = []
   temp =  d3.select('g[data-venn-sets="Guitar"] path').attr('d').split(' ')
  //  console.log(temp)
   xPos[0] = parseInt(temp[1]) + parseInt(temp[4])
   xPos[1] = parseInt(temp[2])
  //  console.log(xPos)

    vennD.select('svg')
    .append('text')
    .attr('id',"x")
    .text("X")
    .attr('dx', xPos[0])
    .attr('dy', xPos[1])
    .style('font-size','3em')
    .style('opacity',  Oscale("#t8","#t9"))
    .style('transform','translate(-.35em)')


}


 graphics2TextAdd()


  //third
  chart3 = venn.VennDiagram().height(width).width(width).duration(scrollAnimationDuration)
  canvas3 = d3.select('#m1c1s3 .animation')
  $canvas3 = $('.animation', '#m1c1s3')
  sets3 = [
    {sets: ['Dogs'], size: 4},
   {sets: ['Mammals'], size: 4},
   {sets: ['Vertebrates'], size: 4},
   {sets: ['Mammals',"Vertebrates"], size: 1},
   {sets: ['Mammals',"Dogs"], size: 1},
   {sets: ['Vertebrates',"Dogs"], size: 1},
   {sets: ['Vertebrates',"Dogs","Mammals"], size: 1},

  ]


  function graphic3(){
      d3.select('g[data-venn-sets = "Mammals"] path').style('fill-opacity',Oscale('#t10','#t11'))
      d3.select('g[data-venn-sets = "Dogs"] path').style('fill-opacity',Oscale('#t11','#t12'))

  }

    function venn3Init(){

      venn3 = canvas3.datum(sets3).call(chart3)
      venn3.selectAll('path').style("fill", 'white')
          .style('fill-opacity',0)
          .style('stroke', "black")
          .style('stroke-opacity',1)
          .style('stroke-width',3)

        d3.select('g[data-venn-sets = "Mammals"] path').style('fill', '#999').style('fill-opacity',Oscale('#t10','#t11'))
        d3.select('g[data-venn-sets = "Dogs"] path').style('fill', '#999').style('fill-opacity',Oscale('#t11','#t12'))
        d3.select('g[data-venn-sets = "Vertebrates_Dogs_Mammals"] path').style('fill', 'white').style('fill-opacity',1)
        d3.select('g[data-venn-sets = "Mammals_Vertebrates"] path').style('fill', 'white').style('fill-opacity',1)

    }

  venn3Init()

  function graphics2(){
    numText.style('opacity', numScale(scrollTop))
    sets = [ {sets: ['Plucked'], size: 12},
                 {sets: ['Guitar'], size: vennEulerScale2(scrollTop)},
                 {sets: ['Plucked','Guitar'], size: vennEulerScale(scrollTop)}];
                //  console.log(vennOScale(scrollTop))
    vennD = d3.select("#m1c1s2 .animation").datum(sets).call(chart)
    d3.select('g[data-venn-sets = "Plucked_Guitar"]').select('path').style('fill-opacity', vennInterScale(scrollTop))
    rgb = Math.round(vennGuitarScale(scrollTop))
    d3.select('g[data-venn-sets = "Guitar"]').select('path').style('fill',"rgb("+rgb+","+rgb+','+rgb+")")
    d3.select('#x').style('opacity',Oscale("#t8","#t9"))




  }


  //real time stuff


  function sticky(){

    freezePoints('#t1','#t4',$canvas)

    freezePoints('#t5','#t9',$canvas2)
    freezePoints('#t10','#t13',$canvas3)
  }

  function freezePoints(startdiv, enddiv,canvasJQ){
    start = tp(startdiv)
    end = tp(enddiv)
    if (scrollTop > start && scrollTop <end){
      canvasJQ.css('position','fixed')
        .css('top',   window.innerHeight/2 - canvasJQ.height()/2)
        .css('left',  window.innerWidth/2)
    } else if (scrollTop <start){
      canvasJQ.css('position','absolute')
        .css('top',   $(startdiv).offset().top - canvasJQ.height()/3)
        .css('left',  window.innerWidth/2)
    } else if (scrollTop >(end+60)){
      canvasJQ.css('position','absolute')
        .css('top',   $(enddiv).offset().top - canvasJQ.height()/3+60)
        .css('left',  window.innerWidth/2)
    }
    setSVGsize()
  }

  var render = function() {


  // Don't re-render if scroll didn't change
  if (scrollTop !== newScrollTop) {

    // console.log(newScrollTop)

    if (newScrollTop < startPoint) status = "initial"


    // Graphics Code Goes Here
    scrollTop = newScrollTop;

    graphics()
    graphics2()
    graphic3()
    sticky();
    graphics2TextAdd()



  }
  window.requestAnimationFrame(render)
}

  window.requestAnimationFrame(render)
  window.onresize = resize


//static
  moods = d3.select('#moods')

  moodsName = ["Universal Affirmative","Universal Negative","Particular Affirmative","Particular Negative"]
  moodsStatement = ["All S are P", "All S are not P", "Some S are P", "Some S are not P"]
  moodsLabel = ["ua","un","pa","pn"]
  for (i in moodsLabel){
    moods.append('div').attr('class','col-md-6').attr('id',moodsLabel[i])
    moods.select('#'+moodsLabel[i]).append('p').attr('class','text-xs-center m-y-0').text(moodsName[i])
  }
  moodWidth = $('#moods .col-md-6').width()
  moodsChart = venn.VennDiagram().width(moodWidth).duration(scrollAnimationDuration)
  moodsVenn = d3.selectAll("#moods .col-md-6")
        .datum([
          {sets:["S"],size:3},
          {sets:["P"],size:3},
          {sets:["S", "P"],size:1}
            ]).call(moodsChart)

  moodsVenn.selectAll('path').style("fill", null)
      .style('fill-opacity',1)
      .style('stroke', "black")
      .style('stroke-opacity',1)
      .style('stroke-width',3)



  for (i in moodsStatement){

    moods.select('#'+moodsLabel[i]).append('p').attr('class','text-xs-center m-b-3').text('"' + moodsStatement[i] + '"')
  }
  d3.selectAll("#moods text").style("font-size", "2em")



  paText = d3.select('#pa').select('svg').append('text').text('X').attr('dx',moodWidth/2).attr('dy',$('svg','#pa').height()/2).style('fill','black').style('font-size','2.5em')

  pnText = d3.select('#pn').select('svg').append('text').text('X').attr('dx',moodWidth/4).attr('dy',$('svg','#pa').height()/2).style('fill','black').style('font-size','2.5em')


  //logicize

  logicizeChart = venn.VennDiagram().width($('#vennLog').width()).height(2*window.innerHeight/3)
  canvasL = d3.select('#vennLog')

  function loadJSON(type, callback){
      $.getJSON('../json/' + type + '.json')
      .done(function(data){
      callback(null, data);
   }).fail(function(){console.log('Failed to Load Quiz')});
  }

  function initVennL(){

    loadSyl( function(error, dogs){
      premise1 = d3.select('#sylProblem').append('p').attr('id','p1')
      premise2 = d3.select('#sylProblem').append('p').attr('id','p2')
      conclusion = d3.select('#sylProblem').append('p').attr('id','con')
      premise1.text("Premise 1: "+dogs.p1str)
      premise2.text("Premise 2: "+dogs.p2str)
      conclusion.text("Conclusion: "+dogs.cstr)
      console.log(dogs)

      var cross = {}


      var a = dogs.terms.m
      var b = dogs.terms.p
      var c = dogs.terms.s
      terms = {
        a:a,
        b:b,
        c:c
      }
      var  cCenter = a+"_"+b+"_"+c
      var  cRight = "-" + a+"_"+b+"_"+c
      var  cLeft = a+"-"+b+"_"+c
      var  cBottom = a+"_"+b+"-"+c
      setsL = [
        {sets: [a], size: 4,clicked:false},
       {sets: [b], size: 4,clicked:false},
       {sets: [c], size: 4,clicked:false},
       {sets: [a,b], size: 1,clicked:false},
       {sets: [a,c], size: 1,clicked:false},
       {sets: [b,c], size: 1,clicked:false},
       {sets: [a,b,c], size: 1,clicked:false},

      ]
      function getCrossLoc(dim,direction){

        var crossStr = "m 10 10 l -20 -20 m 10 10 m -10 10 l 20 -20"
        cir ={}
        cir.cx = parseFloat(dim.split(' ')[1])
        cir.cy = parseFloat(dim.split(' ')[2])
        cir.ab = (parseFloat(dim.split(' ')[10]) - cir.cy)/3
        cir.radius = parseFloat(dim.split(' ')[4]) *-1

        // console.log("M " + $('#vennLog svg').width()/2 + " " + $('#vennLog svg').height()/2   + " " + crossStr)
        if (direction == cRight) direction = "right"
        else if (direction == cLeft) direction = "left"
        else if (direction == cBottom) direction = "bottom"
        else if (direction == cCenter) return "M " + $('#vennLog svg').width()/2 + " " + $('#vennLog svg').height()/2   + " " + crossStr
        else if (direction == a +"_"+b) return "M " +cir.cx + " " + cir.cy  + " m 0 " +cir.ab + " "+ crossStr
        else if (direction == a +"_"+c || direction == b +"_"+c ) return "M " +cir.cx + " " + cir.cy  + " m 0 -" +(cir.radius/2) + " "+ crossStr
        else if (direction == "+" + a +"_"+c ||direction =="+" + b +"_"+c) return "M " +cir.cx + " " + cir.cy  + " m 0 -" + cir.radius + " " + crossStr
        else if (direction == "+" + a +"_"+b ||direction =="-" + a +"_"+b) return (direction == "+" + a +"_"+b)? "M " +cir.cx + " " + cir.cy  + " m " + cir.radius +" 0 "+ " " + crossStr :  "M " +cir.cx + " " + cir.cy  + " m -" + cir.radius +" 0 "+ " " + crossStr
        else if (direction == "-"+a+"_"+c) return "M " +cir.cx + " " + cir.cy + " m -" +  radius + " " + Math.sqrt(cir.radius*cir.radius - radius * radius) +" "+ crossStr
        else if (direction == "-"+b+"_"+c) return "M " +cir.cx + " " + cir.cy + " m " +  radius + " " + Math.sqrt(cir.radius*cir.radius - radius * radius) +" "+ crossStr
        else return "M " +cir.cx + " " + cir.cy  + " " + crossStr
        // console.log(dim.split(' '))


        cir.left = "M " +cir.cx + " " + cir.cy + " m -" + Math.sqrt(cir.radius*cir.radius - radius/2 * radius/2) + " -" +  radius/2 + " " + crossStr

        cir.right = "M " +cir.cx + " " + cir.cy + " m " + Math.sqrt(cir.radius*cir.radius - radius/2 * radius/2) + " -" +  radius/2 + " " + crossStr

        cir.bottom = "M " +cir.cx + " " + cir.cy + " m 0 "    +  cir.radius + " " + crossStr

        // console.log("output " + str)


        return cir[direction]

        // d= "M 588.2238280114467 237.25892100262183 m 192.55 -111  m 20 20 l -40 -40 m 20 20 m -20 20 l 40 -40"
      }


      vennL = canvasL.datum(setsL).call(logicizeChart)
      vennL.selectAll('.label').style('font-size','1.5em').style('text-transform','capitalize')
      var obj = [

      ]
      var objI



      exBut = d3.select('#exBut')
      exBut2 = d3.select('#exBut2')
      delBut = d3.select('#delObj')
      answer = d3.select('#answer')
      var mode = "shade"
      vennL.selectAll('path').style('fill','white')    .style('stroke', "black")
          .style('stroke-opacity',1)
          .style('stroke-width',10)
          .style('fill-opacity',1)
      answer.on('click',function(){
        console.log(obj)
        console.log(setsL)
      })

      exBut.on('click',function(){
        if (mode =="shade"){
          objI = 0;
          mode = "obj1"
           $('#delObj').removeClass('invisible')
          $('#exBut').removeClass('btn-outline-teal')
          $('#exBut').addClass('btn-teal')
          $('#exBut').text('Confirm Object 1')

        }else if (mode == "obj2"){
          objI = 0;
          mode = "obj1"
          $('#exBut').removeClass('btn-outline-teal')
          $('#exBut').addClass('btn-teal')
          $('#exBut').text('Confirm Object 1')
          $('#exBut2').removeClass('btn-blue')
          $('#exBut2').addClass('btn-outline-blue')
          $('#exBut2').text('Edit Object 1')
        }
        else {
          mode = "shade"
          $('#delObj').addClass('invisible')
          $('#exBut').removeClass('btn-teal')
          $('#exBut').addClass('btn-outline-teal')
          $('#exBut').text('Edit Object 1')
        }


      })

      exBut2.on('click',function(){
        if (mode =="shade"){
          objI = 1;
          mode = "obj2"
           $('#delObj').removeClass('invisible')
          $('#exBut2').removeClass('btn-outline-blue')
          $('#exBut2').addClass('btn-blue')
          $('#exBut2').text('Confirm Object 2')
        }
        else if (mode == "obj1"){
          objI = 1;
          mode = "obj2"
          $('#exBut2').removeClass('btn-outline-blue')
          $('#exBut2').addClass('btn-blue')
          $('#exBut2').text('Confirm Object 2')
          $('#exBut').removeClass('btn-teal')
          $('#exBut').addClass('btn-outline-teal')
          $('#exBut').text('Edit Object 1')

        }
        else {
          mode = "shade"
          $('#delObj').addClass('invisible')
          $('#exBut2').removeClass('btn-blue')
          $('#exBut2').addClass('btn-outline-blue')
          $('#exBut2').text('Edit Object 2')
        }

      })

      delBut.on('click',function(){
        if (cross[objI]){
          obj.splice(objI, 1);
          cross[objI].attr('d',"M -1000 -1000")
        }

        mode = "shade"
        var targetBut = (objI == 0)? '#exBut' :'#exBut2'
        var color = (objI == 0)? 'teal' :'blue'
        $(targetBut).removeClass('btn-'+color)
        $(targetBut).addClass('btn-outline-'+color)
        $(targetBut).text('Add Object ' + (objI + 1))
        $('#delObj').addClass('invisible')



      })

      vennL.selectAll("g")
        .on("click", function(d, i) {

          if (mode=="shade"){
            if (!d.clicked){
              d3.select(this).select('path').style('fill','#ccc').style('fill-opacity',1)
              d.clicked = true

            }else{
              d3.select(this).select('path').style('fill','white').style('fill-opacity',1)
              d.clicked = false
            }
          } else if (mode!="shade"){
            var dim
          switch(d.sets.length){
            case (3): {
                centerLoop ={

                }
                centerLoop[cCenter] =  cLeft
                centerLoop[cLeft] =  cRight
                centerLoop[cRight] =  cBottom
                centerLoop[cBottom] =  cCenter
                // console.log(centerLoop)
                if (obj[objI]== cLeft || obj[objI]== cRight|| obj[objI]== cBottom||obj[objI]== cCenter)  obj[objI] = centerLoop[obj[objI]]
                else  obj[objI] = cCenter
                // console.log(obj)
                if (obj[objI] == cRight) dim = vennL.select('g[data-venn-sets="'+a+'"]  path').attr('d')
                else if (obj[objI] == cLeft) dim =  vennL.select('g[data-venn-sets="'+b+'"]  path').attr('d')
                else if (obj[objI] == cBottom) dim = vennL.select('g[data-venn-sets="'+c+'"]  path').attr('d')
                else dim = "0"
                // console.log(dim)
                // dim = (obj[objI]==a+"_"+b"_"+"_"+c)? "0" :vennL.select('g[data-venn-sets="'+terms[obj[objI]]+'"]  path').attr('d')
                break;

              }
              case (2):{
                if (obj[objI] ==  d.sets[0]+"_"+d.sets[1]) obj[objI] = "-"+ d.sets[0]+"_"+d.sets[1]
                else obj[objI] = (obj[objI] ==  "-"+ d.sets[0]+"_"+d.sets[1]) ? obj[objI] = "+"+ d.sets[0]+"_"+d.sets[1]:  obj[objI] =  d.sets[0]+"_"+d.sets[1]


                if (obj[objI] == a+"_"+b) dim = vennL.select('g[data-venn-sets="'+obj[objI]+'"]  path').attr('d')
                else if (obj[objI] == a+"_"+c || obj[objI] == "+" + a+"_"+c || obj[objI] == "+" + a+"_"+b ) dim = vennL.select('g[data-venn-sets="'+a+'"]  path').attr('d')
                else if (obj[objI] == b + "_" + c|| obj[objI] == "+"+b + "_" + c|| obj[objI] == "-" + a+"_"+b ) dim = vennL.select('g[data-venn-sets="'+b+'"]  path').attr('d')
                else dim = vennL.select('g[data-venn-sets="'+c+'"]  path').attr('d')
                // console.log(dim)
                // console.log(obj[objI])

                break;

              }
              case (1): {
                obj[objI] =  d.sets[0]
                dim = vennL.select('g[data-venn-sets="'+obj[objI]+'"]  path').attr('d')
                // console.log(obj[objI])
                break;
              }

            }
            console.log(obj)
            var crossColor = (objI == 1)? "#478EB0" :"#028482"
            if(cross[objI] == undefined){
              cross[objI] = canvasL.select('svg').append('path').attr('d',getCrossLoc(dim,obj[objI])).style('stroke',crossColor)
                  .style('stroke-opacity',.7)
                  .style('stroke-width',7)
                  .style('fill-opacity',1)
            } else{
              cross[objI].transition().duration(300).attr('d',getCrossLoc(dim,obj[objI]))
            }
          }
        })
        .on('mouseover',function(){
          var hoverColor = "#9FB3B6"
          if (mode =="shade") {
             d3.select(this).select('path').transition().style('fill',hoverColor)
          } else {
            d3.select(this).select('path').style('stroke',hoverColor)
          }
        })
        .on('mouseout',function(d){
          if (mode =="shade"){
            var tempColor = (!d.clicked)? "white":"#ccc";
            d3.select(this).select('path').transition().style('fill',tempColor)
          } else{
            d3.select(this).select('path').style('stroke','black')

          }
        })
        // console.log(test = new Syllogism(a,b,c))
        // console.log(test)
    })
  }

  initVennL()



// valid = ['AAA1','EAE1','EIO1','AII1','AEE2','EAE2','EIO2','AOO2','IAI3','OAO3','AII3','AEE4','IAI4','EIO4']
//
// function generateSyl(){
//   mood = ['A','E','I','O']
//   figure = ['1','2','3','4']
//   if (chance.bool({likelihood:30})) return chance.pickone(valid)
//   else return chance.pickone(mood) + chance.pickone(mood) + chance.pickone(mood) + chance.pickone(figure)
// }
//
// function checkValidity(syl){
//
//   o = valid.indexOf(syl)
//   // console.log(o)
//   return (o != -1)
// }
//
//  function Syllogism(p, s, m){
//   this.form =  generateSyl(),
//   this.valid = checkValidity(this.form)
//   this.figure = this.form[3]
//   this.p1mood = this.form[0]
//   this.p2mood = this.form[1]
//   this.cmood = this.form[2]
//   this.c = [s,p]
//   switch (this.figure) {
//     case "1": {
//       this.p1 = [m,p]
//       this.p2 = [s,m]
//       break;
//     }
//     case "2": {
//       this.p1 = [p,m]
//       this.p2 = [s,m]
//       break;
//
//     }
//     case "3": {
//       this.p1 = [m,p]
//       this.p2 = [m,s]
//       break;
//
//     }
//     case "4": {
//       this.p1 = [p,m]
//       this.p2 = [m,s]
//       break;
//
//     }
//
//   }
//   var placeholder = ['p1','p2','c']
//   for (p in placeholder){
//     if (this[placeholder[p]+"mood"] == "A") this[placeholder[p]+"str"] = "All " + this[placeholder[p]][0] +" are " +this[placeholder[p]][1]
//     else if (this[placeholder[p]+"mood"] == "E") this[placeholder[p]+"str"] = "No " + this[placeholder[p]][0] +" are " +this[placeholder[p]][1]
//     else if (this[placeholder[p]+"mood"] == "I") this[placeholder[p]+"str"] = "Some " + this[placeholder[p]][0] +" are " +this[placeholder[p]][1]
//     else if (this[placeholder[p]+"mood"] == "O") this[placeholder[p]+"str"] = "Some " + this[placeholder[p]][0] +" are not" +this[placeholder[p]][1]
//
//   }
//
//
// }

function loadSyl(callback){
  jQuery.post("../processing/syllogism")
  .done(function(data){
      callback(null, data);
  }).fail(function(){$body.append('Failed to Load Quiz')})
};

loadSyl(function(e,d){
  // console.log(d)
})

})

},{"venn.js":8}]},{},[9]);
