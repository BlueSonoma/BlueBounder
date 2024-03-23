#######################################
#
#  Run this cell before proceeding
#
#######################################
from typing import Any

import numpy as np
import skimage
from skimage import color
from skimage.color import rgb2hsv, hsv2rgb, label2rgb
from skimage.measure import regionprops, label
from skimage.segmentation import mark_boundaries, felzenszwalb
from skimage.util import img_as_float, img_as_ubyte

# -----------------------
#   Helper functions
# -----------------------

Image: Any = np.array
ImageF16 = np.array
ImageF32 = np.array
ImageU8 = np.array
ImageU16 = np.array

Color = (float, float, float)


def clip_bounds(row: int, col: int, nrows: int, ncols: int):
    """Validates and returns the row and column within the bounds of
    nrows and ncols
    """

    if row < 0:
        row = 0
    elif row >= nrows:
        row = nrows - 1
    if col < 0:
        col = 0
    elif col >= ncols:
        col = ncols - 1
    return row, col


def get_rgb_value(color: str) -> Color:
    """Returns the rgb value of a color `color`
    """
    colors = {
        'red': (1, 0, 0),
        'green': (0, 1, 0),
        'blue': (0, 0, 1),
        'yellow': (1, 1, 0),
        'white': (1, 1, 1),
        'black': (0, 0, 0),
        'purple': (150 / 255, 10 / 255, 217 / 255),
        'pink': (240 / 255, 10 / 255, 221 / 255)
    }
    assert (colors[color] is not None)
    return colors[color]


def preprocess(image: ImageU8) -> ImageU8:
    """Prepares an image for segmentation. Returns a copy of the image.
    """

    image = img_as_float(image)
    # In case of a binary image, convert to grayscale
    if len(image.shape) < 3:
        image = img_as_ubyte(image)
    else:
        # If the RGB image has an alpha channel, remove it
        if image.shape[2] > 3:
            image = image[:, :, :3]
        # Convert the RGB to grayscale
        image = color.rgb2gray(image)
    # Equalize the histogram
    return skimage.exposure.equalize_hist(image)


def get_felzenszwalb(image: Image, scale: float = 1.0, sigma: float = 0.8, min_size: int = 10) -> Image:
    """Performs Felzenszwalb's segmentation and returns the segmented mask
    """
    return felzenszwalb(image, scale=scale, sigma=sigma, min_size=min_size)


def overlay(background: Image, foreground: Image, opacity: float) -> Image:
    """Overlays `foreground` with the given opacity onto of `background`
    """
    if background.dtype == np.uint8 or background.dtype == np.uint64:
        background = (background / 255).astype(np.float64)
    if foreground.dtype == np.uint8 or foreground.dtype == np.uint64:
        foreground = (foreground / 255).astype(np.float64)

    # Convert the images to HSV format
    img_hsv = rgb2hsv(background)
    mask_hsv = rgb2hsv(foreground)
    # Replace the hue and saturation of the original image with that of the mask
    img_hsv[..., 0] = mask_hsv[..., 0]
    img_hsv[..., 1] = mask_hsv[..., 1] * opacity
    # Convert back to rgb
    return hsv2rgb(img_hsv)


def label_mask(mask: Image, overlay_image: Image = None, uniform: bool = False, color: str = 'red',
               opacity: float = 1.0) -> (Image, Image):
    """Generates the labeled image of `image`, overlays the labeled image it
        on top of `image`, and returns both the labeled and overlay images
    """

    labeled = label(mask)
    if uniform:
        labeled = make_labels_uniform(labeled)
    colorized = label2rgb(labeled, image=overlay_image)

    if uniform:
        color_mask = colorized.copy()
        color = list(get_rgb_value(color))
        for region in regionprops(labeled):
            for c in region.coords:
                color_mask[c[0], c[1]] = color
        colorized = overlay(colorized, color_mask, opacity)

    return labeled, colorized


def get_marked_boundaries(image: Image, mask: Image, color: str = 'red', background: bool = True) -> Image:
    """Marks the boundaries of `image` using the mask `mask`. If `background` is false,
      everything except the boundaries will be visible.
    """
    if not background:
        image = np.zeros_like(image)
    return (mark_boundaries(image, mask, color=get_rgb_value(color), outline_color=None) * 255).astype(np.uint8)


def outline_boundaries(image: Image, marked: Image, color: str = 'black') -> Image:
    """Returns a copy of `image` overlay with `marked` boundaries colored `color`
    """
    assert (image.shape == marked.shape)

    outlined = image.copy()
    color = list(get_rgb_value(color))
    for i in range(marked.shape[0]):
        for j in range(marked.shape[1]):
            if marked[i, j].any() > 0:
                outlined[i, j] = color
    return (outlined * 255).astype(np.uint8)


def make_labels_uniform(labels: Image) -> Image:
    """Makes all labels a single value, notably 1.
    """
    uniform = labels.copy()
    for i in range(uniform.shape[0]):
        for j in range(uniform.shape[1]):
            if uniform[i, j].any() > 0:
                uniform[i, j] = 1
    return uniform


def postprocess(background_image: Image, overlay_image: Image, mask: Image, border_color: str) -> Image:
    """Removes labels in `overlay_image` that do not match those in `mask` and
      replaces any label borders.
    """
    background_image = background_image.copy()

    # Mark borders and remove 'Ghost labels'
    border_color = list(get_rgb_value(border_color))
    for i in range(mask.shape[0]):
        for j in range(mask.shape[1]):
            if mask[i, j] != 0:
                # Check mask neighbors and mark the border of `background_image`, if needed.
                for r in range(-2, 2, 1):
                    for c in range(-2, 2, 1):
                        x, y = clip_bounds(i + r, j + c, mask.shape[0], mask.shape[1])
                        if mask[x, y] == 0:
                            background_image[x, y] = border_color
                            background_image[i - x, j - c] = border_color
                else:
                    background_image[i, j] = overlay_image[i, j] * 255
    return background_image


# -----------------------
#   The Algorithms
# -----------------------

BatchConfig = dict[str | Any, list | int | float | str | bool | list[str] | Any]


def segment_boundaries(image: Image, *, scale: int = 50, sigma: float = 0.8, min_size: int = 20,
                       outline_color: str = 'black', overlay: bool = True, overlay_image: Image = None,
                       label: bool = True, label_uniform: bool = False, label_color: str = 'red',
                       label_opacity: float = 1.0, batch_config: BatchConfig = None) -> Image | list[Image]:
    """Given an input image, returns a copy of the image with its boundaries segmented and outlined.

        Parameters
        ----------
        image:
            A numpy array containing the RGB image data.
        scale:
            A number that controls the number and size of segments clusters (higher means
            larger clusters).
        sigma:
            Width (standard deviation) of the Gaussian kernel.
        min_size:
            Minimum component size.
        outline_color:
            A string describing the color of the boundary outlines (ex: 'black').
        overlay:
            If enabled, the image (mask) produced will overlay with the provided image.
        overlay_image:
            If None, the `image` argument will be the image used. Otherwise, the image
            provided in this argument will be used. NOTE: The image provided must be of the
            same shape as the input image.
        label:

        label_uniform:
            If enabled, all labels will be converted to a single label.
        label_color:
            The color of the resulting label. Omitted if `label_uniform` is not enabled.
        label_opacity:
            The opacity of the label. Omitted if `label_uniform` is not enabled.
        batch_config:
            Accepts a configuration dictionary of arguments and properties to generate one or more separate images and
            a single background image.
            The configuration can have the following properties:
                in_images:        list[numpy.array],  --> A list of input images.
                scale:            uint,               --> An unsigned integer value
                sigma:            float,              --> A float between 0-1.0, inclusive
                min_size:         uint,               --> An unsigned integer value
                outline_color:    str,                --> A string describing the color
                label_uniform:    bool,               --> A boolean value
                overlay:          bool,               --> A boolean value
                overlay_image:    numpy.array[uint8], --> A numpy array of the image data
                label_color:     list[str],           --> A list of strings describing a color.
                                                         Note: len(label_color) == len(in_images)
                label_opacity:    float,              --> A float value between 0-1.0, inclusive
                update_callback:  void fn             --> An optional callback function that is called after each
                                                         iteration with `batch_config` and the current index as arguments
                                                         in that order.

        Returns
        -------
          If batch mode is used, a list[numpy.array] of the resulting images are returned.
          Otherwise, a single numpy.array of the resulting image.

        Notes
        _____
            When `batch_config` is used, all other arguments are ignored. All arguments are expected to be provided
            in `batch_config`.

    """

    # Define a local closure function that actually performs the algorithm
    def __exec_segment_boundaries(image, scale, sigma, min_size, outline_color, overlay, overlay_image, label,
                                  label_uniform, label_color, label_opacity) -> Image:
        background = None

        # Get the segmentation mask using Felzenszwalb
        mask = get_felzenszwalb(image, scale=scale, sigma=sigma, min_size=min_size)

        # Mark boundaries of the image using the mask
        marked = get_marked_boundaries(image, mask, background=False)
        if overlay:
            if overlay_image is not None:
                background = overlay_image
            else:
                background = image

        if label:
            # Get the labeled image overlayed with the mask
            _, overlay_img = label_mask(mask, overlay_image=background, uniform=label_uniform, color=label_color,
                                        opacity=label_opacity)
        else:
            overlay_img = background

        # Return the segmented, labeled overlay image with its boundaries outlined
        return outline_boundaries(overlay_img, marked, outline_color)

    # Run the algorithm on a single image
    if batch_config is None:
        return __exec_segment_boundaries(image, scale, sigma, min_size, outline_color, overlay, overlay_image, label,
                                         label_uniform, label_color, label_opacity)

    # Destructure configurations
    in_images = batch_config['in_images']
    scale = batch_config['scale']
    sigma = batch_config['sigma']
    min_size = batch_config['min_size']
    outline_color = batch_config['outline_color']
    label = batch_config['label']
    label_uniform = batch_config['label_uniform']
    overlay = batch_config['overlay']
    overlay_image = batch_config['overlay_image']
    label_color = batch_config['label_color']
    opacity = batch_config['label_opacity'] if batch_config['label_opacity'] is not None else 1
    callback = batch_config['update_callback']

    results = []

    # Run the batch images
    for i, image in enumerate(in_images):
        image = preprocess(image)
        segmented = __exec_segment_boundaries(image, scale=scale, sigma=sigma, min_size=min_size,
                                              outline_color=outline_color, label=label, label_uniform=label_uniform,
                                              overlay=overlay, overlay_image=overlay_image, label_color=label_color[i],
                                              label_opacity=opacity)

        results.append(segmented)

        # Call the update callback, if given
        if callback is not None:
            callback(batch_config, i)

    return results


def segment_and_overlay_chemistry(band_contrast: Image, chem_mask: Image, opacity: float = 1,
                                  label_color: str = 'yellow') -> ImageU8:
    """
      Segments the boundaries of an image `band_contrast` and its mask `chem_mask` and overlays
      the segmented `chem_mask` image onto `band_contrast` such that only the boundaries of
      `band_contrast` within the area of the of `chem_mask` labels are segmented and bordered.
    """
    import concurrent.futures

    # Run the segmentation algorithms concurrently to reduce processing time
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        # Segment the band contrast
        img_future = executor.submit(segment_boundaries, band_contrast, scale=200, sigma=0.55, min_size=300,
                                     outline_color='black', label=False)

        # Segment the mask
        mask_future = executor.submit(segment_boundaries, chem_mask, scale=30, sigma=0.1, min_size=10,
                                      outline_color='black', label_uniform=True, label_color=label_color,
                                      label_opacity=1)
        img_seg = img_future.result()
        mask_seg = mask_future.result()

    # Overlay the segmented mask onto the segmented band contrast
    overlay_seg = overlay(img_seg, mask_seg, opacity=opacity)

    # Clean up the result by removing invalid labels and replacing borders removed in `overlay`
    return postprocess(background_image=band_contrast, overlay_image=overlay_seg, mask=chem_mask,
                       border_color='black').astype(np.uint8)
