<?php
// Sign up at https://vincario.com/create-account/ and request API keys
// See API documentation at https://vincario.com/api-docs/3.2/

$vin = "WF0MXXGBWM8R43240";
$id = "decode";

$apiKey = "API_KEY";       // Your API key
$secretKey = "API_SECRET"; // Your secret key

$apiPrefix = "https://api.vindecoder.eu/3.2";

$controlSum = substr(sha1("{$vin}|{$id}|{$apiKey}|{$secretKey}"), 0, 10);

$data = file_get_contents("{$apiPrefix}/{$apiKey}/{$controlSum}/decode/{$vin}.json", false);
$result = json_decode($data);

$decodedData = [];
foreach ($result->decode as $data) {
    $decodedData[$data->label] = $data->value;
}

echo "Make: " . $decodedData["Make"] . "\n";
echo "Model: " . $decodedData["Model"] . "\n\n";

print_r($result);