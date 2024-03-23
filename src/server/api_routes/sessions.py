import os.path

import flask
from flask import Blueprint, jsonify
from concurrent.futures import ThreadPoolExecutor

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
    file = flask.request.form['csvFilePath']
    Sessions = f'{project_root_dir}/Sessions/'
    session = os.path.join(Sessions, session)
    Euler_dir = os.path.join(session, '/Euler_Images')
    Chem_dir = os.path.join(session, '/Chemical_Images')
    bandsPath = os.path.join(session, '/Bands/')

    if not os.path.exists(Sessions):
        os.makedirs(Sessions)
    if not os.path.exists(session):
        os.makedirs(session)
    if not os.path.exists(Euler_dir):
        os.makedirs(Euler_dir)
    if not os.path.exists(Chem_dir):
        os.makedirs(Chem_dir)
    if not os.path.exists(bandsPath):
        os.makedirs(bandsPath)
    print(f'File: {file}')

    try:

        max_chemicals = find_max_of_chem(file)

        with ThreadPoolExecutor() as executor:
            euler = executor.submit(get_phase_color, file, Euler_dir)
            band = executor.submit(get_band_con, file, bandsPath)
            AL = executor.submit(get_chem, file, Chem_dir, max_chemicals, 0)
            CA = executor.submit(get_chem, file, Chem_dir, max_chemicals, 1)
            NA = executor.submit(get_chem, file, Chem_dir, max_chemicals, 2)
            FE = executor.submit(get_chem, file, Chem_dir, max_chemicals, 3)
            SI = executor.submit(get_chem, file, Chem_dir, max_chemicals, 4)
            K = executor.submit(get_chem, file, Chem_dir, max_chemicals, 5)

        create_session_JSON_and_return(session, original_name, file, ' ')
        create_folder_structure_json(original_name)

        return jsonify("Images created successfully", 200)
    except Exception as e:
        return jsonify(e, 500)


@api.route('/get_sessions', methods=['GET'])
def api__getSessions():
    print("Getting sessions...")
    try:
        Sessions = os.path.join(project_root_dir, 'Sessions')
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
        cur_directory = os.path.join(project_root_dir, 'Sessions')
        sessionJSON = os.path.join(cur_directory, session, 'session.json')
        _JSON = get_session_JSON(sessionJSON)

        return jsonify(_JSON, 200)
    except Exception as e:
        return str(e), 500


@api.route('/get_session_Folder', methods=['GET'])
def api__getSessionFolderJSON():
    try:
        session = flask.request.args.get('sessionName')
        cur_directory = os.path.join(project_root_dir, 'Sessions')
        sessionJSON = os.path.join(cur_directory, session, 'session.json')
        _JSON = create_folder_structure_json(sessionJSON)

        return jsonify(_JSON, 200)
    except Exception as e:
        return str(e), 500


@api.route('/get_session_images', methods=['GET'])
def api__getSessionImages():
    session_name = flask.request.args.get('sessionName')
    curr_dir = os.path.join(project_root_dir, 'Sessions')
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


@api.route('/clean_Euler', methods=['GET'])
def api__cleanEuler():
    session_name = flask.request.args.get('sessionName')
    curr_dir = os.path.join(project_root_dir, 'Sessions')
    session_dir = os.path.join(curr_dir, session_name)

    session_Cache = os.path.join(session_dir, 'Cache')
    if not os.path.exists(session_Cache):
        os.makedirs(session_Cache)
    session_EulerCache = os.path.join(session_Cache, 'Euler_Images')
    if not os.path.exists(session_EulerCache):
        os.makedirs(session_EulerCache)
    image_name = flask.request.args.get('imageName')

    image_Cache = os.path.join(session_EulerCache, image_name)

    if not os.path.exists(image_Cache):
        os.makedirs(image_Cache)

    area = flask.request.args.get('area')
    quant = flask.request.args.get('quant')
    try:
        image = clean_Euler(red_area=area, quantization=quant)
        add_to_EulerCache(image=image, Cache_path=image_Cache)
        return jsonify("Image cleaned successfully", 200)
    except Exception as e:
        return jsonify(e, 500)


@api.route('/clean_Chemical_img', methods=['GET'])
def api__cleanChemImg():
    session_name = flask.request.args.get('sessionName')
    curr_dir = os.path.join(project_root_dir, 'Sessions')
    session_dir = os.path.join(curr_dir, session_name)
    session_Cache = os.path.join(session_dir, 'Cache')
    if not os.path.exists(session_Cache):
        os.makedirs(session_Cache)
    Session_ChemCache = os.path.join(session_Cache, 'Chemical_Images')
    if not os.path.exists(Session_ChemCache):
        os.makedirs(Session_ChemCache)
    image_name = flask.request.args.get('imageName')

    image_Cache = os.path.join(Session_ChemCache, image_name)
    if not os.path.exists(image_Cache):
        os.makedirs(image_Cache)

    area = flask.request.args.get('area')
    thresh = flask.request.args.get('thresh')

    try:
        image = clean_chemistry(red_area=area, Threshold=thresh)
        add_to_ChemCache(image=image, Cache_path=image_Cache)
        return jsonify("Image cleaned successfully", 200)
    except Exception as e:
        return jsonify(e, 500)
