from flask import Flask, render_template
from flask_bootstrap import Bootstrap5

app = Flask(__name__)
bootsrap =Bootstrap5(app) # Create bootstrap object

@app.route("/")
def homepage():
    """ Main landing page """
    return render_template("about.html")

@app.route("/about")
def about():
    """ about page """
    return render_template("about.html")

@app.route("/resume")
def resume():
    """ Resume page """
    return render_template("resume.html")

@app.route("/portfolio")
def portfolio():
    """ Portfolio page """
    return render_template("portfolio.html")

@app.route("/connect4")
def connect4():
    """ contact page """
    return render_template("connect4.html")