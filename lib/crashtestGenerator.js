'use strict';
//
// $$$$$$\                               $$\        $$\                           $$\
//$$  __$$\                              $$ |       $$ |                          $$ |
//$$ /  \__| $$$$$$\  $$$$$$\   $$$$$$$\ $$$$$$$\ $$$$$$\    $$$$$$\   $$$$$$$\ $$$$$$\
//$$ |      $$  __$$\ \____$$\ $$  _____|$$  __$$\\_$$  _|  $$  __$$\ $$  _____|\_$$  _|
//$$ |      $$ |  \__|$$$$$$$ |\$$$$$$\  $$ |  $$ | $$ |    $$$$$$$$ |\$$$$$$\    $$ |
//$$ |  $$\ $$ |     $$  __$$ | \____$$\ $$ |  $$ | $$ |$$\ $$   ____| \____$$\   $$ |$$\
//\$$$$$$  |$$ |     \$$$$$$$ |$$$$$$$  |$$ |  $$ | \$$$$  |\$$$$$$$\ $$$$$$$  |  \$$$$  |
// \______/ \__|      \_______|\_______/ \__|  \__|  \____/  \_______|\_______/    \____/
//
// A Dummy JSON data generator.
// crashtestGenerator.js - Object generator.
// Akil Harris
// 2014

var crashtestGenerator = function () {

  var config = require('./crashtestConfig').getConfig();

  var generate = function (build) {
    return generateObject(build);
  };

  var getValue = function (type, value) {
    console.log(type);
    switch(type) {
      case config.TYPES.ARRAY :
        return generateArray(value);
        break;
      case config.TYPES.BOOLEAN :
        return generateBoolean(value);
        break;
      case config.TYPES.NULL :
        return generateNull(value);
        break;
      case config.TYPES.NUMBER :
        console.log(generateNumber(value));
        return generateNumber(value);
        break;
      case config.TYPES.OBJECT :
        return generateObject(value);
        break;
      case config.TYPES.STRING :
        return generateString(value);
        break;
      default:
        return undefined;
        break;
    }
  };

  var generateArray = function (arrayDefinition) {
    var generatedArray = [];

    var length = arrayDefinition.value.len;
    var type = arrayDefinition.value.type;
    var value = arrayDefinition.value;

    for (var i = 0; i < length; i++) {
      generatedArray.push(getValue(type, value));
      console.log(generatedArray[i]);
    }

    return generatedArray;
  };

  var generateBoolean = function (booleanDefinition) {
    if (booleanDefinition.value === 0) { return randomBoolean() }
    else if (booleanDefinition.value) { return true; }
    return false;
  };

  var generateNull = function (nullDefinition) {
    return null;
  };

  var generateNumber = function (numberDefinition) {
    //var rangeDetails = numberDefinition.value.split(',');

    if(numberDefinition.value.type == 'f') {
      return randomMinMaxFloat(numberDefinition.value.range.start, numberDefinition.value.range.end);
    } else {
      return randomMinMaxInt(numberDefinition.value.range.start, numberDefinition.value.range.end);
    }
  };

  var generateObject = function (objectDefinition) {
    var generatedObject = {};
    for(var k in objectDefinition) {
      if(objectDefinition.hasOwnProperty(k)) {
        switch(objectDefinition[k].type) {
          case config.TYPES.ARRAY :
            generatedObject[objectDefinition[k].name] = generateArray(objectDefinition[k]);
            break;
          case config.TYPES.BOOLEAN :
            generatedObject[objectDefinition[k].name] = generateBoolean(objectDefinition[k]);
            break;
          case config.TYPES.NULL :
            generatedObject[objectDefinition[k].name] = generateNull(objectDefinition[k]);
            break;
          case config.TYPES.NUMBER :
            generatedObject[objectDefinition[k].name] = generateNumber(objectDefinition[k]);
            break;
          case config.TYPES.OBJECT :
            generatedObject[objectDefinition[k].name] = generateObject(objectDefinition[k].value);
            break;
          case config.TYPES.STRING :
            generatedObject[objectDefinition[k].name] = generateString(objectDefinition[k]);
            break;
        }
      }
    }

    return generatedObject;
  };

  var generateString = function (stringDefinition) {
    return (function (length, characters) {
      var arr = [];

      for(var i = 0; i < length; i++) {
        arr.push(randomString(characters));
      }
      return arr.join('');
    })(stringDefinition.value.len, stringDefinition.value.value);
  };

  var randomBoolean = function () {
    return (Math.floor(Math.random() * 2)) ? true : false;
  }

  var randomMinMaxInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  var randomMinMaxFloat = function (min, max) {
    return Math.random() * (max - min) + min;
  }

  var randomString = function (characters) {
    if(randomBoolean()) {
      return 'aaaaaaaaaaaaa';
    } else {
      return ' ';
    }
  }

  return {
    generate:generate
  };
}();

module.exports = crashtestGenerator;