from Equalizer import app
from flask import request
from scipy.fft import rfft, rfftfreq, irfft, fftfreq
from scipy.io import wavfile
from scipy import signal
import numpy as np
import os
from Equalizer.utilities import uploadAudio, editFreqRange, saveAudio, dataToDraw
# df = pd.read_csv('Equalizer/static/assets/Signal (10).csv')
# signal = list(df['amplitude'])
# time = list(df['time'])
# sr1 = len(time)/time[-1]
# sr, song = wavfile.read("Equalizer/static/assets/pianosong.wav")
# sr, song = wavfile.read("Equalizer/static/assets/upload_sample1.wav")
# sr, song = wavfile.read("Equalizer/static/assets/test.wav")

# sr, song = wavfile.read("Equalizer/static/assets/test.wav")
# yf = rfft(song)
# xf = rfftfreq(len(yf), 1 / sr)
# m = yf.copy()
# points_per_freq = len(xf) / (sr / 2)

# xf = rfftfreq(len(yf), 1 / sr1)
# points_per_freq = len(xf) / (sr1 / 2)
# target_idx1 = int(points_per_freq * 1)
# target_idx2 = int(points_per_freq * 250)

# yf[target_idx1 - 1 : target_idx2 - 1] = 0

# data = irfft(yf)
# data = data.astype(np.int16)

# wavfile.write('edited.wav', sr, data)
yf = 0
sr = 0
song = 0
xf = 0
m = 0
points_per_freq = 0
i = 0
@app.route('/frequency/upload', methods = ['POST'])
def uploadFreq():
    # if request.method == 'POST':
    #     file = request.files['file']
    # if file:
    #     file.save(os.path.join('Equalizer/static/assets/upload-edit/uploaded.wav'))
    # sr, song = wavfile.read("Equalizer/static/assets/upload-edit/uploaded.wav")
    # yf = rfft(song)
    # xf = fftfreq(len(yf), 1 / sr)
    # m = yf.copy()
    # points_per_freq = len(xf) / (sr / 2)
    global sr, song, yf, xf, m, points_per_freq   
    yf, sr, song, xf, m, points_per_freq = uploadAudio(request)
    return []


@app.route('/frequency', methods = ['POST'])
def edit_freq():

    # freq_amp = float(request.values['freqAmp'])
    # freq_range = (request.values['freqToChange']).split()
    # target_idx1 = int(points_per_freq * float(freq_range[0]))
    # target_idx2 = int(points_per_freq * float(freq_range[1]))
    
    # yf[target_idx1-1 : target_idx2] = m[target_idx1-1 : target_idx2]*freq_amp 
    editFreqRange(request, yf, points_per_freq, m)

    return []

@app.route('/frequency/data', methods = ['POST'])
def post_freq_data():
    # z = yf.T[0]
    # y = y1.astype(np.int16)
    # x = list(np.linspace(0, len(y)/sr1, len(y)))
    # data = [xf,list(yf), 'gg']
    global i
    yt, i, filePath = saveAudio(i, yf, sr)
    
    # yt = irfft(yf).astype(np.int16)
    # if(os.path.exists(f"Equalizer/static/edited{i-1}.wav")):
    #     os.remove(f"Equalizer/static/edited{i-1}.wav")
    # if(os.path.exists(f"Equalizer/static/edited{i+1}.wav")):
    #     os.remove(f"Equalizer/static/edited{i+1}.wav")
    # wavfile.write(f"Equalizer/static/edited{i}.wav", sr, yt)
    # i+=1
    
    
    
    # normalizedY = yt / (2.**15)
    # N = 512 
    # w = signal.blackman(N)
    # f, t, freqAmp = signal.spectrogram(normalizedY, sr, window=w, nfft=N)
    # normalizedSong = song / (2.**15)
    # orignalF, orignalT, orignalFreqAmp = signal.spectrogram(normalizedSong, sr, window=w, nfft=N)
    # orignalFreqAmp = 10*np.log10(orignalFreqAmp)
    # freqAmp = 10*np.log10(freqAmp)
    # x = list(np.linspace(0, len(yt)/sr, len(yt)))
    # sampledx = x[::80]
    # sampledy = yt.tolist()[::80]
    # sampledSong = song.tolist()[::80]
    
    sampledx,  sampledy, sampledSong, f, t, freqAmp, orignalF, orignalT, orignalFreqAmp = dataToDraw(yt, sr, song)
    
    return [sampledx,  sampledy, sampledSong, f, t,
            freqAmp, orignalF, orignalT, orignalFreqAmp, filePath]
    
    
    


