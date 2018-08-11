function randInt(min, max) {
  // Get a random integer in the range [min, max], inclusive
  var range = max - min + 1
  return Math.floor(Math.random() * Math.floor(range)) + min
}

function randColor(type) {
  if (type === 'dark') {
    s = randInt(0, 10)
    v = randInt(0, 10)
  } else if (type === 'light') {
    s = randInt(0, 10)
    v = randInt(90, 100)
  } else if (type === 'bright') {
    s = randInt(50, 100)
    v = randInt(50, 100)
  } else {
    return tinycolor.random()
  }
  h = randInt(0, 360)
  color = tinycolor({ h: h, s: s / 100., v: v / 100. })
  return color
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
  } else if (source === 'hexStr' || source === 'tinycolor') {
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
  if (hsv.v < 0.0164 && data.hsv) {  // Stuck on black
    hsv.h = (data.hsv && data.hsv.h) || 0
    hsv.s = (data.hsv && data.hsv.s) || 0
  }
  if (hsv.s < 0.0164 && data.hsv) {  // Stuck on black
    hsv.h = (data.hsv && data.hsv.h) || 0
    hsv.s = (data.hsv && data.hsv.s) || 0
  }
  if (hsv.h === 360 || hsv.h === 0 && data.hsv) {
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

Vue.component('textpreview', {
  props: ['title', 'body', 'color'],
  template: `<div v-bind:style="{color: color }">
    <h1>{{ title }}</h1>
    <p>{{ body }}</p>
  </div>`
})

Vue.component('graphpreview', {
  props: ['id', 'colors'],
  data() {
    return {
      'chart': this.genChart()
    }
  },
  methods: {
    genChart: function () {
      el = document.getElementById('chart-' + this.id)
      return new Chart(el, chartDict)
    }
  },
  template: `<div id="chart-{{ id }}"></div>`
})

Vue.component('colorpicker', {
  props: ['id', 'hexinject'],
  data() {
    return {
      colors: _colorChange(tinycolor.random().toHsv(), 'tinycolor')
    }
  },
  created: function () {
    this.colors = _colorChange(this.hexinject, 'hexStr')
    this.$emit('color-change', this.id, this.colors.hexStr)
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
      this.$emit('color-change', this.id, this.colors.hexStr)
    },
    onChangeHsv(data) {
      this.colors = _colorChange(this.colors, 'hsv')
      this.$emit('color-change', this.id, this.colors.hexStr)
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
  watch: {
    hexinject: function (newVal, oldVal) {
      // Update when color is changed from outside
      this.colors = _colorChange(newVal, 'hexStr')
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
        { 'id': 1, 'hexStr': randColor('light').toHexString() },
        { 'id': 2, 'hexStr': randColor('dark').toHexString() },
        { 'id': 3, 'hexStr': randColor('bright').toHexString() },
      ],
      nextId: 4,
      backgroundColorId1: 1,
      backgroundColorId2: 2,
      textTitle: this.toTitleCase(chance.sentence({ words: 5 })).slice(0, -1),
      textBody: chance.paragraph({ sentences: 3 }),
    }
  },
  computed: {
    backgroundColor1: function () {
      return this.colorPickers[this.indFromId(this.backgroundColorId1)].hexStr
    },
    backgroundColor2: function () {
      return this.colorPickers[this.indFromId(this.backgroundColorId2)].hexStr
    },
    colorsOnBg1: function () {
      var useColors = this.colorPickers.slice(0)
      ind = this.indFromId(this.backgroundColorId1)
      if (ind > -1) {
        useColors.splice(ind, 1);
      }
      console.log(useColors)
      return useColors
    },
    colorsOnBg2: function () {
      var useColors = this.colorPickers.slice(0)
      ind = this.indFromId(this.backgroundColorId2)
      if (ind > -1) {
        useColors.splice(ind, 1);
      }
      return useColors
    }
  },
  methods: {
    addColor: function () {
      this.colorPickers.push({ id: this.nextId, 'hexStr': randColor() })
      this.nextId++
    },
    changeColor: function (id, hex) {
      var target_ind = this.indFromId(id)
      this.colorPickers[target_ind].hexStr = hex
    },
    indFromId: function (id) {
      return this.colorPickers.findIndex(el => el.id == id)
    },
    toTitleCase: function (str) {
      str = str.toLowerCase().split(' ');
      for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
      }
      return str.join(' ');
    },
  }
})