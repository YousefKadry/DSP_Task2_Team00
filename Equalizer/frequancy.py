from Equalizer import app
from flask import request
from scipy.fft import rfft, rfftfreq, irfft, fftfreq
from scipy.io import wavfile
from scipy import signal
import numpy as np
import os
from Equalizer.utilities import uploadAudio, editFreqRange, saveAudio, dataToDraw

yf = 0
sr = 0
song = 0
xf = 0
yfCopy = 0
points_per_freq = 0
i = 0
@app.route('/frequency/upload', methods = ['POST'])
def uploadFreq():
    
    global sr, song, yf, xf, yfCopy, points_per_freq   
    yf, sr, song, xf, yfCopy, points_per_freq = uploadAudio(request)
    return []


@app.route('/frequency', methods = ['POST'])
def edit_freq():

    
    editFreqRange(request, yf, points_per_freq, yfCopy)

    return []

@app.route('/frequency/data', methods = ['POST'])
def post_freq_data():
    
    global i
    yt, i, filePath = saveAudio(i, yf, sr)
    
    
    sampledx,  sampledy, sampledSong, f, t, freqAmp, orignalF, orignalT, orignalFreqAmp = dataToDraw(yt, sr, song)
    
    return [sampledx,  sampledy, sampledSong, f, t,
            freqAmp, orignalF, orignalT, orignalFreqAmp, filePath]
    
    
    


