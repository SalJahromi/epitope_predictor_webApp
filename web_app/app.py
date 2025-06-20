from flask import Flask, render_template, request, session, jsonify, render_template_string
from bp3 import bepipred3
from pathlib import Path
import tempfile
import os
from Bio import SeqIO
import pandas as pd
from io import StringIO
from bp3 import bepipred3
from pathlib import Path
import time

app = Flask(__name__)
app.secret_key = "123"  # <-- Required for sessions to work


def parse(fasta_file):

    seq_list = []
    content = fasta_file.read().decode("utf-8")  # Convert bytes to string
    fasta_io = StringIO(content)
    for seq_record in SeqIO.parse(fasta_io, "fasta"):
        seq_list.append((seq_record.id, str(seq_record.seq)))
    return seq_list


@app.route("/", methods=["GET", "POST"])
def index():
    sequences = []
    filename = None

    if request.method == "POST":
        fasta_file = request.files.get("fasta_file")

        if fasta_file:
            filename = fasta_file.filename
            sequences = parse(fasta_file)
            # temp_file_create(fasta_file)
            fasta_file.seek(0)

            with tempfile.NamedTemporaryFile(delete=False, suffix=".fasta", mode="wb") as temp:
                temp.write(fasta_file.read())
                session["uploaded_fasta_path"] = temp.name

    return render_template("index.html", filename=filename, sequences=sequences)



@app.route("/predict_epitopes", methods=["POST"])
def predict_epitopes():
    fasta_path = session.get("uploaded_fasta_path")
    if not fasta_path or not os.path.exists(fasta_path):
        return "No uploaded FASTA file found.", 400

    MyAntigens = bepipred3.Antigens(Path(fasta_path), Path.cwd() / "esm2_encodings", add_seq_len=True)
    MyBP3EnsemblePredict = bepipred3.BP3EnsemblePredict(MyAntigens)
    MyBP3EnsemblePredict.run_bp3_ensemble()
    out_dir = Path.cwd() / "example_output"
    MyBP3EnsemblePredict.create_csvfile(out_dir)

    # sequences = parse(open(fasta_path, 'rb'))
    # filename = Path(fasta_path).name

    time.sleep(2)  # simulate delay
    # return "Prediction Complete!"
    return "Prediction Complete!"

if __name__ == "__main__":
    app.run(debug=True)
