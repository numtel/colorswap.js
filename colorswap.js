// ColorSwap.js v1.0.0
// https://github.com/numtel/colorswap.js
// ben@latenightsketches.com, MIT License

(function(){

  var curSwaps = {};

  var setSheet = function(origColor, value){
    var swapSheetId = 'color-swapper-rules-' + origColor.toHex();
    var curSwapperSheet = document.getElementById(swapSheetId);
    if(!curSwapperSheet){
      curSwapperSheet = document.createElement('style');
      curSwapperSheet.id = swapSheetId;
      document.head.appendChild(curSwapperSheet);
    };
    curSwapperSheet.innerHTML = value;
  };

  var getReplacedCss = function(find, replace){
    var output = '';
    var sheets = document.styleSheets;
    var sheet, rule;
    var findRgb = find.toRgb();
    var findRe = RegExp('rgb\\(' + findRgb.r + '\\, ' + 
                                   findRgb.g + '\\, ' + 
                                   findRgb.b + '\\)', 'g');

    for(var i=0; i<sheets.length; i++){
      sheet = sheets[i];
      try{
        if(!sheet.cssRules){
          continue;
        };
      }catch(err){
        continue;
      };
      for(var r=0; r<sheet.cssRules.length; r++){
        rule = sheet.cssRules[r];
        if(rule.cssText.indexOf(find.toRgbString()) !== -1){
          output += rule.cssText.replace(findRe, replace.toRgbString()) + '\n';
        };
      };
    };
    return output;
  };

  var getLastSetting = function(origColor){
    if(curSwaps[origColor] !== undefined){
      return curSwaps[origColor];
    }else{
      return origColor;
    };
  };

  var setDefaults = function(options, defaults){
    for(var i in defaults){
      if(defaults.hasOwnProperty(i) && options[i] === undefined){
        options[i] = defaults[i];
      };
    };
    return options;
  };

  var ColorSwap = function(options){
    // Validate options
    if(options.find === undefined || options.replace === undefined){
      throw 'find and replace colors must be specified!';
    };
    var find = tinycolor(options.find);
    var replace = tinycolor(options.replace);
    if(!find.isValid() || !replace.isValid()){
      throw 'Invalid color passed!';
    };

    setDefaults(options, {
      frameDuration: 10,
      duration: 400,
      animation: 'none'
    });


    // Update global collection to enable multiple transitions
    var startColor = getLastSetting(find);
    curSwaps[find] = replace;

    var stepCount = Math.round(options.duration / options.frameDuration);
    var steps = ColorSwap.animationTypes[options.animation](startColor, replace, stepCount);
    var curStep = 0;

    // Perform each transitional step
    var stepInterval = setInterval(function(){
      var output = getReplacedCss(find, steps[curStep]);
      setSheet(find, output);
      curStep++;
      if(curStep === steps.length){
        clearInterval(stepInterval);
      };
    }, options.frameDuration);
  };

  ColorSwap.animationTypes = {
    none: function(start, end, stepCount){
      return [end];
    }
  };

  var addVector3Anim = function(key){
    var genFunc = 'to' + key[0].toUpperCase() + key[1] + key[2];
    return ColorSwap.animationTypes[key] = function(start, end, stepCount){
      var steps = [];
      var sObj = start[genFunc]();
      var eObj = end[genFunc]();
      var perStep = [
        (eObj[key[0]] - sObj[key[0]]) / stepCount,
        (eObj[key[1]] - sObj[key[1]]) / stepCount,
        (eObj[key[2]] - sObj[key[2]]) / stepCount
      ];
      var curStep;
      for(var i = 1; i<stepCount + 1; i++){
        curStep = {};
        curStep[key[0]] = sObj[key[0]] + (perStep[0] * i);
        curStep[key[1]] = sObj[key[1]] + (perStep[1] * i);
        curStep[key[2]] = sObj[key[2]] + (perStep[2] * i);
        steps.push(tinycolor(curStep));
      };
      return steps;
    };
  };
  addVector3Anim('hsv');
  addVector3Anim('rgb');
  addVector3Anim('hsl');

  // Node: Export function
  if (typeof module !== "undefined" && module.exports) {
      module.exports = ColorSwap;
  }
  // AMD/requirejs: Define the module
  else if (typeof define === 'function' && define.amd) {
      define(function () {return ColorSwap;});
  }
  // Browser: Expose to window
  else {
      window.ColorSwap = ColorSwap;
  };

})();
