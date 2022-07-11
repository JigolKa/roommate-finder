import lib
from flask import Flask, jsonify, request
import json
app = Flask(__name__)

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


if __name__ == '__main__':
    app.run()
