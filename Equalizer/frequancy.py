
import scipy.io
from Equalizer import app
from flask import request, json, jsonify
from scipy.fft import rfft, rfftfreq, irfft
from scipy.io import wavfile
from scipy import signal
import numpy as np
import json
import pandas as pd
# df = pd.read_csv('Equalizer/static/assets/Signal (10).csv')
# signal = list(df['amplitude'])
# time = list(df['time'])
# sr1 = len(time)/time[-1]
sr, song = wavfile.read("Equalizer/static/assets/pianosong.wav")

yf = rfft(song)
# xf = rfftfreq(len(yf), 1 / sr1)
xf = rfftfreq(len(yf), 1 / sr)
m = yf.copy()
# points_per_freq = len(xf) / (sr1 / 2)
points_per_freq = len(xf) / (sr / 2)
# target_idx1 = int(points_per_freq * 1)
# target_idx2 = int(points_per_freq * 250)

# yf[target_idx1 - 1 : target_idx2 - 1] = 0

# data = irfft(yf)
# data = data.astype(np.int16)

# wavfile.write('edited.wav', sr, data)

@app.route('/frequancy', methods = ['POST'])
def edit_freq():
    
    freq_amp = float(request.values['freqAmp'])
    freq_range = (request.values['freqRange']).split()
    target_idx1 = int(points_per_freq * int(freq_range[0]))
    target_idx2 = int(points_per_freq * int(freq_range[1]))
    yf[target_idx1-1: target_idx2] = m[target_idx1-1: target_idx2]*freq_amp/100 

    return []

@app.route('/data', methods = ['POST'])
def post_data():
    # z = yf.T[0]
    y1 = irfft(yf).astype(np.int16)
    # y = y1.astype(np.int16)
    x = list(np.linspace(0, len(y1)/sr, len(y1)))
    # x = list(np.linspace(0, len(y)/sr1, len(y)))
    
    # data = [xf,list(yf), 'gg']
    wavfile.write('edited.wav', sr, y1)
    normalizedY = y1 / (2.**15)
    N = 512 
    w = signal.blackman(N)
    f, t, freqAmp = signal.spectrogram(normalizedY, sr, window=w, nfft=N)
    normalizedSong = song / (2.**15)
    orignalF, orignalT, orignalFreqAmp = signal.spectrogram(normalizedSong, sr, window=w, nfft=N)
    orignalFreqAmp = 10*np.log10(orignalFreqAmp)
    freqAmp = 10*np.log10(freqAmp)
    sampledx = x[::50]
    sampledy = y1.tolist()[::50]
    sampledSong = song.tolist()[::50]
    
    
    return [sampledx,  sampledy, sampledSong, f.tolist(), t.tolist(),
            freqAmp.tolist(), orignalF.tolist(), orignalT.tolist(), orignalFreqAmp.tolist()]
    
    
    


