from flask import Flask, request
import requests
from geolib import geohash
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/events',methods=['GET'])
def events():

    keyword=request.args['keyword']
    distance=request.args['distance']
    category=request.args['category']
    latitude=request.args['latitude']
    longitude=request.args["longitude"]
    apikey= 'tl9YgQAGCVrRhB9RGEJCjae9oIMtImav'

    geopoint = geohash.encode(latitude, longitude, 7)
    # print("d",distance)
    # print(longitude,latitude)

    if category=='empty':
        r = requests.get(f'https://app.ticketmaster.com/discovery/v2/events.json?apikey={apikey}&keyword={keyword}&radius={distance}&unit=miles&geoPoint={geopoint}')
    else:
        r = requests.get(f'https://app.ticketmaster.com/discovery/v2/events.json?apikey={apikey}&keyword={keyword}&segmentId={category}&radius={distance}&unit=miles&geoPoint={geopoint}')

    return r.json()


@app.route('/event_details')
def event_details():

    apikey= 'tl9YgQAGCVrRhB9RGEJCjae9oIMtImav'
    event_id=request.args['event_id']
    
    r = requests.get(f'https://app.ticketmaster.com/discovery/v2/events/{event_id}?apikey={apikey}')

    return r.json()


@app.route('/venue')
def venue():

    apikey= 'tl9YgQAGCVrRhB9RGEJCjae9oIMtImav'
    venue=request.args['venue']
    r = requests.get(f'https://app.ticketmaster.com/discovery/v2/venues?apikey={apikey}&keyword={venue}')

    return r.json()




if __name__ == "__main__":
    app.run(debug=False,port=8083)