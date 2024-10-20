import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Model
import { whFormModel } from '../../../model/Warehouse/WHFormModel';

// Utils
import { getAlert } from '../../../utils/SamuiUtils';

import {
    manageWhItemData
} from '../../../utils/WarehouseUtils';

const AdjustWhModal = ({ whDataList, showWhModal, handleWhClose, itemDetailModal, warehouseId }) => {
    const [formData, setFormData] = useState(whFormModel());
    const [fromWhId, setFromWhId] = useState("");  // ต้น
    const [toWhId, setToWhId] = useState(""); // ปลาย
    const [disabled, setDisabled] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        clearValue();

        if (itemDetailModal) {
            setFormData({
                itemCode: itemDetailModal.Item_Code || '',
                itemName: itemDetailModal.Item_Name || '',
                stcBalance: itemDetailModal.STC_Balance || '',
                whName: itemDetailModal.WH_Name || '',
            });
            setDisabled(false);
        } else {
            setDisabled(true);
        }

        setFromWhId(warehouseId);
    }, [itemDetailModal]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRadioChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            updateType: e.target.value,
        }));

        setToWhId("");
    };

    const onChangeWarehouse = (setFor, id) => {
        if (setFor === 'FROM') {
            setFromWhId(id);
        } else {
            setToWhId(id);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const quantity = parseInt(formData.quantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
            getAlert("FAILED", "กรุณากรอกจำนวนที่ถูกต้องและมากกว่าศูนย์");
            return;
        }

        if (!formData.reason || formData.reason.length > 50) {
            getAlert("FAILED", "กรุณากรอกเหตุผลให้ครบถ้วนและไม่เกิน 50 ตัวอักษร.");
            return;
        }

        if (!formData.updateType) {
            getAlert("FAILED", "กรุณาเลือกประเภทการอัปเดต");
            return;
        }

        if (fromWhId === "" || fromWhId === "13") {
            getAlert("FAILED", "กรุณาเลือกคลังต้นทาง");
            return;
        }

        try {
            if (formData.updateType === 'AI' || formData.updateType === 'AO') { // ปรับปรุงเข้า (AI) || ปรับปรุงออก (AO)

                // ดักเงื่อนไข สต็อกคลัง ห้ามปรับปรุงออก ลด หรือ ย้าย มากกว่าจำนวนที่คงเหลือ
                if (formData.updateType === 'AO' && Number(formData.quantity) > Number(formData.stcBalance)) {
                    getAlert("FAILED", "ไม่สามารถใส่จำนวนเกินกว่าคงเหลือได้");
                    return;
                }

                await manageWhItemData(
                    itemDetailModal?.Item_Id, // Item ไอดีของสิ่งนั้นๆ
                    itemDetailModal?.Item_Code, // Item โค้ดของสิ่งนั้นๆ
                    itemDetailModal?.Item_Name, // ชื่อ Item นั้นๆ
                    fromWhId, // WarehouseID ของไอเทม
                    formData.updateType, // ประเภท เช่น IN/OUT/AI/AO/TI/TO
                    parseInt(formData.quantity, 10), // ค่าจำนวนที่กรอกจากหน้าจอ
                    null, // ไอดีเอกสาร
                    formData.updateType === 'AI' ? "ปรับปรุงเข้า" : "ปรับปรุงออก", // เลขเอกสาร
                    formData.reason, // เลขเอกสารอ้างอิง
                    null // หมายเหตุ
                );
            } else if (formData.updateType === 'TR') { // ย้ายคลัง (TR)
                // บังคับให้เลือกปลายทางด้วย ในกรณีที่มีการย้ายคลัง
                if (toWhId === "" || toWhId === "13") {
                    getAlert("FAILED", "กรุณาเลือกคลังปลายทาง");
                    return;
                }

                // ย้ายออก
                await manageWhItemData(
                    itemDetailModal?.Item_Id, // Item ไอดีของสิ่งนั้นๆ
                    itemDetailModal?.Item_Code, // Item โค้ดของสิ่งนั้นๆ
                    itemDetailModal?.Item_Name, // ชื่อ Item นั้นๆ
                    fromWhId, // WarehouseID ของไอเทม
                    "TO", // ประเภท เช่น IN/OUT/AI/AO/TI/TO
                    parseInt(formData.quantity, 10), // ค่าจำนวนที่กรอกจากหน้าจอ
                    null, // ไอดีเอกสาร
                    "ย้ายออกจากคลัง", // เลขเอกสาร
                    formData.reason, // เลขเอกสารอ้างอิง
                    null // หมายเหตุ
                );

                // ย้ายเข้า
                await manageWhItemData(
                    itemDetailModal?.Item_Id, // Item ไอดีของสิ่งนั้นๆ
                    itemDetailModal?.Item_Code, // Item โค้ดของสิ่งนั้นๆ
                    itemDetailModal?.Item_Name, // ชื่อ Item นั้นๆ
                    toWhId, // WarehouseID ของไอเทม
                    "TI", // ประเภท เช่น IN/OUT/AI/AO/TI/TO
                    parseInt(formData.quantity, 10), // ค่าจำนวนที่กรอกจากหน้าจอ
                    null, // ไอดีเอกสาร
                    "ย้ายเข้ามาคลัง", // เลขเอกสาร
                    formData.reason, // เลขเอกสารอ้างอิง
                    null // หมายเหตุ
                );
            }

            getAlert("OK", "อัปเดตคลังสินค้าสำเร็จ");

            await clearValue();

            handleWhClose();
            navigate('/warehouse-stock');
        } catch (error) {
            getAlert("FAILED", "ไม่สามารถอัปเดตคลังสินค้าได้");
        }
    };

    const clearValue = async () => {
        setFormData(whFormModel());
        setFromWhId("");
        setToWhId("");
    }

    return (
        <>
            <div
                className={`modal ${showWhModal ? 'show' : ''}`}
                style={{ display: showWhModal ? 'block' : 'none' }}
                tabIndex="-1"
                role="dialog"
            >
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            {/* <h5 className="modal-title">ปรับปรุงสินค้า เข้า-ออก, ย้ายคลัง</h5> */}
                            <button type="button" className="btn-close" onClick={handleWhClose}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>

                                <div className='card shadow-lg mb-3' style={{ backgroundColor: '#F5F7FD' }}>
                                    <div className="container mt-3">
                                        <h5
                                            className="modal-title text-black text-center p-3 my-2 text-white rounded shadow" style={{ backgroundColor: '#EF6C00' }}
                                        >
                                            ปรับปรุงสินค้า เข้า-ออก, ย้ายคลัง
                                        </h5>
                                        <div className="form-group row">
                                            <label htmlFor="itemCode" className="col-1 col-form-label"><strong className='text-black'>รหัสสินค้า</strong></label>
                                            <div className="col-11">
                                                <input
                                                    type="text"
                                                    id="itemCode"
                                                    className="form-control"
                                                    value={formData.itemCode}
                                                    style={{ fontWeight: 'bold', color: 'black' }}
                                                    onChange={handleChange}
                                                    disabled={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="itemName" className="col-1 col-form-label"><strong className='text-black'>ชื่อสินค้า</strong></label>
                                            <div className="col-11">
                                                <input
                                                    type="text"
                                                    id="itemName"
                                                    className="form-control"
                                                    value={formData.itemName}
                                                    onChange={handleChange}
                                                    disabled={true}
                                                    style={{ fontWeight: 'bold', color: 'black' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="row">
                                                        <div className="col-7 mb-3">
                                                            <div className="d-flex align-items-center">
                                                                {/* <label><strong className='text-black'>คงคลัง : </strong> </label> */}
                                                                <label className='text-black'>คงคลัง : </label>
                                                                <input
                                                                    id="stcBalance"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.stcBalance}
                                                                    onChange={handleChange}
                                                                    disabled={true}
                                                                    style={{ fontWeight: 'bold', color: 'black' }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='col-5' />
                                                        <div className="col-7">
                                                            <div className="d-flex align-items-center">
                                                                <label className='text-black'>จน.ปรับปรุง : </label>
                                                                <input
                                                                    id="quantity"
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.quantity}
                                                                    onChange={handleChange}
                                                                    disabled={disabled}
                                                                    style={{ color: 'black' }}
                                                                    onInput={(e) => {
                                                                        if (/^0+/.test(e.target.value)) {
                                                                            e.target.value = e.target.value.replace(/^0+/, '');
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='col-5' />

                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="row">
                                                        <div className="col-10 mb-2">
                                                            <small className="text-danger mb-1">ต้นทาง</small>
                                                            <div className="d-flex align-items-center">
                                                                <label className="me-1 text-black">คลัง : </label>
                                                                <select
                                                                    style={{ width: '200px', color: 'black' }}
                                                                    className="form-select"
                                                                    value={fromWhId}
                                                                    onChange={(e) => onChangeWarehouse('FROM', e.target.value)}

                                                                    disabled={true}

                                                                >
                                                                    {whDataList.map((ware) => (
                                                                        <option
                                                                            key={ware.WH_Id}
                                                                            value={ware.WH_Id}>
                                                                            {ware.WH_Name}
                                                                        </option>
                                                                    ))}
                                                                </select>

                                                            </div>
                                                        </div>
                                                        <div className="col-2" />
                                                        <div className="col-10 mb-2">
                                                            <small className="text-danger mb-1 ">ปลายทาง</small>
                                                            <div className="d-flex align-items-center">
                                                                <label className="me-1 text-black">คลัง : </label>
                                                                <select
                                                                    style={{ width: '200px', color: 'black' }}
                                                                    className="form-select"
                                                                    value={toWhId}
                                                                    onChange={(e) => onChangeWarehouse('TO', e.target.value)}
                                                                    disabled={formData.updateType !== 'TR'}
                                                                >
                                                                    {whDataList.map((ware) => (
                                                                        <option
                                                                            key={ware.WH_Id}
                                                                            value={ware.WH_Id}>
                                                                            {ware.WH_Name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='col-2' />
                                                    </div>
                                                </div>
                                                <div className='col-6' />
                                            </div>

                                        </div>
                                        <div className='row'>
                                            <div className='col-5'>
                                                <div className="radio-inline mb-4">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="updateType"
                                                        id="option1"
                                                        value="AI"
                                                        checked={formData.updateType === 'AI'}
                                                        onChange={handleRadioChange}
                                                        disabled={disabled}
                                                    />
                                                    <label className="form-check-label text-black" htmlFor="option1">
                                                        ปรับปรุงเข้า (AI)
                                                    </label>
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="updateType"
                                                        id="option2"
                                                        value="AO"
                                                        checked={formData.updateType === 'AO'}
                                                        onChange={handleRadioChange}
                                                        disabled={disabled}
                                                    />
                                                    <label className="form-check-label text-black" htmlFor="option2">
                                                        ปรับปรุงออก (AO)
                                                    </label>
                                                </div>
                                            </div>
                                            <div className='col-7' />
                                            <div className='col-12'>
                                                <div className="radio-inline mb-4">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="updateType"
                                                        id="option3"
                                                        value="TR"
                                                        checked={formData.updateType === 'TR'}
                                                        onChange={handleRadioChange}
                                                        disabled={disabled}
                                                    />
                                                    <label className="form-check-label text-black" htmlFor="option3">
                                                        ย้ายคลัง (TR)
                                                    </label>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label htmlFor="reason" className="col-1 col-form-label text-black">เหตุผล : </label>
                                            <div className="col-11">
                                                <input
                                                    type="text"
                                                    id="reason"
                                                    className="form-control"
                                                    value={formData.reason}
                                                    onChange={handleChange}
                                                    disabled={disabled}
                                                />
                                                <small className="text-danger mb-1 mt-2">(50 ตัวอักษร)</small>
                                            </div>
                                            {/* <div className='col-3' /> */}
                                        </div>
                                    </div>



                                </div>




                                <div className="modal-footer">
                                    <button type="submit"
                                        className="btn  btn-lg text-white"
                                        style={{ backgroundColor: 'rgb(239, 108, 0)' }} disabled={disabled}>ยืนยันการปรับปรุง</button>
                                    <button type="button"
                                        className="btn btn-lg text-white"
                                        style={{ backgroundColor: 'black' }} onClick={handleWhClose}>ยกเลิกการปรับปรุง</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {showWhModal && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default AdjustWhModal;
