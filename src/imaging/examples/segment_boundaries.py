"""
  Responsible for the majority of the work inside `segment_and_overlay_chemistry()`,
  segment_boundaries can be used in two ways:

    1. single image mode
    2. batch images mode

  This example illustrates batch mode and provides an example for single mode
  as well.
"""

import time

from skimage import io

from src.imaging.segmentation.segmentation import segment_boundaries, BatchConfig
from src.imaging.segmentation.utils import dir_map

# The file for which we will overlay the chemistry mask onto
band_filename = 'band_image.png'
band_image_file = dir_map['IMAGES_DIR'] + band_filename

# All the input filenames
in_filenames = [
    'AL_img.png',
    'K_img.png',
    'FE_img.png',
    'SI_img.png',
    'CA_img.png',
    'NA_img.png',
]

# All the output filenames
out_filenames = [
    'band_overlay_AL.png',
    'band_overlay_K.png',
    'band_overlay_FE.png',
    'band_overlay_SI.png',
    'band_overlay_CA.png',
    'band_overlay_NA.png',
]

# The path to the input files
in_al_image_file = dir_map['REDUCED_DIR'] + in_filenames[0]
in_k_image_file = dir_map['REDUCED_DIR'] + in_filenames[1]
in_fe_image_file = dir_map['REDUCED_DIR'] + in_filenames[2]
in_si_image_file = dir_map['REDUCED_DIR'] + in_filenames[3]
in_ca_image_file = dir_map['REDUCED_DIR'] + in_filenames[4]
in_na_image_file = dir_map['REDUCED_DIR'] + in_filenames[5]

# The path to the output files
out_al_image_file = dir_map['CHEMISTRY_DIR'] + out_filenames[0]
out_k_image_file = dir_map['CHEMISTRY_DIR'] + out_filenames[1]
out_fe_image_file = dir_map['CHEMISTRY_DIR'] + out_filenames[2]
out_si_image_file = dir_map['CHEMISTRY_DIR'] + out_filenames[3]
out_ca_image_file = dir_map['CHEMISTRY_DIR'] + out_filenames[4]
out_na_image_file = dir_map['CHEMISTRY_DIR'] + out_filenames[5]

# Lists containing all the input files and the label color of each respective mask
# Note that these must all be in order such that each input file has the same index as the output file
# and label color.
in_files = [
    in_al_image_file,
    in_k_image_file,
    in_fe_image_file,
    in_si_image_file,
    in_ca_image_file,
    in_na_image_file
]

in_images = []

# Open and store our images.
for i, file in enumerate(in_files):
    in_images.append(io.imread(file))

# List of colors of our label overlays
label_colors = [
    'red',
    'green',
    'blue',
    'yellow',
    'pink',
    'purple'
]

# Open the band contrast image that we will use as our image background
band_image = io.imread(band_image_file)


# Define an update callback that will be called with these parameters after every iteration
def print_callback(batch_config, index):
    print(f'  - Processed "{in_files[index]}"')


# Create our configurations
segmentation_config: BatchConfig = {
    'in_images': in_images,
    'scale': 50,
    'sigma': 0.1,
    'min_size': 10,
    'outline_color': 'black',
    'label': True,
    'label_uniform': True,
    'overlay': True,
    'overlay_image': band_image,
    'label_color': label_colors,
    'label_opacity': 0.4,
    'update_callback': print_callback
}

print('Processing...')

# Timer will track the time taken process
start = time.time()

# Finally, call the function and get the results
segmented = segment_boundaries(
    None,
    batch_config=segmentation_config
)

# Uncomment below to run a single image.

# segmented = segment_boundaries(band_image, scale=50, sigma=0.1, min_size=10, outline_color='black',
# label_uniform=True, overlay=True, label_color='red', label_opacity=0.3)

print(f'Completed in {((time.time() - start) / 60) :.2f} minutes')

out_files = [
    out_al_image_file,
    out_k_image_file,
    out_fe_image_file,
    out_si_image_file,
    out_ca_image_file,
    out_na_image_file,
]

print('Saving results...')
# Save the images: Note the order is maintain from the input images
for i, image in enumerate(segmented):
    io.imsave(out_files[i], image)
    print(f'  - Saved "{out_files[i]}"')

print('Finished')
