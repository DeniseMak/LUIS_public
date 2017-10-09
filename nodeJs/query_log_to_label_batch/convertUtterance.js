const babyparse = require("babyparse");

function mapEntity(entities){
    
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

var convertUtterance = function(i, rowAsString){

    let json = {
        "row":i,
        "text":"",
        "intentName":"",
        "entityLabels":{}
    };

    if(!rowAsString) return json;

    // csv to baby parser object
    let dataRow = babyparse.parse(rowAsString);

    // unwrap baby parser's first row, 2nd column
    let utteranceString = dataRow.data[0][2];

    try{
        // convert stringifyied JSON into real JSON
        let utterance = JSON.parse(utteranceString);

        json.intentName = utterance.intents && utterance.intents.length>0 ? utterance.intents[0].intent : "";
        json.text = utterance.query;
        json.entityLabels = utterance.entities && utterance.entities.length ? mapEntity(utterance.entities): [];

        return json;

    }catch(err){
        // do something with error
        console.log("err " + err);
    }

};

module.exports = convertUtterance;
