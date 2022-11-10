from Equalizer import app 
from flask import render_template, send_file

@app.route('/')
def main_route():
    audiopath = '../static/assets/upload-edit/edited.wav'
    return render_template('index.html', audiopath=audiopath)


@app.route('/audio', methods= ['GET'])
def get_audio():
    audiopath = 'static/assets/upload-edit/edited.wav'
    return send_file(
        audiopath, 
        mimetype="audio/wav"
        )


