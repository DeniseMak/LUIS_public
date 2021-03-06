// node 7.x
// uses async/await - promises

var rp = require('request-promise');
var fs = require('fs-extra');
var path = require('path');


// main function to call
var upload = async (config) => {

    try{
    // request options
    config.options = {
        uri: config.uri,
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
        },
        json: true
    };

    config.response = {
        success: {},
        error: {}
    };
    console.log("upload");
    return await getBatchFromFile(config)
        .then(sendBatchToApi)
        .then(response => {
            console.log("upload done");
            return response;
        });
        
    } catch(err){
        config.response.error.upload = err;
        return config;        
    }

}
// get json from file - already formatted for this api
var getBatchFromFile = async (config) => {
    try {
        console.log("getBatchFromFile");
        console.log(config.inFile);

        var inFile = await fs.readFile(config.inFile, 'utf-8');

        console.log(inFile);
        config.options.body = inFile;
        console.log(config.options.body);
        config.response.success.getBatchFromFile = true;

        return config;

    } catch (err) {
        console.log(err);
        config.response.error.getBatchFromFile = err;
        return config;
    }
}
// send json as post.body to api
var sendBatchToApi = async (config) => {
    try {
        console.log("sendBatchToApi");
        config.response.success.apiResponse = await rp.post(config.options);

        return config;
    }
    catch (err) {
        config.response.error.sendBatchToApi = err;
        console.log("sendBatchToApi failed = " + err.response.statusCode + " " + err.response.statusMessage);
        return err;
    }
}

module.exports = upload;

/* 
//example usage

var config = {
    LUIS_subscriptionKey: "<subscriptionKey>",
    LUIS_appId: "<appId>",
    LUIS_versionId: "0.1"
};

config.inFile = path.join(__dirname, "./utterances.json");
config.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", config.LUIS_appId).replace("{versionId}", config.LUIS_versionId);


upload(config).then(output => {
    console.log(JSON.stringify(output.response));
}).catch(err => console.log("final " + err));
*/