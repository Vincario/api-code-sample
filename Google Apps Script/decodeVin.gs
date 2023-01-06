// Sign up and request API key at https://vindecoder.eu/api/#request-free-trial-api-key
// See API documentation at https://vindecoder.eu/my/api/latest/docs

function decodeVin(vin) {
  const API_KEY = "API_KEY";    // Your API key
  const SECRET = "SECRET_KEY";  // Your Secret key
  const apiBaseUrl = "https://api.vindecoder.eu/3.2";
  const upperVin = vin.toUpperCase();

  const control = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_1, `${upperVin}|decode|${API_KEY}|${SECRET}`)
    .map(function (e) {
      return ("0" + (e < 0 ? e + 256 : e).toString(16)).slice(-2)
    })
    .join("")
    .slice(0, 10);

  const result = UrlFetchApp.fetch(`${apiBaseUrl}/${API_KEY}/${control}/decode/${upperVin}.json`);
  return JSON.parse(result.getContentText());
}