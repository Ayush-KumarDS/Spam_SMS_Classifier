const input = document.getElementById("message");
const btn = document.getElementById("predictBtn");
const btnText = document.getElementById("btnText");
const resultBox = document.getElementById("result");
const counter = document.getElementById("count");

input.addEventListener("input", () => {
    counter.textContent = `${input.value.length} / ${input.maxLength}`;
});

btn.addEventListener("click", checkMessage);

input.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        checkMessage();
    }
});

function setLoading(status) {
    btn.disabled = status;
    btn.classList.toggle("loading", status);
    btnText.textContent = status
        ? "Checking..."
        : "Check Message";
}

function showResult(type, title, detail) {

    resultBox.hidden = false;

    resultBox.innerHTML = `
        <div class="result-card ${type}">
            <div class="badge">${title}</div>
            <p>${detail}</p>
        </div>
    `;
}

function parseResult(data) {

    const output =
        data.prediction ||
        data.result ||
        data.label;

    return String(output).toLowerCase();
}

async function checkMessage() {

    const message = input.value.trim();

    if (!message) {
        showResult(
            "error",
            "Empty Message",
            "Please enter a message first."
        );
        return;
    }

    setLoading(true);

    try {

        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data = await response.json();

        const prediction = parseResult(data);

        if (prediction === "spam" || prediction === "1") {

            showResult(
                "spam",
                "Spam",
                "This message appears to be spam."
            );

        } else {

            showResult(
                "ham",
                "Not Spam",
                "This message appears safe."
            );
        }

    } catch (error) {

        showResult(
            "error",
            "Error",
            error instanceof TypeError
                ? "Could not connect to the server. Make sure the Flask app is running."
                : error.message
        );

    } finally {
        setLoading(false);
    }
}