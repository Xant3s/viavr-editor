import json
from flask import Flask, request, jsonify

# Session management
with open('session.json',"w") as f:
    session_data = json.load(f)

def clear_session():
    session_data = {}
    with open('session.json', 'w') as f:
        json.dump(session_data, f)

def basic_data(domain,theme,keyword):
    session_data['domain'] = domain
    session_data['theme'] = theme
    session_data['keyword'] = keyword
    with open('session.json', 'w') as f:
        json.dump(session_data, f)