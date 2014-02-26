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

var crashtest = function () {

  var build = {},
    generator = require('./lib/crashtestGenerator'),
    config = require('./lib/crashtestConfig').getConfig(),
    Q = require('Q'),
    prompt = require('prompt'),
    fs = require('fs'),
    generatedJSON;

  var run = function (showWelcome) {
    if(showWelcome) {
      welcomeScreen();
    }

    mainMenu().then(function (value) {
      run(value);
    });
  };

  var welcomeScreen = function () {
    console.log('');
    console.log('----------------------------------------------------------------------------------------'.blue);
    console.log(' $$$$$$\\                               $$\\        $$\\                           $$\\');
    console.log('$$  __$$\\                              $$ |       $$ |                          $$ |');
    console.log('$$ /  \\__| $$$$$$\\  $$$$$$\\   $$$$$$$\\ $$$$$$$\\ $$$$$$\\    $$$$$$\\   $$$$$$$\\ $$$$$$\\');
    console.log('$$ |      $$  __$$\\ \\____$$\\ $$  _____|$$  __$$\\\\_$$  _|  $$  __$$\\ $$  _____|\\_$$  _|');
    console.log('$$ |      $$ |  \\__|$$$$$$$ |\\$$$$$$\\  $$ |  $$ | $$ |    $$$$$$$$ |\\$$$$$$\\    $$ |');
    console.log('$$ |  $$\\ $$ |     $$  __$$ | \\____$$\\ $$ |  $$ | $$ |$$\\ $$   ____| \\____$$\\   $$ |$$\\');
    console.log('\\$$$$$$  |$$ |     \\$$$$$$$ |$$$$$$$  |$$ |  $$ | \\$$$$  |\\$$$$$$$\\ $$$$$$$  |  \\$$$$  |');
    console.log(' \\______/ \\__|      \\_______|\\_______/ \\__|  \\__|  \\____/  \\_______|\\_______/    \\____/ v0.0.1');
    console.log('----------------------------------------------------------------------------------------'.blue);
  }

  var mainMenu = function () {
    //TODO check if build exists. If not use build else make an array to hold multiple builds.
    //TODO add functionality to save / print from multiple builds.
    prompt.message = '';
    prompt.delimiter = '';
    prompt.start();
    var deferred = Q.defer();

    var ask = function () {
      var d = Q.defer();

      var promptDetails = {
        properties: {
          option: {
            description: '(B)'.green + 'uild template, ' + '(H)'.green + 'elp, ' + '(A)'.green + 'bout, ' + '(S)'.green
              + 'ave, ' + '(P)'.green + 'rint, ' + '(Q)'.green + 'uit?',
            type: 'string',
            before: function (value) { return value.toLowerCase(); }
          }
        }
      };

      prompt.get(promptDetails, function (err, result) {
        switch (result.option) {
        case 'a':
          welcomeScreen();
          console.log('A dummy JSON data generator.\nWritten by Akil Harris.\nhttp://www.grizzlebees.com/\n');
          d.resolve(false);
          break;
        case 'b':
          buildObject().then(function (obj) {
            build = obj;
            generatedJSON = JSON.stringify(generator.generate(build));
            rain();
            console.log('Object Built.')
            rain();
            d.resolve(true);
          });
          break;
        case 'h':
          displayHelp();
          d.resolve(false);
          break;
        case 'p':  //TODO don't crash on empty build.
          rain();
          console.log('Obj Print-out:', build);
          console.log('JSON Print-out:', generatedJSON);
          rain();
          d.resolve(false);
          break;
        case 'q':
          console.log('Bye!');
          process.exit();
          break;
        case 's':
          save().then(function (filename) {
            console.log('Saved: ' + filename + '.json');
            console.log('Saved: ' + filename + '.config.json');
            //TODO Build save menu.
            d.resolve(false);
          });
          break;
        default:
          console.error('Not a valid option!');
          d.resolve(false);
          break;
      }

      });
      return d.promise;
    };

    ask().then(function (value) {
      return deferred.resolve(value);
    });

    return deferred.promise;
  };

  var rain = function () {
    console.log('$$$$$$$$$$$$$$$$$$$$$$$'.green);
  }

  var pour = function (count) {
    for(var i = 0; i < count; i++) {
      rain();
    }
  }

  var displayHelp = function () {
      console.log('Sorry I can\'t right now. \n');
  };

  var buildObject = function () {
    var properties = [];
    var deferred = Q.defer();

    var objectPrompt = {
      properties: {
        option: {
          description: 'Number of properties:',
          before: function (value) { return parseInt(value, 10); }
        }
      }
    };

    prompt.get(objectPrompt, function (err, result){
      console.log('Building ' + result.option + ' ' + ((result.option === 1) ? 'property' : 'properties'));

      var propertyManager = function () {
        buildProperties().then(function (property) {
          properties.push(property);
          if (properties.length === result.option) {
            deferred.resolve(properties);
          } else {
            propertyManager();
          }
        });
      };

      var buildProperties = function () {
        var d = Q.defer();
        buildProperty().then(function (property) {
          d.resolve(property);
        });
        return d.promise;
      };

      propertyManager();
    });
//      if(isNaN(option)) {
//      } else if (option > config.MAX_PROPERTY_COUNT) {

    return deferred.promise;
  };

  var buildProperty = function() {
    var property = {},
      deferred = Q.defer();

    namePrompt().then(function (name) {
      property.name = name;
      return typePrompt();
    }).then(function (type) {
        property.type = type;
      return valuePrompt(type);
    }).then(function(value) {
      property.value = value;
      console.log('***********************'.blue);
      deferred.resolve(property);
    });

    return deferred.promise;
  };

  var namePrompt = function () {
    var deferred = Q.defer();

    var namePrompt = {
      properties: {
        name: {
          description: 'Property Name:'
        }
      }
    };

    prompt.get(namePrompt, function (err, result){
        deferred.resolve(result.name);
    });
//        if(answer.length < config.MAX_PROPERTY_NAME_LENGTH && answer.length > 0) {

    return deferred.promise;
  };

  var typePrompt = function () {
    var deferred = Q.defer();
    var typePrompt = {
      properties: {
        type: {
          description: 'Choose a data type: ' + '(N)'.green + 'umber, ' + '(S)'.green + 'tring, ' + '(B)'.green +
            'oolean, ' + '(A)'.green + 'rray, ' + '(O)'.green + 'bject, n' + '(U)'.green + 'll: ',
          before: function (value) { return fetchType(value.toLowerCase()); }
        }
      }
    };

    prompt.get(typePrompt, function (err, result){
      deferred.resolve(result.type);
    });

    return deferred.promise;
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
    if (type === config.TYPES.NULL) { return null; }
    console.log('Set the value: ');
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

    return undefined;
  };

  var promptBoolean = function () {
    var deferred = Q.defer();
    var typePrompt = {
      properties: {
        option: {
          description: '(T)'.green + 'rue, ' + '(F)'.green + 'alse, ' + '(R)'.green + 'andom: ',
          before: function (value) { return value.toLowerCase(); }
        }
      }
    };

    prompt.get(typePrompt, function (err, result){
      switch (result.option) {
        case 't':
          deferred.resolve(true);
          break;
        case 'f':
          deferred.resolve(false);
          break;
        case 'r':
          deferred.resolve(0);
          break;
      }
    });

    return deferred.promise;
  };

  var promptNumber = function () {
    var numberDefinition = {
      'range': {}
    };
    var deferred = Q.defer();

    var type = function () {
      var d = Q.defer();
      var typePrompt = {
        properties: {
          type: {
            description: '(F)'.blue + 'loat or ' + '(I)'.blue + 'nt: ',
            before: function (value) { return value.toLowerCase(); }
          }
        }
      };

      prompt.get(typePrompt, function (err, result){
        d.resolve(result.type);
      });

      return d.promise;
    };

    var min = function () {
      var d = Q.defer();
      var typePrompt = {
        properties: {
          type: {
            description: 'Range start: '
          }
        }
      };

      prompt.get(typePrompt, function (err, result){
        d.resolve(result.type);
      });

      return d.promise;
    };

    var max = function () {
      var d = Q.defer();
      var typePrompt = {
        properties: {
          type: {
            description: 'Range max: '
          }
        }
      };

      prompt.get(typePrompt, function (err, result){
        d.resolve(result.type);
      });

      return d.promise;
    };

    type().then(function (type) {
      numberDefinition.type = type;
      return min();
    }).then(function (rangeStart) {
        numberDefinition.range.start = rangeStart;
        return max();
    }).then(function (rangeEnd) {
        numberDefinition.range.end = rangeEnd;
        deferred.resolve(numberDefinition);
    });

    return deferred.promise;
  };

  var promptString = function () {
    var deferred = Q.defer();
    var stringDefinition = {};

    var stringLength = function () {
      var d = Q.defer();

      var typePrompt = {
        properties: {
          type: {
            description: 'String length: ',
            before: function (value) { return parseInt(value, 10); }
          }
        }
      };

      prompt.get(typePrompt, function (err, result){
        d.resolve(result.type);
      });

      return d.promise;
    };

    var stringCharacters = function () {
      var d = Q.defer();

      var typePrompt = {
        properties: {
          type: {
            description: 'String valid characters [\'array\',\'format\']:'
          }
        }
      };

      prompt.get(typePrompt, function (err, result){
        d.resolve(result.type);
      });

      return d.promise;
    };

    stringLength().then(function (length) {
      stringDefinition.len = length;
      return stringCharacters();
    }).then(function (characters) {
        stringDefinition.value = characters;
      return deferred.resolve(stringDefinition);
    });

//      if(answer > config.MAX_STRING_SIZE) {

    return deferred.promise;
  };

  var promptArray = function () {
    var deferred = Q.defer();
    var arrayDefinition = {};

    var arrayLength = function () {
      var d = Q.defer();
      var typePrompt = {
        properties: {
          len: {
            description: 'Whats the length of the array you would like to create:',
            before: function (value) { return parseInt(value, 10); }
          }
        }
      };

      prompt.get(typePrompt, function (err, result){
        d.resolve(result.len);
      });

      return d.promise;
    };

    arrayLength().then(function (len) {
      arrayDefinition.len = len;
      return typePrompt();
    }).then(function (type) {
      arrayDefinition.type = type;
      return valuePrompt(arrayDefinition.type);
    })
    .then(function (value) {
      arrayDefinition.value = value;
      deferred.resolve(arrayDefinition);
    });

    return deferred.promise;
  };

  var save = function () {
    var filename = build[0].name;
    var deferred = Q.defer();

    fs.exists('output', function (exists) {
      if(exists) {
        writeFiles(filename).finally(deferred.resolve(filename));
      } else {
        createOutputDirectory();
        writeFiles(filename);
      }
    });

    return deferred.promise;
  };

  var writeFiles = function (filename) {
    var deferred = Q.defer();

    //TODO write this properly.
    fs.writeFile('output/' + filename + '.json', generatedJSON + '\n', function(error) {
      if(error) { console.error(error) };
      deferred.resolve(filename);
    });

    fs.writeFile('output/' + filename + '.config.json', JSON.stringify(build) + '\n', function(error) {
      if(error) { console.error(error) };
    });

    return deferred.promise;
  };

  var createOutputDirectory = function () {
     fs.mkdir('output', function (error) {
       if(error) { console.error(error) }
     });
  };

  return {
    run: run
  };
}();

crashtest.run(true);

