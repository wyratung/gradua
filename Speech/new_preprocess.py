#from memory_profiler import memory_usage
import os
import pandas as pd
from glob import glob
import numpy as np
from keras import layers
from keras import models
from tensorflow import keras
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
from keras.layers import Conv2D, MaxPooling2D
from keras import regularizers, optimizers
import pandas as pd
import numpy as np
from keras.preprocessing.image import ImageDataGenerator

train_data_path='data/train/'
test_data_path='data/test/'
wav_path = 'data/wav/'

# Ham tao ra spectrogram tu file wav
def create_spectrogram(filename,name,file_path):
    plt.interactive(False)
    clip, sample_rate = librosa.load(filename, sr=None,mono=True, duration=4)
    # fig, ax = plt.subplots(figsize=(0.72,0.72))
    fig = plt.figure(figsize=[0.72,0.72])
    n_mels = 43
    n_fft = int(sr * 0.025)  # 25ms
    hop_length = int(sr * 0.010)  # 10ms
    S = librosa.feature.melspectrogram(y=audio, sr=sr, n_mels=n_mels, n_fft=n_fft, hop_length=hop_length)

# Convert to dB scale and normalize
    S_dB = librosa.power_to_db(S, ref=np.max)
    S_dB_norm = (S_dB - S_dB.mean()) / S_dB.std()
    name =name.split('\\')[1]
    filename  = file_path + name + '.png'
    print(filename, name)
    plt.savefig(filename, dpi=400, bbox_inches='tight',pad_inches=0)
    plt.close('all')
    del filename,name,clip,sample_rate,fig,ax,S

# Lap trong thu muc data/wav/train va tao ra 120 file anh spectrogram
Data_dir=np.array(glob(wav_path+"train/*"))
print(Data_dir)
for file in Data_dir[0:180]:
    filename,name = file,file.split('/')[-1].split('.')[0]
    create_spectrogram(filename,name, train_data_path)

gc.collect()

# Lap trong thu muc data/wav/test va tao ra 40 file anh spectrogram
Test_dir=np.array(glob(wav_path+"test/*"))


for file in Test_dir[0:60]:
    filename,name = file,file.split('/')[-1].split('.')[0]
    create_spectrogram(filename,name,test_data_path)

gc.collect()

print("Process done!")