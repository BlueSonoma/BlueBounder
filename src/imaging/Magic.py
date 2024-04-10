import os.path

from PIL import Image as im
import numpy as np
import os
import skimage
from skimage import io
import imageio
from scipy.ndimage import maximum_filter
from skimage import color
from skimage.filters.rank import modal
from skimage.morphology import square
import json
import math
from datetime import datetime
import shutil
import matplotlib.pyplot as plt
from src.shared.python.utils import create_directory, get_dir_path
from PIL import Image




def get_band_con(file, bandsPath):
    with open(file, 'r') as file:
        # skip the first two lines because that's just the header
        file.seek(0)
        file.readline()
        file.readline()

        # find the max x and y values to determine the size of the image
        max_x = 0
        max_y = 0
        for line in file:
            line = line.split(",")
            x = int(line[1]) // 10
            y = int(line[2]) // 10

            if x > max_x:
                max_x = x
            if y > max_y:
                max_y = y

        print(max_x, max_y)
        width = max_x + 1
        height = max_y + 1
        file.seek(0)
        file.readline()
        file.readline()

        # create a 3d array of zeros with the size of the image
        band = np.zeros((height, width))
        # read through each line of the data file and assign the correspond x,y values pixel its rgba value
        for line in file:
            line = line.split(",")
            y = int(line[1]) // 10  # line[1] is the x value
            x = int(line[2]) // 10  # line[2] is the y value
            band[x, y] = int(line[5])
    imageio.imsave(os.path.join(bandsPath, 'band_contrast.png'), band.astype('uint8'))

    return band


def get_phase_color(file, Euler_dir):
    with open(file, 'r') as file:
        # skip the first two lines because that's just the header

        file.seek(0)
        file.readline()
        file.readline()

        # find the max x and y values to determine the size of the image
        max_x = 0
        max_y = 0
        for line in file:
            line = line.split(",")
            x = int(line[1]) // 10
            y = int(line[2]) // 10

            if x > max_x:
                max_x = x
            if y > max_y:
                max_y = y

        print(max_x, max_y)
        width = max_x + 1
        height = max_y + 1
        file.seek(0)
        file.readline()
        file.readline()

        # create a 3d array of zeros with the size of the image
        euler_phase = np.zeros((height, width, 4))
        # read through each line of the data file and assign the correspond x,y values pixel its rgba value
        for line in file:
            line = line.split(",")
            rgb = line[4].split()  # line[4] is the rgb value
            y = int(line[1]) // 10  # line[1] is the x value
            x = int(line[2]) // 10  # line[2] is the y value

            rgb = np.array(rgb, "int")
            # if line[3] is 1 then the pixel is a grain and we assign it the rgb value
            if int(line[3]) == 1:
                rgb = rgb / 255.0
                # add 0.5 alpha value to rgb
                rgba = np.append(rgb, 0.5)
                euler_phase[x, y, :] = rgba

            else:
                euler_phase[x, y, :] = [1.0, 1.0, 1.0, 0.0]

        imageio.imwrite(os.path.join(Euler_dir, 'euler_phase.png'), (euler_phase * 255).astype(np.uint8))


def get_chem(file, Chem_dir, max_chemicals, chemical):
    with open(file, 'r') as file:
        # skip the first two lines because thats just the header
        file.seek(0)
        file.readline()
        file.readline()

        # find the max x and y values to determine the size of the image
        max_x = 0
        max_y = 0

        for line in file:
            line = line.split(",")
            x = int(line[1]) // 10
            y = int(line[2]) // 10

            if x > max_x:
                max_x = x
            if y > max_y:
                max_y = y

        width = max_x + 1
        height = max_y + 1
        file.seek(0)
        file.readline()
        file.readline()

        chemical_img = np.zeros((height, width))

        # read through each line of the data file and assign to correspond x,y values pixel its chemical value
        for line in file:
            line = line.split(",")
            y = int(line[1]) // 10
            x = int(line[2]) // 10

            # if (int(line[3]) == 1):
            chemical_values = line[6].split(' ')
            # normalize the chemical values
            chemical_values = np.array(chemical_values, "float")
            chemical_values = chemical_values / max_chemicals[chemical]

            chemical_img[x, y] = chemical_values[chemical]

        chemical_img = chemical_img * 255
        chemical_img = chemical_img.astype(np.uint8)

        if chemical == 0:
            imageio.imwrite(os.path.join(Chem_dir, 'AL_fromFile.png'), chemical_img)
        if chemical == 1:
            imageio.imwrite(os.path.join(Chem_dir, 'CA_fromFile.png'), chemical_img)
        if chemical == 2:
            imageio.imwrite(os.path.join(Chem_dir, 'NA_fromFile.png'), chemical_img)
        if chemical == 3:
            imageio.imwrite(os.path.join(Chem_dir, 'FE_fromFile.png'), chemical_img)
        if chemical == 4:
            imageio.imwrite(os.path.join(Chem_dir, 'SI_fromFile.png'), chemical_img)
        if chemical == 5:
            imageio.imwrite(os.path.join(Chem_dir, 'K_fromFile.png'), chemical_img)

    return


def find_max_of_chem(file):
    with open(file, 'r') as file:
        file.seek(0)
        file.readline()
        file.readline()

        max_chem_0 = 0
        max_chem_1 = 0
        max_chem_2 = 0
        max_chem_3 = 0
        max_chem_4 = 0
        max_chem_5 = 0

        for line in file:
            line = line.split(",")

            chemical_values = line[6].split(' ')
            chemical_values = np.array(chemical_values, "float")
            if chemical_values[0] > max_chem_0:
                max_chem_0 = chemical_values[0]
            if chemical_values[1] > max_chem_1:
                max_chem_1 = chemical_values[1]
            if chemical_values[2] > max_chem_2:
                max_chem_2 = chemical_values[2]
            if chemical_values[3] > max_chem_3:
                max_chem_3 = chemical_values[3]
            if chemical_values[4] > max_chem_4:
                max_chem_4 = chemical_values[4]
            if chemical_values[5] > max_chem_5:
                max_chem_5 = chemical_values[5]

    return [max_chem_0, max_chem_1, max_chem_2, max_chem_3, max_chem_4, max_chem_5]


def quantization(img, L):
    """
    Quantize the image img (with 256 gray levels) to L gray levels (in the example above,
    image was quantized to 4 gray levels)
    Return the quantized image
    """
    factor = 256 / L
    img2 = img // factor
    return img2 * factor


def my_max_neighbor_fast(image, channel):
    half_window = 1
    footprint = np.ones((2 * half_window + 1, 2 * half_window + 1))
    result = maximum_filter(image[:, :, channel], footprint=footprint)
    return result


def reduce_area(image, area):
    labeled = skimage.morphology.label(image)
    my_regions = skimage.measure.regionprops_table(labeled, properties=('label', 'area'))

    for i in range(len(my_regions['label'])):
        if my_regions['area'][i] < area:
            labeled[labeled == my_regions['label'][i]] = 0

    return labeled


def my_modal_filter(image,windowSize=3):
    # half_window = 1
    # size = 2 * half_window + 1
    result = modal(image, square(windowSize))
    return result


def clean_Euler(image, quant=16, red_area=100):
    Cleaned_Euler_directory = os.path.join('Euler_images', 'cleaned')
    # Create the directory if it does not exist
    # create_directory(Cleaned_Euler_directory)
    print(image)
    euler_img = getImage_withPath(image)

    if euler_img.shape[2] == 4:
        euler_img = euler_img[:, :, :3]

    quant = int(quant)
    red_area = int(red_area)
    euler_img = quantization(img=euler_img, L=quant)

    red_channel = my_max_neighbor_fast(euler_img, 0)
    green_channel = my_max_neighbor_fast(euler_img, 1)
    blue_channel = my_max_neighbor_fast(euler_img, 2)
    euler_img = np.stack((red_channel, green_channel, blue_channel), axis=-1)

    grayscale = color.rgb2gray(euler_img)
    binary = grayscale > 0
    reduced_Binary = reduce_area(binary, red_area)

    for i in range(len(reduced_Binary)):
        for j in range(len(reduced_Binary[0])):
            if reduced_Binary[i][j] == 0:
                euler_img[i][j] = 0

    # imageio.imsave('Euler_Images/clean_Euler_fast.png', euler_img.astype('uint8'))
    return euler_img


def getImage_withPath(imagePath):
    image = io.imread(imagePath)
    return image

def Chem_regTObinary(image):
    image = getImage_withPath(image)
    image[image > 0] = 1
    return image

def Thresh_CHem(image, UpperThresh = 0,LowerThresh=255):
    Chemistry_directory_reduced = os.path.join('Chemical_images', 'reduced')
    image = getImage_withPath(image)
    LowerThresh = int(LowerThresh)
    UpperThresh = int(UpperThresh)
    image[image < LowerThresh] = 0
    image[image > UpperThresh] = 0
   
    # image = im.fromarray((max_image * 255).astype(np.uint8), mode="L")

    return image
  
def modal_chem(image,windowSize=3):
    image = my_modal_filter(image,windowSize)
    return image

def Area_Chem(image, red_area=100):
    image= reduce_area(image, red_area)
    return image


#This is still a work in progress fs
def send_Histogram(image, Current_Session):


    image_arr = np.array(image)

    # Calculate histogram using numpy
    hist, bins = np.histogram(image_arr.flatten(), bins=256, range=[0,256])

    # Plot histogram
    plt.figure(figsize=(12, 6))
    plt.bar(bins[:-1], hist, width=1, color='black')
    plt.title('')
    plt.xlabel('Pixel Intensity')
    plt.ylabel('Frequency')

    # Save histogram as a PNG
    plt.savefig('histogram.png')

    return 'histogram.png'

    
    

def clean_chemistry(image, Threshold=0.5, red_area=100):
    Chemistry_directory_reduced = os.path.join('Chemical_images', 'reduced')
    # Create the directory if it does not exist
    create_directory(Chemistry_directory_reduced)
    Threshold = float(Threshold)
    print('Threshold:', Threshold)
    print('Red Area:', red_area)
    red_area = int(red_area)
    image = getImage_withPath(image)
    image = image / 255
    image[image < Threshold] = 0
    image[image > Threshold] = 1

    max_image = my_modal_filter(image)
    max_image = reduce_area(max_image, red_area)
    image = im.fromarray((max_image * 255).astype(np.uint8), mode="L")

    return image


def make_binary(img):
    # any pixel that is not black make 1
    # any pixel that is black make 0
    # then return the binary image
    binary_img = np.zeros((img.shape[0], img.shape[1]))
    for x in range(img.shape[0]):
        for y in range(img.shape[1]):
            if img[x, y].all() != 0:
                binary_img[x, y] = 1
            else:
                binary_img[x, y] = 0
    return binary_img


def create_XOR_default(Chem_dir):

    create_directory(os.path.join(Chem_dir, 'masks'))
    AL = os.path.join(Chem_dir, 'AL_fromFile.png')
    CA = os.path.join(Chem_dir, 'CA_fromFile.png')
    NA = os.path.join(Chem_dir, 'NA_fromFile.png')
    FE = os.path.join(Chem_dir, 'FE_fromFile.png')
    SI = os.path.join(Chem_dir, 'SI_fromFile.png')
    K = os.path.join(Chem_dir, 'K_fromFile.png')

    AL = clean_chemistry(image = AL, Threshold=0.2)
    #imageio.imsave(os.path.join(Chem_dir, 'Reduced_AL.png'), AL)  # save image
    CA = clean_chemistry(image =CA, Threshold=0.2)
    #imageio.imsave(os.path.join(Chem_dir, 'Reduced_CA.png'), CA)  # save image
    NA = clean_chemistry(image =NA, Threshold=0.2)
    #imageio.imsave(os.path.join(Chem_dir, 'Reduced_NA.png'), NA)  # save image
    FE = clean_chemistry(image =FE, Threshold=0.2)
    #imageio.imsave(os.path.join(Chem_dir, 'Reduced_FE.png'), FE)  # save image
    SI = clean_chemistry(image =SI)
    #imageio.imsave(os.path.join(Chem_dir, 'Reduced_SI.png'), SI)  # save image
    K = clean_chemistry(image =K, Threshold=0.2)
    #imageio.imsave(os.path.join(Chem_dir, 'Reduced_K.png'), K)  # save image

    # turn images to binary images
    AL = np.array(AL)
    CA = np.array(CA)
    NA = np.array(NA)
    FE = np.array(FE)
    SI = np.array(SI)
    K = np.array(K)

    AL = AL > 0
    CA = CA > 0
    NA = NA > 0
    FE = FE > 0
    SI = SI > 0
    K = K > 0



    # now the final image will be the result of XOR'ing all the binary images together

    def xor_image_with_SI(SI, img):
        for x in range(img.shape[0]):
            for y in range(img.shape[1]):
                if (SI[x, y] == 1) and (img[x, y] == 1):
                    SI[x, y] = 0

        return SI

    xor_SI = xor_image_with_SI(SI, AL)
    xor_SI = xor_image_with_SI(xor_SI, CA)
    xor_SI = xor_image_with_SI(xor_SI, NA)
    xor_SI = xor_image_with_SI(xor_SI, FE)
    xor_SI = xor_image_with_SI(xor_SI, K)

    # now save he xor_SI image
    
    imageio.imsave(os.path.join(Chem_dir,'masks', 'xor_SI.png'), xor_SI.astype('uint8') * 255)  # save image


def create_AND_default(Euler_directory, Chem_directory):
    # create_directory(os.path.join('Euler_Image', 'binary'))

    max_16_reduced = clean_Euler(image=os.path.join(Euler_directory, 'euler_phase.png'))
    for x in range(max_16_reduced.shape[0]):
        for y in range(max_16_reduced.shape[1]):
            if max_16_reduced[x, y].all() == 240:
                max_16_reduced[x, y] = 0

    xor_SI = io.imread(os.path.join(Chem_directory, 'masks', 'xor_SI.png'))
    binary_SI = make_binary(xor_SI)
    imageio.imsave(os.path.join(Chem_directory,'masks', 'binary_SI.png'),
                   binary_SI.astype('uint8') * 255)  # save image

    # save the binary image in a folder called Euler_Images/binary

    # imageio.imsave('Euler_Images/binary/max_16_reduced.png', max_16_reduced.astype('uint8')*255 )# save image
    gray = color.rgb2gray(max_16_reduced)
    gray = gray * 255  # Scale the values up to 0-255
    # turn all values at 255 to 0
    for x in range(gray.shape[0]):
        for y in range(gray.shape[1]):
            if gray[x, y] == 255:
                gray[x, y] = 0
    thresh = skimage.filters.threshold_otsu(gray)
    binary = gray < thresh

    imageio.imsave(os.path.join(Euler_directory, 'binary_euler.png'),
                   binary.astype('uint8') * 255)  # Save image

    def AND_Euler_wth_SI(SI, img):
        for x in range(img.shape[0]):
            for y in range(img.shape[1]):
                if (SI[x, y] == 1) and (img[x, y] == 1):
                    img[x, y] = 1
                else:
                    img[x, y] = 0

        return img

    AND_Euler = AND_Euler_wth_SI(binary_SI, binary)
    # create a folder called Euler_Images/binary

    imageio.imsave(os.path.join(Euler_directory, 'AND_Euler.png'),
                   AND_Euler.astype('uint8') * 255)  # save image


def create_XA():
    print("Creating the masks...")
    create_X()
    create_A()
    print("Done with creating the masks!")


# def createBandContrast():
#
# Format of the data array is as follows:
# JSON array of objects
# Each object has the following properties:
# 1. PixelXY: [x,y]
# 2. EulerAngles: [phi1, Phi, phi2]
# 3. MAD: [MAD]
# 4. BC: [BC]
# 5. BS: [BS]
# each object represents a pixel in the image created by the csv File
# Temporary pagination implementation
def get_ctf_data(filename, page, items_per_page):
    PixelData = []
    start_index = (page - 1) * items_per_page
    end_index = start_index + items_per_page

    with open(filename, 'r') as file:
        for line in file:
            data = line.split()
            if data[0] == "Phase":
                break

        for i, line in enumerate(file):
            if i < start_index:
                continue
            if i >= end_index:
                break

            data = line.split()

            eulerAngles = [float(data[5]), float(data[6]), float(data[7])]
            pixelXY = [math.ceil(float(data[1])), math.ceil(float(data[2]))]
            MAD = [float(data[8])]
            BC = [float(data[9])]
            BS = [float(data[10])]
            Pixel = [pixelXY, eulerAngles, MAD, BC, BS]

            PixelData.append(Pixel)

    return PixelData


def get_chemical_data(fileName):
    with open(fileName, 'r') as file:
        file.seek(0)
        file.readline()
        file.readline()
        pixelChemicalData = []
        for line in file:
            line = line.split(",")
            XY = [int(line[1]), int(line[2])]
            chemical_values = line[6].split(' ')
            pixel = [XY, chemical_values]
            pixelChemicalData.append(pixel)

        return pixelChemicalData


def create_folder_structure_dict(path):
    result = {'name': os.path.basename(path), 'type': 'folder', 'children': []}

    if os.path.isdir(path):
        for entry in os.listdir(path):
            entry_path = os.path.join(path, entry)

            if os.path.isdir(entry_path):
                result['children'].append(create_folder_structure_dict(entry_path))
            else:
                result['children'].append({'name': entry, 'type': 'file'})

    return result


def create_folder_structure_json(sessionsName):
    try:
        path = os.path.join(get_dir_path('sessions'), sessionsName)
        folder_dict = create_folder_structure_dict(path)
        folder_json_str = json.dumps(folder_dict, indent=4)

    except Exception as e:
        return str(e), 500


def create_session_JSON_and_return(cur_directory, sessionName, csvFilePath, ctfFilePath, grainStepSize=10):
    sessionInfo_path = os.path.join(cur_directory, 'session.json')
    print(sessionInfo_path)
    session = {
        "sessionName": sessionName,
        "csvFilePath": csvFilePath,
        "ctfFilePath": ctfFilePath,
        "grainStepSize": grainStepSize
    }

    with open(sessionInfo_path, 'x') as file:
        json.dump(session, file)


def get_session_JSON(sessionJSON):
    try:
        with open(sessionJSON, 'r') as file:
            session = json.load(file)
        return session
    except FileNotFoundError:
        print(f"File not found: {sessionJSON}")
    except OSError:
        print(f"File could not be read: {sessionJSON}")
    except json.JSONDecodeError:
        print(f"File does not contain valid JSON: {sessionJSON}")


def add_to_ChemCache(image, Cache_path):
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    # image_extension = os.path.splitext(image)[1]
    image_name = f'{timestamp}.png'
    image_path = os.path.join(Cache_path, image_name)
    imageio.imsave(image_path, image)

    return image_name,image_path


def add_to_EulerCache(image, Cache_path):
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    # image_extension = os.path.splitext(image)[1]
    image_name = f'{timestamp}.png'
    image_path = os.path.join(Cache_path, image_name)

    imageio.imsave(image_path, image.astype('uint8'))

    return image_path


def extract_DIR(DirPath):
    import re

    # Find last '/' or '\\'
    pattern = r"[/\\](?!.*[/\\])"
    match = re.search(pattern, DirPath)

    DirName = ''
    if match:
        DirName = DirPath[match.start() + 1:]

    return DirName


