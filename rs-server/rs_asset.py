from flask import request, jsonify
from utils import asset_master, fetchFromSketchfab,fetchFromCollectionID, computeUtilityMatrixCB, template_master
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import requests

""" def asset():
    # Need to perform collaborative filtering on the asset dataset
    # query should contain a set of keywords
    # The response JSON can have uid (label), and name (value)

    dataForAsset = request.get_json() # Get data from user

    query = dataForAsset['session']['t_domain'] 
    
    return fetchFromSketchfab(query) """


def asset():
    # Dataset management
    asset_copy = asset_master.copy(deep=True)
    session_profile = [] # Use this variable to store session profile
    errors = [] # Use this variable to store errors
    """ session_data = requests.post('http://localhost:5000/session', json={"session": {}}).json()
    print(session_data)
    return jsonify(session_data) """

    dataForAssets = requests.post('http://localhost:5000/session', json={"session": {}}).json() # Get data from user 
    print("\nData from user for assets: \n")

    try:
        user_domain = dataForAssets['domain'] # Rehab/Therapy
        user_theme = dataForAssets['theme'] # Occuppational/Physical/Speech
        user_keyword = dataForAssets['keyword'] # Gait
    except:
        user_domain = "Therapy"
        user_theme = "Physical"
        user_keyword = "Walk"
    
    # We don not need exact asset matches but gathher keywords from the asset dataset
    
    asset_df = asset_copy[["name","theme"]]
    assetUM = computeUtilityMatrixCB(asset_df, "utilityMatrixCB_asset")
    print("\nHeaders: ", assetUM.columns)

    user_asset_profile = pd.DataFrame(columns=assetUM.columns)
    # Add an entry to the user profile
    user_asset_profile.loc[0] = [0 for n in range(len(user_asset_profile.columns))]
    # Ads user theme preference to the user profile
    if(user_theme in user_asset_profile.columns):
        user_asset_profile[user_theme] = 1
    else:
        print("Asset not found in asset dataset")
        errors.append({
            "code": "AssetNA"
        })

    print("\nUser asset profile: \n", user_asset_profile)
    
    # Compute similarity between user profile and asset dataset
    similartiy = cosine_similarity(user_asset_profile, assetUM)

    # Get the top 5 similar assets
    for i in range(5):
        index = similartiy.argsort()[0][-i]
        recommeded_asset = asset_df.iloc[index]
        asset_dict = {
            "id": i,
            "name": recommeded_asset["name"],
            #"theme": recommeded_asset["theme"]
            "collection": fetchFromCollectionID(recommeded_asset["name"])
        }
        session_profile.append(asset_dict)


    response = {
        "assets": session_profile,
        "errors": errors
    }

    print("\nSession profile: ", session_profile)
    
    names_of_assets = [item['name'] for item in session_profile[:5]]

    print("\nNames of assets: ", names_of_assets)
    
    return jsonify(response)

    # return fetchFromSketchfab(user_theme)
    
    """    # Data from user
    dataForAssets = request.get_json() # Get data from user -  READ FROM SESSON.JSON
    print("\nData from user: \n")
    print(dataForAssets)
    user_domain = dataForAssets['t_domain'] # Rehab/Therapy
    user_theme = dataForAssets['t_theme'] # Occuppational/Physical/Speech
    user_keyword = dataForAssets['t_keyword'] # Gait
    
    basic_data(user_domain,user_theme,user_keyword) # Store data in session.json

    # Return error message if no data is received
    if dataForTemplate is None:
        return "error': 'No data received"

    print("\nComplete template dataset: \n")
    print(template_copy.head(10))

    # Perform a keyword search for exact match
    exact_match = template_copy[template_copy['keyword'].str.contains(user_keyword, na=False)]
    template_df = template_copy[["name","theme"]]

    # Add exact match to a json object
    if not exact_match.empty:
        for index, row in exact_match.iterrows():
            session_profile.append({
                "name": row['name'],
                "theme": row['theme'],
                "link": row['link']
            })
        print("\nSession profile: ", session_profile)
    else:
        print("No exact match found")
        errors.append({
            "code": "KeywordNA"
        })

    templateUM = computeUtilityMatrixCB(template_df, "utilityMatrixCB")
    print("\nHeaders: ", templateUM.columns)

    # User profile: Get input from user
    # Create an empty dataframe with the same columns as the utility matrix
    user_profile = pd.DataFrame(columns=templateUM.columns)
    # Add an entry to the user profile
    user_profile.loc[0] = [0 for i in range(len(user_profile.columns))]
    # Add the user's input to the user profile
    if(user_theme.capitalize() in user_profile.columns):
        user_profile[user_theme.capitalize()] = 1
    else:
        print("Theme not found in template dataset")
        errors.append({
            "code": "ThemeNA"
        })
        
    print("\nUser profile: \n", user_profile)

    # Compute similarity between user profile and utility matrix
    similarity = cosine_similarity(user_profile, templateUM)

    # Add the first 5 most similar items to the json object
    for i in range(5):
        most_similar_item_index = similarity.argsort()[0][-i]
        most_similar_item = template_copy.iloc[most_similar_item_index]
        item_dict = {
            "id": i,
            "name": most_similar_item['name'],
            "theme": most_similar_item['theme'],
            "link": most_similar_item['link']
        }
        session_profile.append(item_dict)
    
    response = {
        "templates": session_profile,
        "errors": errors
    }

    print("\nSession profile (json): ", response)

    return jsonify(response) """