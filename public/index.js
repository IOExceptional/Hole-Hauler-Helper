(function () {
    var textArea = document.querySelector("#stuff");
    var submitButton = document.querySelector("#submit");

    var resultCollateral = document.querySelector("#result-collateral");
    var resultCost = document.querySelector("#result-cost");
    var resultError = document.querySelector("#result-error");

    function submit (stuff) {
        fetch("/api/submit", {
            method: "POST",
            headers:  new Headers({
                "Content-Type": "application/json"
            }),
            body: JSON.stringify({ "stuff": stuff })
        })
            .then(function (r){ return r.json()})
            .then(function (response) {
                if(response.error) {
                    resultError.innerText = response.message;
                    return;
                }

                resultCollateral.innerText = response.collateral;
                resultCost.innerText = response.cost;
                resultError.innerText = "";
            });
    }

    submitButton.addEventListener("click", function () {
        submit(textArea.value);
    });
})();