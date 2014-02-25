/**
 * Created by akilharris on 2/25/14.
 */


var crashtestGenerator = function () {

  var config = require('./crashtestConfig').getConfig();

  var generate = function (build) {
    return generateObject(build);
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

    var length = arrayDefinition.length;
    var type = arrayDefinition.type;
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
    var rangeDetails = numberDefinition.value.split(',');

    if(numberDefinition.type == 'f') {
      return randomMinMaxFloat(numberDefinition.range.start, numberDefinition.range.end);
    } else {
      return randomMinMaxInt(numberDefinition.range.start, numberDefinition.range.end);
    }
  };

  var generateObject = function (objectDefinition) {
    var generatedObject = {};

    for(var i = 0, len = objectDefinition.properties.length; i < len; i++) {
      switch(objectDefinition.properties[i].type) {
        case config.TYPES.ARRAY :
          generatedObject[objectDefinition.properties.name] = generateArray(objectDefinition.properties[i]);
          break;
        case config.TYPES.BOOLEAN :
          generatedObject[objectDefinition.properties.name] = generateBoolean(objectDefinition.properties[i]);
          break;
        case config.TYPES.NULL :
          generatedObject[objectDefinition.properties.name] = generateNull(objectDefinition.properties[i]);
          break;
        case config.TYPES.NUMBER :
          generatedObject[objectDefinition.properties.name] = generateNumber(objectDefinition.properties[i]);
          break;
        case config.TYPES.OBJECT :
          generatedObject[objectDefinition.properties.name] = generateObject(objectDefinition.properties[i]);
          break;
        case config.TYPES.STRING :
          generatedObject[objectDefinition.properties.name] = generateString(objectDefinition.properties[i]);
          break;
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
    })(stringDefinition.length, stringDefinition.value);
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