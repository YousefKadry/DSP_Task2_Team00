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
m = 0
points_per_freq = 0
i = 0

@app.route('/musicalInstruments/upload', methods = ['POST'])
def uploadMusic():
    
    global sr, song, yf, xf, m, points_per_freq
    yf, sr, song, xf, m, points_per_freq = uploadAudio(request)
    return []


@app.route('/musicalInstruments', methods = ['POST'])
def edit_music():

    editFreqRange(request, yf, points_per_freq, m)
    
    return []



@app.route('/musicalInstruments/data', methods = ['POST'])
def post_music_data():
    
    global i
    yt, i, filePath = saveAudio(i, yf, sr)
    
    sampledx,  sampledy, sampledSong, f, t, freqAmp, orignalF, orignalT, orignalFreqAmp = dataToDraw(yt, sr, song)
    
    return [sampledx,  sampledy, sampledSong, f, t,
            freqAmp, orignalF, orignalT, orignalFreqAmp, filePath]