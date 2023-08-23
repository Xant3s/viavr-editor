from flask import Flask, request, jsonify
from rs_template import template
from rs_asset import asset
from session_management import clear_session, auto_complete

# For RS

import json

# Session management 
clear_session()

print("Server: 082023 Running")

app = Flask(__name__)

# Template RS
@app.route('/template', methods=['POST'])
def template_route():
    return template()

@app.route('/asset', methods=['POST'])
def asset_route():
    return asset()

@app.route('/session', methods=['POST'])
def session_route():
    session_data = {}
    with open('./session.json') as f:
        session_data = json.load(f)
    return jsonify(session_data)

@app.route('/autocomplete', methods=['POST'])
def autocomplete_route():
    return auto_complete()

if __name__ == '__main__':
    app.run(port=5000, debug=True)