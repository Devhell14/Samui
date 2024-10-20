const sql = require('../config/database');
const express = require('express');
const router = express.Router();

const checkApiKey = (req, res) => {
    if (req.headers['key'] !== process.env.API_KEY) {
        res.status(401).send("Unauthorized: Invalid API KEY.");
        return false;
    }
    return true;
};

const queryDatabase = async (query, params, res) => {
    try {
        const request = new sql.Request();
        params.forEach((param, index) => {
            request.input(`param${index}`, param);
        });
        const result = await request.query(query);
        res.status(200).send(result.recordset);
    } catch (err) {
        console.log(err);
        res.status(500).send("An Error Occurred While Querying The Database.");
    }
};

router.post('/get-view-pr-h', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const compId = req.body.comp_id;

    if (typeof compId !== 'string') {
        res.status(400).send("Company ID is required.");
        return;
    }

    let query = `
        SELECT * 
        FROM API_0101_PR_H 
        WHERE Comp_Id = @param0
        AND DocStatus_Name = 'อนุมัติ'
        ORDER BY Doc_No DESC
    `;

    queryDatabase(query, [compId], res);
});

module.exports = router;