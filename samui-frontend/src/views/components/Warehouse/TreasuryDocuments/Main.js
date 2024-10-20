import React, { useState } from 'react';

// React DateTime
import Datetime from 'react-datetime';
import moment from 'moment';

// Components
import Breadcrumbs from '../../Breadcrumbs';

// Utils
import {
  formatCurrency
} from "../../../../utils/SamuiUtils";

import {
  formatDate,
  formatDateOnChange
} from "../../../../utils/DateUtils";

import {
  downloadReconciliationPDF
} from "../../../../utils/ExportUtils";

const Main = ({ name, onChangeMode, dataMasterList, dataDetailList }) => {
  const [filteredDetailList, setFilteredDetailList] = useState([]);
  const [whDocNo, setWhDocNo] = useState("");

  // จากคลัง
  const [fromWhId, setFromWhId] = useState("");
  const [fromWhName, setFromWhName] = useState("");

  // ไปคลัง
  const [toWhId, setToWhId] = useState("");
  const [toWhName, setToWhName] = useState("");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleChangeDate = (value, name) => {
    // ตรวจสอบว่า value เป็น moment object หรือไม่
    const newValue = value && value instanceof moment ? value.format('YYYY-MM-DD') : value;

    if (name === 'fromDate') {
      setFromDate(formatDateOnChange(newValue));
    } else {
      setToDate(formatDateOnChange(newValue));
    }
  };

  const onRowSelected = (fromData) => {
    const filteredDetail = dataDetailList.filter(data => Number(data.WHDoc_Id) === fromData.WHDoc_Id);

    if (filteredDetail && filteredDetail.length > 0) {
      setFilteredDetailList(filteredDetail);
    } else {
      setFilteredDetailList([]);
    }

    setWhDocNo(fromData.WHDoc_No);

    if (selectedItemType === 2) {
      setFromWhId(filteredDetail[0].F_WH_Id);
      setFromWhName(filteredDetail[0].F_WH_Name);
      setToWhId(filteredDetail[0].T_WH_Id);
      setToWhName(filteredDetail[0].T_WH_Name);
    }
  };

  // ทดสอบการทำค้นหาโดย SpriteZadis (ยังไม่สมบูรณ์ เดี๋ยวมาทำต่อ)
  const [searchItemTerm, setSearchItemTerm] = useState('');
  const [selectedItemType, setSelectedItemType] = useState(1);
  const filterDataByDate = (data) => {
    const from = fromDate ? moment(fromDate, 'YYYY-MM-DD') : null;
    const to = toDate ? moment(toDate, 'YYYY-MM-DD') : null;

    const docDate = moment(data.WHDoc_Date, 'YYYY-MM-DD HH:mm:ss.SSS');
    const isWithinRange = (!from || docDate.isSameOrAfter(from, 'day')) &&
      (!to || docDate.isSameOrBefore(to, 'day'));

    return isWithinRange;
  };
  const filteredItemData = dataMasterList.filter((data) => {
    // ตรวจสอบการค้นหาตามหมายเลขและชื่อประเภทเอกสาร
    const matchesItemSearchTerm =
      data.WHDoc_No.toLowerCase().includes(searchItemTerm.toLowerCase()) ||
      data.WHDocType_Name.toLowerCase().includes(searchItemTerm.toLowerCase());

    // ตรวจสอบการกรองตามประเภทเอกสาร
    const matchesItemType = selectedItemType ? data.WHDoc_Type === selectedItemType : true;

    // ตรวจสอบการกรองตามวันที่
    const matchesDateRange = filterDataByDate(data);

    return matchesItemSearchTerm && matchesItemType && matchesDateRange;
  });


  return <>
    <Breadcrumbs page={name} items={[
      { name: 'คลังสินค้า', url: '/Warehouse' },
      { name: name, url: '/treasury-documents' },
    ]} />
    <div className="container-fluid card py-3">
      <div className="row mb-2 align-items-center">
        <div className="col-3">
          <button
            className="btn text-white"
            onClick={onChangeMode("FA")}
            style={{
              backgroundColor: 'rgb(239, 108, 0)',
              whiteSpace: 'nowrap',
              padding: '10px',
              fontSize: '15px'
            }}
          >
            <i className="fa fa-plus" aria-hidden="true"></i> สร้างใบปรับปรุงสินค้า
          </button>
          <button
            className="btn text-white mx-3"
            onClick={onChangeMode("FT")}
            style={{
              backgroundColor: 'rgb(239, 108, 0)',
              whiteSpace: 'nowrap',
              padding: '10px',
              fontSize: '15px'
            }}
          >
            <i className="fa fa-plus" aria-hidden="true"></i> สร้างใบโอนย้าย
          </button>
        </div>
        <div className="col-2" style={{ marginLeft: '-5%' }}>
          <div className="input-group">
            <span className="input-group-text">Search</span>
            <input
              type="text"
              className="form-control"
              value={searchItemTerm}
              onChange={(e) => setSearchItemTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-2" >
          <div className="radio-inline">
            <input
              className="form-check-input"
              type="radio"
              name="paymentStatus"
              value="1"
              checked={selectedItemType === 1}
              onChange={(e) => setSelectedItemType(1)}
            />
            <label className="form-check-label">ใบปรับสินค้า</label>
            <input
              className="form-check-input"
              type="radio"
              name="paymentStatus"
              value="2"
              checked={selectedItemType === 2}
              onChange={(e) => setSelectedItemType(2)}
            />
            <label className="form-check-label">ใบโอนสินค้า</label>
          </div>
        </div>
        <div className="col-2">
          <div className="input-group" style={{ width: '110%' }}>
            <span className="input-group-text">จากวันที่</span>
            <Datetime
              name="fromDate"
              value={fromDate || null}
              onChange={(date) => handleChangeDate(date, 'fromDate')}
              dateFormat="DD-MM-YYYY"
              timeFormat={false}
              inputProps={{ readOnly: true, disabled: false }}
            />
          </div>
        </div>
        <div className="col-2">
          <div className="input-group">
            <span className="input-group-text">ถึง</span>
            <Datetime
              name="toDate"
              value={toDate || null}
              onChange={(date) => handleChangeDate(date, 'toDate')}
              dateFormat="DD-MM-YYYY"
              timeFormat={false}
              inputProps={{ readOnly: true, disabled: false }}
            />
          </div>
        </div>
        <div className="col-2" />
      </div>
      <hr />
      <div className="row ">
        <div className="col-2 mb-1" style={{ borderRight: '2px solid #c7c8c9' }}>
          <div className="table-responsive">
            <table id="basic-datatables" className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center" style={{ width: '50%' }}>เลขเอกสาร</th>
                  <th className="text-center" style={{ width: '50%' }}>ประเภท</th>
                </tr>
              </thead>
              <tbody>
                {filteredItemData.length > 0 ? (
                  filteredItemData.map((data, index) => (
                    <tr
                      key={data.WHDoc_Id || index + 1}
                      onClick={() => onRowSelected(data)}
                      style={{ cursor: 'pointer' }}>
                      <td className="text-center">{data.WHDoc_No}</td>
                      <td className="text-center">{data.WHDocType_Name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">
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
        <div className="col-10 mb-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="card-title mb-0">
              {filteredDetailList.length !== 0 && (
                <>
                  เอกสารเลขที่: {whDocNo}
                  {whDocNo.substring(0, 3) === 'TNS' && selectedItemType === 2 && (
                    <span> จากคลัง: {fromWhId} {fromWhName} ไปยังคลัง: {toWhId} {toWhName}</span>
                  )}
                </>
              )}
            </p>
            <button onClick={downloadReconciliationPDF}
              className="btn d-flex align-items-center text-white" style={{
                backgroundColor: 'rgb(239, 108, 0)',
                fontSize: '16px'
              }}>
              <i className="fa fa-print me-2" aria-hidden="true"></i>
              พิมพ์ใบปรับยอด
            </button>

          </div>
          <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table id="basic-datatables" className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center" style={{ width: '3%' }}>ลำดับ</th>
                  <th className="text-center" style={{ width: '9%' }}>Item_Code</th>
                  <th className="text-center" style={{ width: '22%' }}>Item_Name</th>
                  <th className="text-center" style={{ width: '5%' }}>จำนวน</th>
                  <th className="text-center" style={{ width: '5%' }}>หน่วย</th>
                  <th className="text-center" style={{ width: '7%' }}>ราคา/หน่วย</th>
                  <th className="text-center" style={{ width: '4%' }}>รวมเงิน</th>
                  <th className="text-center" style={{ width: '4%' }}>AI/AO</th>
                  <th className="text-center" style={{ width: '8%' }}>หมายเหตุ</th>
                  <th className="text-center" style={{ width: '7%' }}>จากคลัง</th>
                  <th className="text-center" style={{ width: '7%' }}>วันที่จัดส่ง</th>
                  <th className="text-center" style={{ width: '6%' }}>ไปยังคลัง</th>
                  <th className="text-center" style={{ width: '6%' }}>รหัสลูกค้า</th>
                  <th className="text-center" style={{ width: '7%' }}>ชื่อลูกค้า</th>
                </tr>
              </thead>
              <tbody>
                {filteredDetailList.length > 0 ? (
                  filteredDetailList.map((item, index) => (
                    <tr key={item.DT_Id || index + 1}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item.Item_Code}</td>
                      <td className="text-left">{item.Item_Name}</td>
                      <td className="text-center">{item.Item_Qty}</td>
                      <td className="text-center">{item.Item_Unit}</td>
                      <td className="text-center">{formatCurrency(item.Item_Price_Unit)}</td>
                      <td className="text-center">{formatCurrency(item.Item_Total)}</td>
                      <td className="text-center">{item.Doc_Type}</td>
                      <td className="text-center">{item.WHDoc_Remark}</td>
                      <td className="text-center">{item.F_WH_Name}</td>
                      <td className="text-center">{formatDate(item.WHDoc_TransDate)}</td>
                      <td className="text-center">{item.T_WH_Name}</td>
                      <td className="text-center">{item.WHDoc_Cust_Id}</td>
                      <td className="text-center"></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="14">
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
      </div>
    </div>
  </>;
};

export default Main;
