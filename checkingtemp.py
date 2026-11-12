# Checking if the vectorizer.pkl file exists and loading it

import joblib

try:
    vectorizer = joblib.load('vectorizer.pkl')
    print("Vectorizer loaded successfully.")
except FileNotFoundError:
    print("Vectorizer file not found.")
except Exception as e:
    print(f"An error occurred while loading the vectorizer: {e}")
    
    
try:
    model = joblib.load('model.pkl')
    print("Model loaded successfully.")
except FileNotFoundError:
    print("Model file not found.")
except Exception as e:
    print(f"An error occurred while loading the model: {e}")