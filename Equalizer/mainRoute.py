from Equalizer import app 
from flask import render_template

@app.route('/')
def main_route():
    slidernum = [i for i in range(1,11)]
    return render_template('index.html', slidernum=slidernum)