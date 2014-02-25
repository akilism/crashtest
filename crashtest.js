//generate an array of JSON objects based on some input.
//array name
//property - type - input
//if type === array
//get array data type and length;
//worry about objects in arrays later
//write to filename.json


var crashtest = function (){
//  var process = require('process');
  var init = function () {
     console.log('Welcome to crashtest');
  };
  return {
    init:init
  }
}();

var ct = crashtest;
ct.init();
