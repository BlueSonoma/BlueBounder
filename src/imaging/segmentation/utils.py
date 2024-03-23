# Directory dictionary for referencing locations
# NOTE: This will need to be changed to your working directory in order to work properly

import os

dir_map = {
    'INPUT_IMAGES_DIR': '../../',
    'OUTPUT_IMAGES_DIR': '../../',
    'REDUCED_DIR': '../../Reduced/',
    'CHEMISTRY_DIR': '../../Chemistry/',
}


def create_directory(dir):
    if not os.path.exists(dir):
        os.makedirs(dir)
        print(f'Directory "{str(dir)}" created')
    else:
        print(f'Directory "{str(dir)}" already exists')


cwd = os.getcwd()
for _, path in dir_map.items():
    dir = cwd + '/' + path
    create_directory(dir)
