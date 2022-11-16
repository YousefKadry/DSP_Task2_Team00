from Equalizer import app
from flask import request
from scipy.fft import rfft, rfftfreq, irfft, fftfreq
from scipy.io import wavfile
from scipy import signal
import numpy as np
import os
from Equalizer.utilities import saveAudio, dataToDraw
import librosa

yt = 0
sr = 0
song = 0
xf = 0
i = 0
factor = 1
@app.route('/pitch/upload', methods = ['POST'])
def uploadPitch():
    
    if request.method == 'POST':
        file = request.files['file']
    if file:
        file.save(os.path.join('Equalizer/static/assets/upload-edit/uploaded.wav'))
    
    global song, sr
    song, sr = librosa.load('Equalizer/static/assets/upload-edit/uploaded.wav', sr=None)
    
    return []


@app.route('/pitch', methods = ['POST'])
def edit_pitch():

    global song, yt, sr, factor
    
    factor = float(request.values['freqAmp'])
    yt = librosa.effects.time_stretch(song, rate=factor)



    
    return []



@app.route('/pitch/data', methods = ['POST'])
def post_pitch_data():
    
    global i, yt, sr, factor
    # sr = int(sr/factor)
    yt, i, filePath = saveAudio(i, 0, int(sr/factor), song)
    
    sampledx,  sampledy, sampledSong, f, t, freqAmp, orignalF, orignalT, orignalFreqAmp = dataToDraw(yt, int(sr/factor), song)
    
    return [sampledx,  sampledy, sampledSong, f, t,
            freqAmp, orignalF, orignalT, orignalFreqAmp, filePath]