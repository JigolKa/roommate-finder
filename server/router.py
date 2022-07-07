import os
import lib
from flask import Flask, jsonify, request, flash, redirect, url_for
import json
from werkzeug.utils import secure_filename
app = Flask(__name__)

app.config["UPLOAD_FOLDER"] = "./uploads"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/images/<term>')
def images(term):

    response = lib.googleimagesdownload()

    limit = request.args.get('limit')

    arguments = {"keywords": term + " landscape", "limit": limit or 1,
                 "no_download": True, "exact_size": "640,480",
                 "print_urls": True,
                 "safe_search": True, "usage_rights": "labeled-for-nocommercial-reuse",
                 "type": "photo"}
    paths = response.download(arguments)

    # here you could use make_response(render_template(...)) too
    resp = jsonify(paths[0])
    resp.headers['Access-Control-Allow-Origin'] = '*'

    return resp


@app.route('/country/<term>/cities')
def get_cities(term):
    data = json.load(open('geo-data/cities.json', 'r'))

    code = request.args.get('code')

    cities = []

    for country in data:
        if code:
            if country[code] == term:
                city = [city['name'] for city in country['cities']]
                cities.append(city)

        else:
            if country['name'] == term:
                city = [city['name'] for city in country['cities']]
                cities.append(city)

    response = jsonify(cities)

    response.headers['Access-Control-Allow-Origin'] = '*'

    return response


@app.route("/upload", methods=["POST"])
def upload():
    data = None
    if 'file' not in request.files or file.filename == '':
        data = {"error": "no files"}

    file = request.files['file']

    if file and allowed_file(file.filename):
        data = {"cool": "coll"}
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    response = jsonify(data)

    response.headers['Access-Control-Allow-Origin'] = '*'

    return "response"


if __name__ == '__main__':
    app.run(debug=True)
