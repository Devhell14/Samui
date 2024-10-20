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

// Route สำหรับ Insert WH_ITEM_STC (อย่างเดียว)
router.post('/insert-wh-item-stc', async (req, res) => {
    const request = new sql.Request();
    if (!checkApiKey(req, res)) return;

    const {
        item_id,
        item_code,
        item_name,
        doc_type,
        ref_balance,
        stc_qty,
        stc_balance,
        stc_date,
        stc_by,
        comp_id,
        doc_id,
        doc_no,
        doc_noref,
        stc_remark,
        stc_seq,
        wh_id,
        zone_id,
        lt_id
    } = req.body;

    const queryInsert = `
        INSERT INTO WH_ITEM_STC (
            Item_Id, 
            Item_Code, 
            Item_Name, 
            Doc_type, 
            Ref_Balance, 
            STC_QTY, 
            STC_Balance, 
            STC_Date, 
            STC_By, 
            Comp_Id, 
            Doc_Id, 
            Doc_No, 
            Doc_NoRef, 
            STC_Remark, 
            STC_SEQ, 
            WH_Id, 
            Zone_Id, 
            LT_Id
        ) VALUES (
            @itemId, 
            @itemCode, 
            @itemName, 
            @docType, 
            @refBalance, 
            @stcQty, 
            @stcBalance, 
            @stcDate, 
            @stcBy, 
            @compId, 
            @docId, 
            @docNo, 
            @docNoref, 
            @stcRemark, 
            @stcSeq, 
            @whId, 
            @zoneId, 
            @ltId
        );
    `;

    const paramsInsertSTC = [
        { name: 'itemId', value: item_id },
        { name: 'itemCode', value: item_code },
        { name: 'itemName', value: item_name },
        { name: 'docType', value: doc_type },
        { name: 'refBalance', value: ref_balance },
        { name: 'stcQty', value: stc_qty },
        { name: 'stcBalance', value: stc_balance },
        { name: 'stcDate', value: stc_date },
        { name: 'stcBy', value: stc_by },
        { name: 'compId', value: comp_id },
        { name: 'docId', value: doc_id },
        { name: 'docNo', value: doc_no },
        { name: 'docNoref', value: doc_noref },
        { name: 'stcRemark', value: stc_remark },
        { name: 'stcSeq', value: stc_seq },
        { name: 'whId', value: wh_id },
        { name: 'zoneId', value: zone_id },
        { name: 'ltId', value: lt_id }
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
