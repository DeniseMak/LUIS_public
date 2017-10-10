// node 7.x
// uses async/await - promises

var rp = require('request-promise');
var fs = require('fs-extra');
var path = require('path');

const download = async (config) => {

    try{

      config.options = {
        uri: config.uri,
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
        }
      };
      
        config.response = {
            success: {},
            error: {}
        };

        return getApi(config)
        .then(writeFile)
        .then(response => {
          console.log("download done");
          return response;
        });

     } catch(err){
        config.response.error.download = err;
        return config;
    }
}

const writeFile = async (config) => {

  try { 
    config.response.success.writeFile = await fs.writeFile(config.outFile,config.response.success.getApi, 'utf-8');
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

var config = {
    LUIS_subscriptionKey: "<subscriptionKey>",
    LUIS_appId: "<appId>"
};

config.outFile = path.join(__dirname, "./utterances.csv");
config.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/querylogs".replace("{appId}",LUIS_appId);

download(config).then(output => {
  console.log("done");  
}).catch(err => console.log("final " + JSON.stringify(err.response.error)));
*/