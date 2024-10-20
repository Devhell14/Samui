import React, { useState, useEffect } from 'react';
import { formatCurrency, getAlert } from '../../../utils/SamuiUtils';
import { formatThaiDateUi, formatThaiDate } from '../../../utils/DateUtils';
import Datetime from 'react-datetime';
import moment from 'moment';

const RecModal = ({ showRecModal, handleRecClose, recDataList, onConfirmRecSelection }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredRecDataList, setFilteredRecDataList] = useState(recDataList);
    const [selectedItems, setSelectedItems] = useState([]);
    const [docStatusPaid, setDocStatusPaid] = useState(0);

    useEffect(() => {
        setFilteredRecDataList(
            recDataList.filter(rec =>
                (rec.Rec_No.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rec.AP_Name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (!startDate || !endDate || (moment(formatThaiDate(rec.Rec_Date)).isBetween(startDate, endDate, 'day', '[]'))) &&
                rec.Doc_Status_Paid === docStatusPaid
            )
        );
    }, [searchTerm, startDate, endDate, docStatusPaid, recDataList]);

    useEffect(() => {
        if (showRecModal) {
            setSearchTerm('');
            setSelectedItems([]);
            setStartDate(moment(Math.min(...recDataList.map(rec => new Date(formatThaiDate(rec.Rec_Date))))));
            setEndDate(moment(Math.max(...recDataList.map(rec => new Date(formatThaiDate(rec.Rec_Date))))));
            setDocStatusPaid(0);
        }
    }, [showRecModal]);

    const checkApNameConsistency = (items) => {
        if (items.length > 0) {
            const apName = items[0].AP_Name;
            const isConsistent = items.every(item => item.AP_Name === apName);
            if (!isConsistent) {
                getAlert('FAILED', 'กรุณาเลือกผู้รับเงินเป็นรายเดียวกัน');
            }
            return isConsistent;
        }
        return true;
    };

    const handleCheckboxChange = (rec) => {
        const updatedSelectedItems = selectedItems.some(item => item.Rec_No === rec.Rec_No)
            ? selectedItems.filter(item => item.Rec_No !== rec.Rec_No)
            : [...selectedItems, rec];

        setSelectedItems(updatedSelectedItems);
    };

    const handleConfirmSelection = () => {
        if (checkApNameConsistency(selectedItems)) {
            onConfirmRecSelection(selectedItems);
        }
    };

    const clearSelection = () => {
        setSelectedItems([]);
    };

    return (
        <>
            <div className={`modal ${showRecModal ? 'show' : ''}`} style={{ display: showRecModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">รายชื่อใบรับสินค้า</h5>
                            <button type="button" className="close" onClick={handleRecClose}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-4">
                                    <div className="form-group">
                                        <span className="fw-bold">ค้นหาเอกสาร</span>
                                        <input
                                            style={{ width: '100%' }}
                                            type="text"
                                            className="form-control"
                                            placeholder="ค้นหาเลขที่เอกสาร (REC) หรือ AP_NAME"
                                            value={searchTerm || ''}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="form-group">
                                        <span className="fw-bold">สถานะจ่าย</span>
                                        <div className="radio-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="docStatusPaid"
                                                value={0}
                                                id="status0"
                                                checked={docStatusPaid === 0}
                                                onChange={(e) => clearSelection() + setDocStatusPaid(parseInt(e.target.value))}
                                            />
                                            <label className="form-check-label ml-2" htmlFor="status0">ยังไม่ทำรายการ</label>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="docStatusPaid"
                                                value={1}
                                                id="status1"
                                                checked={docStatusPaid === 1}
                                                onChange={(e) => clearSelection() + setDocStatusPaid(parseInt(e.target.value))}
                                            />
                                            <label className="form-check-label ml-2" htmlFor="status1">ค้างจ่าย</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="form-group">
                                        <span className="fw-bold">วันที่เริ่มต้น</span>
                                        <Datetime
                                            className="input-spacing-input-date"
                                            value={startDate}
                                            dateFormat="DD-MM-YYYY"
                                            timeFormat={false}
                                            onChange={date => setStartDate(date)}
                                            inputProps={{ readOnly: true, disabled: false }}
                                        />
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="form-group">
                                        <span className="fw-bold">วันที่สิ้นสุด</span>
                                        <Datetime
                                            className="input-spacing-input-date"
                                            value={endDate}
                                            dateFormat="DD-MM-YYYY"
                                            timeFormat={false}
                                            onChange={date => setEndDate(date)}
                                            inputProps={{ readOnly: true, disabled: false }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                <table className="table table-striped table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th className="text-center" style={{ width: '3%' }}>
                                                <input type="checkbox" onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setSelectedItems(checked ? filteredRecDataList : []);
                                                }} checked={filteredRecDataList.length > 0 && selectedItems.length === filteredRecDataList.length} />
                                            </th>
                                            <th className="text-center" style={{ width: '15%' }}>เลขที่เอกสาร (REC)</th>
                                            <th className="text-center" style={{ width: '30%' }}>AP_NAME</th>
                                            <th className="text-center" style={{ width: '25%' }}>รายละเอียดเอกสาร</th>
                                            <th className="text-center" style={{ width: '10%' }}>วันที่รับเข้า</th>
                                            <th className="text-center" style={{ width: '5%' }}>ราคารวม</th>
                                            <th className="text-center" style={{ width: '12%' }}>สถานะจ่าย</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRecDataList && filteredRecDataList.length > 0 ? (
                                            filteredRecDataList.map((rec, index) => (
                                                <tr
                                                    key={rec.Rec_Id || index + 1}
                                                    checked={selectedItems.some(item => item.Rec_No === rec.Rec_No)}
                                                    onClick={() => handleCheckboxChange(rec)}
                                                    style={{ cursor: 'pointer' }}>
                                                    <td className="text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.some(item => item.Rec_No === rec.Rec_No)}
                                                            onChange={() => handleCheckboxChange(rec)}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    </td>
                                                    <td className="text-center">{rec.Rec_No}</td>
                                                    <td className="text-left">{rec.AP_Name}</td>
                                                    <td className="text-left">{rec.Doc_Remark1}</td>
                                                    <td className="text-center">{formatThaiDateUi(rec.Rec_Date)}</td>
                                                    <td className="text-end">{formatCurrency(rec.NetTotal)}</td>
                                                    <td className="text-center">{rec.DocStatusPaid_Name}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7">
                                                    <center>
                                                        <h5>ไม่พบข้อมูล</h5>
                                                    </center>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={handleConfirmSelection}>
                                ยืนยันการเลือก
                            </button>
                            <button className="btn btn-danger" onClick={clearSelection}>
                                ยกเลิกการเลือก
                            </button>
                            <button className="btn btn-secondary" onClick={handleRecClose}>
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RecModal;