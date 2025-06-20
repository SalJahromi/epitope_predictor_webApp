// function showSpinner() {
//     document.getElementById("spinner").style.display = "block";
// }

async function submitEpitopePrediction(event) {
    event.preventDefault(); // Stop default form action
    document.getElementById("spinner").style.display = "block";

    const response = await fetch("/predict_epitopes", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    if (response.ok) {
        const html = await response.text();
        document.getElementById("epitope-result").innerHTML = html;
    } else {
        alert("Prediction failed.");
        document.getElementById("epitope-result").innerHTML = "<p>Error predicting epitopes.</p>";
    }

    document.getElementById("spinner").style.display = "none";
}
