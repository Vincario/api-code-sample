#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Sign up and request API key at https://vindecoder.eu/api/#request-free-trial-api-key
See API documentation at https://vindecoder.eu/my/api/latest/docs
"""

import json
import requests
import hashlib

vin = "WF0MXXGBWM8R43240"

apiKey = "API_KEY"
secretKey = "API_SECRET"

apiPrefix = "https://api.vindecoder.eu/3.2"
id = "decode"

controlSum = hashlib.sha1((vin.upper()+"|"+id+"|"+apiKey+"|"+secretKey).encode('utf-8')).hexdigest()[:10]
url = apiPrefix+"/"+apiKey+"/"+controlSum+"/decode/"+vin.upper()+".json"

json_data = requests.get(url).json()
print(json_data)
