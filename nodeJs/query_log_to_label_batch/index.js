var path = require('path');

const download = require('./index.download')
const parse = require('./index.parse');
const upload = require('./index.upload')

const LUIS_subscriptionKey = "<subscription key>";
const LUIS_appId = "<appid>";
const LUIS_versionId = "0.1";

const downloadFile= "./utterances.csv";
const uploadFile = "./utterances.json"



/* download configuration */
var configDownload = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_appId: LUIS_appId,
    outFile: path.join(__dirname, "./utterances.csv"),
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/querylogs".replace("{appId}",LUIS_appId)
};

/* upload configuration */
var configUpload = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: "0.1",
    inFile: path.join(__dirname, uploadFile),
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId)
};

/* parse configuration */
var configParse = {
    inFile: path.join(__dirname, "./utterances.csv"),
    outFile: path.join(__dirname, "./utterances.json")
}; 

download(configDownload)
.then(parse(configParse))
.then(upload(configUpload))
.then(output => {
  console.log("process done");  
}).catch(err => console.log("final " + JSON.stringify(err.response.error)));