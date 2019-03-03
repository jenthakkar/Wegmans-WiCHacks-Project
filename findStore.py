import http.client, urllib.request, urllib.parse, urllib.error, base64
import requests, json

#js2py, 

################################################################################
#this defines a Store class to store the data that we need related to each store
################################################################################

class Store:
    def __init__(self, longitude, latitude, number, type):
        self.longitude = longitude
        self.latitude = latitude
        self.type = type
        self.number = number

    def __repr__(self):
        return str(self.longitude) + " and " + str(self.latitude)

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
        data = data.decode('utf8').replace("'", '"')
        jsonData = json.loads(data)

    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))

    stores = []

    for store in jsonData["stores"]:
        stores.append(Store(store["latitude"], store["longitude"], store["number"], store["type"]))

    connection.close()
    for store in stores:
        if store.type != "Wegmans Store":
            stores.remove(store)

    #print(sorted(stores, key = lambda store: (store.latitude,store.longitude)))
    location = open("userLocation.json")

main()
