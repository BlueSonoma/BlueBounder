"""
  This example illustrates how to overlay a segmented chemistry label onto its
  band contrast image.
"""

import time

from matplotlib import pyplot as plt
from skimage import io

from src.imaging.segmentation.segmentation import segment_and_overlay_chemistry
from src.shared.python.utils import dir_map

# The file for the band contrast image in which we will overlay the chemistry mask
band_filename = 'band_image.png'
band_image_file = dir_map['IMAGES_DIR'] + band_filename

# The chemistry mask image
in_si_filename = 'AND_Euler.png'
in_si_image_file = dir_map['REDUCED_DIR'] + in_si_filename

# The file name and filepath for our output image
out_si_filename = 'SI_segmented_band_contrast.png'
out_si_image_file = dir_map['CHEMISTRY_DIR'] + out_si_filename

# Open and load in the files
band_contrast_image = io.imread(band_image_file)
si_mask_image = io.imread(in_si_image_file)

print('Processing...')

# Timer will track the time taken process
start = time.time()

# Call the function with our images and arguments
chem_seg_image = segment_and_overlay_chemistry(
    band_contrast=band_contrast_image,
    chem_mask=si_mask_image,
    opacity=0.7,
    label_color='yellow',
)

print(f'Completed in {((time.time() - start) / 60) :.2f} minutes')

print('Saving results...')

io.imsave(out_si_image_file, chem_seg_image)
print(f'  - Saved "{out_si_image_file}"')

print('Finished')

fig, ax = plt.subplots(2, 2, figsize=(10, 10), sharex=True, sharey=True)
ax1, ax2, ax3, ax4 = ax.ravel()

ax1.imshow(band_contrast_image)
ax1.set_title(f'Band Contrast')

ax2.imshow(si_mask_image, cmap='gray')
ax2.set_title(f'Chemistry Mask')

ax3.imshow(chem_seg_image)
ax3.set_title(f'Segmented Chemistry')

plt.tight_layout()
plt.show()
