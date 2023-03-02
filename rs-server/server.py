""" 
TODO:
MAJOR: Set priority - keyword, theme, domain?
1. Use env variables for the file paths and other variables
2. Check on the similarity measure
3. DB?
4. Use logging
5. How to represent the data on the frontend?
"""

# For server
from flask import Flask, request, jsonify

# For RS
import pandas as pd
import json
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

missing_values = ['na','--','?','-','None','none','non','NaN']
template_master = pd.read_csv("./DummyDatasets/template_dataset.csv", na_values = missing_values)

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

@app.route('/template', methods=['POST'])
def template():
    # Dataset management
    template_copy = template_master.copy(deep=True)
    session_profile = [] # Use this variable to store session profile
    
    # Data from user
    # TODO: Build up user profile throughout the session
    dataForTemplate = request.get_json() # Get data from user
    print("\nData from user: \n")
    print(dataForTemplate)
    user_domain = dataForTemplate['session']['t_domain'] # Rehab/Therapy
    user_theme = dataForTemplate['session']['t_theme'] # Occuppational/Physical/Speech
    user_keyword = dataForTemplate['session']['t_keyword'] # Gait

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
                "theme": row['theme']
            })
        print("\nSession profile: ", session_profile)
    else:
        print("No exact match found")

    templateUM = computeUtilityMatrixCB(template_df, "utilityMatrixCB")
    print("\nHeaders: ", templateUM.columns)


    # User profile: Get input from user
    # Create an empty dataframe with the same columns as the utility matrix
    user_profile = pd.DataFrame(columns=templateUM.columns)
    # Add an entry to the user profile
    user_profile.loc[0] = [0 for i in range(len(user_profile.columns))]
    # Add the user's input to the user profile
    user_profile[user_theme] = 1
    print("\nUser profile: \n", user_profile)

    # Compute similarity between user profile and utility matrix
    similarity = cosine_similarity(user_profile, templateUM)

    # Add the first 5 most similar items to the json object
    for i in range(5):
        most_similar_item_index = similarity.argsort()[0][-i]
        most_similar_item = template_copy.iloc[most_similar_item_index]
        session_profile.append({
            "name": most_similar_item['name'],
            "theme": most_similar_item['theme']
        })

    print("\nSession profile: ", session_profile)
    return jsonify(session_profile)

if __name__ == '__main__':
    app.run(port=5000, debug=True)