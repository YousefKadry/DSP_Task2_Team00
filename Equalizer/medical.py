from Equalizer import app
from flask import request
from scipy.fft import rfft, rfftfreq, irfft, fftfreq
from scipy.io import wavfile
from scipy import signal
import numpy as np
import os
from Equalizer.utilities import uploadAudio, editFreqRange, saveAudio, dataToDraw
from scipy.misc import electrocardiogram

ecg = electrocardiogram()
sr = 360 
time = np.arange(ecg.size)/sr
yf = rfft(ecg)
xf = rfftfreq(len(ecg), (time[1]-time[0]))
points_per_freq = len(xf) / (xf[-1])
yfCopy = yf.copy()


@app.route('/medicalSignal', methods = ['POST'])
def edit_medical():

    editFreqRange(request, yf, points_per_freq, yfCopy)
    
    
    return []



@app.route('/medicalSignal/data', methods = ['POST'])
def post_medical_data():
    
    global i
    yt = irfft(yf).astype(np.int16)
    filePath = ''
    x = list(np.linspace(0, len(yt)/sr, len(yt)))
    

    sampledx,  sampledy, sampledSong, f, t, freqAmp, orignalF, orignalT, orignalFreqAmp = dataToDraw(yt, sr, ecg)
    
    return [sampledx,  sampledy, sampledSong, f, t,
            freqAmp, orignalF, orignalT, orignalFreqAmp, filePath]


