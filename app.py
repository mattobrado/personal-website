from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def homepage():
    """ Main landing page """
    return render_template("cover.html")

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

@app.route("/contact")
def contact():
    """ contact page """
    return render_template("contact.html")