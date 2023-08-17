# For server
from flask import Flask, request, jsonify

# For RS
import pandas as pd
import json
from sklearn.metrics.pairwise import cosine_similarity

import requests

app = Flask(__name__)

missing_values = ['na','--','?','-','None','none','non','NaN']
asset_master = pd.read_csv("./DummyDatasets/asset_dataset.csv", na_values = missing_values)



def fetchFromSketchfab(query):
    """ Fetches models from Sketchfab using the API """

    url = 'https://api.sketchfab.com/v3/search?type=models&q=' + query

    # Send a GET request to the API endpoint
    response = requests.get(url)

    model_list = []

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        
        # Print the results
        for model in data['results']:
            model_data = {
                'id': model['uid'],
                'name': model['name'],
                'url': model['viewerUrl']
            }
            model_list.append(model_data)
        # Convert the list to a JSON string
        model_json = json.dumps(model_list)

        # Return the JSON string
        return model_json
    else:
        # Print an error message
        print('Error: {}'.format(response.status_code))
        return 'Error'

def assetRS(query):
    
    return 'Under development'

@app.route('/sketchfab', methods=['POST'])
def sketchfab():
    dataForAsset = request.get_json() # Get data from user

    query = dataForAsset['t_domain'] 
    
    return fetchFromSketchfab(query)
if __name__ == '__main__':
    app.run(port=5000, debug=True)