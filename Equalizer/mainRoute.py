from Equalizer import app 
from flask import render_template

@app.route('/')
def main_route():
    audiopath = '../static/assets/upload-edit/edited.wav'
    return render_template('index.html', audiopath=audiopath)


