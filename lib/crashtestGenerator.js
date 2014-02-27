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
    return generateRootObject(build);
  };

  var getValue = function (type, value) {
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
        return generateNumber(value);
        break;
      case config.TYPES.OBJECT :
        return generateNestedObject(value.value);
        break;
      case config.TYPES.STRING :
        return generateString(value);
        break;
      default:
        return undefined;
        break;
    }
  };

  var generateNestedObject = function (objectDefinition) {
    var generatedObj = {};

    for (var i = 0, len = objectDefinition.length; i < len; i++) {
      var property = objectDefinition[i];
      generatedObj[property.name] = getValue(property.type, property);
    }

    return generatedObj;
  };

  var generateArray = function (arrayDefinition) {
    var generatedArray = [];

    var length = arrayDefinition.value.len;
    var type = arrayDefinition.value.type;
    var value = arrayDefinition.value;

    for (var i = 0; i < length; i++) {
      generatedArray.push(getValue(type, value));
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
    var start, end, type;

    if(numberDefinition.value) {
      start = numberDefinition.value.range.start;
      end = numberDefinition.value.range.end;
      type = numberDefinition.value.type;
    } else {
      start = numberDefinition.range.start;
      end = numberDefinition.range.end;
      type = numberDefinition.type;
    }


    if(type === 'f') {
      return randomMinMaxFloat(start, end);
    } else {
      return randomMinMaxInt(start, end);
    }
  };

  var generateRootObject = function (objectDefinition) {
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
    var len = stringDefinition.value.len || stringDefinition.len;
    var value = stringDefinition.value.value || stringDefinition.value;

    return (function (length, characters) {
      var arr_chars = (characters.indexOf(',') > -1) ? characters.split(',') : [];
      if (arr_chars.length === 0) { arr_chars.push(characters); }
      var randString = randomString(arr_chars);
      return (randString.length > length) ? randString.slice(0,length) : randString;
    })(len, value);
  };

  var randomBoolean = function () {
    console.log(Math.floor(Math.random() * 2));
    return (Math.floor(Math.random() * 2) === 1);
  }

  var randomMinMaxInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  var randomMinMaxFloat = function (min, max) {
    return Math.random() * (max - min) + min;
  }

  var randomString = function (characters) {
    return characters[randomMinMaxInt(0, characters.length)];
  }

  return {
    generate:generate
  };
}();

module.exports = crashtestGenerator;