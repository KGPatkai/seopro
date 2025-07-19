from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, static_folder='.', template_folder='.')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_files(filename):
    return send_from_directory('.', filename)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

@app.route('/blog/<path:filename>')
def serve_blog(filename):
    return send_from_directory('blog', filename)

@app.route('/case-study/<path:filename>')
def serve_case_study(filename):
    return send_from_directory('case-study', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)