/**
* A configuration of font families which are initialized when the page loads
*/
declare const FONTS: {
  'FontAwesome': {
    custom: {
      families: [
        'FontAwesome'
      ]
      urls: [
        'fonts/fontawesome/css/all.min.css'
      ]
    }
  }
  'Signika': {
    custom: {
      families: [
        'Signika'
      ]
      urls: [
        'fonts/signika/signika.css'
      ]
    }
  }
  _loaded: [
  ]
}

/**
* Load font, and perform a callback once the font has been rendered
* @deprecated since 0.6.4, to be removed in 0.8.x
*/
declare function loadFont (fontName: string, callback: () => void): void
