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

router.post('/get-doc-status-colour', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const docCode = req.body.doc_code;
    const docField = req.body.doc_field;

    if (typeof docCode !== 'string') {
        res.status(400).send("Doc Code Name is required.");
        return;
    }

    if (typeof docField !== 'string') {
        res.status(400).send("Doc Field Name is required.");
        return;
    }

    let query = `
        SELECT * 
        FROM Tb_Set_DocStatusColour 
        WHERE DocCode_Name = @param0 
        AND DocField_Name = @param1 
        ORDER BY DocSetStatus ASC
    `;

    queryDatabase(query, [docCode, docField], res);
});

module.exports = router;