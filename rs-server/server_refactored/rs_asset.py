from flask import request, jsonify
from utils import template_master, fetchFromSketchfab
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import requests

def asset():
    dataForAsset = request.get_json() # Get data from user

    query = dataForAsset['session']['t_domain'] 
    
    return fetchFromSketchfab(query)