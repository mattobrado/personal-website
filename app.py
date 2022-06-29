from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def homepage():
    """ Main landing page """
    return render_template("homepage.html")

@app.route("/resume")
def resume():
    """ Resume page """
    return render_template("resume.html")

@app.route("/portfolio")
def portfolio():
    """ Portfolio page """
    return render_template("portfolio.html")

@app.route("/contact")
def contact():
    """ contact page """
    return render_template("contact.html")