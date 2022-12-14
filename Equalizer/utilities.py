from Equalizer import app
from flask import request
from scipy.fft import rfft, rfftfreq, irfft, fftfreq
from scipy.io import wavfile
from scipy import signal
import numpy as np
import os


def uploadAudio(request):
    if request.method == 'POST':
        file = request.files['file']
    if file:
        file.save(os.path.join('Equalizer/static/assets/upload-edit/uploaded.wav'))
    
    sr, song = wavfile.read("Equalizer/static/assets/upload-edit/uploaded.wav")
    yf = rfft(song)
    xf = fftfreq(len(yf), 1 / sr)
    yfCopy = yf.copy()
    points_per_freq = len(xf) / (sr / 2)
    return yf, sr, song, xf, yfCopy, points_per_freq


def editFreqRange(request, yf, points_per_freq, yfCopy):
    freq_amp = float(request.values['freqAmp'])
    freq_range = (request.values['freqToChange']).split()
    target_idx1 = int(points_per_freq * float(freq_range[0]))
    target_idx2 = int(points_per_freq * float(freq_range[1]))
    yf[target_idx1-1 : target_idx2] = yfCopy[target_idx1-1 : target_idx2]*freq_amp
    
    
    
def saveAudio(i, yf, sr, yt=[]):
    if(len(yt)==0):
        yt = irfft(yf).astype(np.int16)
    if(os.path.exists(f"Equalizer/static/edited{i-1}.wav")):
        os.remove(f"Equalizer/static/edited{i-1}.wav")
    if (os.path.exists(f"Equalizer/static/edited{i+1}.wav")):
        os.remove(f"Equalizer/static/edited{i+1}.wav")
    wavfile.write(f"Equalizer/static/edited{i}.wav", sr, yt)
    i += 1
    return yt, i, f'edited{i-1}.wav'


def dataToDraw(yt, sr, song, factor=1):
    
    
    normalizedY = yt / (2.0**15)
    N = 512
    w = signal.blackman(N)
    f, t, freqAmp = signal.spectrogram(normalizedY, int(sr/factor), window=w, nfft=N)
    normalizedSong = song / (2.0**15)
    orignalF, orignalT, orignalFreqAmp = signal.spectrogram(
        normalizedSong, sr, window=w, nfft=N)
    orignalFreqAmp = 10*np.log10(orignalFreqAmp)
    freqAmp = 10*np.log10(freqAmp)
    x = list(np.linspace(0, len(song)/sr, len(song)))
    sampledx = x[::80]
    sampledy = yt.tolist()[::80]
    sampledSong = song.tolist()[::80]
    if factor == 1:
    
        return sampledx, sampledy, sampledSong, f.tolist(), t.tolist(), freqAmp.tolist(), orignalF.tolist(), orignalT.tolist(), orignalFreqAmp.tolist()
    else:
        srPitch = int(sr/factor)
        xpitch = list(np.linspace(0, int(len(yt)/srPitch), len(yt)))
        sampledxpitch = xpitch[::80]
        return sampledx, sampledy, sampledSong, f.tolist(), t.tolist(), freqAmp.tolist(), orignalF.tolist(), orignalT.tolist(), orignalFreqAmp.tolist(), sampledxpitch





    
