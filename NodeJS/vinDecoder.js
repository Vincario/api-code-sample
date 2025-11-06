// Sign up at https://vincario.com/create-account/ and request API keys
// See API documentation at https://vincario.com/api-docs/3.2/

const https = require('https');
const sha1 = require('./sha1');

module.exports = function vinDecoder(id, vin = null) {
  let apiKey = 'API_KEY';
  let secretKey = 'API_SECRET';

  let apiPrefix = "https://api.vindecoder.eu/3.2";
  let action = (id === "info") ? "decode/info" : id;

  let hash = sha1((vin ? vin + '|' : '') + id + '|' + apiKey + '|' + secretKey).substring(0, 10);
  let path = apiPrefix + '/' + apiKey + '/' + hash + '/' + action + (vin ? '/' + vin : '') + '.json';

  return new Promise((resolve, reject) => {
    https.get(path, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        resolve(data)
      });

    }).on("error", (err) => {
      reject(err);
    });
  });
}