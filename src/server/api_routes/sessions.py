from os import path

import flask
from flask import Blueprint, jsonify
from concurrent.futures import ThreadPoolExecutor

from src.imaging.Magic import *
from src.shared.python.utils import create_directory, get_dir_path

api = Blueprint('sessions', __name__)


# This is the api route used by the front end to create our basic images. A csv file path is provided by the user
# through a html form which is then extracted by request.form['csvFilePath'] and used to create the images. These
# images are stored in directories which is the directories do not exist initially will then be created.
@api.route('/create_starter_images', methods=['POST'])
def api__read_and_create():
    print("Creating starter images...")
    session_name = flask.request.form['sessionName'].strip()
    file = flask.request.form['csvFilePath'].strip()
    sessions_path = get_dir_path('sessions')
    sessions_path = os.path.join(sessions_path, session_name)
    Euler_dir = os.path.join(sessions_path, 'Euler_Images')
    Chem_dir = os.path.join(sessions_path, 'Chemical_Images')
    bandsPath = os.path.join(sessions_path, 'Bands')

    create_directory(sessions_path)
    create_directory(Euler_dir)
    create_directory(Chem_dir)
    create_directory(bandsPath)
    print(f'File: {file}')

    try:
        print('')
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

        create_session_JSON_and_return(sessions_path, session_name, file, ' ')
        create_folder_structure_json(session_name)

        return jsonify("Images created successfully", 200)
    except Exception as e:
        return jsonify(e, 500)


@api.route('/get_sessions', methods=['GET'])
def api__getSessions():
    print("Getting sessions...")
    try:
        session_list = os.listdir(get_dir_path('sessions'))
        session_json = [{"label": name} for name in session_list]
        return json.dumps(session_json), 200
    except Exception as e:
        return str(e), 500


@api.route('/get_session_Info', methods=['GET'])
def api__getSessionJSON():
    try:
        session = flask.request.args.get('sessionName')
        print(f"Getting session info for {session}...")
        sessionJSON = os.path.join(get_dir_path('sessions'), session, 'session.json')
        _JSON = get_session_JSON(sessionJSON)

        return jsonify(_JSON, 200)
    except Exception as e:
        return str(e), 500


@api.route('/get_session_Folder', methods=['GET'])
def api__getSessionFolderJSON():
    try:
        session_name = flask.request.args.get('sessionName')
        sessionJSON = os.path.join(get_dir_path('sessions'), session_name, 'session.json')
        _JSON = create_folder_structure_json(sessionJSON)

        return jsonify(_JSON, 200)
    except Exception as e:
        return str(e), 500


@api.route('/get_session_images', methods=['GET'])
def api__getSessionImages():
    DIR_NAMES_TYPES = {
        'Euler_Images': 'Euler',
        'Chemical_Images': 'Chemical',
        'Bands': 'Band'
    }

    def collect_images_rec(dir_name, dir_path):
        for file in os.listdir(dir_path):
            filepath = os.path.join(dir_path, file)
            if not path.isfile(filepath):
                if file in DIR_NAMES_TYPES.keys():
                    collect_images_rec(file, filepath)
                continue
            imageType = None
            for _name, _type in DIR_NAMES_TYPES.items():
                if dir_name == _name:
                    imageType = _type
            if imageType is None:
                continue
            if file.endswith(".png") or file.endswith('.jpg'):
                file_info = {"path": filepath, "type": imageType}
                files.append(file_info)

    session_name = flask.request.args.get('sessionName')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)

    try:
        files = []
        collect_images_rec(session_name, session_dir)
        return jsonify(files, 200)
    except Exception as e:
        return str(e), 500


@api.route('/clean_Euler_img', methods=['GET'])
def api__cleanEuler():
    print("Cleaning Euler image...")
    session_name = flask.request.args.get('sessionName')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)
    session_Cache = os.path.join(session_dir, 'Cache')
    create_directory(session_Cache)
    session_EulerCache = os.path.join(session_Cache, 'Euler_Images/')
    create_directory(session_EulerCache)
    image_name = flask.request.args.get('imageName')

    image = os.path.join(session_dir, 'Euler_Images', image_name)
    image_Cache = os.path.join(session_EulerCache, image_name)

    create_directory(image_Cache)

    area = flask.request.args.get('area')
    quant = flask.request.args.get('quant')
    try:
        newImage = clean_Euler(image=image, red_area=area, quant=quant)
        image_path = add_to_EulerCache(image=newImage, Cache_path=image_Cache)
        print(image_path)
        return jsonify({'path': image_path}, 200)
    except Exception as e:
        return jsonify(e, 500)


@api.route('/clean_Chemical_img', methods=['GET'])
def api__cleanChemImg():
    session_name = flask.request.args.get('sessionName')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)
    session_Cache = os.path.join(session_dir, 'Cache')
    create_directory(session_Cache)
    Session_ChemCache = os.path.join(session_Cache, 'Chemical_Images')
    create_directory(Session_ChemCache)
    image_name = flask.request.args.get('imageName')

    image_Cache = os.path.join(Session_ChemCache, image_name)
    create_directory(image_Cache)

    image = os.path.join(session_dir, 'Chemical_Images', image_name)

    area = flask.request.args.get('area')
    thresh = flask.request.args.get('thresh')

    try:
        newImage = clean_chemistry(image=image, red_area=area, Threshold=thresh)
        image_path = add_to_ChemCache(image=newImage, Cache_path=image_Cache)
        return jsonify({'path': image_path}, 200)
    except Exception as e:
        return jsonify(e, 500)
