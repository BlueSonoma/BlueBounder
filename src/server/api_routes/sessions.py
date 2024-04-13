from os import path

import flask
from flask import Blueprint, jsonify
from concurrent.futures import ThreadPoolExecutor

from src.imaging.Magic import *
from src.shared.python.utils import create_directory, get_dir_path, remove_file_ext

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

        create_XOR_default(Chem_dir)
        create_AND_default(Euler_directory=Euler_dir, Chem_directory=Chem_dir)

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

@api.route('/neighbor_Euler', methods=['GET'])
def api__NeighborEuler():
    print("Cleaning Euler image...")
    session_name = flask.request.args.get('sessionName')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)
    session_Cache = os.path.join(session_dir, 'Cache')
    create_directory(session_Cache)
    session_EulerCache = os.path.join(session_Cache, 'Euler_Images')
    create_directory(session_EulerCache)
    image_name = flask.request.args.get('imageName')

    image = os.path.join(session_dir, 'Euler_Images', image_name)
    image_cache = os.path.join(session_EulerCache, remove_file_ext(image_name))

    create_directory(image_cache)

    window = flask.request.args.get('window')
    try:
        new_image = neighbor_max_Euler(image=image, windowsize=window)
        image_name, image_path = add_to_EulerCache(image=new_image, cache_path=image_cache)
        print(image_path)
        return jsonify({
            "name": image_name,
            "path": image_path,
            "dir": remove_file_ext(image_name),
            "type": "Euler",
            "cached": True},
            200)

    except Exception as e:
        return jsonify(e, 500)


@api.route('/Reduce_Euler', methods=['GET'])
def api__ReduceEuler():
    print("Cleaning Euler image...")
    session_name = flask.request.args.get('sessionName')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)
    session_Cache = os.path.join(session_dir, 'Cache')
    create_directory(session_Cache)
    session_EulerCache = os.path.join(session_Cache, 'Euler_Images')
    create_directory(session_EulerCache)
    image_name = flask.request.args.get('imageName')

    image = os.path.join(session_dir, 'Euler_Images', image_name)
    image_cache = os.path.join(session_EulerCache, remove_file_ext(image_name))

    create_directory(image_cache)

    area = flask.request.args.get('area')
    area = int(area)
    try:
        new_image = euler_reduce_area(image, red_area=area)
        image_name, image_path = add_to_EulerCache(image=new_image, cache_path=image_cache)
        print(image_path)
        return jsonify({
            "name": image_name,
            "path": image_path,
            "dir": remove_file_ext(image_name),
            "type": "Euler",
            "cached": True},
            200)

    except Exception as e:
        return jsonify(e, 500)



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
        'Bands': 'Band',
        'Cache': None
    }

    def collect_images_rec(dir_name, dir_path, cached=False, cache_dir=None):
        for file in os.listdir(dir_path):
            filepath = os.path.join(dir_path, file)
            if not path.isfile(filepath):
                # if file this is an accepted dir
                if file in DIR_NAMES_TYPES.keys():
                    collect_images_rec(file, filepath, cached)
                # if this dir is an accepted dir (i.e. this file is child of the Cache/ dir)
                elif dir_name in DIR_NAMES_TYPES.keys():
                    collect_images_rec(dir_name, filepath, True, file)
                continue
            imageType = None
            for _name, _type in DIR_NAMES_TYPES.items():
                if dir_name == _name:
                    imageType = _type
            if imageType is None:
                continue
            if file.endswith(".png") or file.endswith('.jpg'):
                file_info = {
                    "name": file,
                    "path": filepath,
                    "type": imageType,
                    "cached": cached,
                    "dir": dir_name if not cached else cache_dir
                }
                files.append(file_info)
                print(file_info)

    session_name = flask.request.args.get('sessionName')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)

    try:
        files = []
        collect_images_rec(session_name, session_dir)
        return jsonify(files, 200)
    except Exception as e:
        return str(e), 500


@api.route('/clean_Euler', methods=['GET'])
def api__cleanEuler():

    print("Cleaning Euler image...")
    session_name = flask.request.args.get('sessionName')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)
    session_Cache = os.path.join(session_dir, 'Cache')
    create_directory(session_Cache)
    session_EulerCache = os.path.join(session_Cache, 'Euler_Images')
    create_directory(session_EulerCache)
    image_name = flask.request.args.get('imageName')

    image = os.path.join(session_dir, 'Euler_Images', image_name)
    image_cache = os.path.join(session_EulerCache, remove_file_ext(image_name))

    create_directory(image_cache)

    area = flask.request.args.get('area')
    quant = flask.request.args.get('quant')
    try:
        new_image = clean_Euler(image=image, red_area=area, quant=quant)
        image_name, image_path = add_to_EulerCache(image=new_image, cache_path=image_cache)
        print(image_path)
        return jsonify({
            "name": image_name,
            "path": image_path,
            "dir": remove_file_ext(image_name),
            "type": "Euler",
            "cached": True},
            200)

    except Exception as e:
        return jsonify(e, 500)
    

@api.route('/Quant_Euler', methods=['GET'])
def api__QuanEuler():
    print("Cleaning Euler image...")
    session_name = flask.request.args.get('sessionName')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)
    session_Cache = os.path.join(session_dir, 'Cache')
    create_directory(session_Cache)
    session_EulerCache = os.path.join(session_Cache, 'Euler_Images')
    create_directory(session_EulerCache)
    image_name = flask.request.args.get('imageName')

    image = os.path.join(session_dir, 'Euler_Images', image_name)
    image_cache = os.path.join(session_EulerCache, remove_file_ext(image_name))

    create_directory(image_cache)

    quant = flask.request.args.get('quant')
    try:
        new_image = Quant_Euler(image=image, quant=quant)
        image_name, image_path = add_to_EulerCache(image=new_image, cache_path=image_cache)
        print(image_path)
        return jsonify({
            "name": image_name,
            "path": image_path,
            "dir": remove_file_ext(image_name),
            "type": "Euler",
            "cached": True},
            200)

    except Exception as e:
        return jsonify(e, 500)



@api.route('/Clean_Chem_All', methods=['GET'])
def api__cleanChemImg():
    session_name = flask.request.args.get('sessionName')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)
    session_Cache = os.path.join(session_dir, 'Cache')
    create_directory(session_Cache)
    Session_ChemCache = os.path.join(session_Cache, 'Chemical_Images')
    create_directory(Session_ChemCache)
    image_name = flask.request.args.get('imageName')

    image_cache = os.path.join(Session_ChemCache, remove_file_ext(image_name))
    create_directory(image_cache)

    image = os.path.join(session_dir, 'Chemical_Images', image_name)

    area = flask.request.args.get('area')
    upper_thresh = flask.request.args.get('upper_thresh')
    lower_thresh = flask.request.args.get('lower_thresh')
    window = flask.request.args.get('window')

    area = int(area)
    upper_thresh = int(upper_thresh)
    lower_thresh = int(lower_thresh)
    window = int(window)

    try:

        new_image = clean_chemistry(image=image, red_area=area, upper_thresh=upper_thresh, lower_thresh=lower_thresh,
                                    window=window)
        image_name, image_path = add_to_ChemCache(image=new_image, cache_path=image_cache)

        return jsonify({
            "name": image_name,
            "path": image_path,
            "dir": remove_file_ext(image_name),
            "type": "Chemical",
            "cached": True},
            200)
    except Exception as e:
        return jsonify(e, 500)


@api.route('/clean_Chemical_img_OnlyThresh', methods=['GET'])
def api__cleanChemImg_OnlyThresh():
    session_name = flask.request.args.get('sessionName')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)
    session_Cache = os.path.join(session_dir, 'Cache')
    create_directory(session_Cache)
    Session_ChemCache = os.path.join(session_Cache, 'Chemical_Images')
    create_directory(Session_ChemCache)
    image_name = flask.request.args.get('imageName')

    image_cache = os.path.join(Session_ChemCache, remove_file_ext(image_name))
    create_directory(image_cache)

    image = os.path.join(session_dir, 'Chemical_Images', image_name)

    upper_thresh = flask.request.args.get('upperThresh')
    lower_thresh = flask.request.args.get('lowerThresh')

    try:
        new_image = Thresh_CHem(image=image, upper_thresh=upper_thresh, lower_thresh=lower_thresh)
        image_name, image_path = add_to_ChemCache(image=new_image, cache_path=image_cache)

        return jsonify({
            "name": image_name,
            "path": image_path,
            "dir": remove_file_ext(image_name),
            "type": "Chemical",
            "cached": True},
            200)
    except Exception as e:
        return jsonify(e, 500)


@api.route('/ReduceArea', methods=['GET'])
def api__ReduceArea():
    session_name = flask.request.args.get('sessionName')
    image_type = flask.request.args.get('type')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)
    session_Cache = os.path.join(session_dir, 'Cache')
    create_directory(session_Cache)
    dir_name = 'Euler_Images' if image_type == 'Euler' else 'Chemical_Images'
    Session_ChemCache = os.path.join(session_Cache, dir_name)
    create_directory(Session_ChemCache)
    image_name = flask.request.args.get('imageName')

    image_cache = os.path.join(Session_ChemCache, remove_file_ext(image_name))
    create_directory(image_cache)

    image = os.path.join(session_dir, dir_name, image_name)

    area = flask.request.args.get('area')
    area = int(area)

    try:
        new_image = Area_Chem(image=image, red_area=area)
        image_name, image_path = add_to_ChemCache(image=new_image, cache_path=image_cache)
        return jsonify({
            "name": image_name,
            "path": image_path,
            "dir": remove_file_ext(image_name),
            "type": "Chemical",
            "cached": True},
            200)
    except Exception as e:
        return jsonify(e, 500)


@api.route('/ToBinary', methods=['GET'])
def api__ToBinary():
    session_name = flask.request.args.get('sessionName')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)
    session_Cache = os.path.join(session_dir, 'Cache')
    create_directory(session_Cache)
    Session_ChemCache = os.path.join(session_Cache, 'Chemical_Images')
    create_directory(Session_ChemCache)
    image_name = flask.request.args.get('imageName')

    image_cache = os.path.join(Session_ChemCache, remove_file_ext(image_name))
    create_directory(image_cache)

    image = os.path.join(session_dir, 'Chemical_Images', image_name)

    try:
        new_image = make_binary(image=image)
        image_name, image_path = add_to_ChemCache(image=new_image, cache_path=image_cache)
        return jsonify({
            "name": image_name,
            "path": image_path,
            "dir": remove_file_ext(image_name),
            "type": "Chemical",
            "cached": True},
            200)
    except Exception as e:
        return jsonify(e, 500)


@api.route('/Neighbor_Chem', methods=['GET'])
def api__Neighbor_chem():
    session_name = flask.request.args.get('sessionName')
    session_dir = os.path.join(get_dir_path('sessions'), session_name)
    session_Cache = os.path.join(session_dir, 'Cache')
    create_directory(session_Cache)
    Session_ChemCache = os.path.join(session_Cache, 'Chemical_Images')
    create_directory(Session_ChemCache)
    image_name = flask.request.args.get('imageName')

    image_cache = os.path.join(Session_ChemCache, remove_file_ext(image_name))
    create_directory(image_cache)

    image = os.path.join(session_dir, 'Chemical_Images', image_name)
    window = flask.request.args.get('window')
    window = int(window)
    try:

        new_image = modal_chem(image=image, window=window)
        image_name, image_path = add_to_ChemCache(image=new_image, cache_path=image_cache)

        return jsonify({
            "name": image_name,
            "path": image_path,
            "dir": remove_file_ext(image_name),
            "type": "Chemical",
            "cached": True},
            200)
    except Exception as e:
        return jsonify(e, 500)
