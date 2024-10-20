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

// Route สำหรับ Insert WH_ITEM_Onhand (อย่างเดียว)
router.post('/insert-wh-item-onhand', async (req, res) => {
    const request = new sql.Request();
    if (!checkApiKey(req, res)) return;

    const {
        item_id,
        item_code,
        item_name,
        item_barcode,
        last_qty,
        item_on_hand,
        wh_id,
        zone_id,
        lt_id,
        last_stc_seq,
        last_stc_date,
        comp_id
    } = req.body;

    const queryInsert = `
        INSERT INTO WH_ITEM_Onhand (
            Item_Id, 
            Item_Code, 
            Item_Name, 
            Item_Barcode, 
            Last_Qty, 
            Item_Onhand, 
            WH_Id, 
            Zone_Id, 
            LT_Id, 
            Last_STC_SEQ, 
            Last_STC_Date, 
            Comp_Id 
        ) VALUES (
            @itemId, 
            @itemCode, 
            @itemName, 
            @itemBarcode, 
            @lastQty, 
            @itemOnHand, 
            @whId, 
            @zoneId, 
            @ltId, 
            @lastStcSeq, 
            @lastStcDate, 
            @compId 
        );
    `;

    const paramsInsertSTC = [
        { name: 'itemId', value: item_id },
        { name: 'itemCode', value: item_code },
        { name: 'itemName', value: item_name },
        { name: 'itemBarcode', value: item_barcode },
        { name: 'lastQty', value: last_qty },
        { name: 'itemOnHand', value: item_on_hand },
        { name: 'whId', value: wh_id },
        { name: 'zoneId', value: zone_id },
        { name: 'ltId', value: lt_id },
        { name: 'lastStcSeq', value: last_stc_seq },
        { name: 'lastStcDate', value: last_stc_date },
        { name: 'compId', value: comp_id }
    ];

    paramsInsertSTC.forEach(({ name, value }) => {
        request.input(name, value);
    });

    try {
        const result = await request.query(queryInsert);
        res.send({
            "status": "OK",
            "message": `บันทึกข้อมูลสำเร็จ`,
            "result": result
        });
    } catch (err) {
        console.log(err);
        res.send({ "status": "FAILED", "message": "บันทึกไม่สำเร็จ", "result": err });
    }
});

module.exports = router;
