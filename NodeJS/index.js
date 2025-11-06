// Sign up at https://vincario.com/create-account/ and request API keys
// See API documentation at https://vincario.com/api-docs/3.2/

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