
import scipy.io
from Equalizer import app
from flask import request, json
from scipy.fft import rfft, rfftfreq, irfft
from scipy.io import wavfile
import numpy as np

sr, song = wavfile.read("Equalizer/static/assets/[MP3DL.CC] (Cutter) Beethoven 9 - Chicago Symphony Orchestra - Riccardo Muti-HQ-right.wav")
yf = rfft(song)
xf = rfftfreq(len(yf), 1 / sr)

points_per_freq = len(xf) / (sr / 2)
target_idx1 = int(points_per_freq * 1)
target_idx2 = int(points_per_freq * 250)

yf[target_idx1 - 1 : target_idx2 - 1] = 0

data = irfft(yf)
data = data.astype(np.int16)

wavfile.write('edited.wav', sr, data)

@app.route('/freq', methods = ['POST'])
def edit_freq():
    
    silders_values = json.loads(request.data)
    values = silders_values.values()
    for value in values:
        freq_range = value['freq_range']
        freq_amp = value['freq_amp']
        target_idx1 = int(points_per_freq * freq_range[0])
        target_idx2 = int(points_per_freq * freq_range[1])
        yf[target_idx1 - 1 : target_idx2 - 1] = freq_amp
    y = irfft(yf)
    x = np.linspace(0, len(y)/sr, len(y))
    data = {x:x, y:y}
    
    return data
    
    
    
