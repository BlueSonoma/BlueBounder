import os
import sys

from flask_cors import CORS

print(sys.executable)
# Add the src package to the system path before importing, so it can be accessed
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root_dir = os.path.abspath(os.path.join(current_dir, '..', '..'))
sys.path.append(project_root_dir)

from src.server import create_app

main = create_app()
CORS(main)

if __name__ == '__main__':
    main.run(port=8000, debug=True, threaded=True)
