from flask import request, jsonify
from utils import template_master, computeUtilityMatrixCB
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import requests
from session_management import basic_data

def template():
    # Dataset management
    template_copy = template_master.copy(deep=True)
    session_profile = [] # Use this variable to store session profile
    errors = [] # Use this variable to store errors
    
    # Data from user
    # TODO: Build up user profile throughout the session
    dataForTemplate = request.get_json() # Get data from user
    print("\nData from user: \n")
    print(dataForTemplate)
    user_domain = dataForTemplate['session']['t_domain'] # Rehab/Therapy
    user_theme = dataForTemplate['session']['t_theme'] # Occuppational/Physical/Speech
    user_keyword = dataForTemplate['session']['t_keyword'] # Gait
    
    basic_data(user_domain,user_theme,user_keyword) # Store data in session.json

    # Return error message if no data is received
    if dataForTemplate is None:
        return "error': 'No data received"

    print("\nComplete template dataset: \n")
    print(template_copy.head(10))

    """ template_df = template_copy[template_copy['domain'].str.contains(user_domain, na=False)]
    template_df = template_df[template_df['theme'].str.contains(user_theme, na=False)] """
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

    return jsonify(response)