########### Python 3.6 #############
import requests

appid = '60340f5f-99c1-4043-8ab9-c810ff16252d'

headers = {
    # Request headers
    'Ocp-Apim-Subscription-Key': '03e69d3426dd44a8824163114261cc26',
}

params ={
    # Query parameter
    'q': 'turn on the left light',
    # Optional request parameters, set to default values
    'timezoneOffset': '0',
    'verbose': 'false',
    'spellCheck': 'false',
    'staging': 'false',
}

try:
    r = requests.get('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/' + appid,headers=headers, params=params)
    print(r.json())

except Exception as e:
    print("[Errno {0}] {1}".format(e.errno, e.strerror))

####################################