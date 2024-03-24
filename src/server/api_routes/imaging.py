import os.path

import flask
from flask import Blueprint, jsonify
from skimage import io

from src.imaging.Magic import clean_chemistry
from src.imaging.segmentation.utils import create_directory

api = Blueprint('imaging', __name__)

NULL = 'null'


@api.route('/clean_chem_img', methods=['POST'])
def api__clean_chemistry():
    case = flask.request.form['case']
    threshold = flask.request.form['threshold']
    clean_chemistry()


@api.route('/exec_segmentation', methods=['POST'])
def api__exec_segmentation():
    from src.imaging.segmentation.segmentation import segment_boundaries

    chem_image_path = flask.request.form['chemImagePath']
    scale = flask.request.form['scale']
    sigma = flask.request.form['sigma']
    min_size = flask.request.form['minSize']
    outline_color = flask.request.form['outlineColor']
    label = flask.request.form['label']
    uniform_label = flask.request.form['uniformLabel']
    overlay = flask.request.form['overlay']
    band_image_path = flask.request.form['bandImagePath']
    label_color = flask.request.form['labelColor']
    label_opacity = flask.request.form['labelOpacity']
    output_path = flask.request.form['outputPath']
    output_filename = flask.request.form['outputFilename']

    create_directory(output_path)

    try:
        chemImage = io.imread(chem_image_path)
        bandImage = io.imread(band_image_path)
        segmented = segment_boundaries(chemImage,
                                       scale=int(scale),
                                       sigma=float(sigma),
                                       min_size=int(min_size),
                                       outline_color=outline_color,
                                       label=bool(label),
                                       label_uniform=bool(uniform_label),
                                       overlay=bool(overlay),
                                       overlay_image=bandImage,
                                       label_color=label_color,
                                       label_opacity=float(label_opacity)
                                       )
        path = os.path.join(output_path, output_filename + '.png')
        io.imsave(path, segmented)
        return jsonify(path, 200)
    except Exception as e:
        print(str(e))
        return str(e), 500


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
