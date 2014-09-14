# colorswap.js

View demo at http://numtel.github.io/colorswap.js/

A find/replace operation for all loaded stylesheets specialized for swapping colors globally.

### Installation

Only dependency is [tinycolor](http://bgrins.github.io/TinyColor/)

    <script src="tinycolor.js"></script>
    <script src="colorswap.js"></script>

### Usage

The find color is the original color. Subsequent calls to replace the color still specify the color in the original CSS. View this page's source for an example.

    ColorSwap({
      find: '#428bca', // hex, rgb(), hsv(), hsl()
      replace: '#f00', // hex, rgb(), hsv(), hsl()
      animation: 'hsl' // optional: 'none', 'rgb', 'hsv', 'hsl'
      duration: 400 // optional: milliseconds to complete animation
      frameDuration: 10 // optional: milliseconds per frame in animation
    });

### Caveats


* Only works with CSS rules in files from the same origin due to security restrictions.
* HSL, HSV animations could use some work in between red and blue.


