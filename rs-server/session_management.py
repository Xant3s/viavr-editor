import json
from flask import Flask, request, jsonify
from utils import template_master

# Session management
""" with open('./session.json',"w") as f:
    session_data = json.load(f) """

def clear_session():
    session_data = {}
    with open('./session.json', 'w') as f:
        f.write(json.dumps(session_data))

def basic_data(domain,theme,keyword):
    session_data = {
        'domain': '',
        'theme': '',
        'keyword': ''
    }
    session_data['domain'] = domain
    session_data['theme'] = theme
    session_data['keyword'] = keyword
    with open('./session.json', 'w') as f:
        f.write(json.dumps(session_data))

def auto_complete():
    domain_list = template_master['domain'].unique().tolist()
    theme_list = template_master['theme'].unique().tolist()

    merged_list = {
        'domains': domain_list,
        'themes': theme_list
    }
    
    return (jsonify(merged_list))