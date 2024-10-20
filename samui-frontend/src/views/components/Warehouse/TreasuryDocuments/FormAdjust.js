import React, { useState, useEffect } from 'react';
import Axios from "axios";
import './../../../../assets/css/purchase/form.css';

// React DateTime
import Datetime from 'react-datetime';
import moment from 'moment';

// Components
import Breadcrumbs from "../../Breadcrumbs";
import ApModal from '../../Modal/ApModal';
import FormAction from '../../Actions/FormAction';
import ItemWhModal from '../../Content/ItemWhTable';

// Model
import { whDocMasterModel } from '../../../../model/Warehouse/WHDocMasterModel';
import { whDocDetailModel } from '../../../../model/Warehouse/WHDocDetailModel';

import {
    getDataWithComp,
    getViewAp,
    formatCurrency,
    getAlert,
    getMaxAdjNo
} from "../../../../utils/SamuiUtils";

import {
    formatDateTime,
    formatDateOnChange,
    formatStringDateToDate,
    formatThaiDateUiToDate,
} from "../../../../utils/DateUtils";

import {
    manageWhItemData
} from '../../../../utils/WarehouseUtils';

const FormAdjust = ({ callInitialize, mode, name, whDocNo }) => {
    const [formMasterList, setFormMasterList] = useState(whDocMasterModel());
    const [formDetailList, setFormDetailList] = useState([]);
    const [itemDataList, setItemDataList] = useState([]);
    const [whDataList, setWhDataList] = useState([]);
    const [apDataList, setApDataList] = useState([]);

    // การเลือกคลังจากหน้าจอ
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);

    useEffect(() => {
        initialize();
    }, []);

    const initialize = async () => {
        const whDataList = await getDataWithComp('Tb_Set_WH', 'ORDER BY WH_Code ASC');
        if (whDataList && whDataList.length > 0) {
            setWhDataList(whDataList);
        }

        const apDataList = await getViewAp();
        if (apDataList && apDataList.length > 0) {
            setApDataList(apDataList);
        }
    };

    const handleChangeMaster = (e) => {
        const { name, value } = e.target;
        // อัปเดตค่าใน formMasterList
        setFormMasterList((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeDateMaster = (value, name) => {
        // ตรวจสอบว่า value เป็น moment object หรือไม่
        const newValue = value && value instanceof moment ? value.format('YYYY-MM-DD') : value;
        // อัปเดตค่าใน formMasterList
        setFormMasterList((prev) => ({
            ...prev,
            [name]: formatDateOnChange(newValue),
        }));
    };

    const handleChangeWarehouse = async (value) => {

        // เคลียค่าตอนกดย้ายคลัง
        setFormDetailList([]);

        const itemDataList = await getDataWithComp('API_1101_WH_ITEM_ONHAND', `AND WH_Id = ${Number(value)} ORDER BY Item_Code ASC`);
        if (itemDataList && itemDataList.length > 0) {
            setItemDataList(itemDataList);
        }

        setSelectedWarehouse(value);
    };

    const handleQuantityChange = (index, type, value, onHand) => {
        // ตรวจสอบว่าค่าที่กรอกเข้ามาเป็นตัวเลขหรือตัวเลขที่มีจุดทศนิยม
        if (!/^\d*\.?\d*$/.test(value)) {
            //getAlert("FAILED", "กรุณากรอกเฉพาะตัวเลขเท่านั้น");
            return;
        }

        const updatedList = [...formDetailList];

        // หยอดข้อมูล เพิ่ม/ลด รายละเอียดสินค้า แยกตามประเภท
        if (type === 'increase') {
            updatedList[index].itemIncrease = value;
            updatedList[index].itemDecrease = null;
            updatedList[index].itemBalance = Number(onHand) + Number(value);
            updatedList[index].itemQty = Number(value);
        } else if (type === 'decrease') {
            // ดักไม่ให้ปรับปรุงเกินกว่าสินค้าคงเหลือ เฉพาะตอนปรับลดสินค้า
            if (value > onHand) {
                getAlert("FAILED", "กรุณาระบุจำนวนไม่เกินคงเหลือ");
                updatedList[index].itemIncrease = null;
                updatedList[index].itemDecrease = null;
                updatedList[index].docType = null;
                updatedList[index].itemBalance = Number(onHand);
                setFormDetailList(updatedList);
                return;
            }

            updatedList[index].itemIncrease = null;
            updatedList[index].itemDecrease = value;
            updatedList[index].itemBalance = Number(onHand) - Number(value);
            updatedList[index].itemQty = Number(value);
        }

        updatedList[index].docType = type === 'increase' ? "AI" : "AO";
        setFormDetailList(updatedList);
    };

    // SET AP
    const [showApModal, setShowApModal] = useState(false);
    const handleApShow = () => setShowApModal(true);
    const handleApClose = () => setShowApModal(false);
    const onRowSelectAp = (apSelected) => {
        try {
            setFormMasterList({
                ...formMasterList,
                whDocCustId: apSelected.AP_Id,
                whDocCustCode: apSelected.AP_Code,
                whDocCustName: apSelected.AP_Name
            });
            handleApClose(); // ปิด modal หลังจากเลือก
        } catch (error) {
            getAlert("FAILED", error);
        }
    };

    // SET ITEM
    const [showItemModal, setShowItemModal] = useState(false);
    const handleItemShow = () => setShowItemModal(true);
    const handleItemClose = () => setShowItemModal(false);
    const onRowSelectItem = (itemSelected) => {
        try {
            const newRow = whDocDetailModel(formDetailList.length + 1);

            setFormDetailList([
                ...formDetailList,
                {
                    ...newRow,
                    line: null,
                    itemId: itemSelected.Item_Id,
                    itemCode: itemSelected.Item_Code,
                    itemName: itemSelected.Item_Name,
                    itemUnit: itemSelected.Item_Unit_ST,
                    itemOnHand: itemSelected.Item_Onhand || 0,
                    itemBalance: itemSelected.Item_Onhand || 0,
                    itemPriceUnit: 0,
                    itemTotal: 0,
                    docType: null
                }
            ]);

            handleItemClose(); // ปิด modal หลังจากเลือก
        } catch (error) {
            getAlert("FAILED", error);
        }
    };
    const handleRemoveRow = (index) => {
        const newList = formDetailList.filter((_, i) => i !== index);
        setFormDetailList(newList);
    };

    const handleSubmit = async () => {
        try {
            const findMaxAdjNo = await getDataWithComp('WHDoc_H', `AND WHDoc_Type = '1' ORDER BY WHDoc_No DESC`);
            const maxAdj = getMaxAdjNo(findMaxAdjNo);
            let newMaxAdj = maxAdj;

            // ตรวจสอบค่า formMasterList.apID และ formMasterList.apCode
            if (selectedWarehouse === null) {
                getAlert("FAILED", "กรุณาเลือกจากคลัง");
                return; // หยุดการทำงานของฟังก์ชันหากไม่มีค่า apID หรือ apCode
            }

            // ตรวจสอบค่า formMasterList.apID และ formMasterList.apCode
            // if (!formMasterList.whDocCustId) {
            //     getAlert("FAILED", "กรุณาเลือกผู้ขาย");
            //     return; // หยุดการทำงานของฟังก์ชันหากไม่มีค่า apID หรือ apCode
            // }

            // ตรวจสอบว่า formDetailList มีค่าหรือมีความยาวเป็น 0
            if (!formDetailList || formDetailList.length === 0) {
                getAlert("FAILED", "กรุณาเพิ่มรายละเอียดสินค้าที่จะปรับปรุง");
                return; // หยุดการทำงานของฟังก์ชันหาก formDetailList ไม่มีค่า
            }

            // ตรวจสอบค่าภายใน formDetailList
            for (const item of formDetailList) {
                if (!item.itemQty || parseInt(item.itemQty) === 0) {
                    getAlert("FAILED", `กรุณากรอกจำนวนปรับปรุงของสินค้า ${item.itemName}`);
                    return; // หยุดการทำงานหากจำนวนของสินค้าเป็น 0 หรือไม่มีค่า
                }
            }

            // ข้อมูลหลักที่จะส่งไปยัง API
            const formMasterData = {
                wh_doc_no: newMaxAdj,
                wh_doc_type: parseInt("1", 10),
                wh_doc_cust_id: parseInt(formMasterList.whDocCustId, 10),
                wh_doc_date: formatStringDateToDate(formMasterList.whDocDate),
                wh_doc_trans_date: formatStringDateToDate(formMasterList.whDocTransDate),
                wh_doc_created_date: formatThaiDateUiToDate(formMasterList.whDocCreatedDate),
                wh_doc_created_by: formMasterList.whDocCreatedBy,
                wh_doc_status: parseInt("1", 10),
                wh_doc_seq: formatDateTime(new Date()),
                wh_doc_remark: formMasterList.whDocRemark,
                wh_doc_comp_id: formMasterList.whDocCompId,
                wh_doc_show_front: null
            };

            // ส่งข้อมูลหลักไปยัง API
            const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/create-wh-doc-h`, formMasterData, {
                headers: { key: process.env.REACT_APP_ANALYTICS_KEY }
            });

            if (response.data.status === 'OK') {
                const getWhDocIdResponse = await Axios.post(`${process.env.REACT_APP_API_URL}/api/get-by-wh-doc-no`, {
                    table: 'WHDoc_H',
                    wh_doc_no: formMasterData.wh_doc_no
                }, {
                    headers: { key: process.env.REACT_APP_ANALYTICS_KEY }
                });

                if (getWhDocIdResponse && getWhDocIdResponse.data.length > 0) {
                    const whDocId = parseInt(getWhDocIdResponse.data[0].WHDoc_Id, 10);
                    let line = 1;

                    const detailPromises = formDetailList.map(async (item) => {
                        const formDetailData = {
                            wh_doc_id: whDocId,
                            line: line,
                            item_id: item.itemId,
                            item_code: item.itemCode,
                            item_name: item.itemName,
                            item_qty: item.itemQty,
                            item_unit: item.itemUnit,
                            item_price_unit: item.itemPriceUnit,
                            item_total: item.itemTotal,
                            doc_type: item.docType,
                            f_wh_id: selectedWarehouse,
                            f_zone_id: item.fZoneId,
                            f_lt_id: item.fLtId,
                            t_wh_id: item.tWhId,
                            t_zone_id: item.fZoneId,
                            t_lt_id: item.fLtId
                        };
                        line++;

                        await manageWhItemData(
                            item.itemId, // Item ไอดีของสิ่งนั้นๆ
                            item.itemCode, // Item โค้ดของสิ่งนั้นๆ
                            item.itemName, // ชื่อ Item นั้นๆ
                            selectedWarehouse, // WarehouseID ของไอเทม
                            item.docType, // ประเภท เช่น IN/OUT/AI/AO/TI/TO
                            Number(item.itemQty), // ค่าจำนวนที่กรอกจากหน้าจอ
                            whDocId, // ไอดีเอกสาร
                            newMaxAdj, // เลขเอกสาร
                            newMaxAdj, // เลขเอกสารอ้างอิง
                            formMasterList.whDocRemark // หมายเหตุ
                        );

                        return Axios.post(`${process.env.REACT_APP_API_URL}/api/create-wh-doc-d`, formDetailData, {
                            headers: { key: process.env.REACT_APP_ANALYTICS_KEY }
                        });
                    });

                    await Promise.all(detailPromises);
                }

                callInitialize();
                getAlert(response.data.status, response.data.message);
            }
        } catch (error) {
            getAlert("FAILED", error.response?.data?.message || error.message);
        }
    };

    const handleUpdate = async () => {
        console.debug("Begin handleUpdate");
    };

    const handleCancel = async () => {
        console.debug("Begin handleCancel");
    };

    return <>
        <Breadcrumbs page={whDocNo} items={[
            { name: 'คลังสินค้า', url: '/Warehouse' },
            { name: "จัดการเอกสารงานคลัง", url: '/treasury-documents' },
            { name: mode === 'U' ? "เรียกดู" + name : "สร้าง" + name, url: '#' }
        ]} />

        <div className="body">
            <div class="container-fluid my-4">
                <h5 className="">ใบปรับปรุงสินค้า</h5>
                <div className="row mb-1">
                    <div className="col-4">
                        <div className="d-flex">
                            <label>วันที่เอกสาร : </label>
                            <Datetime
                                className="input-spacing-input-date"
                                name="whDocDate"
                                value={formMasterList.whDocDate || null}
                                onChange={(date) => handleChangeDateMaster(date, 'whDocDate')}
                                dateFormat="DD-MM-YYYY"
                                timeFormat={false}
                                inputProps={{ readOnly: true, disabled: mode === 'U' }}
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="d-flex">
                            <label>ผู้ขาย</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control input-spacing"
                                    name="whDocCustId"
                                    value={
                                        (formMasterList.whDocCustCode || '')
                                        + (" ") +
                                        (formMasterList.whDocCustName || '')
                                    }
                                    onChange={handleChangeMaster}
                                    disabled={true}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={handleApShow}>
                                    <i className="fas fa-search"></i>
                                </button>
                                <ApModal
                                    showApModal={showApModal}
                                    handleApClose={handleApClose}
                                    apDataList={apDataList}
                                    onRowSelectAp={onRowSelectAp}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="d-flex">
                            <label className="">วันที่สร้าง : </label>
                            <input
                                type="text"
                                className="form-control input-spacing"
                                value={formMasterList.whDocCreatedDate}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="row mb-1">
                    <div className="col-4">
                        <div className="d-flex">
                            <label>วันที่จัดส่ง : </label>
                            <Datetime
                                className="input-spacing-input-date"
                                name="whDocTransDate"
                                value={formMasterList.whDocTransDate || null}
                                onChange={(date) => handleChangeDateMaster(date, 'whDocTransDate')}
                                dateFormat="DD-MM-YYYY"
                                timeFormat={false}
                                inputProps={{ readOnly: true, disabled: false }}
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="d-flex">
                            <label>สร้างโดย : </label>
                            <input
                                type="text"
                                className="form-control input-spacing"
                                value={formMasterList.whDocCreatedBy}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className="col-4" />
                </div>
                <div className="row mb-1">
                    <div className="col-4">
                        <div className="d-flex">
                            <label>จากคลัง : </label>
                            <select
                                class="form-select"
                                value={selectedWarehouse}
                                onChange={(e) => handleChangeWarehouse(e.target.value)}>
                                <option value={null}>
                                    กรุณาระบุคลัง
                                </option>
                                {whDataList.map((warehouse) => (
                                    <option
                                        key={warehouse.WH_Id}
                                        value={warehouse.WH_Id}
                                    >
                                        {warehouse.WH_Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="d-flex">
                            <label>หมายเหตุ : </label>
                            <input
                                type="text"
                                className="form-control input-spacing"
                                name="whDocRemark"
                                value={formMasterList.whDocRemark || ''}
                                onChange={handleChangeMaster}
                                disabled={false} />
                        </div>
                    </div>
                    <div className="col-4" />
                </div>
                <hr />
            </div>
            <div className="container-fluid my-3">
                <div className="row">
                    <div className="col-12">
                        <ItemWhModal
                            mode={mode}
                            showItemModal={showItemModal}
                            handleItemClose={handleItemClose}
                            itemDataList={itemDataList}
                            onRowSelectItem={onRowSelectItem}
                            formDetailList={formDetailList}
                            handleItemShow={handleItemShow}
                            handleQuantityChange={handleQuantityChange}
                            handleRemoveRow={handleRemoveRow}
                            formatCurrency={formatCurrency}
                            disabled={selectedWarehouse === null}
                        />
                        <FormAction
                            onSubmit={handleSubmit}
                            onUpdate={handleUpdate}
                            onCancel={handleCancel}
                            mode={mode}
                            disabled={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    </>
};

export default FormAdjust;
