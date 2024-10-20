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
        res.send({ "status": "OK", "message": `${action}รายการใบสำคัญจ่ายสำเร็จ`, "result": result });
    } catch (err) {
        console.log(err);
        res.send({ "status": "FAILED", "message": `${action}รายการใบสำคัญจ่ายไม่สำเร็จ`, "result": err });
    }
};

router.post('/create-pay-h', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const {
        pay_no,
        pay_date,
        pay_status,
        pay_type,
        doc_remark1,
        doc_remark2,
        ref_doc_id,
        ref_doc,
        ref_doc_date,
        ref_project_id,
        ref_project_no,
        comp_id,
        ap_id,
        ap_code,
        ar_id,
        ar_code,
        doc_due_date,
        doc_pay_date,
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
        printed_by,
        cancel_memo,
        total_pay_per
    } = req.body;

    const query = `
    INSERT INTO PAY_H (
        Pay_No, Pay_Date, Pay_Status, Pay_Type, Doc_Remark1, 
        Doc_Remark2, Ref_DocID, Ref_Doc, Ref_DocDate, Ref_ProjectID, 
        Ref_ProjectNo, Comp_Id, AP_Id, AP_Code, AR_Id, AR_Code, Doc_DueDate, 
        Doc_PayDate, Action_Hold, Discount_Value, Discount_Value_Type, 
        Discount_Cash, Discount_Cash_Type, Discount_Transport, 
        Discount_Transport_Type, IsVat, Doc_SEQ, CreditTerm, 
        CreditTerm1Day, CreditTerm1Remark, CreditTerm2Remark, 
        ACC_Code, EmpName, Created_Date, Created_By_Name, 
        Created_By_Id, Update_Date, Update_By_Name, 
        Update_By_Id, Approved_Date, Approved_By_Name, 
        Approved_By_Id, Cancel_Date, Cancel_By_Name, 
        Cancel_By_Id, Approved_Memo, Printed_Status, 
        Printed_Date, Printed_By, Cancel_Memo, Total_Pay_Per 
    ) VALUES (
        @pay_no, @pay_date, @pay_status, @pay_type, @doc_remark1, 
        @doc_remark2, @ref_doc_id, @ref_doc, @ref_doc_date, @ref_project_id, 
        @ref_project_no, @comp_id, @ap_id, @ap_code, @ar_id, @ar_code, 
        @doc_due_date, @doc_pay_date,@action_hold, @discount_value, @discount_value_type, 
        @discount_cash, @discount_cash_type, @discount_transport, 
        @discount_transport_type, @is_vat, @doc_seq, @credit_term, 
        @credit_term_1_day, @credit_term_1_remark, @credit_term_2_remark, 
        @acc_code, @emp_name, @created_date, @created_by_name, 
        @created_by_id, @update_date, @update_by_name, 
        @update_by_id, @approved_date, @approved_by_name, 
        @approved_by_id, @cancel_date, @cancel_by_name, 
        @cancel_by_id, @approved_memo, @printed_status, 
        @printed_date, @printed_by, @cancel_memo, @total_pay_per 
    )`;

    const params = [
        { name: 'pay_no', value: pay_no },
        { name: 'pay_date', value: pay_date },
        { name: 'pay_status', value: pay_status },
        { name: 'pay_type', value: pay_type },
        { name: 'doc_remark1', value: doc_remark1 },
        { name: 'doc_remark2', value: doc_remark2 },
        { name: 'ref_doc_id', value: ref_doc_id },
        { name: 'ref_doc', value: ref_doc },
        { name: 'ref_doc_date', value: ref_doc_date },
        { name: 'ref_project_id', value: ref_project_id },
        { name: 'ref_project_no', value: ref_project_no },
        { name: 'comp_id', value: comp_id },
        { name: 'ap_id', value: ap_id },
        { name: 'ap_code', value: ap_code },
        { name: 'ar_id', value: ar_id },
        { name: 'ar_code', value: ar_code },
        { name: 'doc_due_date', value: doc_due_date },
        { name: 'doc_pay_date', value: doc_pay_date },
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
        { name: 'printed_by', value: printed_by },
        { name: 'cancel_memo', value: cancel_memo },
        { name: 'total_pay_per', value: total_pay_per }
    ];

    queryDatabase(query, params, res);
});

router.post('/update-pay-h', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const params = [
        { name: 'payNo', value: req.body.pay_no },
        { name: 'payDate', value: req.body.pay_date },
        { name: 'docDueDate', value: req.body.doc_due_date },
        { name: 'docPayDate', value: req.body.doc_pay_date },
        { name: 'payStatus', value: req.body.pay_status },
        { name: 'payType', value: req.body.pay_type },
        { name: 'refDocID', value: req.body.ref_doc_id },
        { name: 'refDoc', value: req.body.ref_doc },
        { name: 'refDocDate', value: req.body.ref_doc_date },
        { name: 'refProjectID', value: req.body.ref_project_id },
        { name: 'refProjectNo', value: req.body.ref_project_no },
        { name: 'compId', value: req.body.comp_id },
        { name: 'docRemark1', value: req.body.doc_remark1 },
        { name: 'docRemark2', value: req.body.doc_remark2 },
        { name: 'apID', value: req.body.ap_id },
        { name: 'apCode', value: req.body.ap_code },
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
        { name: 'approvedDate', value: req.body.approved_date },
        { name: 'approvedByName', value: req.body.approved_by_name },
        { name: 'approvedById', value: req.body.approved_by_id },
        { name: 'cancelDate', value: req.body.cancel_date },
        { name: 'cancelByName', value: req.body.cancel_by_name },
        { name: 'cancelById', value: req.body.cancel_by_id },
        { name: 'approvedMemo', value: req.body.approved_memo },
        { name: 'printedStatus', value: req.body.printed_status },
        { name: 'printedDate', value: req.body.printed_date },
        { name: 'printedBy', value: req.body.printed_by },
        { name: 'cancelMemo', value: req.body.cancel_memo },
        { name: 'totalPayPer', value: req.body.total_pay_per }
    ];

    const query = `
        UPDATE PAY_H SET
            Pay_Date = @payDate,
            Pay_Status = @payStatus,
            Pay_Type = @payType,
            Doc_Remark1 = @docRemark1,
            Doc_Remark2 = @docRemark2,
            Ref_DocID = @refDocID,
            Ref_Doc = @refDoc,
            Ref_DocDate = @refDocDate,
            Ref_ProjectID = @refProjectID,
            Ref_ProjectNo = @refProjectNo,
            Comp_Id = @compId,
            AP_Id = @apID,
            AP_Code = @apCode,
            AR_Id = @arID,
            AR_Code = @arCode,
            Doc_DueDate = @docDueDate,
            Doc_PayDate = @docPayDate,
            Action_Hold = @actionHold,
            Discount_Value = @discountValue,
            Discount_Value_Type = @discountValueType,
            Discount_Cash = @discountCash,
            Discount_Cash_Type = @discountCashType,
            Discount_Transport = @discountTransport,
            Discount_Transport_Type = @discountTransportType,
            IsVat = @isVat,
            Doc_SEQ = @docSEQ,
            CreditTerm = @creditTerm,
            CreditTerm1Day = @creditTerm1Day,
            CreditTerm1Remark = @creditTerm1Remark,
            CreditTerm2Remark = @creditTerm2Remark,
            ACC_Code = @accCode,
            EmpName = @empName,
            Created_Date = @createdDate,
            Created_By_Name = @createdByName,
            Created_By_Id = @createdById,
            Update_Date = @updateDate,
            Update_By_Name = @updateByName,
            Update_By_Id = @updateById,
            Approved_Date = @approvedDate,
            Approved_By_Name = @approvedByName,
            Approved_By_Id = @approvedById,
            Cancel_Date = @cancelDate,
            Cancel_By_Name = @cancelByName,
            Cancel_By_Id = @cancelById,
            Approved_Memo = @approvedMemo,
            Printed_Status = @printedStatus,
            Printed_Date = @printedDate,
            Printed_By = @printedBy,
            Cancel_Memo = @cancelMemo,
            Total_Pay_Per = @totalPayPer
        WHERE Pay_No = @payNo
    `;

    queryDatabase(query, params, res, "แก้ไข");
});

router.post('/cancel-pay-h', (req, res) => {
    if (!checkApiKey(req, res)) return;

    const params = [
        { name: 'payNo', value: req.body.pay_no },
        { name: 'payStatus', value: req.body.pay_status },
        { name: 'cancelDate', value: req.body.cancel_date },
        { name: 'cancelByName', value: req.body.cancel_by_name },
        { name: 'cancelById', value: req.body.cancel_by_id },
    ];

    const query = `
        UPDATE PAY_H SET
            Pay_Status = @payStatus, 
            Cancel_Date = @cancelDate, 
            Cancel_By_Name = @cancelByName, 
            Cancel_By_Id = @cancelById 
        WHERE Pay_No = @payNo`;

    queryDatabase(query, params, res, "ยกเลิก");
});

module.exports = router;
