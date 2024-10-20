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
        res.send({ "status": "OK", "message": `${action}รายละเอียดรายการปรับปรุงสินค้าสำเร็จ`, "result": result });
    } catch (err) {
        console.log(err);
        res.send({ "status": "FAILED", "message": `${action}รายละเอียดรายการปรับปรุงสินค้าไม่สำเร็จ`, "result": err });
    }
};

router.post('/create-wh-doc-d', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const {
        wh_doc_id,
        line,
        item_id,
        item_code,
        item_name,
        item_qty,
        item_unit,
        item_price_unit,
        item_total,
        doc_type,
        f_wh_id,
        f_zone_id,
        f_lt_id,
        t_wh_id,
        t_zone_id,
        t_lt_id
    } = req.body;

    const query = `
    INSERT INTO WHDoc_D (
        WHDoc_Id, 
        Line, 
        Item_Id, 
        Item_Code, 
        Item_Name, 
        Item_Qty, 
        Item_Unit, 
        Item_Price_Unit, 
        Item_Total, 
        Doc_Type, 
        F_WH_Id, 
        F_Zone_Id, 
        F_LT_Id, 
        T_WH_Id, 
        T_Zone_Id, 
        T_LT_Id
    ) VALUES (
        @wh_doc_id, 
        @line, 
        @item_id, 
        @item_code, 
        @item_name, 
        @item_qty, 
        @item_unit, 
        @item_price_unit, 
        @item_total, 
        @doc_type, 
        @f_wh_id, 
        @f_zone_id, 
        @f_lt_id, 
        @t_wh_id, 
        @t_zone_id, 
        @t_lt_id
    )`;

    const params = [
        { name: 'wh_doc_id', value: wh_doc_id },
        { name: 'line', value: line },
        { name: 'item_id', value: item_id },
        { name: 'item_code', value: item_code },
        { name: 'item_name', value: item_name },
        { name: 'item_qty', value: item_qty },
        { name: 'item_unit', value: item_unit },
        { name: 'item_price_unit', value: item_price_unit },
        { name: 'item_total', value: item_total },
        { name: 'doc_type', value: doc_type },
        { name: 'f_wh_id', value: f_wh_id },
        { name: 'f_zone_id', value: f_zone_id },
        { name: 'f_lt_id', value: f_lt_id },
        { name: 't_wh_id', value: t_wh_id },
        { name: 't_zone_id', value: t_zone_id },
        { name: 't_lt_id', value: t_lt_id }
    ];

    queryDatabase(query, params, res, "สร้าง");
});

module.exports = router;