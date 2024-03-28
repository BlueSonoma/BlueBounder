import os.path
import time

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
    from src.imaging.segmentation.segmentation import bounder_segmentation

    print('Preparing arguments...')
    band_contrast_path = flask.request.form['bandContrastPath']
    mask_path = flask.request.form['maskPath']
    border_color = flask.request.form['borderColor']
    overlay_opacity = flask.request.form['overlayOpacity']
    bc_scale = flask.request.form['bandContrastScale']
    bc_sigma = flask.request.form['bandContrastSigma']
    bc_min_size = flask.request.form['bandContrastMinSize']
    bc_outline_color = flask.request.form['bandContrastOutlineColor']
    mask_scale = flask.request.form['maskScale']
    mask_sigma = flask.request.form['maskSigma']
    mask_min_size = flask.request.form['maskMinSize']
    mask_outline_color = flask.request.form['maskOutlineColor']
    label_regions = flask.request.form['labelRegions']
    uniform_label = flask.request.form['uniformLabel']
    label_color = flask.request.form['labelColor']
    label_opacity = flask.request.form['labelOpacity']

    output_path = flask.request.form['outputPath']
    output_filename = flask.request.form['outputFilename']

    print('ok')

    print('Preparing output directory...')
    create_directory(output_path)
    print('ok')

    try:
        print('Reading band contrast image...')
        band_image = io.imread(band_contrast_path)
        print('ok')
        print('Reading mask image...')
        chem_image = io.imread(mask_path)
        print('ok')

        print('Executing segmentation...')
        start = time.time()
        segmented = bounder_segmentation(band_image,
                                         chem_image,
                                         border_color=border_color,
                                         overlay_opacity=float(overlay_opacity),
                                         label_regions=bool(label_regions),
                                         uniform_label=bool(uniform_label),
                                         label_color=label_color,
                                         label_opacity=float(label_opacity),
                                         bc_scale=float(bc_scale),
                                         bc_sigma=float(bc_sigma),
                                         bc_min_size=int(bc_min_size),
                                         bc_outline_color=bc_outline_color,
                                         mask_scale=float(mask_scale),
                                         mask_sigma=float(mask_sigma),
                                         mask_min_size=int(mask_min_size),
                                         mask_outline_color=mask_outline_color
                                         )

        print(f'completed in {time.time() - start} seconds')
        path = os.path.join(output_path, output_filename + '.png')

        print('Saving resulting image...')
        io.imsave(path, segmented)
        print('ok')

        print('Done')
        return jsonify(path, 200)
    except Exception as e:
        print()
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
