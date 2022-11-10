from flask import Flask
from flask_jsglue import JSGlue

app = Flask(__name__)
jsglue = JSGlue(app)

from Equalizer import frequancy, medical, music, vowels, mainRoute