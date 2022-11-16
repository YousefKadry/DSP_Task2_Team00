from Equalizer import app
from flask import request
from scipy.fft import rfft, rfftfreq, irfft, fftfreq
from scipy.io import wavfile
from scipy import signal
import numpy as np
import os
from Equalizer.utilities import uploadAudio, editFreqRange, saveAudio, dataToDraw, modifyVowel

yf = 0
sr = 0
song = 0
xf = 0
m = 0
points_per_freq = 0
i = 0

@app.route('/vowels/upload', methods = ['POST'])
def uploadVowels():
    
    global sr, song, yf, xf, m, points_per_freq
    yf, sr, song, xf, m, points_per_freq = uploadAudio(request)
    return []


@app.route('/vowels', methods = ['POST'])
def edit_vowels():

    global yf, sr, m
    freq_amp = float(request.values['freqAmp'])
    freq_range = (request.values['freqToChange']).split()
    
    modifyVowel(sr, xf, yf, m, song, freq_amp, int(freq_range[1]), int(freq_range[0]))
    
    return []



@app.route('/vowels/data', methods = ['POST'])
def post_vowels_data():
    
    global i
    yt, i, filePath = saveAudio(i, yf, sr)
    
    sampledx,  sampledy, sampledSong, f, t, freqAmp, orignalF, orignalT, orignalFreqAmp = dataToDraw(yt, sr, song)
    
    return [sampledx,  sampledy, sampledSong, f, t,
            freqAmp, orignalF, orignalT, orignalFreqAmp, filePath]