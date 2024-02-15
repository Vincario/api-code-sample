// Sign up and request API key at https://vindecoder.eu/api/#request-free-trial-api-key
// See API documentation at https://vindecoder.eu/my/api/latest/docs

const vinDecoder = require('./vinDecoder');

let vin = 'WF0MXXGBWM8R43240';

try {
  // Vindecode Info
  vinDecoder('info', vin).then(function (resp) {
	  console.log(resp);
  })
  
  // Vindecode
  vinDecoder('decode', vin).then(function (resp) {
	  console.log(resp);
  })

  // Stolen Check
  vinDecoder('stolen-check', vin).then(function (resp) {
	  console.log(resp);
  })

  // API Balance
  vinDecoder('balance').then(function (resp) {
	  console.log(resp);
  })
} catch (error) {
  console.log(error);
}