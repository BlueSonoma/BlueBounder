import json
import os.path
import pathlib
import re

from PIL import Image as im

import flask
from flask import Flask, jsonify
from Magic import *

from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# This is the api route used by the front end to create our basic images. A csv file path is provided by the user
# through a html form which is then extracted by request.form['csvFilePath'] and used to create the images. These
# images are stored in directories which is the directories do not exist initially will then be created.
@app.route('/create_starter_images', methods=['POST'])
def read_and_create():
    print("Creating starter images...")
    session = flask.request.form['sessionName']
    filepath = flask.request.form['csvFilePath']
    Sessions = 'Sessions/'
    session = Sessions + session
    Euler_dir = session + '/Euler_Images'
    Chem_dir = session + '/Chemical_Images'

    if not os.path.exists(Sessions):
        os.makedirs(Sessions)
    if not os.path.exists(session):
        os.makedirs(session)
    if not os.path.exists(Euler_dir):
        os.makedirs(Euler_dir)
    if not os.path.exists(Chem_dir):
        os.makedirs(Chem_dir)

    print(f'File: {filepath}')

    try:
        with open(filepath, 'r') as file:
            max_chemicals = find_max_of_chem(file)

            print("getting chemicals")
            euler_image = get_phase_color(file)
            print("saving euler image")
            print(euler_image.dtype)
            print(euler_image.min(), euler_image.max())
            euler_image = (euler_image * 255).astype(np.uint8)
            imageio.imwrite(Euler_dir + '/euler_phase.png', euler_image)

            print("getting AL")
            AL_img = get_chem(file, max_chemicals, chemical=0)
            print("getting CA")
            CA_img = get_chem(file, max_chemicals, chemical=1)
            print("getting NA")
            NA_img = get_chem(file, max_chemicals, chemical=2)
            print("getting FE")
            FE_img = get_chem(file, max_chemicals, chemical=3)
            print("getting SI")
            SI_img = get_chem(file, max_chemicals, chemical=4)
            print("getting K")
            K_img = get_chem(file, max_chemicals, chemical=5)

            print("converting images")
            # Convert the arrays to uint8 arrays with values in the range 0-255
            AL_img_uint8 = AL_img.astype(np.uint8)
            CA_img_uint8 = CA_img.astype(np.uint8)
            NA_img_uint8 = NA_img.astype(np.uint8)
            FE_img_uint8 = FE_img.astype(np.uint8)
            SI_img_uint8 = SI_img.astype(np.uint8)
            K_img_uint8 = K_img.astype(np.uint8)

            print("saving images")
            # Now you can save the arrays as images
            imageio.imwrite(Chem_dir + '/AL_fromFile.png', AL_img_uint8)
            imageio.imwrite(Chem_dir + '/CA_fromFile.png', CA_img_uint8)
            imageio.imwrite(Chem_dir + '/NA_fromFile.png', NA_img_uint8)
            imageio.imwrite(Chem_dir + '/FE_fromFile.png', FE_img_uint8)
            imageio.imwrite(Chem_dir + '/SI_fromFile.png', SI_img_uint8)
            imageio.imwrite(Chem_dir + '/K_fromFile.png', K_img_uint8)

        return jsonify("Images created successfully", 200)
    except Exception as e:
        return jsonify(e, 500)


@app.route('/clean_chem_img', methods=['POST'])
def clean_chemistry():
    print("Cleaning chemical images...")

    case = flask.request.form['case']
    threshold = flask.request.form['threshold']

    Chemistry_directory_reduced = 'Chemical_images/reduced/'
    # Create the directory if it does not exist
    if not os.path.exists(Chemistry_directory_reduced):
        os.makedirs(Chemistry_directory_reduced)

        # SI_img = SI_img*255
        # AL_img = AL_img*255
        # CA_img = CA_img*255
        # FE_img = FE_img*255
        # K_img = K_img*255
        # NA_img = NA_img*255

        def SI():
            SI_img = io.imread('Chemical_Images/SI_fromFile.png')

            SI_img = SI_img / 255
            SI_img[SI_img < 0.5] = 0
            SI_img[SI_img > 0.5] = 1

            SI_img = io.imread('Chemical_Images/SI_fromFile.png')
            SI_img = SI_img / 255
            SI_img[SI_img < 0.5] = 0
            max_SI_img = my_modal_filter(SI_img)
            max_SI_img = reduce_area(max_SI_img, 100)
            SI_img = im.fromarray(max_SI_img.astype(np.uint8), mode="L")
            SI_img.save(Chemistry_directory_reduced + "SI_img.png")
            print("Done with SI")
            return "SI"

        def AL():
            AL_img = io.imread('Chemical_Images/AL_fromFile.png')

            AL_img = AL_img / 255
            AL_img[AL_img < 0.2] = 0
            AL_img[AL_img > 0.2] = 1

            max_AL_img = my_modal_filter(AL_img)
            max_AL_img = reduce_area(max_AL_img, 100)
            AL_img = im.fromarray(max_AL_img.astype(np.uint8), mode="L")
            AL_img.save(Chemistry_directory_reduced + "AL_img.png")
            print("Done with AL")
            return "SI"

        def CA():
            CA_img = io.imread('Chemical_Images/CA_fromFile.png')
            CA_img = CA_img / 255
            CA_img[CA_img < 0.2] = 0
            CA_img[CA_img > 0.2] = 1

            max_CA_img = my_modal_filter(CA_img)
            max_CA_img = reduce_area(max_CA_img, 100)
            CA_img = im.fromarray(max_CA_img.astype(np.uint8), mode="L")
            CA_img.save(Chemistry_directory_reduced + "CA_img.png")
            print("Done with CA")
            return "SI"

        def FE():
            FE_img = io.imread('Chemical_Images/FE_fromFile.png')
            FE_img = FE_img / 255
            FE_img[FE_img < 0.2] = 0
            FE_img[FE_img > 0.2] = 1

            max_FE_img = my_modal_filter(FE_img)
            max_FE_img = reduce_area(max_FE_img, 100)
            FE_img = im.fromarray(max_FE_img.astype(np.uint8), mode="L")
            FE_img.save(Chemistry_directory_reduced + "FE_img.png")
            print("Done with FE")
            return "FE"

        def K():
            K_img = io.imread('Chemical_Images/K_fromFile.png')
            K_img = K_img / 255

            K_img[K_img < 0.2] = 0
            K_img[K_img > 0.2] = 1

            max_K_img = my_modal_filter(K_img)
            max_K_img = reduce_area(max_K_img, 100)
            K_img = im.fromarray(max_K_img.astype(np.uint8), mode="L")
            K_img.save(Chemistry_directory_reduced + "K_img.png")
            print("Done with K")
            return "K"

        def NA():
            NA_img = io.imread('Chemical_Images/NA_fromFile.png')
            NA_img = NA_img / 255

            NA_img[NA_img < 0.2] = 0
            NA_img[NA_img > 0.2] = 1

            max_NA_img = my_modal_filter(NA_img)
            max_NA_img = reduce_area(max_NA_img, 100)
            NA_img = im.fromarray(max_NA_img.astype(np.uint8), mode="L")
            NA_img.save(Chemistry_directory_reduced + "NA_img.png")
            print("Done with NA")
            return "NA"

        switch = {
            0: SI,
            1: AL,
            2: CA,
            3: FE,
            4: K,
            5: NA
        }


@app.route('/get_Sessions', methods=['GET'])
def getSessions():
    print("Getting sessions...")
    try:
        Sessions = 'Sessions/'
        session_list = os.listdir(Sessions)
        session_json = [{"label": name} for name in session_list]
        return json.dumps(session_json), 200
    except Exception as e:
        return str(e), 500


if __name__ == '__main__':
    app.run(port=8000, debug=True)
