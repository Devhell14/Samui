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
        res.send({ "status": "OK", "message": `${action}รายการใบรับสินค้าสำเร็จ`, "result": result });
    } catch (err) {
        console.log(err);
        res.send({ "status": "FAILED", "message": `${action}รายการใบรับสินค้าไม่สำเร็จ`, "result": err });
    }
};

router.post('/create-rec-h', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const {
        rec_no,
        rec_date,
        rec_due_date,
        rec_status,
        doc_status_paid,
        doc_code,
        doc_type,
        doc_for,
        ref_doc_id,
        ref_doc,
        ref_doc_date,
        ref_project_id,
        ref_project_no,
        comp_id,
        transport_type,
        doc_remark1,
        doc_remark2,
        ap_id,
        ap_code,
        action_hold,
        discount_value,
        discount_value_type,
        discount_cash,
        discount_cash_type,
        discount_transport,
        discount_transport_type,
        is_vat,
        doc_seq,
        credit_term,
        credit_term_1_day,
        credit_term_1_remark,
        credit_term_2_remark,
        acc_code,
        emp_name,
        created_date,
        created_by_name,
        created_by_id,
        update_date,
        update_by_name,
        update_by_id,
        approved_date,
        approved_by_name,
        approved_by_id,
        cancel_date,
        cancel_by_name,
        cancel_by_id,
        approved_memo,
        printed_status,
        printed_date,
        printed_by
    } = req.body;

    const query = `
    INSERT INTO REC_H (
        Rec_No, Rec_Date, Rec_DueDate, Rec_Status, Doc_Status_Paid, Doc_Code, 
        Doc_Type, Doc_For, Ref_DocID, Ref_Doc, Ref_DocDate, Ref_ProjectID, 
        Ref_ProjectNo, Comp_Id, Transport_Type, Doc_Remark1, Doc_Remark2, AP_Id, 
        AP_Code, Action_Hold, Discount_Value, Discount_Value_Type, Discount_Cash,
        Discount_Cash_Type, Discount_Transport, Discount_Transport_Type,
        IsVat, Doc_SEQ, CreditTerm, CreditTerm1Day, CreditTerm1Remark,
        CreditTerm2Remark, ACC_Code, EmpName, Created_Date, Created_By_Name,
        Created_By_Id, Update_Date, Update_By_Name, Update_By_Id,
        Approved_Date, Approved_By_Name, Approved_By_Id, Cancel_Date,
        Cancel_By_Name, Cancel_By_Id, Approved_Memo, Printed_Status,
        Printed_Date, Printed_By
    ) VALUES (
        @rec_no, @rec_date, @rec_due_date, @rec_status , @doc_status_paid, @doc_code, 
        @doc_type, @doc_for, @ref_doc_id, @ref_doc, @ref_doc_date, @ref_project_id, 
        @ref_project_no, @comp_id, @transport_type, @doc_remark1, @doc_remark2, @ap_id, 
        @ap_code, @action_hold, @discount_value, @discount_value_type, @discount_cash,
        @discount_cash_type, @discount_transport, @discount_transport_type,
        @is_vat, @doc_seq, @credit_term, @credit_term_1_day, @credit_term_1_remark,
        @credit_term_2_remark, @acc_code, @emp_name, @created_date, @created_by_name,
        @created_by_id, @update_date, @update_by_name, @update_by_id,
        @approved_date, @approved_by_name, @approved_by_id, @cancel_date,
        @cancel_by_name, @cancel_by_id, @approved_memo, @printed_status,
        @printed_date, @printed_by
    )`;

    const params = [
        { name: 'rec_no', value: rec_no },
        { name: 'rec_date', value: rec_date },
        { name: 'rec_due_date', value: rec_due_date },
        { name: 'rec_status', value: rec_status },
        { name: 'doc_status_paid', value: doc_status_paid },
        { name: 'doc_code', value: doc_code },
        { name: 'doc_type', value: doc_type },
        { name: 'doc_for', value: doc_for },
        { name: 'ref_doc_id', value: ref_doc_id },
        { name: 'ref_doc', value: ref_doc },
        { name: 'ref_doc_date', value: ref_doc_date },
        { name: 'ref_project_id', value: ref_project_id },
        { name: 'ref_project_no', value: ref_project_no },
        { name: 'comp_id', value: comp_id },
        { name: 'transport_type', value: transport_type },
        { name: 'doc_remark1', value: doc_remark1 },
        { name: 'doc_remark2', value: doc_remark2 },
        { name: 'ap_id', value: ap_id },
        { name: 'ap_code', value: ap_code },
        { name: 'action_hold', value: action_hold },
        { name: 'discount_value', value: discount_value },
        { name: 'discount_value_type', value: discount_value_type },
        { name: 'discount_cash', value: discount_cash },
        { name: 'discount_cash_type', value: discount_cash_type },
        { name: 'discount_transport', value: discount_transport },
        { name: 'discount_transport_type', value: discount_transport_type },
        { name: 'is_vat', value: is_vat },
        { name: 'doc_seq', value: doc_seq },
        { name: 'credit_term', value: credit_term },
        { name: 'credit_term_1_day', value: credit_term_1_day },
        { name: 'credit_term_1_remark', value: credit_term_1_remark },
        { name: 'credit_term_2_remark', value: credit_term_2_remark },
        { name: 'acc_code', value: acc_code },
        { name: 'emp_name', value: emp_name },
        { name: 'created_date', value: created_date },
        { name: 'created_by_name', value: created_by_name },
        { name: 'created_by_id', value: created_by_id },
        { name: 'update_date', value: update_date },
        { name: 'update_by_name', value: update_by_name },
        { name: 'update_by_id', value: update_by_id },
        { name: 'approved_date', value: approved_date },
        { name: 'approved_by_name', value: approved_by_name },
        { name: 'approved_by_id', value: approved_by_id },
        { name: 'cancel_date', value: cancel_date },
        { name: 'cancel_by_name', value: cancel_by_name },
        { name: 'cancel_by_id', value: cancel_by_id },
        { name: 'approved_memo', value: approved_memo },
        { name: 'printed_status', value: printed_status },
        { name: 'printed_date', value: printed_date },
        { name: 'printed_by', value: printed_by }
    ];

    queryDatabase(query, params, res, "สร้าง");
});

router.post('/update-rec-h', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const params = [
        { name: 'recNo', value: req.body.rec_no },
        { name: 'recDate', value: req.body.rec_date },
        { name: 'recDueDate', value: req.body.rec_due_date },
        { name: 'recStatus', value: req.body.rec_status },
        { name: 'docStatusPaid', value: req.body.doc_status_paid },
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
        { name: 'apID', value: req.body.ap_id },
        { name: 'apCode', value: req.body.ap_code },
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
        { name: 'approvedDate', value: req.body.approved_date },
        { name: 'approvedByName', value: req.body.approved_by_name },
        { name: 'approvedById', value: req.body.approved_by_id },
        { name: 'cancelDate', value: req.body.cancel_date },
        { name: 'cancelByName', value: req.body.cancel_by_name },
        { name: 'cancelById', value: req.body.cancel_by_id },
        { name: 'approvedMemo', value: req.body.approved_memo },
        { name: 'printedStatus', value: req.body.printed_status },
        { name: 'printedDate', value: req.body.printed_date },
        { name: 'printedBy', value: req.body.printed_by }
    ];

    const query = `
    UPDATE REC_H SET
        Rec_Date = @recDate, Rec_DueDate = @recDueDate, Rec_Status = @recStatus, 
        Doc_Status_Paid = @docStatusPaid, Doc_Code = @docCode, Doc_Type = @docType, 
        Doc_For = @docFor, Ref_DocID = @refDocID, Ref_Doc = @refDoc, Ref_DocDate = @refDocDate, 
        Ref_ProjectID = @refProjectID, Ref_ProjectNo = @refProjectNo, 
        Comp_Id = @compId, Transport_Type = @transportType, Doc_Remark1 = @docRemark1, 
        Doc_Remark2 = @docRemark2, AP_ID = @apID, AP_Code = @apCode, 
        Action_Hold = @actionHold, Discount_Value = @discountValue, Discount_Value_Type = @discountValueType, 
        Discount_Cash = @discountCash, Discount_Cash_Type = @discountCashType, 
        Discount_Transport = @discountTransport, Discount_Transport_Type = @discountTransportType, 
        IsVat = @isVat, Doc_SEQ = @docSEQ, CreditTerm = @creditTerm, 
        CreditTerm1Day = @creditTerm1Day, CreditTerm1Remark = @creditTerm1Remark, 
        CreditTerm2Remark = @creditTerm2Remark, ACC_Code = @accCode, EmpName = @empName, 
        Created_Date = @createdDate, Created_By_Name = @createdByName, Created_By_Id = @createdById, 
        Update_Date = @updateDate, Update_By_Name = @updateByName, Update_By_Id = @updateById, 
        Approved_Date = @approvedDate, Approved_By_Name = @approvedByName, Approved_By_Id = @approvedById, 
        Cancel_Date = @cancelDate, Cancel_By_Name = @cancelByName, Cancel_By_Id = @cancelById, 
        Approved_Memo = @approvedMemo, Printed_Status = @printedStatus, Printed_Date = @printedDate, 
        Printed_By = @printedBy
    WHERE Rec_No = @recNo`;

    queryDatabase(query, params, res, "แก้ไข");
});

router.post('/cancel-rec-h', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const params = [
        { name: 'recNo', value: req.body.rec_no },
        { name: 'recStatus', value: req.body.rec_status },
        { name: 'cancelDate', value: req.body.cancel_date },
        { name: 'cancelByName', value: req.body.cancel_by_name },
        { name: 'cancelById', value: req.body.cancel_by_id },
    ];

    const query = `
        UPDATE REC_H SET
            Rec_Status = @recStatus, 
            Cancel_Date = @cancelDate, 
            Cancel_By_Name = @cancelByName, 
            Cancel_By_Id = @cancelById 
        WHERE Rec_No = @recNo`;

    queryDatabase(query, params, res, "ยกเลิก");
});

module.exports = router;