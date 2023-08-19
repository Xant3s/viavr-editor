import pandas as pd
import json
import requests

missing_values = ['na', '--', '?', '-', 'None', 'none', 'non', 'NaN']
template_master = pd.read_csv("./rs-server/DummyDatasets/template_dataset.csv", na_values=missing_values)
asset_master = pd.read_csv("./rs-server/DummyDatasets/asset_dataset.csv", na_values=missing_values)

def computeUtilityMatrixCB(items, filename):
    """
        Creates a utility matrix from the items and category dataframes
        Returns Item x Category matrix

        Content Based RS does not need information on users. 
    """
    # To separate the themes
    items['theme'] = items.theme.astype(str).str.split('|')

    # Copying the items dataframe
    utilityMatrixCB = items.copy(deep=True)

    x = []
    for index, row in items.iterrows():
        x.append(index)
        for genre in row['theme']:
            utilityMatrixCB.at[index, genre] = 1 

    utilityMatrixCB = utilityMatrixCB.fillna(0)

    # utilityMatrixCB.to_csv("./cs/stage1/"+filename+".csv")
    print("\n"+filename+" created\n")

    utilityMatrixCB = utilityMatrixCB.drop('name', axis=1)
    utilityMatrixCB = utilityMatrixCB.drop('theme', axis=1)

    print(utilityMatrixCB.head(10))

    return utilityMatrixCB

#############################################################################################

def fetchFromSketchfab(query):
    """ Fetches models from Sketchfab using the API """
    # API reference: https://docs.sketchfab.com/data-api/v3/index.html#!/collections/get_v3_collections

    url = 'https://api.sketchfab.com/v3/search?type=collections&q=' + query

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
                'name': model['name']
                #'url': model['viewerUrl']
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

#############################################################################################

def fetchFromCollectionID(query):
    """ Fetches models from Sketchfab using the API """
    # API reference: https://docs.sketchfab.com/data-api/v3/index.html#!/collections/get_v3_collections

    url = 'https://api.sketchfab.com/v3/search?type=collections&q=' + query

    # Send a GET request to the API endpoint
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()

        # Get the collection ID from the first result (if any)
        if len(data['results']) > 0:
            collection_id = data['results'][0]['uid']
            return collection_id
        else:
            return None
    else:
        # Print an error message
        print('Error: {}'.format(response.status_code))
        return None