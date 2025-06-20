

// Async function triggered when the "Epitopes" button is clicked
async function submitEpitopePrediction(event) {
    // Prevent the default form submission behavior (which would reload the page)
    event.preventDefault();

    // Show the loading spinner
    document.getElementById("spinner").style.display = "block";

    // Send an asynchronous POST request to the Flask backend at /predict_epitopes
    const response = await fetch("/predict_epitopes", {
        method: "POST", // We're sending data to the server
        headers: {
            // This header tells the server to expect standard form-encoded data (even though we're not sending any actual body content here)
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    // Get the <div> where we'll show the predicted results
    const resultDiv = document.getElementById("epitope-result");

    // Check if the server responded with a 200 OK status
    if (response.ok) {
        // Parse the response as JSON (a list of sequences and residue data)
        const data = await response.json();

        // Start building the HTML that will be injected into the result div
        let html = "";

        // Loop through each sequence (grouped by Accession)
        data.forEach(seq => {
            // Add a header for the sequence name
            html += `<h4>${seq.accession}</h4><p style="font-family: monospace;">`;

            // Loop through each residue in the sequence
            seq.residues.forEach(r => {
                // If the residue's score is above the threshold (0.05),
                // wrap it in a red-colored span tag
                if (r.score > 0.05) {
                    html += `<span style="background-color: yellow;">${r.residue}</span>`;
                } else {
                    // Otherwise, just add the residue normally
                    html += r.residue;
                }
            });

            // Close the paragraph tag after all residues
            html += `</p>`;
        });

        // Inject the generated HTML into the result div
        resultDiv.innerHTML = html;
    } else {
        // If the request failed, show an error message
        resultDiv.innerHTML = "<p>Error predicting epitopes.</p>";
    }

    // Hide the spinner once the processing is complete (whether success or error)
    document.getElementById("spinner").style.display = "none";
}


// document.getElementById("epitope-result").innerHTML = html;
