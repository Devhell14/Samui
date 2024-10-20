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

router.post('/count-purchase', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const compId = req.body.comp_id;

    let query;

    if (compId) {
        query = `SELECT 
            (SELECT COUNT(*) FROM DEPOS_H WHERE Comp_Id = ${compId}) +
            (SELECT COUNT(*) FROM PR_H WHERE Comp_Id = ${compId}) +
            (SELECT COUNT(*) FROM PO_H WHERE Comp_Id = ${compId}) +
            (SELECT COUNT(*) FROM REC_H WHERE Comp_Id = ${compId}) +
            (SELECT COUNT(*) FROM PAY_H WHERE Comp_Id = ${compId}) 
        AS Count;`;
    }

    queryDatabase(query, [], res);
});

router.post('/count-warehouse', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const compId = req.body.comp_id;

    let query;

    if (compId) {
        query = `SELECT 
            (SELECT COUNT(*) FROM WHDoc_H WHERE Comp_Id = ${compId}) 
        AS Count;`;
    }

    queryDatabase(query, [], res);
});

module.exports = router;