import flask
from flask import Blueprint

from src.imaging.Magic import clean_chemistry

api = Blueprint('imaging', __name__)


@api.route('/clean_chem_img', methods=['POST'])
def api__clean_chemistry():
    case = flask.request.form['case']
    threshold = flask.request.form['threshold']
    clean_chemistry()

