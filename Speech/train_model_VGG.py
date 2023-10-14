import os
import pandas as pd
from glob import glob
import matplotlib.pyplot as pyplot
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
import keras
from path import Path
from keras.layers import Dense, Activation, Flatten, Dropout, BatchNormalization
from keras.models import Sequential, Model
from keras.layers import Conv2D, MaxPooling2D, MaxPool2D
from keras import regularizers, optimizers
import pandas as pd
import numpy as np
from keras.preprocessing.image import ImageDataGenerator
import pickle

train_data_path='data/train/'
test_data_path='data/test/'
wav_path = 'data/wav/'

# Ham doi duoi tu wav sang png
def append_ext(fn):
    return fn.replace(".wav",".png")

# Load du lieu train va test tu file csv
traindf=pd.read_csv('data/train.csv',dtype=str)
testdf=pd.read_csv('data/test.csv',dtype=str)
traindf["filename"]=traindf["filename"].apply(append_ext)
testdf["filename"]=testdf["filename"].apply(append_ext)

datagen=ImageDataGenerator(rescale=1./255.,validation_split=0.25)


# Load generator train
train_generator_vgg=datagen.flow_from_dataframe(
    dataframe=traindf,
    directory=train_data_path,
    x_col="filename",
    y_col="className",
    subset="training",
    batch_size=32,
    seed=42,
    shuffle=True,
    class_mode="categorical",
    target_size=(224,224))

# Load generator val
valid_generator_vgg=datagen.flow_from_dataframe(
    dataframe=traindf,
    directory=train_data_path,
    x_col="filename",
    y_col="className",
    subset="validation",
    batch_size=32,
    seed=42,
    shuffle=True,
    class_mode="categorical",
    target_size=(224,224))


# model VGG 16
modelvgg = Sequential()
modelvgg.add(Conv2D(input_shape=(224,224,3),filters=64,kernel_size=(3,3),padding="same", activation="relu"))
modelvgg.add(Conv2D(filters=64,kernel_size=(3,3),padding="same", activation="relu"))
modelvgg.add(MaxPool2D(pool_size=(2,2),strides=(2,2)))
modelvgg.add(Conv2D(filters=128, kernel_size=(3,3), padding="same", activation="relu"))
modelvgg.add(Conv2D(filters=128, kernel_size=(3,3), padding="same", activation="relu"))
modelvgg.add(MaxPool2D(pool_size=(2,2),strides=(2,2)))
modelvgg.add(Conv2D(filters=256, kernel_size=(3,3), padding="same", activation="relu"))
modelvgg.add(Conv2D(filters=256, kernel_size=(3,3), padding="same", activation="relu"))
modelvgg.add(Conv2D(filters=256, kernel_size=(3,3), padding="same", activation="relu"))
modelvgg.add(MaxPool2D(pool_size=(2,2),strides=(2,2)))
modelvgg.add(Conv2D(filters=512, kernel_size=(3,3), padding="same", activation="relu"))
modelvgg.add(Conv2D(filters=512, kernel_size=(3,3), padding="same", activation="relu"))
modelvgg.add(Conv2D(filters=512, kernel_size=(3,3), padding="same", activation="relu"))
modelvgg.add(MaxPool2D(pool_size=(2,2),strides=(2,2)))
modelvgg.add(Conv2D(filters=512, kernel_size=(3,3), padding="same", activation="relu"))
modelvgg.add(Conv2D(filters=512, kernel_size=(3,3), padding="same", activation="relu"))
modelvgg.add(Conv2D(filters=512, kernel_size=(3,3), padding="same", activation="relu"))
modelvgg.add(MaxPool2D(pool_size=(2,2),strides=(2,2)))
modelvgg.add(Dropout(0.5))
modelvgg.add(Flatten())
modelvgg.add(Dense(units=4096,activation="relu"))
modelvgg.add(Dropout(0.5))
modelvgg.add(Dense(units=4096,activation="relu"))
modelvgg.add(Dropout(0.5))
modelvgg.add(Dense(units=5, activation="softmax"))
from keras.optimizers import Adam
opt = Adam(lr=0.001)
modelvgg.compile(optimizer=opt, loss=keras.losses.categorical_crossentropy, metrics=['accuracy'])
modelvgg.summary()

# Tinh so buoc trong 1 epoch khi train
STEP_SIZE_TRAIN=train_generator_vgg.n//train_generator_vgg.batch_size
# Tinh so buoc trong 1 epoch khi val
STEP_SIZE_VALID=valid_generator_vgg.n//valid_generator_vgg.batch_size



# Train model
history=modelvgg.fit_generator(generator=train_generator_vgg,
                    steps_per_epoch=STEP_SIZE_TRAIN,
                    validation_data=valid_generator_vgg,
                    validation_steps=STEP_SIZE_VALID,
                    epochs=25,verbose=1
)

pyplot.figure(figsize=(20,10))
pyplot.subplot(211)
pyplot.title('Loss')
pyplot.plot(history.history['loss'], label='train')
pyplot.plot(history.history['val_loss'], label='test')
pyplot.legend()
# plot accuracy during training
pyplot.subplot(212)
pyplot.title('Accuracy')
pyplot.plot(history.history['accuracy'], label='train')
pyplot.plot(history.history['val_accuracy'], label='test')
pyplot.legend()
pyplot.show()
# Luu model
modelvgg.save("modelvgg.h5");
np.save('model_indices', train_generator_vgg.class_indices)
with open('model_indices.pickle_vgg', 'wb') as handle:
    pickle.dump(train_generator_vgg.class_indices, handle, protocol=pickle.HIGHEST_PROTOCOL)



print("Model trained!")