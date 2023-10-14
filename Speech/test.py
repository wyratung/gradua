import os
import pandas as pd
from PIL import Image
from glob import glob
import numpy as np
from keras import layers
from keras import models
from keras.layers import LeakyReLU
from keras.optimizers import Adam
import keras.backend as K
import librosa
import librosa.display
import pylab
import matplotlib.pyplot as plt
from matplotlib import figure
import gc
from path import Path
from keras.layers import Dense, Activation, Flatten, Dropout, BatchNormalization
from keras.models import Sequential, Model
from keras.models import load_model
from keras.layers import Conv2D, MaxPooling2D
from keras import regularizers, optimizers
import pandas as pd
import numpy as np
from keras.preprocessing.image import ImageDataGenerator
import pickle
# file_name="./data\\336_.wav"
# name="336_"
# file_path="./data/"
# def create_spectrogram(filename,name,file_path):
#     plt.interactive(False)
#     clip, sample_rate = librosa.load(filename, sr=None)
#     # fig, ax = plt.subplots(figsize=(0.72,0.72))
#     fig = plt.figure(figsize=[0.72,0.72])
#     ax = fig.add_subplot(111)
#     ax.axes.get_xaxis().set_visible(False)
#     ax.axes.get_yaxis().set_visible(False)
#     ax.set_frame_on(False)
#     S = librosa.feature.melspectrogram(y=clip, sr=sample_rate)                        
#     librosa.display.specshow(librosa.power_to_db(S, ref=np.max))
#     filename  = file_path + name + '.png'
#     print(filename, name)
#     plt.savefig(filename, dpi=400, bbox_inches='tight',pad_inches=0)
#     # plt.close()
#     # fig.clf()
#     # plt.close(fig)    
#     plt.close('all')
#     # del filename,name,clip,sample_rate,fig,ax,S

# create_spectrogram(file_name,name,file_path)

model = load_model('model.h5')
img = Image.open('./data\\116_.png')
data = np.asarray(img)
image_resized = img.resize((64, 64))

data_resized = np.asarray(image_resized)
data_resized=data_resized[:, :, :3]
data_resized = np.expand_dims(data_resized, axis=0)
print(data_resized.shape)
test =model.predict(data_resized)
print(test)
predicted_class_indices=np.argmax(test,axis=1)
# Load class name tu file
with open('model_indices.pickle', 'rb') as handle:
    labels = pickle.load(handle)
print(labels)
labels = dict((v,k) for k,v in labels.items())
predictions = [labels[k] for k in predicted_class_indices]
print(predictions)
# Resize image to (64, 64) using Pillow
# image_resized = img.resize((64, 64))

# # Convert resized image to NumPy array
# data_resized = np.asarray(image_resized)

# # Add third dimension to data_resized
# data_resized = np.expand_dims(data_resized, axis=-1)

# # Repeat data_resized along third axis to create (None, 64, 64, 3) tensor
# tensor = np.repeat(data_resized, 3, axis=-1)

# test =model.predict(tensor)
# print(test)
