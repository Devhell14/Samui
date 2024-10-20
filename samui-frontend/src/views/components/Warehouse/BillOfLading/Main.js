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

const Main = ({ name, onChangeMode, dataMasterList, dataDetailList }) => {
  const [filteredDetailList, setFilteredDetailList] = useState([]);
  const [whDocNo, setWhDocNo] = useState("");

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
      { name: name, url: '/billof-lading' },
    ]} />
    <div className="container-fluid card py-3">
      <div className="row mb-2 align-items-center">
        <div className="col-3">
          <button
            className="btn text-white mx-3"
            onClick={onChangeMode("BL")}
            style={{
              backgroundColor: 'rgb(239, 108, 0)',
              whiteSpace: 'nowrap',
              padding: '10px',
              fontSize: '15px'
            }}
          >
            <i className="fa fa-plus" aria-hidden="true"></i> ใบเบิกสินค้า
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
                  เอกสารเลขที่: {whDocNo} จากคลัง: 001 คลัง xxx ไปยังคลัง: 001 คลัง xxx
                </>
              )}
            </p>
          </div>
          <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <table id="basic-datatables" className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th className="text-center" style={{ width: '3%' }}>ลำดับ</th>
                  <th className="text-center" style={{ width: '9%' }}>Item_Code</th>
                  <th className="text-center" style={{ width: '28%' }}>Item_Name</th>
                  <th className="text-center" style={{ width: '5%' }}>จำนวน</th>
                  <th className="text-center" style={{ width: '5%' }}>หน่วย</th>
                  <th className="text-center" style={{ width: '8%' }}>ราคา/หน่วย</th>
                  <th className="text-center" style={{ width: '5%' }}>รวมเงิน</th>
                  <th className="text-center" style={{ width: '5%' }}>AI/AO</th>
                  <th className="text-center" style={{ width: '9%' }}>หมายเหตุ</th>
                  <th className="text-center" style={{ width: '8%' }}>จากคลัง</th>
                  <th className="text-center" style={{ width: '8%' }}>วันที่จัดส่ง</th>
                  <th className="text-center" style={{ width: '7%' }}>ไปยังคลัง</th>
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
