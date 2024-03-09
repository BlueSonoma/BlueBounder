import json
import os.path

import flask
import imageio
import numpy as np
from flask import Blueprint, jsonify

from src.imaging.Magic import *
from src.server.api_routes import project_root_dir

api = Blueprint('sessions', __name__)


# This is the api route used by the front end to create our basic images. A csv file path is provided by the user
# through a html form which is then extracted by request.form['csvFilePath'] and used to create the images. These
# images are stored in directories which is the directories do not exist initially will then be created.
@api.route('/create_starter_images', methods=['POST'])
def api__read_and_create():
    print("Creating starter images...")
    session = flask.request.form['sessionName']
    original_name = session
    filepath = flask.request.form['csvFilePath']
    Sessions = f'{project_root_dir}/Sessions/'
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

            create_session_JSON_and_return(session, original_name, filepath, ' ')
            create_folder_structure_json(original_name)

        return jsonify("Images created successfully", 200)
    except Exception as e:
        return jsonify(e, 500)


@api.route('/get_sessions', methods=['GET'])
def api__getSessions():
    print("Getting sessions...")
    try:
        Sessions = f'{project_root_dir}/Sessions/'
        session_list = os.listdir(Sessions)
        session_json = [{"label": name} for name in session_list]
        return json.dumps(session_json), 200
    except Exception as e:
        return str(e), 500


@api.route('/get_session_Info', methods=['GET'])
def api__getSessionJSON():
    try:
        session = flask.request.args.get('sessionName')
        print(f"Getting session info for {session}...")
        cur_directory = f'{project_root_dir}/Sessions/'
        sessionJSON = cur_directory + session + '/session.json'
        _JSON = get_session_JSON(sessionJSON)

        return jsonify(_JSON, 200)
    except Exception as e:
        return str(e), 500


@api.route('/get_session_Folder', methods=['GET'])
def api__getSessionFolderJSON():
    try:
        session = flask.request.args.get('sessionName')
        cur_directory = f'{project_root_dir}/Sessions/'
        sessionJSON = cur_directory + session + '/session.json'
        _JSON = create_folder_structure_json(sessionJSON)

        return jsonify(_JSON, 200)
    except Exception as e:
        return str(e), 500


@api.route('/get_session_images', methods=['GET'])
def api__getSessionImages():
    session_name = flask.request.args.get('sessionName')
    curr_dir = f'{project_root_dir}/Sessions'
    session_dir = os.path.join(curr_dir, session_name)

    files = []

    def collect_images_rec(dir):
        for file in os.listdir(dir):
            filepath = os.path.join(dir, file)
            if file.endswith(".png") or file.endswith('.jpg'):
                print(file)
                files.append(filepath)
            elif not os.path.isfile(filepath):
                collect_images_rec(filepath)

    try:
        collect_images_rec(session_dir)
        return jsonify(files, 200)
    except Exception as e:
        return str(e), 500
