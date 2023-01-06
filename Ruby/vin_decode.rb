# Sign up and request API key at https://vindecoder.eu/api/#request-free-trial-api-key
# See API documentation at https://vindecoder.eu/my/api/latest/docs

require 'digest'
require 'httparty'

api_prefix = "https://api.vindecoder.eu/3.2"
api_key = "API_KEY"
secret_key = "SECRET_KEY"
id = "decode"
vin = "WF0MXXGBWM8R43240"

control_sum = Digest::SHA1.hexdigest("#{vin}|#{id}|#{api_key}|#{secret_key}")[0..9]
result = HTTParty.get("#{api_prefix}/#{api_key}/#{control_sum}/decode/#{vin}.json")