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

const queryDatabase = async (query, params, res, action) => {
    try {
        const request = new sql.Request();
        params.forEach(({ name, value }) => {
            request.input(name, value);
        });
        const result = await request.query(query);
        res.send({ "status": "OK", "message": `${action}รายละเอียดรายการใบขอซื้อสำเร็จ`, "result": result });
    } catch (err) {
        console.log(err);
        res.send({ "status": "FAILED", "message": `${action}รายละเอียดรายการใบขอซื้อไม่สำเร็จ`, "result": err });
    }
};

router.post('/create-po-d', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const {
        doc_id,
        line,
        item_id,
        item_code,
        item_name,
        item_qty,
        item_unit,
        item_price_unit,
        item_discount,
        item_distype,
        item_total,
        item_rec_qty,
        item_rec_balance,
        item_status,
        wh_id,
        zone_id,
        lt_id,
        ds_seq
    } = req.body;

    const query = `
    INSERT INTO PO_D (
        Doc_ID,
        Line,
        Item_Id,
        Item_Code,
        Item_Name,
        Item_Qty,
        Item_Unit,
        Item_Price_Unit,
        Item_Discount,
        Item_DisType,
        Item_Total,
        Item_REC_Qty,
        Item_REC_Balance,
        Item_Status,
        WH_ID,
        Zone_ID,
        LT_ID,
        DS_SEQ
    ) VALUES (
        @doc_id,
        @line,
        @item_id,
        @item_code,
        @item_name,
        @item_qty,
        @item_unit,
        @item_price_unit,
        @item_discount,
        @item_distype,
        @item_total,
        @item_rec_qty,
        @item_rec_balance,
        @item_status,
        @wh_id,
        @zone_id,
        @lt_id,
        @ds_seq
    )`;

    const params = [
        { name: 'doc_id', value: doc_id },
        { name: 'line', value: line },
        { name: 'item_id', value: item_id },
        { name: 'item_code', value: item_code },
        { name: 'item_name', value: item_name },
        { name: 'item_qty', value: item_qty },
        { name: 'item_unit', value: item_unit },
        { name: 'item_price_unit', value: item_price_unit },
        { name: 'item_discount', value: item_discount },
        { name: 'item_distype', value: item_distype },
        { name: 'item_total', value: item_total },
        { name: 'item_rec_qty', value: item_rec_qty },
        { name: 'item_rec_balance', value: item_rec_balance },
        { name: 'item_status', value: item_status },
        { name: 'wh_id', value: wh_id },
        { name: 'zone_id', value: zone_id },
        { name: 'lt_id', value: lt_id },
        { name: 'ds_seq', value: ds_seq }
    ];

    queryDatabase(query, params, res, "สร้าง");
});

module.exports = router;