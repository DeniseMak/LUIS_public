var rp = require('request-promise');
var fs = require('fs-extra');
var path = require('path');


const LUIS_subscriptionKey = "<subscription key>";
const LUIS_appId = "<appid>";
const LUIS_versionId = "0.1";

const WriteFile = async (file, data ) => {

  try {  
    //assuming text file - utf-8
    return await fs.writeFile(file,data, 'utf-8');
  }
  catch (err) {
      console.error("file: " + file + " " + err);
  }
}

const GetApi = async (options) => {
  try {

    return await rp(options);

  }
  catch (err) {
      console.error(err)
  }
}

const ReadResponseFromApi = (response) => {
  return response;
}

var apis = [
  "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/querylogs"
];

var options = {
  uri: apis[0].replace("{appId}",LUIS_appId),
  method: 'GET',
  headers: {
    'Ocp-Apim-Subscription-Key': LUIS_subscriptionKey
  }
};

GetApi(options)
.then(ReadResponseFromApi)
.then( data => WriteFile('./LUIS.querylog.backup.json',data))
.catch(err => console.error(err));
