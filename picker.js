/*
 Gradient slider: https://codepen.io/egrucza/pen/LEoOQZ
 Color to hex string: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 RGB/HSV conversions: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
*/


function setIdColor(divId, color) {
  var colorStr = color.toHexString();
  document.getElementById(divId).style.backgroundColor = colorStr;
};

/*
var BoxId = 'box',
    HueRange = document.getElementById('hue'),
    SatRange = document.getElementById('sat'),
    ValRange = document.getElementById('val'),
    currentColor = initColor;
var cHSV = currentColor.toHsv();
HueRange.value = cHSV.h;
SatRange.value = cHSV.s;
ValRange.value = cHSV.v;
*/
function updateSliderGrads(c) {
  c = c.toHsv();
  var HueGradVals = [
    tinycolor({ h: 0, s: c.s, v: c.v }),
    tinycolor({ h: 60, s: c.s, v: c.v }),
    tinycolor({ h: 120, s: c.s, v: c.v }),
    tinycolor({ h: 180, s: c.s, v: c.v }),
    tinycolor({ h: 240, s: c.s, v: c.v }),
    tinycolor({ h: 300, s: c.s, v: c.v }),
    tinycolor({ h: 360, s: c.s, v: c.v }),
  ];
  var SatGradVals = [
    tinycolor({ h: c.h, s: 0, v: c.v }),
    tinycolor({ h: c.h, s: 100, v: c.v })
  ];
  var ValGradVals = [
    tinycolor({ h: 0, s: 0, v: 0 }),
    tinycolor({ h: c.h, s: c.s, v: 100 })
  ];
  var HueGradStr = HueGradVals.map(c => c.toHexString()).join(', ');
  var SatGradStr = SatGradVals.map(c => c.toHexString()).join(', ');
  var ValGradStr = ValGradVals.map(c => c.toHexString()).join(', ');
  HueGradStr = `-webkit-linear-gradient(left, ${HueGradStr})`;
  SatGradStr = `-webkit-linear-gradient(left, ${SatGradStr})`;
  ValGradStr = `-webkit-linear-gradient(left, ${ValGradStr})`;
  HueRange.style.background = HueGradStr;
  SatRange.style.background = SatGradStr;
  ValRange.style.background = ValGradStr;
}
/*
updateSliderGrads(currentColor);
setIdColor(BoxId, currentColor);

// move gradient
HueRange.addEventListener('input', function () {
    // Change slide thumb color on way up
    currentColor.h = parseInt(this.value);
    //setIdColor(BoxId, currentColor);
    updateSliderGrads(currentColor);
});

SatRange.addEventListener('input', function () {
    currentColor.s = parseFloat(this.value);
    //setIdColor(BoxId, currentColor);
    updateSliderGrads(currentColor);
});

ValRange.addEventListener('input', function () {
    currentColor.v = parseFloat(this.value);
    //setIdColor(BoxId, currentColor);
    updateSliderGrads(currentColor);
});
*/