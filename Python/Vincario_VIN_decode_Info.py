#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Sign up at https://vincario.com/create-account/ and request API keys
See API documentation at https://vincario.com/api-docs/3.2/
"""

import json
import requests
import hashlib

vin = "WF0MXXGBWM8R43240"

apiKey = "API_KEY"
secretKey = "API_SECRET"

apiPrefix = "https://api.vincario.com/3.2"
id = "info"

controlSum = hashlib.sha1((vin.upper()+"|"+id+"|"+apiKey+"|"+secretKey).encode('utf-8')).hexdigest()[:10]
url = apiPrefix+"/"+apiKey+"/"+controlSum+"/decode/info/"+vin.upper()+".json"

json_data = requests.get(url).json()
print(json_data)