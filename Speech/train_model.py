#from memory_profiler import memory_usage
import os
import matplotlib.pyplot as pyplot
import pandas as pd
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
from sklearn.model_selection import train_test_split

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
train_generator=datagen.flow_from_dataframe(
    dataframe=traindf,
    directory=train_data_path,
    x_col="filename",
    y_col="className",
    subset="training",
    batch_size=32,
    seed=42,
    shuffle=True,
    class_mode="categorical",
    target_size=(64,64))

# train_data, valid_data = train_test_split(train_generator, test_size=0.1)
# Load generator val
valid_generator=datagen.flow_from_dataframe(
    dataframe=traindf,
    directory=train_data_path,
    x_col="filename",
    y_col="className",
    subset="validation",
    batch_size=32,
    seed=42,
    shuffle=True,
    class_mode="categorical",
    target_size=(64,64))

# Khoi tao model
model = Sequential()
model.add(Conv2D(32, (3, 3), padding='same',
                 input_shape=(64,64,3)))
model.add(Activation('relu'))
model.add(Conv2D(64, (3, 3)))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))
model.add(Conv2D(64, (3, 3), padding='same'))
model.add(Activation('relu'))
model.add(Conv2D(64, (3, 3)))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.5))
model.add(Conv2D(128, (3, 3), padding='same'))
model.add(Activation('relu'))
model.add(Conv2D(128, (3, 3)))
model.add(Activation('relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.5))
model.add(Flatten())
model.add(Dense(512))
model.add(Activation('relu'))
model.add(Dropout(0.5))
model.add(Dense(5, activation='softmax'))
# model.compile(optimizer='adam',loss='binary_crossentropy',metrics=['accuracy'])
model.compile(Adam(lr=5e-4),loss="categorical_crossentropy",metrics=["accuracy"])
# model.compile(optimizers.adam(lr=0.0005, decay=1e-6),loss="categorical_crossentropy",metrics=["accuracy"])
model.summary()

# Tinh so buoc trong 1 epoch khi train
STEP_SIZE_TRAIN=train_generator.n//train_generator.batch_size
# Tinh so buoc trong 1 epoch khi val
STEP_SIZE_VALID=train_generator.n//train_generator.batch_size

# Train model
history = model.fit(
    train_generator,
    steps_per_epoch=STEP_SIZE_TRAIN,
    validation_data=train_generator,
    validation_steps=STEP_SIZE_VALID,
    epochs=50,
    verbose=1
)

# history = model.fit(train_generator, batch_size=32, epochs=50,validation_data=(valid_generator))

# plot loss và accuracy
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
model.save("model.h5")
# Luu ten class
#np.save('model_indices', train_generator.class_indices)
with open('model_indices.pickle', 'wb') as handle:
    pickle.dump(train_generator.class_indices, handle, protocol=pickle.HIGHEST_PROTOCOL)

print("Model trained!")
