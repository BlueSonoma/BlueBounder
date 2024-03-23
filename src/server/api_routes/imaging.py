import flask
from flask import Blueprint, jsonify
from skimage import io

from src.imaging.Magic import clean_chemistry

api = Blueprint('imaging', __name__)

NULL = 'null'


@api.route('/clean_chem_img', methods=['POST'])
def api__clean_chemistry():
    case = flask.request.form['case']
    threshold = flask.request.form['threshold']
    clean_chemistry()


@api.route('/sample_pixel', methods=['GET'])
def api__sample_pixel(path: str, x: float | int = None, y: float | int = None):
    # Sample a pixel value (rgba) at coords (x,y)
    try:
        image = io.imread(path)
        r = image[x:y:0]
        g = image[x:y:1]
        b = image[x:y:2]
        a = image[x:y:3]
        data = [r, g, b, a]
        return jsonify(data, 200)
    except Exception as e:
        return str(e), 500


@api.route('/get_alpha', methods=['GET'])
def api__get_alpha():
    path = flask.request.args.get('path')
    print(f'Path: {path}')
    try:
        image = io.imread(path)
        print(f'Shape: {image.shape}')
        if image.shape[2] > 3:  # Check if image has at least 4 channels (RGBA)
            data = image[0, 0, :]  # Accessing first pixel's RGBA values
            print(f'Data: {data}')
            return jsonify({'data': data.tolist()[3]})
        return jsonify({'data': NULL})
    except Exception as e:
        return str(e), 500


@api.route('/set_alpha', methods=['POST'])
def api__set_alpha():
    path = flask.request.form['path']
    value = flask.request.form['value']
    print(f'Path: {path}')
    print(f'Value: {value}')
    try:
        image = io.imread(path)
        print(f'Shape: {image.shape}')
        if image.shape[2] > 3:  # Check if image has at least 4 channels (RGBA)
            image[:, :, 3] = value
            io.imsave(path, image)
        return jsonify(200)
    except Exception as e:
        return str(e), 500
