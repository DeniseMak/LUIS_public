var path = require('path');

const download = require('./index.download')
const parse = require('./index.parse');
const upload = require('./index.upload')

const LUIS_subscriptionKey = "e237d6bc86cd4562bf67b09dff44d2e6";
const LUIS_appId = "84d6601f-a1f0-456e-a894-be5e662a5a6b";
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

var output = {};

download(configDownload)
.then(output => {
    //output.download = output;
    return parse(configParse);
}).then(output => {
    //output.parse = output;
    return upload(configUpload);
}).then(output => {
    //output.upload = output;
  console.log("process done");  
});
//.catch(err => console.log(err));