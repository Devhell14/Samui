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
        res.send({ "status": "OK", "message": `${action}รายการใบขอซื้อสำเร็จ`, "result": result });
    } catch (err) {
        console.log(err);
        res.send({ "status": "FAILED", "message": `${action}รายการใบขอซื้อไม่สำเร็จ`, "result": err });
    }
};

router.post('/create-depos-h', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const docNo = req.body.doc_no;
    const docDate = req.body.doc_date;
    const docDueDate = req.body.doc_due_date;
    const docStatus = req.body.doc_status;
    const docCode = req.body.doc_code;
    const docType = req.body.doc_type;
    const docFor = req.body.doc_for;
    const refDocID = req.body.ref_doc_id;
    const refDoc = req.body.ref_doc;
    const refDocDate = req.body.ref_doc_date;
    const compId = req.body.comp_id;
    const refProjectID = req.body.ref_project_id;
    const refProjectNo = req.body.ref_project_no;
    const transportType = req.body.transport_type;
    const docRemark1 = req.body.doc_remark1;
    const docRemark2 = req.body.doc_remark2;
    const arID = req.body.ar_id;
    const arCode = req.body.ar_code;
    const actionHold = req.body.action_hold;
    const discountValue = req.body.discount_value;
    const discountValueType = req.body.discount_value_type;
    const discountCash = req.body.discount_cash;
    const discountCashType = req.body.discount_cash_type;
    const discountTransport = req.body.discount_transport;
    const discountTransportType = req.body.discount_transport_type;
    const isVat = req.body.is_vat;
    const docSEQ = req.body.doc_seq;
    const creditTerm = req.body.credit_term;
    const creditTerm1Day = req.body.credit_term_1_day;
    const creditTerm1Remark = req.body.credit_term_1_remark;
    const creditTerm2Remark = req.body.credit_term_2_remark;
    const accCode = req.body.acc_code;
    const empName = req.body.emp_name;
    const createdDate = req.body.created_date;
    const createdByName = req.body.created_by_name;
    const createdById = req.body.created_by_id;
    const updateDate = req.body.update_date;
    const updateByName = req.body.update_by_name;
    const updateById = req.body.update_by_id;
    const cancelDate = req.body.cancel_date;
    const cancelByName = req.body.cancel_by_name;
    const cancelById = req.body.cancel_by_id;
    const printedStatus = req.body.printed_status;
    const printedDate = req.body.printed_date;
    const printedBy = req.body.printed_by;
    const confirmById = req.body.confirm_by_id;
    const confirmDate = req.body.confirm_date;
    const confirmByName = req.body.confirm_by_name;
    const payType = req.body.pay_type;
    const approvedPayDate = req.body.approved_pay_date;
    const approvedPayByName = req.body.approved_pay_by_name;
    const approvedPayById = req.body.approved_pay_by_id;
    const custName = req.body.cust_name;
    const custTel = req.body.cust_tel;
    const custMail = req.body.cust_mail;
    const custConfirmMemo = req.body.cust_confirm_memo;

    const query = `
    INSERT INTO DEPOS_H (
        Doc_No, Doc_Date, Doc_DueDate, Doc_Status, Doc_Code, 
        Doc_Type, Doc_For, Ref_DocID, Ref_Doc, 
        Ref_DocDate, Ref_ProjectID, Ref_ProjectNo, Comp_Id, 
        Transport_Type, Doc_Remark1, Doc_Remark2, AR_ID, 
        AR_Code, Action_Hold, Discount_Value, Discount_Value_Type, 
        Discount_Cash, Discount_Cash_Type, Discount_Transport, 
        Discount_Transport_Type, IsVat, Doc_SEQ, CreditTerm, 
        CreditTerm1Day, CreditTerm1Remark, CreditTerm2Remark, 
        ACC_Code, EmpName, Created_Date, Created_By_Name, 
        Created_By_Id, Update_Date, Update_By_Name, 
        Update_By_Id, Cancel_Date, Cancel_By_Name, 
        Cancel_By_Id, Printed_Status, Printed_Date, Printed_By,
        Confirm_By_Id, Confirm_Date, Confirm_By_Name, Pay_Type, 
        Approved_Pay_Date, Approved_Pay_By_Name, Approved_Pay_By_Id, 
        Cust_Name, Cust_Tel, Cust_Mail, Cust_Confirm_Memo
    ) VALUES (
        @docNo, @docDate, @docDueDate, @docStatus, @docCode, 
        @docType, @docFor, @refDocID, @refDoc, 
        @refDocDate, @refProjectID, @refProjectNo, @compId, 
        @transportType, @docRemark1, @docRemark2, @arID, 
        @arCode, @actionHold, @discountValue, @discountValueType, 
        @discountCash, @discountCashType, @discountTransport, 
        @discountTransportType, @isVat, @docSEQ, @creditTerm, 
        @creditTerm1Day, @creditTerm1Remark, @creditTerm2Remark, 
        @accCode, @empName, @createdDate, @createdByName, 
        @createdById, @updateDate, @updateByName, 
        @updateById, @cancelDate, @cancelByName, 
        @cancelById, @printedStatus, @printedDate, @printedBy,
        @confirmById, @confirmDate ,@confirmByName, @payType, @approvedPayDate,
        @approvedPayByName, @approvedPayById, @custName, @custTel,
        @custMail, @custConfirmMemo
    )`;

    const params = [
        { name: 'docNo', value: docNo },
        { name: 'docDate', value: docDate },
        { name: 'docDueDate', value: docDueDate },
        { name: 'docStatus', value: docStatus },
        { name: 'docCode', value: docCode },
        { name: 'docType', value: docType },
        { name: 'docFor', value: docFor },
        { name: 'refDocID', value: refDocID },
        { name: 'refDoc', value: refDoc },
        { name: 'refDocDate', value: refDocDate },
        { name: 'refProjectID', value: refProjectID },
        { name: 'refProjectNo', value: refProjectNo },
        { name: 'compId', value: compId },
        { name: 'transportType', value: transportType },
        { name: 'docRemark1', value: docRemark1 },
        { name: 'docRemark2', value: docRemark2 },
        { name: 'arID', value: arID },
        { name: 'arCode', value: arCode },
        { name: 'actionHold', value: actionHold },
        { name: 'discountValue', value: discountValue },
        { name: 'discountValueType', value: discountValueType },
        { name: 'discountCash', value: discountCash },
        { name: 'discountCashType', value: discountCashType },
        { name: 'discountTransport', value: discountTransport },
        { name: 'discountTransportType', value: discountTransportType },
        { name: 'isVat', value: isVat },
        { name: 'docSEQ', value: docSEQ },
        { name: 'creditTerm', value: creditTerm },
        { name: 'creditTerm1Day', value: creditTerm1Day },
        { name: 'creditTerm1Remark', value: creditTerm1Remark },
        { name: 'creditTerm2Remark', value: creditTerm2Remark },
        { name: 'accCode', value: accCode },
        { name: 'empName', value: empName },
        { name: 'createdDate', value: createdDate },
        { name: 'createdByName', value: createdByName },
        { name: 'createdById', value: createdById },
        { name: 'updateDate', value: updateDate },
        { name: 'updateByName', value: updateByName },
        { name: 'updateById', value: updateById },
        { name: 'cancelDate', value: cancelDate },
        { name: 'cancelByName', value: cancelByName },
        { name: 'cancelById', value: cancelById },
        { name: 'printedStatus', value: printedStatus },
        { name: 'printedDate', value: printedDate },
        { name: 'printedBy', value: printedBy },
        { name: 'confirmById', value: confirmById },
        { name: 'confirmDate', value: confirmDate },
        { name: 'confirmByName', value: confirmByName },
        { name: 'payType', value: payType },
        { name: 'approvedPayDate', value: approvedPayDate },
        { name: 'approvedPayByName', value: approvedPayByName },
        { name: 'approvedPayById', value: approvedPayById },
        { name: 'custName', value: custName },
        { name: 'custTel', value: custTel },
        { name: 'custMail', value: custMail },
        { name: 'custConfirmMemo', value: custConfirmMemo }
    ];

    queryDatabase(query, params, res, "สร้าง");
});

router.post('/update-depos-h', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const params = [
        { name: 'docNo', value: req.body.doc_no },
        { name: 'docDate', value: req.body.doc_date },
        { name: 'docDueDate', value: req.body.doc_due_date },
        { name: 'docStatus', value: req.body.doc_status },
        { name: 'docCode', value: req.body.doc_code },
        { name: 'docType', value: req.body.doc_type },
        { name: 'docFor', value: req.body.doc_for },
        { name: 'refDocID', value: req.body.ref_doc_id },
        { name: 'refDoc', value: req.body.ref_doc },
        { name: 'refDocDate', value: req.body.ref_doc_date },
        { name: 'refProjectID', value: req.body.ref_project_id },
        { name: 'refProjectNo', value: req.body.ref_project_no },
        { name: 'compId', value: req.body.comp_id },
        { name: 'transportType', value: req.body.transport_type },
        { name: 'docRemark1', value: req.body.doc_remark1 },
        { name: 'docRemark2', value: req.body.doc_remark2 },
        { name: 'arID', value: req.body.ar_id },
        { name: 'arCode', value: req.body.ar_code },
        { name: 'actionHold', value: req.body.action_hold },
        { name: 'discountValue', value: req.body.discount_value },
        { name: 'discountValueType', value: req.body.discount_value_type },
        { name: 'discountCash', value: req.body.discount_cash },
        { name: 'discountCashType', value: req.body.discount_cash_type },
        { name: 'discountTransport', value: req.body.discount_transport },
        { name: 'discountTransportType', value: req.body.discount_transport_type },
        { name: 'isVat', value: req.body.is_vat },
        { name: 'docSEQ', value: req.body.doc_seq },
        { name: 'creditTerm', value: req.body.credit_term },
        { name: 'creditTerm1Day', value: req.body.credit_term_1_day },
        { name: 'creditTerm1Remark', value: req.body.credit_term_1_remark },
        { name: 'creditTerm2Remark', value: req.body.credit_term_2_remark },
        { name: 'accCode', value: req.body.acc_code },
        { name: 'empName', value: req.body.emp_name },
        { name: 'createdDate', value: req.body.created_date },
        { name: 'createdByName', value: req.body.created_by_name },
        { name: 'createdById', value: req.body.created_by_id },
        { name: 'updateDate', value: req.body.update_date },
        { name: 'updateByName', value: req.body.update_by_name },
        { name: 'updateById', value: req.body.update_by_id },
        { name: 'cancelDate', value: req.body.cancel_date },
        { name: 'cancelByName', value: req.body.cancel_by_name },
        { name: 'cancelById', value: req.body.cancel_by_id },
        { name: 'printedStatus', value: req.body.printed_status },
        { name: 'printedDate', value: req.body.printed_date },
        { name: 'printedBy', value: req.body.printed_by },
        { name: 'confirmById', value: req.body.confirm_by_id },
        { name: 'confirmDate', value: req.body.confirm_date },
        { name: 'confirmByName', value: req.body.confirm_by_name },
        { name: 'payType', value: req.body.pay_type },
        { name: 'approvedPayDate', value: req.body.approved_pay_date },
        { name: 'approvedPayByName', value: req.body.approved_pay_by_name },
        { name: 'approvedPayById', value: req.body.approved_pay_by_id },
        { name: 'custName', value: req.body.cust_name },
        { name: 'custTel', value: req.body.cust_tel },
        { name: 'custMail', value: req.body.cust_mail },
        { name: 'custConfirmMemo', value: req.body.cust_confirm_memo }
    ];

    const query = `
    UPDATE DEPOS_H SET
        Doc_Date = @docDate, Doc_DueDate = @docDueDate, Doc_Status = @docStatus, 
        Doc_Code = @docCode, Doc_Type = @docType, Doc_For = @docFor, 
        Ref_DocID = @refDocID, Ref_Doc = @refDoc, 
        Ref_DocDate = @refDocDate, Ref_ProjectID = @refProjectID, Ref_ProjectNo = @refProjectNo, 
        Comp_Id = @compId, Transport_Type = @transportType, Doc_Remark1 = @docRemark1, 
        Doc_Remark2 = @docRemark2, AR_ID = @arID, AR_Code = @arCode, 
        Action_Hold = @actionHold, Discount_Value = @discountValue, Discount_Value_Type = @discountValueType, 
        Discount_Cash = @discountCash, Discount_Cash_Type = @discountCashType, 
        Discount_Transport = @discountTransport, Discount_Transport_Type = @discountTransportType, 
        IsVat = @isVat, Doc_SEQ = @docSEQ, CreditTerm = @creditTerm, 
        CreditTerm1Day = @creditTerm1Day, CreditTerm1Remark = @creditTerm1Remark, 
        CreditTerm2Remark = @creditTerm2Remark, ACC_Code = @accCode, EmpName = @empName, 
        Created_Date = @createdDate, Created_By_Name = @createdByName, Created_By_Id = @createdById, 
        Update_Date = @updateDate, Update_By_Name = @updateByName, Update_By_Id = @updateById, 
        Cancel_Date = @cancelDate, Cancel_By_Name = @cancelByName, Cancel_By_Id = @cancelById, 
        Printed_Status = @printedStatus, Printed_Date = @printedDate, Printed_By = @printedBy,
        Confirm_By_Id = @confirmById, Confirm_Date = @confirmDate, Confirm_By_Name = @confirmByName, 
        Pay_Type = @payType, Approved_Pay_Date = @approvedPayDate, Approved_Pay_By_Name = @approvedPayByName, 
        Approved_Pay_By_Id = @approvedPayById, Cust_Name = @custName, Cust_Tel = @custTel, 
        Cust_Mail = @custMail, Cust_Confirm_Memo = @custConfirmMemo
    WHERE Doc_No = @docNo`;

    queryDatabase(query, params, res, "แก้ไข");
});

router.post('/cancel-depos-h', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const params = [
        { name: 'docNo', value: req.body.doc_no },
        { name: 'docStatus', value: req.body.doc_status },
        { name: 'cancelDate', value: req.body.cancel_date },
        { name: 'cancelByName', value: req.body.cancel_by_name },
        { name: 'cancelById', value: req.body.cancel_by_id },
    ];

    const query = `
        UPDATE DEPOS_H SET
            Doc_Status = @docStatus, 
            Cancel_Date = @cancelDate, 
            Cancel_By_Name = @cancelByName, 
            Cancel_By_Id = @cancelById 
        WHERE Doc_No = @docNo`;

    queryDatabase(query, params, res, "ยกเลิก");
});

router.post('/approved-pay-depos-h', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const params = [
        { name: 'docNo', value: req.body.doc_no },
        { name: 'docStatus', value: req.body.doc_status },
        { name: 'approvedPayDate', value: req.body.approved_pay_date },
        { name: 'approvedPayByName', value: req.body.approved_pay_by_name },
        { name: 'approvedPayById', value: req.body.approved_pay_by_id },
    ];

    const query = `
        UPDATE DEPOS_H SET
            Doc_Status = @docStatus, 
            Approved_Pay_Date = @approvedPayDate, 
            Approved_Pay_By_Name = @approvedPayByName, 
            Approved_Pay_By_Id = @approvedPayById 
        WHERE Doc_No = @docNo`;

    queryDatabase(query, params, res, "ยืนยันการชำระเงิน");
});

module.exports = router;