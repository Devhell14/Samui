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

router.post('/get-data', (req, res) => {
    if (!checkApiKey(req, res)) return;
    if (typeof req.body.table !== 'string') {
        res.status(400).send("Table is required.");
        return;
    }
    queryDatabase(`SELECT * FROM ${req.body.table} WHERE ${req.body.where}`, [], res);
});

router.post('/get-data-with-comp', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const table = req.body.table;
    const order = req.body.order || '';
    const compId = req.body.comp_id;

    if (typeof table !== 'string') {
        res.status(400).send("Table is required.");
        return;
    }

    // สร้าง query ตามการมีหรือไม่มี compId
    let query;
    let params = [];

    if (compId) {
        query = `SELECT * FROM ${table} WHERE Comp_Id = @param0 ${order}`;
        params.push(compId);
    } else {
        query = `SELECT * FROM ${table} WHERE 1=1 ${order}`;
    }

    queryDatabase(query, params, res);
});

router.post('/get-by-doc-id', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const table = req.body.table;
    const docId = req.body.doc_id;
    const andOrder = req.body.and_order;

    // ตรวจสอบค่าที่ส่งมา
    if (typeof table !== 'string') {
        res.status(400).send("Table name is required.");
        return;
    }

    // สร้าง query เบื้องต้น
    let query = `SELECT * FROM ${table} WHERE Doc_Id = @param0`;

    // เพิ่มเงื่อนไข 'AND' || 'ORDER BY' ถ้ามี
    if (andOrder) {
        query += ` ${andOrder}`;
    }

    // เรียกใช้งาน queryDatabase กับ query ที่สร้างขึ้น
    queryDatabase(query, [docId], res);
});

router.post('/get-by-rec-id', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const table = req.body.table;
    const recId = req.body.rec_id;
    const andOrder = req.body.and_order;

    // ตรวจสอบค่าที่ส่งมา
    if (typeof table !== 'string') {
        res.status(400).send("Table name is required.");
        return;
    }

    // สร้าง query เบื้องต้น
    let query = `SELECT * FROM ${table} WHERE Rec_ID = @param0`;

    // เพิ่มเงื่อนไข 'AND' || 'ORDER BY' ถ้ามี
    if (andOrder) {
        query += ` ${andOrder}`;
    }

    // เรียกใช้งาน queryDatabase กับ query ที่สร้างขึ้น
    queryDatabase(query, [recId], res);
});

router.post('/get-by-pay-id', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const table = req.body.table;
    const payId = req.body.pay_id;
    const andOrder = req.body.and_order;

    // ตรวจสอบค่าที่ส่งมา
    if (typeof table !== 'string') {
        res.status(400).send("Table name is required.");
        return;
    }

    // สร้าง query เบื้องต้นมาก่อน
    let query = `SELECT * FROM ${table}`;

    // ตรวจสอบว่ามีการส่ง pay_id มาและมีค่า
    if (payId) {
        query += ` WHERE Pay_ID = @param0`;
    } else if (andOrder) {
        // ถ้าไม่มี pay_id แต่มี and_order ก็ใช้เป็น WHERE แทน
        query += ` WHERE ${andOrder}`;
    } else {
        // ถ้าไม่มีทั้งคู่เลย ก็ไม่อนุญาตให้ใช้ API ตัวนี้นะจ๊ะ
        res.status(400).send("Either payId or andOrder is required.");
        return;
    }

    // เรียกใช้งาน queryDatabase กับ query ที่สร้างขึ้น
    // ถ้า pay_id มีค่า จะใช้เป็น parameter ของ query
    const params = payId ? [payId] : [];
    queryDatabase(query, params, res);
});

router.post('/get-by-doc-no', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const table = req.body.table;
    const docNo = req.body.doc_no;

    if (typeof table !== 'string') {
        res.status(400).send("Table name is required.");
        return;
    }

    if (typeof docNo !== 'string') {
        res.status(400).send("Doc No is required.");
        return;
    }

    // ใช้ parameterized queries สำหรับ compId เพื่อป้องกัน SQL Injection
    let query = `SELECT * FROM ${table} WHERE Doc_No = @param0`;

    queryDatabase(query, [docNo], res);
});

router.post('/get-by-wh-doc-no', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const table = req.body.table;
    const whDocNo = req.body.wh_doc_no;

    if (typeof table !== 'string') {
        res.status(400).send("Table name is required.");
        return;
    }

    if (typeof whDocNo !== 'string') {
        res.status(400).send("WHDocNo is required.");
        return;
    }

    // ใช้ parameterized queries สำหรับ compId เพื่อป้องกัน SQL Injection
    let query = `SELECT * FROM ${table} WHERE WHDoc_No = @param0`;

    queryDatabase(query, [whDocNo], res);
});

router.post('/get-by-pay-no', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const table = req.body.table;
    const payNo = req.body.pay_no;

    if (typeof table !== 'string') {
        res.status(400).send("Table name is required.");
        return;
    }

    if (typeof payNo !== 'string') {
        res.status(400).send("Pay No is required.");
        return;
    }

    // ใช้ parameterized queries สำหรับ compId เพื่อป้องกัน SQL Injection
    let query = `SELECT * FROM ${table} WHERE Pay_No = @param0`;

    queryDatabase(query, [payNo], res);
});

router.post('/get-by-rec-no', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const table = req.body.table;
    const recNo = req.body.rec_no;

    if (typeof table !== 'string') {
        res.status(400).send("Table name is required.");
        return;
    }

    if (typeof recNo !== 'string') {
        res.status(400).send("Rec No is required.");
        return;
    }

    // ใช้ parameterized queries สำหรับ compId เพื่อป้องกัน SQL Injection
    let query = `SELECT * FROM ${table} WHERE Rec_No = @param0`;

    queryDatabase(query, [recNo], res);
});

router.post('/get-line-by-doc-id', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const table = req.body.table;
    const docId = req.body.doc_id;

    if (typeof table !== 'string') {
        res.status(400).send("Table name is required.");
        return;
    }

    // ใช้ parameterized queries สำหรับ compId เพื่อป้องกัน SQL Injection
    let query = `SELECT * FROM ${table} WHERE Doc_ID = @param0 ORDER BY Line ASC`;

    queryDatabase(query, [docId], res);
});

module.exports = router;