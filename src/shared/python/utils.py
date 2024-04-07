import os

from src import dir_map


def get_dir_path(dir_name: str):
    return dir_map[dir_name]


def create_directory(dir_path):
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        print(f'Directory "{str(dir_path)}" created')
    else:
        print(f'Directory "{str(dir_path)}" already exists')


def remove_file_ext(file_name: str):
    return file_name.split('.')[0]

# cwd = os.getcwd()
# for _, path in dir_map.items():
#     dir = cwd + '/' + path
#     create_directory(dir)
