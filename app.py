from flask import Flask, render_template, jsonify, request

import joblib

app = Flask(__name__)

# Load the trained model

model = joblib.load('model.pkl')
vectorizer = joblib.load('vectorizer.pkl')
SPAM_THRESHOLD = 0.20

@app.route('/')

def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    message = data.get('message', '')
    
    # Transform the input message using the loaded vectorizer
    
    transformed_message = vectorizer.transform([message]).toarray()
    spam_probability = model.predict_proba(transformed_message)[0][
        list(model.classes_).index(1)
    ]
    
    result = 'Spam' if spam_probability >= SPAM_THRESHOLD else 'Not Spam'
    
    return jsonify({'prediction': result})
if __name__ == '__main__':
    app.run(debug=True)