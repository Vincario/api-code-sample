// Sign up and request API key at https://vindecoder.eu/api/#request-free-trial-api-key
// See API documentation at https://vindecoder.eu/my/api/latest/docs

const vinDecoder = require('./vinDecoder');

let vin = 'WF0MXXGBWM8R43240';

try {
  let response1 = await vinDecoder('info', vin);
  console.log(response1);

  let response2 = await vinDecoder('decode', vin);
  console.log(response2);

  let response3 = await vinDecoder('stolen-check', vin);
  console.log(response3);

  let response4 = await vinDecoder('balance');
  console.log(response4);
} catch (error) {
  console.log(error);
}