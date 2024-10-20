const express = require('express');
const sql = require('../config/database');
const router = express.Router();

// ฟังก์ชันตรวจสอบ API Key
const checkApiKey = (req, res) => {
    if (req.headers['key'] !== process.env.API_KEY) {
        res.status(401).send("Unauthorized: Invalid API KEY.");
        return false;
    }
    return true;
};

// ฟังก์ชันสำหรับทำการ Query ฐานข้อมูล
const queryDatabase = async (query, params, res) => {
    try {
        const request = new sql.Request();
        params.forEach(({ name, value }) => {
            request.input(name, value);
        });
        const result = await request.query(query);
        res.send({
            "status": "OK",
            "message": `อัพเดท ${params[0].name} เป็น ${params[0].value} ของ Table : ${params[1].value} สำเร็จ`,
            "result": result
        });
    } catch (err) {
        console.log(err);
        res.send({ "status": "FAILED", "message": "อัพเดทไม่สำเร็จ", "result": err });
    }
};

// Route สำหรับ Update สถานะ
router.post('/update-status', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const { table, field, status, where } = req.body;

    // สร้าง SQL Query
    const query = `
        UPDATE ${table}
        SET ${field} = @status 
        ${where}
    `;

    // เรียกใช้ queryDatabase โดยมีการส่ง query และ parameter ไปด้วย
    queryDatabase(query, [
        { name: 'status', value: status },
        { name: 'table', value: table }
    ], res);
});

// Route สำหรับ Update QTY ใน Detail
router.post('/update-qty', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const { table, update_code, where } = req.body;

    // สร้าง SQL Query
    const query = `
        UPDATE ${table}
        SET ${update_code} 
        ${where}
    `;

    // เรียกใช้ queryDatabase โดยมีการส่ง query และ parameter ไปด้วย
    queryDatabase(query, [
        { name: 'Item_REC', value: "ตามจำนวน" },
        { name: 'table', value: "Detail" }
    ], res);
});

// Route สำหรับ Update WH_ITEM_ON_HAND
router.post('/update-wh-item-on-hand', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const { last_qty, item_on_hand, last_stc_seq, last_stc_date, item_id, wh_id, comp_id } = req.body;

    // สร้าง SQL Query
    const query = `
        UPDATE WH_ITEM_Onhand
        SET Last_Qty = ${last_qty} ,
        Item_Onhand = ${item_on_hand} ,
        Last_STC_SEQ = ${last_stc_seq} ,
        Last_STC_Date = '${last_stc_date}' 
        WHERE Item_Id = ${item_id} 
        AND WH_Id = ${wh_id} 
        AND Comp_Id = ${comp_id} 
    `;

    // เรียกใช้ queryDatabase โดยมีการส่ง query และ parameter ไปด้วย
    queryDatabase(query, [
        { name: 'Last_Qty', value: last_qty },
        { name: 'table', value: "WH_ITEM_Onhand" }
    ], res);
});

module.exports = router;