var rp = require('request-promise');
var fs = require('fs-extra');
var path = require('path');

const download = async (config) => {

    try{
        config.response = {
            success: {},
            error: {}
        };

        return getApi(config)
        .then(writeFile);

     } catch(err){
        config.response.error.download = err;
        return config;
    }
}

const writeFile = async (config) => {

  try {  
    config.response.success.writeFile = await fs.writeFile(config.fileOut,config.response.success.getApi, 'utf-8');
    return config;
  }
  catch (err) {
    config.response.error.writeFile = err;
    return config;
  }
}

const getApi = async (config) => {
  try {
    config.response.success.getApi = await rp(config.options);
    return config;
  }
  catch (err) {
    config.response.error.getApi = err;
    return config;
  }
}
  

module.exports = download;

/* 
//example usage

const LUIS_subscriptionKey = "<subscription key>";
const LUIS_appId = "<appid>";

var config = {
    fileOut: "./utterances.csv"
};

config.options = {
  uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/querylogs".replace("{appId}",LUIS_appId),
  method: 'GET',
  headers: {
    'Ocp-Apim-Subscription-Key': LUIS_subscriptionKey
  }
};

download(config).then(output => {
  console.log("done");  
}).catch(err => console.log("final " + JSON.stringify(err.response.error)));
*/