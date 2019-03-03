import http.client, urllib.request, urllib.parse, urllib.error, base64
import requests, json

#js2py,

################################################################################
#this defines a Store class to store the data that we need related to each store
################################################################################

class Store:
    def __init__(self, longitude, latitude, number, type, name):
        self.longitude = longitude
        self.latitude = latitude
        self.type = type
        self.number = number
        self.name = name

    def __repr__(self):
        return str(self.longitude) + " and " + str(self.latitude)

##########################################################################
#Comparing the users location to stores' location to find closest one
##########################################################################

def closestStore(stores, userLong, userLat):


    return closestStoreNum

######################
#fetching store data
######################

headers = {"Subscription-Key": "93e653b15a1f4f68b4687fac88c4584a"}

params = urllib.parse.urlencode({
})

def main():

    try:
        #stores/ <insert a number here for one store> ?api
        connection = http.client.HTTPSConnection('api.wegmans.io')
        """ this is what /stores returns
        {
            "stores": [
                {
                  "_links": [
                    {
                      "href": "/stores/1?api-version=2018-10-18",
                      "rel": "self",
                      "type": "GET"
                    }
                  ],
                  "latitude": 43.13316,
                  "longitude": -76.2232,
                  "name": "JOHN GLENN",
                  "number": 1,
                  "type": "Wegmans Store"
                },
                {...}
            ]
        }
        """
        connection.request("GET", "/stores/?api-version=2018-10-18&%s" % params, "{body}", headers)
        response = connection.getresponse()
        data = response.read()

    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))

    data = data.decode('utf8').replace("'", '"')
    jsonData = json.loads(data)
    stores = []

    for store in jsonData["stores"]:
        stores.append(Store(store["latitude"], store["longitude"], store["number"], store["type"], store['name']))
        #print(store)

        # 43.06729 and -77.61175
    for store in stores:
        if store.longitude == 43.06729:
            print("Store near Rochester Number: " + str(store.number))

    for store in stores:
        if store.type != "Wegmans Store":
            stores.remove(store)

    #print(sorted(stores, key = lambda store: (store.latitude,store.longitude)))

    location = open('userLocation.json').read()
    data = json.loads(location)
    entry = data['entry']
    info = entry[0]
    messaging = info['messaging']
    moreinfo = messaging[0]
    message = moreinfo['message']
    attachments = message['attachments']
    importantAttachments = attachments[0]
    payload = importantAttachments['payload']
    coords = payload['coordinates']
    userLong = coords['long']
    userLat = coords['lat']
    print("Users Longitude: " + str(userLong))
    print("Users Latitude: " + str(userLat))

    closestLong = 200;
    closestLat = 200;
    closestStoreNum = '';
    nameOfStore = ''

    for store in stores:
        long = 0;
        lat = 0;
        long = abs(float(userLong) - float(store.longitude))
        lat = abs(float(userLat) - float(store.longitude))

        if closestLong > long and closestLat > lat:
            closestLong = long
            closestLat = lat
            closestStoreNum = store.number
            nameOfStore = store.name

    print("Number of the store closest to the user: " + str(closestStoreNum))
    print("Name of the store: " + nameOfStore)

    connection.close()

main()
