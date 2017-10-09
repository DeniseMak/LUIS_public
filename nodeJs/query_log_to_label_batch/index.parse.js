// node 7.x
// built with streams for larger files

const fse = require('fs-extra');
const path = require('path');
const lineReader = require('line-reader');
const Promise = require('bluebird');
const babyparse = require("babyparse");

// rewrite each items properties and values
function mapEntity(entities) {

    return entities.map(entity => {

        // create new properties
        entity.entityName = entity.entity;
        entity.startCharIndex = entity.startIndex;
        entity.endCharIndex = entity.endIndex;

        // delete old properties
        delete entity.startIndex;
        delete entity.endIndex;
        delete entity.score;
        delete entity.entity;

        return entity;
    });
}

var utterance = function (i, rowAsString) {

    let json = {
        "row": i,
        "text": "",
        "intentName": "",
        "entityLabels": {}
    };

    if (!rowAsString) return json;

    // csv to baby parser object
    let dataRow = babyparse.parse(rowAsString);

    // unwrap baby parser's first row, 2nd column
    let utteranceString = dataRow.data[0][2];

    try {
        // convert stringifyied JSON into real JSON
        let utterance = JSON.parse(utteranceString);

        json.intentName = utterance.intents && utterance.intents.length > 0 ? utterance.intents[0].intent : "";
        json.text = utterance.query;
        json.entityLabels = utterance.entities && utterance.entities.length ? mapEntity(utterance.entities) : [];

        return json;

    } catch (err) {
        // do something with error
        console.log("err " + err);
    }

};

// main function to call
// read stream line at a time
// conversion happens in precess.convert_utterance_map file
function convert(config, callback) {

    var i = 0;

    // create out file
    var myOutFile = fse.createWriteStream(config.outFile, 'utf-8');
    myOutFile.write('[');

    // create in file reader
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(config.inFile, 'utf-8')
    });

    // read 1 line
    lineReader.on('line', function (line) {

        // skip first line with headers
        if (i++ == 0) return;

        console.log(i);

        // transform utterance from csv to json
        jsonUtterance = utterance((i - 1), line);

        // write to out stream
        if (i > 2) myOutFile.write(",");
        myOutFile.write(JSON.stringify(jsonUtterance));

    });

    // stream is done reading file
    lineReader.on('close', function () {

        // close write stream
        myOutFile.write(']');
        myOutFile.end();
        callback('done');
    });

}

module.exports = convert;

/* 
//example usage

var config = {};
config.inFile = path.join(__dirname, "./utterances.csv");
config.outFile = path.join(__dirname, "./utterances.json");

convert(config, (response) => {
    console.log(response);
});

*/