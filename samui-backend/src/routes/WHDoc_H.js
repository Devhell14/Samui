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
        res.send({ "status": "OK", "message": `${action}รายการปรับปรุงสินค้าสำเร็จ`, "result": result });
    } catch (err) {
        console.log(err);
        res.send({ "status": "FAILED", "message": `${action}รายการปรับปรุงสินค้าไม่สำเร็จ`, "result": err });
    }
};

router.post('/create-wh-doc-h', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const whDocNo = req.body.wh_doc_no;
    const whDocType = req.body.wh_doc_type;
    const whDocCustId = req.body.wh_doc_cust_id;
    const whDocDate = req.body.wh_doc_date;
    const whDocTransDate = req.body.wh_doc_trans_date;
    const whDocCreatedDate = req.body.wh_doc_created_date;
    const whDocCreatedBy = req.body.wh_doc_created_by;
    const whDocStatus = req.body.wh_doc_status;
    const whDocSeq = req.body.wh_doc_seq;
    const whDocRemark = req.body.wh_doc_remark;
    const whDocCompId = req.body.wh_doc_comp_id;
    const whDocShowFront = req.body.wh_doc_show_front;

    const query = `
    INSERT INTO WHDoc_H (
        WHDoc_No, 
        WHDoc_Type, 
        WHDoc_Cust_Id, 
        WHDoc_Date, 
        WHDoc_TransDate, 
        WHDoc_CreatedDate, 
        WHDoc_CreatedBy, 
        WHDoc_Status, 
        WHDoc_SEQ, 
        WHDoc_Remark, 
        Comp_Id, 
        WHDoc_ShowFront
    ) VALUES (
        @whDocNo, 
        @whDocType, 
        @whDocCustId, 
        @whDocDate, 
        @whDocTransDate, 
        @whDocCreatedDate, 
        @whDocCreatedBy, 
        @whDocStatus, 
        @whDocSeq, 
        @whDocRemark, 
        @whDocCompId, 
        @whDocShowFront
    )`;

    const params = [
        { name: 'whDocNo', value: whDocNo },
        { name: 'whDocType', value: whDocType },
        { name: 'whDocCustId', value: whDocCustId },
        { name: 'whDocDate', value: whDocDate },
        { name: 'whDocTransDate', value: whDocTransDate },
        { name: 'whDocCreatedDate', value: whDocCreatedDate },
        { name: 'whDocCreatedBy', value: whDocCreatedBy },
        { name: 'whDocStatus', value: whDocStatus },
        { name: 'whDocSeq', value: whDocSeq },
        { name: 'whDocRemark', value: whDocRemark },
        { name: 'whDocCompId', value: whDocCompId },
        { name: 'whDocShowFront', value: whDocShowFront }
    ];

    queryDatabase(query, params, res, "สร้าง");
});

module.exports = router;