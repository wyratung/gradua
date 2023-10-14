image_resized = img.resize((64, 64))

# # Convert resized image to NumPy array
# data_resized = np.asarray(image_resized)

# # Add third dimension to data_resized
# data_resized = np.expand_dims(data_resized, axis=-1)

# # Repeat data_resized along third axis to create (None, 64, 64, 3) tensor
# tensor = np.repeat(data_resized, 3, axis=-1)

# test =model.predict(tensor)
# print(test)
