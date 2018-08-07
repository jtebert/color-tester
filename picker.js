
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

Vue.component('colorpicker', {
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
      this.$emit('color-change', this.colors.hexStr)
    },
    onChangeHsv(data) {
      this.colors = _colorChange(this.colors, 'hsv')
      this.$emit('color-change', this.colors.hexStr)
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
  template: `
    <div class="color-picker" v-bind:class="{ lightText: colors.isDark }"
        v-bind:style="{backgroundColor: colors.hexStr }" >
      <input type="text" class="hex-input" maxlength="7" spellcheck="false"
        v-bind:class="{ lightText: colors.isDark }" v-model="colors.hex"
        @change="onChangeHex" @input="onChangeHex" />

      <input id="hue" type="range" min="0" max="360" class="range white"
        v-bind:style="{ background: hueGrad() }"
        v-model="colors.hsv.h" @change="onChangeHsv"  @input="onChangeHsv"/>
      <input id="sat" type="range" min="0" max="1" step="any" class="range white"
        v-bind:style="{ background: satGrad() }"
        v-model="colors.hsv.s" @change="onChangeHsv" @input="onChangeHsv" />
      <input id="val" type="range" min="0" max="1" step="any" class="range white"
        v-bind:style="{ background: valGrad() }"
        v-model="colors.hsv.v" @change="onChangeHsv" @input="onChangeHsv" />
    </div>
    `
})

new Vue({
  el: '#app',
  data() {
    return {
      colorPickers: [
        { 'hexStr': "#333333" },
        { 'hexStr': '#444EEE' },
      ]
    }
  },
  computed: {
    computedNoCard1: function () {
      let availableCards = new Set(['card2'])
      return this.cards.filter((item) => {
        return availableCards.has(item['type'])
      })
    }
  },
  methods: {
    addColor: function () {
      this.colorPickers.push({ 'hex': '#FFFFFF' })
    },
    changeColor: function (hex) {
      console.log("COLOR CHANGE", hex)
    },
  }
})