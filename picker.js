function hueGradient(c) {
  // c = this.colors.hsv
  console.log("HUE", c)
  if (c) {
    c = c.hsv
    var hueGradVals = [
      tinycolor({ h: 0, s: c.s, v: c.v }),
      tinycolor({ h: 60, s: c.s, v: c.v }),
      tinycolor({ h: 120, s: c.s, v: c.v }),
      tinycolor({ h: 180, s: c.s, v: c.v }),
      tinycolor({ h: 240, s: c.s, v: c.v }),
      tinycolor({ h: 300, s: c.s, v: c.v }),
      tinycolor({ h: 360, s: c.s, v: c.v }),
    ]
    var hueGradStr = hueGradVals.map(c => c.toHexString()).join(', ')
    return `-webkit-linear-gradient(left, ${hueGradStr})`;
  } else {
    return '#fff'
  }
}

function satGradient(c) {
  // c = this.colors.hsv
  var satGradVals = [
    tinycolor({ h: c.h, s: 0, v: c.v }),
    tinycolor({ h: c.h, s: 100, v: c.v })
  ]
  var satGradStr = satGradVals.map(c => c.toHexString()).join(', ')
  return `-webkit-linear-gradient(left, ${satGradStr})`
}

function valGradient(data) {
  // c = this.colors.hsv
  var valGradVals = [
    tinycolor({ h: 0, s: 0, v: 0 }),
    tinycolor({ h: c.h, s: c.s, v: 100 })
  ]
  var valGradStr = valGradVals.map(c => c.toHexString()).join(', ')
  return `-webkit-linear-gradient(left, ${valGradStr})`
}

function _colorChange(data, source) {
  // Data is either h, s, or v (from sliders)
  // Or a hex from text box
  var color, hex
  if (source === 'hsv') {
    color = tinycolor(data.hsv)
  } else if (source === 'hex' && data.hex.length === 7) {
    // Check if text input is valid
    var tmp_color = tinycolor(data.hex)
    if (tmp_color.isValid()) {
      color = tmp_color
    } else {
      color = tinycolor(data.hexStr)
    }
  } else if (source === 'tinycolor') {
    color = tinycolor(data)
  } else {
    color = tinycolor(data.hexStr)
  }

  if (source === 'hex') {
    hex = data.hex
  } else {
    hex = color.toHexString()
  }

  var hsv = color.toHsv()

  // when the hsv.v is less than 0.0164 (base on test)
  // because of possible loss of precision
  // the result of hue and saturation would be miscalculated
  if (hsv.v < 0.0164) {  // Stuck on black
    hsv.h = data.h || (data.hsv && data.hsv.h) || 0
    hsv.s = data.s || (data.hsv && data.hsv.s) || 0
  }
  if (hsv.s < 0.0164) {  // Stuck on black
    hsv.h = data.h || (data.hsv && data.hsv.h) || 0
    hsv.s = data.s || (data.hsv && data.hsv.s) || 0
  }
  if (hsv.h === 360 || hsv.h === 0) {
    // Flips between 0/360 in some cases. Go with whichever value was
    // closer in the previous state
    prev_h = data.hsv.h
    if (360 - prev_h < prev_h) {
      hsv.h = 360
    } else {
      hsv.h = 0
    }
  }
  return {
    hex: hex.toUpperCase(),
    hsv: hsv,
    hexStr: color.toHexString().toUpperCase(),
    isDark: color.getLuminance() < 0.55,
  }
}

var app = new Vue({
  el: '#app',
  data() {
    return {
      colors: _colorChange(tinycolor.random().toHsv(), 'tinycolor')
    }
  },
  computed: {
    colors: {
      get() {
        return this.val
      },
      set(newVal) {
        this.val = newVal
        this.$emit('input', newVal)
      }
    }
  },
  methods: {
    onChangeHex(data) {
      this.colors = _colorChange(this.colors, 'hex')
    },
    onChangeHsv(data) {
      this.colors = _colorChange(this.colors, 'hsv')
    },
    hueGrad() {
      c = this.colors.hsv
      var hueGradVals = [
        tinycolor({ h: 0, s: c.s, v: c.v }),
        tinycolor({ h: 60, s: c.s, v: c.v }),
        tinycolor({ h: 120, s: c.s, v: c.v }),
        tinycolor({ h: 180, s: c.s, v: c.v }),
        tinycolor({ h: 240, s: c.s, v: c.v }),
        tinycolor({ h: 300, s: c.s, v: c.v }),
        tinycolor({ h: 360, s: c.s, v: c.v }),
      ]
      var hueGradStr = hueGradVals.map(c => c.toHexString()).join(', ')
      return `-webkit-linear-gradient(left, ${hueGradStr})`;
    },
    satGrad() {
      s = this.colors.hsv
      var satGradVals = [
        tinycolor({ h: c.h, s: 0, v: c.v }),
        tinycolor({ h: c.h, s: 100, v: c.v })
      ]
      var satGradStr = satGradVals.map(c => c.toHexString()).join(', ')
      return `-webkit-linear-gradient(left, ${satGradStr})`
    },
    valGrad() {
      c = this.colors.hsv
      var valGradVals = [
        tinycolor({ h: 0, s: 0, v: 0 }),
        tinycolor({ h: c.h, s: c.s, v: 100 })
      ]
      var valGradStr = valGradVals.map(c => c.toHexString()).join(', ')
      return `-webkit-linear-gradient(left, ${valGradStr})`
    }
  },
})