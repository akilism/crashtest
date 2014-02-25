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
// Akil Harris
// 2014

//generate an array of JSON objects based on some input.
//array name
//property - type - input
//if type === array
//get array data type and length;
//worry about objects in arrays later
//write to filename.json
//make CLI.


var crashtest = function () {

  var build = {},
    generator = require('./lib/crashtestGenerator'),
    config = require('./lib/crashtestConfig').getConfig(),
    readline = require('readline'),
    Q = require('Q'),
    rl = readline.createInterface({
      'input': process.stdin,
      'output': process.stdout
    });

  var run = function () {
    welcomeScreen();
    mainMenu();
  };

  var welcomeScreen = function () {
    console.log('');
    console.log('----------------------------------------------------------------------------------------');
    console.log(' $$$$$$\\                               $$\\        $$\\                           $$\\');
    console.log('$$  __$$\\                              $$ |       $$ |                          $$ |');
    console.log('$$ /  \\__| $$$$$$\\  $$$$$$\\   $$$$$$$\\ $$$$$$$\\ $$$$$$\\    $$$$$$\\   $$$$$$$\\ $$$$$$\\');
    console.log('$$ |      $$  __$$\\ \\____$$\\ $$  _____|$$  __$$\\\\_$$  _|  $$  __$$\\ $$  _____|\\_$$  _|');
    console.log('$$ |      $$ |  \\__|$$$$$$$ |\\$$$$$$\\  $$ |  $$ | $$ |    $$$$$$$$ |\\$$$$$$\\    $$ |');
    console.log('$$ |  $$\\ $$ |     $$  __$$ | \\____$$\\ $$ |  $$ | $$ |$$\\ $$   ____| \\____$$\\   $$ |$$\\');
    console.log('\\$$$$$$  |$$ |     \\$$$$$$$ |$$$$$$$  |$$ |  $$ | \\$$$$  |\\$$$$$$$\\ $$$$$$$  |  \\$$$$  |');
    console.log(' \\______/ \\__|      \\_______|\\_______/ \\__|  \\__|  \\____/  \\_______|\\_______/    \\____/ v0.0.1');
    console.log('----------------------------------------------------------------------------------------');
  }

  var mainMenu = function () {
    //TODO check if build exists. If not use build else make an array to hold multiple builds.
    //TODO add functionality to save / print from multiple builds.

    rl.question('(B)uild template, (H)elp, (A)bout, (S)ave, (P)rint, (Q)uit? ', function (answer) {
      var option = answer.toLowerCase();
      switch (option) {
        case 'a':
          welcomeScreen();
          console.log('A dummy JSON data generator.\nWritten by Akil Harris.\nhttp://www.grizzlebees.com/\n');
          break;
        case 'b':
          build = buildObject();
          break;
        case 'h':
          displayHelp();
          break;
        case 'p':
          console.log(JSON.stringify(generator.generate(build)));
          break;
        case 'q':
          console.log('Bye!');
          process.exit();
          break;
        case 's':
          saveMenu();
          break;
        default:
          console.error('Not a valid option!');
          break;
      }

      mainMenu();
    });
  };

  var displayHelp = function() {
      console.log('Sorry I can\'t right now. \n');
  };

  var buildObject = function () {
    var properties = [];
    var deferred = Q.defer();

    rl.question('Number of properties: ', function (answer) {
      rl.pause();
      if(isNaN(answer)) {
        console.error(answer + ' is not a number!');
      } else if (parseInt(answer, 10) > config.MAX_PROPERTY_COUNT) {
        console.error('Max property count is :' + config.MAX_PROPERTY_COUNT);
        return buildObject();
      } else {
        console.log('Building ' + answer + (parseInt(answer, 10) === 1) ? ' property' : 'properties');
        for(var i = 0, len = parseInt(answer, 10); i < len; i++) {
          console.log('--------------------------------');
          properties[i] = buildProperty();
        }

        deferred.resolve(properties);
      }
    });

    return deferred.promise;
  };

  var buildProperty = function() {
    var property = {};
    property.name = namePrompt();
    property.type = typePrompt();
    property.value = valuePrompt(property.type);
    return property;
  };

  var namePrompt = function () {
    console.log('namePrompt');
    rl.question('Property Name:', function (answer) {
        if(answer.length < config.MAX_PROPERTY_NAME_LENGTH && answer.length > 0) {
          rl.pause();
          return answer;
        } else {
          console.log('Please input a valid property name:')
          rl.pause();
          return namePrompt();
        }
    });
  };

  var typePrompt = function () {
    console.log('typePrompt');
    rl.question('Choose a data type: (N)umber, (S)tring, (B)oolean, (A)rray, (O)bject, n(U)ll: ', function (answer) {
      var type = fetchType(answer[0]);
      if(type) {
        return type;
      } else {
        console.log('Please input a valid type.\n');
        return typePrompt();
      }
    });
  };

  var fetchType = function (inputType) {
      switch (inputType.toLowerCase()) {
        case 'a':
          return config.TYPES.ARRAY;
          break;
        case 'b':
          return config.TYPES.BOOLEAN;
            break;
        case 'n':
          return config.TYPES.NUMBER;
            break;
        case 'o':
          return config.TYPES.OBJECT;
            break;
        case 's':
          return config.TYPES.STRING;
            break;
        case 'u':
          return config.TYPES.NULL;
            break;
      }

    return undefined;
  };

  var valuePrompt = function (type) {
    console.log('valuePrompt');
    if (type === config.TYPES.NULL) { return null; }
    console.log('Set the value: (H)elp');
    switch (type) {
      case config.TYPES.ARRAY:
        return promptArray();
        break;
      case config.TYPES.BOOLEAN:
        return promptBoolean();
        break;
      case config.TYPES.NUMBER:
        return promptNumber();
        break;
      case config.TYPES.OBJECT:
        return buildObject();
        break;
      case config.TYPES.STRING:
        return promptString();
        break;
//      case config.TYPES.NULL:
//        return null;
//        break;
    }
  };

  var promptBoolean = function () {
    rl.question('(T)rue, (F)alse, (R)andom: ', function(answer) {
      switch (answer.toLowerCase()) {
        case 't':
          return true;
        case 'f':
          return false;
        case 'r':
          return 0;
      }
    });
  };

  var promptNumber = function () {
    var numberDefinition = {
      'range': {}
    };

    rl.question('(F)loat or (I)nt: ', function (answer) {
      var option = answer.toLowerCase();
      if (option === 'h') {
        console.log('help screen');
      } else if (option === 'f') {
        numberDefinition.type = 'f';
      } else if (option === 'i') {
        numberDefinition.type = 'i';
      }
    });

    rl.question('Range start: ', function (answer) {
      if (answer.toLowerCase() === 'h') {
        console.log('help screen');
      }
      numberDefinition.range.start = (numberDefinition.type === 'i') ? parseInt(answer, 10) : answer;
    });

    rl.question('Range end: ', function (answer) {
      if (answer.toLowerCase() === 'h') {
        console.log('help screen');
      }
      numberDefinition.range.end = (numberDefinition.type === 'i') ? parseInt(answer, 10) : answer;
    });

    return numberDefinition;
  };

  var promptString = function () {
    var stringDefinition = {};
    rl.question('String length: ', function(answer) {
      if(answer > config.MAX_STRING_SIZE) {

      }
      stringDefinition.length = answer;
    });

    rl.question('String valid characters [\'array\',\'format\']: ', function(answer) {
      stringDefinition.value = answer;
    });

    return stringDefinition;
  };

  var promptArray = function () {
    var arrayDefinition = {};
    rl.resume();
    rl.question('Whats the length of the array you would like to create:', function (answer) {
      arrayDefinition.length = answer;
    });
    arrayDefinition.type = typePrompt();
    arrayDefinition.value = valuePrompt(arrayDefinition.type);
    return arrayDefinition;
  };

  return {
    run: run
  }
}();

var ct = crashtest;
ct.run();

