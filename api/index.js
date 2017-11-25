var express = require("express"),
    router = express.Router(),
    axios = require("axios");

function createEvepraisalLink (stuff) {
    return "https://evepraisal.com/appraisal.json?market=jita&persist=no&raw_textarea=" + stuff;
}

function sendError(res, message) {
    res.status(500).send({
        error: true,
        message: message
    });
}

function sendResponse (res, evePraisalCost) {
    var collateral = evePraisalCost;

    if(!collateral || collateral === 0) {
        sendError(res, "List must contain valid items");
        return;
    }

    var cost = 20000000 + (evePraisalCost * 0.3);

    res.json({
        error: false,
        collateral: collateral,
        cost: cost
    });
}

router.post("/submit", function (req, res) {
    var stuff = req.body.stuff;

    if(!stuff) {
        sendError(res, "Stuff was not defined");
    }

    var evePraisal = axios.post(createEvepraisalLink(stuff));

    axios.all([evePraisal])
        .then(axios.spread(function(ep) {
            sendResponse(res, ep.data.appraisal.totals.sell);
        }))
        .catch(function (error) {
            sendError(res, "Something went wrong, was the list formatted correctly?")
        });
});


module.exports = router;