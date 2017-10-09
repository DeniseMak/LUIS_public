var ConvertUtterance = require("./convertUtterance");
const fse = require('fs-extra');
var path = require('path');
var lineReader = require('line-reader');

const utterancesCSV = "./utterances.csv";
const utterancesJSON = "./utterances.json";

var inFile = path.join(__dirname, utterancesCSV);
var outFile = path.join(__dirname, utterancesJSON);

function processAllRows(inFile, outFile, callback){

  var i = 0;

  // create out file
  var myOutFile = fse.createWriteStream(outFile,'utf-8');
  myOutFile.write('[');

  // create in file reader
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(inFile,'utf-8')
  });

  // read 1 line
  lineReader.on('line', function (line) {

    // skip first line with headers
    if (i++==0) return;

    console.log(i);

    // transform utterance from csv to json
    jsonUtterance = ConvertUtterance((i-1),line);

    // write to out stream
    if(i > 2) myOutFile.write(",");
    myOutFile.write(JSON.stringify(jsonUtterance));

  });

  // steam is done reading file
  lineReader.on('close', function(){

    // close write stream
    myOutFile.write(']');
    myOutFile.end();

    callback('Done.');
  });

}

processAllRows(inFile,outFile,function(result){
  console.log(result);
});