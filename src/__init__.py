# Add the src package to the system path before importing, so it can be accessed
import sys
from os import path

current_dir = path.dirname(path.abspath(__file__))
project_root_dir = path.abspath(path.join(current_dir, '..'))
sys.path.append(project_root_dir)

dir_map = {
    'root': project_root_dir,
    'sessions': path.join(project_root_dir, 'Sessions'),
    'src': path.join(project_root_dir, 'src'),
    'app': path.join(project_root_dir, 'src', 'app'),
    'imaging': path.join(project_root_dir, 'src', 'imaging'),
    'segmentation': path.join(project_root_dir, 'src', 'imaging', 'segmentation'),
    'server': path.join(project_root_dir, 'src', 'server'),
    'api': path.join(project_root_dir, 'src', 'server', 'api'),
}
