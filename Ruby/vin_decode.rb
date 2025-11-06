# Sign up at https://vincario.com/create-account/ and request API keys
# See API documentation at https://vincario.com/api-docs/3.2/

require 'digest'
require 'httparty'

api_prefix = "https://api.vincario.com/3.2"
api_key = "API_KEY"
secret_key = "SECRET_KEY"
id = "decode"
vin = "WF0MXXGBWM8R43240"

control_sum = Digest::SHA1.hexdigest("#{vin}|#{id}|#{api_key}|#{secret_key}")[0..9]
result = HTTParty.get("#{api_prefix}/#{api_key}/#{control_sum}/decode/#{vin}.json")