from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import pdfplumber
import spacy
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
nlp = spacy.load("en_core_web_sm")

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        return " ".join([page.extract_text() for page in pdf.pages if page.extract_text()])

# Function to calculate match score
def calculate_match_score(resume_text, job_desc):
    doc1 = nlp(resume_text.lower())
    doc2 = nlp(job_desc.lower())
    return round(doc1.similarity(doc2) * 100, 2)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask API is running!"})

@app.route("/shortlist", methods=["POST"])
def shortlist_resume():
    if "resume" not in request.files or "job_desc" not in request.form:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["resume"]
    job_desc = request.form["job_desc"]

    if file.filename == "" or file.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Invalid file format"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    resume_text = extract_text_from_pdf(filepath)
    match_score = calculate_match_score(resume_text, job_desc)

    status = "Shortlisted" if match_score <= 50 else "Unshortlisted"

    response = {
        "message": "Resume processed successfully",
        "match_score": match_score,
        "status": status,
        "filename": filename,
        "text_snippet": resume_text[:500]  # Providing a snippet of extracted text
    }
    return jsonify(response)

@app.route("/bulk_shortlist", methods=["POST"])
def bulk_shortlist():
    if "resumes" not in request.files or "job_desc" not in request.form:
        return jsonify({"error": "No files uploaded"}), 400
    
    job_desc = request.form["job_desc"]
    files = request.files.getlist("resumes")
    results = []
    
    for file in files:
        if file.filename == "" or file.filename.split(".")[-1].lower() not in ALLOWED_EXTENSIONS:
            continue

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        resume_text = extract_text_from_pdf(filepath)
        match_score = calculate_match_score(resume_text, job_desc)

        status = "Shortlisted" if match_score <= 50 else "Unshortlisted"

        results.append({
            "filename": filename,
            "match_score": match_score,
            "status": status,
        })
    
    return jsonify({"message": "Bulk resumes processed successfully", "results": results})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
 