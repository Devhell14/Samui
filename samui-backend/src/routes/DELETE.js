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

router.post('/delete', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const table = req.body.table;
    const where = req.body.where;

    if (typeof table !== 'string') {
        res.status(400).send("Invalid table name.");
        return;
    }

    if (typeof where !== 'string') {
        res.status(400).send("Where clause is required.");
        return;
    }

    let query = `DELETE FROM ${table} ${where}`;

    queryDatabase(query, [], res);
});

module.exports = router;
