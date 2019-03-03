import json
import requests

def main():
    search = input("What item are you looking for? ")
    searchResult = requests.get("https://api.wegmans.io/products/search?query=" + search + "&api-version=2018-10-18&subscription-key=f8d017e8fbe7429a9bd8e1ba49131ce1")
    searchResult.text
    searchResult.json()
    print(searchResult.text)
main()
