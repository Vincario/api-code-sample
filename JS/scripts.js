// Sign up and request API key at https://vindecoder.eu/api/#request-free-trial-api-key
// See API documentation at https://vindecoder.eu/my/api/latest/docs

let apiPrefix = 'https://api.vindecoder.eu/3.2';
let apiKey = 'API_KEY'; // Your API key
let secretKey = 'API_SECRET'; // Your secret key
let id = 'decode';
let vin = 'WF0MXXGBWM8R43240';

let controlSum = SHA1(vin + '|' + id + '|' + apiKey + '|' + secretKey).substring(0, 10);
let url = apiPrefix + '/' + apiKey + '/' + controlSum + '/decode/' + vin + '.json';

// Create a request variable and assign a new XMLHttpRequest object to it.
let request = new XMLHttpRequest()
let table;

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', url, true)

request.onload = function () {
  // Begin accessing JSON data here
  let data = JSON.parse(this.response);
  table = document.getElementById('results');

  if (request.status >= 200 && request.status < 400 && data.hasOwnProperty("decode")) {
    data.decode.forEach(function (decodeData) {
      let rowData = parseResponseRow(decodeData);

      addTableRow(table, rowData.label, rowData.value);
    });
  } else {
    console.log('error');
  }
}

request.send();

function addTableRow(table, label, value) {

  let tr = document.createElement('tr');

  let tdLabel = document.createElement('td');
  tdLabel.appendChild(document.createTextNode(label));
  tr.appendChild(tdLabel);

  let tdValue = document.createElement('td');
  tdValue.innerHTML = value;
  tr.appendChild(tdValue);

  table.appendChild(tr);
}

function parseResponseRow(data) {
  let {label, value} = data;

  if (typeof value === 'object') {
    value = flattenArray(value);
  }

  return {label, value};
}

function flattenArray(data, level = 0) {
  let output = [];
  for (const key in data) {
    if (!data.hasOwnProperty(key)) {
      continue;
    }

    if (typeof data[key] === "object") {
      data[key] = flattenArray(data[key], (level + 1));
    }

    if (isNaN(parseFloat(key))) {
      output.push(`${key}: ${data[key]}`);
    } else {
      output.push(data[key]);
    }
  }

  return output.join(level === 0 ? "<br>" : ", ");
}
