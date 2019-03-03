import http.client, urllib.request, urllib.parse, urllib.error, base64, requests, json

recipeItem = input("what ingredient would you like to find recipes for?: ")
numOfRecipes = input("how many results do you want to see?: ")
page = input("what page? (starts at 1): ")

headers = {'Subscription-Key': '93e653b15a1f4f68b4687fac88c4584a'}

params = urllib.parse.urlencode({
    # Request parameters
    'results': numOfRecipes,
    'page': page,
})

class Recipe:
    def __init__(self, id, name):
        self.id = id
        self.name = name

def main():
    try:
        connection = http.client.HTTPSConnection('api.wegmans.io')
        connection.request("GET", "/meals/recipes/search?query=" + recipeItem + "&api-version=2018-10-18&%s" % params, "{body}", headers)
        response = connection.getresponse()
        data = response.read()
        data = data.decode('utf8')
        jsonData = json.loads(data)
        recipes = []
        for recipe in jsonData['results']:
            recipes.append(Recipe(recipe['id'], recipe['name']))

        for item in recipes:
            print(item.name)


    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))

main()
