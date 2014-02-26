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
// crashtestConfig.js - Configuration Settings.
// Akil Harris
// 2014
var crashtestConfig = function () {

  var config = {
    'MAX_ARRAY_SIZE': 1000,
    'MAX_PROPERTY_COUNT': 1000,
    'MAX_PROPERTY_NAME_LENGTH': 500,
    'MAX_STRING_SIZE': 1000,
    'TYPES': {
      'NUMBER': 0,
      'STRING': 1,
      'BOOLEAN': 2,
      'OBJECT': 3,
      'ARRAY': 4,
      'NULL': 5
    }
  };

  var getConfig = function() {
    return config;
  };

  return {
    getConfig:getConfig
  };
}();

module.exports = crashtestConfig;