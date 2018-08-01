/*
 Gradient slider: https://codepen.io/egrucza/pen/LEoOQZ
 Color to hex string: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 RGB/HSV conversions: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
*/

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
    return "#" + componentToHex(rgb.R) + componentToHex(rgb.G) + componentToHex(rgb.B);
}

function hsvToHex(hsv) {
    var rgb = hsvToRgb(hsv);
    return rgbToHex(rgb)
}

function hslToHex(hsl) {
    var rgb = hslToRgb(hsl);
    return rgbToHex(rgb)
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h [0, 360], s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(hsl) {
    var h = hsl.H / 360.,
        s = hsl.S,
        l = hsl.L;
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        R: Math.round(r * 255),
        G: Math.round(g * 255),
        B: Math.round(b * 255)
    };
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h [0, 360], s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(rgb) {
    var r = rgb.R,
        g = rgb.G,
        b = rgb.B;
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { H: h * 360, S: s, V: v };
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h [0, 360], s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(rgb) {
    var r = rgb.R,
        g = rgb.G,
        b = rgb.B;

    r = r / 255, g = g / 255, b = b / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { H: h * 360, S: s, V: v };
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h [0, 360], s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(hsv) {
    var h = hsv.H / 360.,
        s = hsv.S,
        v = hsv.V;
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return {
        R: Math.round(r * 255),
        G: Math.round(g * 255),
        B: Math.round(b * 255)
    };
}

function setIdHsvColor(divId, color) {
    var rgbStr = hsvToHex(color);
    document.getElementById(divId).style.backgroundColor = rgbStr;
};


var BoxId = 'box',
    HueRange = document.getElementById('hue'),
    SatRange = document.getElementById('sat'),
    ValRange = document.getElementById('val'),
    currentColor = {
        H: parseInt(HueRange.value),
        S: parseFloat(SatRange.value),
        V: parseFloat(ValRange.value),
    };

function updateSliderGrads(c) {
    var HueGradVals = [
        { H: 0, S: c.S, V: c.V },
        { H: 60, S: c.S, V: c.V },
        { H: 120, S: c.S, V: c.V },
        { H: 180, S: c.S, V: c.V },
        { H: 240, S: c.S, V: c.V },
        { H: 300, S: c.S, V: c.V },
        { H: 360, S: c.S, V: c.V },
    ];
    var SatGradVals = [
        { H: c.H, S: 0, V: c.V },
        { H: c.H, S: 1, V: c.V }
    ];
    var ValGradVals = [
        { H: 0, S: 0, V: 0 },
        { H: c.H, S: c.S, V: 1. }
    ];
    var HueGradStr = HueGradVals.map(x => hsvToHex(x)).join(', ');
    var SatGradStr = SatGradVals.map(x => hsvToHex(x)).join(', ');
    var ValGradStr = ValGradVals.map(x => hsvToHex(x)).join(', ');
    HueGradStr = `-webkit-linear-gradient(left, ${HueGradStr})`;
    SatGradStr = `-webkit-linear-gradient(left, ${SatGradStr})`;
    ValGradStr = `-webkit-linear-gradient(left, ${ValGradStr})`;
    HueRange.style.background = HueGradStr;
    SatRange.style.background = SatGradStr;
    ValRange.style.background = ValGradStr;
}

updateSliderGrads(currentColor);
setIdHsvColor(BoxId, currentColor);

// move gradient
HueRange.addEventListener('input', function () {
    // Change slide thumb color on way up
    currentColor.H = parseInt(this.value);
    setIdHsvColor(BoxId, currentColor);
    updateSliderGrads(currentColor);
    /*
    if (this.value > 20) {
        HueRange.classList.add('blue');
    }
    //Change slide thumb color on way down
    if (this.value < 20) {
        HueRange.classList.remove('blue');
    }*/
});

SatRange.addEventListener('input', function () {
    currentColor.S = parseFloat(this.value);
    setIdHsvColor(BoxId, currentColor);
    updateSliderGrads(currentColor);
});

ValRange.addEventListener('input', function () {
    currentColor.V = parseFloat(this.value);
    setIdHsvColor(BoxId, currentColor);
    updateSliderGrads(currentColor);
});