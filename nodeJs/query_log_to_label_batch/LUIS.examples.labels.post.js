var rp = require('request-promise');
var fs = require('fs-extra');
var path = require('path');

const LUIS_label_jsonFile = './utterances.json';
const inFile = path.join(__dirname, LUIS_label_jsonFile);

const LUIS_subscriptionKey = "fb3488ba06614b4985c1baa7a0af0376";
const LUIS_appId = "2cce2d6a-2500-4ce7-804c-51da84609209";
const LUIS_versionId = "0.1";
const uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + LUIS_appId + "/versions/" + LUIS_versionId + "/examples";

const getBatchFromFile = async (jsonFile) => {
  try{
    return await fs.readFile(jsonFile,'utf-8');
  } catch (err){
    console.err(err);
  }
}

const SendBatchToApi = async (batch) => {
  try {

    var options = {
      uri: uri,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': LUIS_subscriptionKey
      },
      body: JSON.parse(batch),
      json: true
    };

    return await rp.post(options);

  }
  catch (err) {
      console.error(err)
  }
}

const ReadResponseFromApi = (response) => {
  response.map(item => {
    console.log(JSON.stringify(item));
  });
}

getBatchFromFile(inFile)
.then(SendBatchToApi)
.then(ReadResponseFromApi)
.catch(err => console.error(err));
