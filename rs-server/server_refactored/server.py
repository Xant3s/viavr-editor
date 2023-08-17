from flask import Flask, request, jsonify
from rs_template import template
from rs_asset import asset
from session_management import clear_session

# For RS

import json

# Session management 
clear_session()

print("Refactored server is running...")

app = Flask(__name__)

# Template RS
@app.route('/template', methods=['POST'])
def template_route():
    return template()

@app.route('/asset', methods=['POST'])
def asset_route():
    return asset()

if __name__ == '__main__':
    app.run(port=5000, debug=True)