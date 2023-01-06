// Sign up and request API key at https://vindecoder.eu/api/#request-free-trial-api-key
// See API documentation at https://vindecoder.eu/my/api/latest/docs

package main

import (
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func main() {
	apiPrefix := "https://api.vindecoder.eu/3.2"
	apiKey := "API_KEY"
	secretKey := "SECRET_KEY"
	id := "decode"
	vin := "WF0MXXGBWM8R43240"

	// vin, id, API Key and Secret Key
	s := vin + "|" + id + "|" + apiKey  + "|" + secretKey

	h := sha1.New()
	h.Write([]byte(s))
	bs := h.Sum(nil)

	controlSum := hex.EncodeToString(bs[0:5])

	// url with API access
	url := apiPrefix + "/" + apiKey + "/" + controlSum + "/" + id + "/" + vin + ".json"

	resp, err := http.Get(url)
	if err != nil {
		log.Println("URL is incorrect", err)
	}

	// decode JSON from response body
	var data map[string]interface{}
	err = json.NewDecoder(resp.Body).Decode(&data)
	if err != nil {
		log.Println("Unable to decode", err)
	}
	defer resp.Body.Close()

	fmt.Print(data)
}
