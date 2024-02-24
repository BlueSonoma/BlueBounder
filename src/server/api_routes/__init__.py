import os
import sys
import flask

# Add the local packages  to the system path before importing, so each submodule can access them
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root_dir = os.path.abspath(os.path.join(current_dir, '..', '..', '..'))
sys.path.append(project_root_dir)

from . import sessions
from . import imaging

api = flask.Blueprint('api', __name__)
api.register_blueprint(sessions.api, url_prefix='/sessions')
api.register_blueprint(imaging.api, url_prefix='/imaging')
