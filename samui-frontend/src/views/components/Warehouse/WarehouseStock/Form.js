import React, { useState, useEffect } from 'react';
import './../../../../assets/css/purchase/form.css';

// Components
import Breadcrumbs from '../../Breadcrumbs';
import AdjustWhModal from '../../Modal/AdjustWhModal'

// Utils
import {
    getDataWithComp,
    getAlert
} from '../../../../utils/SamuiUtils';

import {
    formatDate,
    setCreateDateTime,
} from '../../../../utils/DateUtils';

// ทดสอบการใช้ Plugin Download PDF
import {
    downloadProductBalancePDF,
    downloadWarehouseProductsPDF
} from '../../../../utils/ExportUtils';

function Form({ name }) {
    const [activeTab, setActiveTab] = useState(2);
    const [formItemList, setFormItemList] = useState([]);
    const [formItemOnHand, setFormItemOnHand] = useState([]);
    const [formItemHistory, setFormItemHistory] = useState([]);
    const [formItemOnHandCaseTab, setFormItemOnHandCaseTab] = useState([]);
    const [whDataList, setWhDataList] = useState([]);

    // ข้อมูลตั้งต้น
    const [itemId, setItemId] = useState([]);
    const [warehouseId, setWarehouseId] = useState(1);

    // Modal
    const [showWhModal, setShowWhModal] = useState(false);
    const handleWhShow = () => setShowWhModal(true);
    const handleWhClose = async () => {
        setShowWhModal(false);
        await initialize();
        await onRowSelectOnHand(itemId, warehouseId);
    };

    useEffect(() => {
        initialize();
    }, []);

    const initialize = async () => {
        try {
            // ค้นหาข้อมูลตั้งต้นจาก API_0002_Set_Item
            const itemList = await getDataWithComp('API_0002_Set_Item', `AND Reft_ItemOnhand > 0 AND Item_Status = 'Y'  ORDER BY Item_Code ASC`);
            if (itemList && itemList.length > 0) {
                setFormItemList(itemList);
            }

            // ค้นหาข้อมูลตั้งต้นจาก Tb_Set_WH
            const whDataList = await getDataWithComp('Tb_Set_WH', 'ORDER BY WH_Code ASC');
            if (whDataList && whDataList.length > 0) {
                setWhDataList(whDataList);
            }
        } catch (error) {
            getAlert('FAILED', error.message);
        }
    };

    // SET ITEM_ONHAND
    const onRowSelectOnHand = async (itemId, whId) => {
        try {
            // เรียก initialize อีกครั้ง เพื่อที่จะกระตุกตัวมันเองด้วย ตอนที่กด onRow
            await initialize();

            setItemId(itemId);
            setFormItemOnHand([]);

            // ค้นหาที่ View : API_1101_WH_ITEM_ONHAND Where Item_Id = ตามตารางซ้าย AND Comp_Id = ล็อกอิน Order By WHName
            const itemOnHand = await getDataWithComp('API_1101_WH_ITEM_ONHAND', `AND Item_Id = ${itemId} ORDER BY WH_Name ASC`);

            if (itemOnHand && itemOnHand.length > 0) {
                setFormItemOnHand(itemOnHand); // ลบค่าทั้งหมดที่มีอยู่ก่อน
            }
        } catch (error) {
            getAlert('FAILED', error.message);
        } finally {
            await onRowSelectHistory(itemId, whId);
            await onRowSelectOnHandCaseTab(whId);
        }
    };

    // API_1201_WH_ITEM_STC (ประวัติคลังสินค้า)
    const onRowSelectHistory = async (itemId, whId) => {
        try {
            setFormItemHistory([]);

            const itemHistory = await getDataWithComp('API_1201_WH_ITEM_STC', `AND Item_Id = ${itemId} AND WH_Id = ${whId} ORDER BY STC_SEQ DESC`);

            if (itemHistory && itemHistory.length > 0) {
                setFormItemHistory(itemHistory);
            }
        } catch (error) {
            getAlert('FAILED', error.message);
            setFormItemHistory([]);
        }
    };

    // API_1101_WH_ITEM_ONHAND (สินค้าคงคลัง)
    const onRowSelectOnHandCaseTab = async (whId) => {
        try {
            setFormItemOnHandCaseTab([]);

            const itemOnHandCaseTab = await getDataWithComp('API_1101_WH_ITEM_ONHAND', `AND WH_Id = ${whId} ORDER BY Item_Code ASC`);

            if (itemOnHandCaseTab && itemOnHandCaseTab.length > 0) {
                setFormItemOnHandCaseTab(itemOnHandCaseTab);
            }
        } catch (error) {
            getAlert('FAILED', error.message);
            setFormItemOnHandCaseTab([]);
        }
    };

    // ตอนเลือกคลัง
    const onChangeWarehouse = async (id) => {
        try {
            setWarehouseId(id);
            onRowSelectOnHand(itemId, id);
        } catch (error) {
            getAlert('FAILED', error.message);
        }
    };

    // ใช้สำหรับค้นหาที่ formItemList (พี่แบงค์แจ้งมาให้ Fetch Realtime)
    const [searchItemTerm, setSearchItemTerm] = useState('');
    const [filterOption, setFilterOption] = useState('0');

    const handleItemSearch = async () => {
        let query = `AND Item_Status = 'Y' `;

        if (searchItemTerm) {
            query += `AND (Item_Code LIKE '%${searchItemTerm}%' OR Item_Name LIKE '%${searchItemTerm}%') `;
        }

        switch (filterOption) {
            case '0':
                query += `AND Reft_ItemOnhand > 0 `;
                break;
            case '1':
                query += `AND Reft_ItemOnhand >= 0 `;
                break;
            case '2':
                query += `AND Reft_ItemOnhand = 0 `;
                break;
            case '3':
                break;
            default:
                break;
        }

        query += `ORDER BY Item_Code ASC`;

        const itemList = await getDataWithComp('API_0002_Set_Item', query);
        if (itemList && itemList.length > 0) {
            setFormItemList(itemList);
        } else {
            setFormItemList([]);
        }
    };

    // ใช้สำหรับค้นหาที่ formItemHistory (พี่แบงค์แจ้งมาให้ Fetch Realtime)
    // const [searchHistoryTerm, setSearchHistoryTerm] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const handleHistorySearch = async () => {
        let query = `AND Item_Id = ${itemId} AND WH_Id = ${warehouseId} `;

        // if (searchHistoryTerm) {
        //     query += `AND (Item_Code LIKE '%${searchHistoryTerm}%' OR Item_Name LIKE '%${searchHistoryTerm}%') `;
        // }

        let yearInAD = '';
        if (year) {
            yearInAD = (parseInt(year) - 543).toString();
        }

        if (yearInAD) {
            query += `AND YEAR(STC_Date) = ${yearInAD} `;
        }

        if (month) {
            query += `AND MONTH(STC_Date) = ${parseInt(month)} `;
        }

        query += `ORDER BY STC_SEQ DESC`;

        const itemHistory = await getDataWithComp('API_1201_WH_ITEM_STC', query);

        if (itemHistory && itemHistory.length > 0) {
            setFormItemHistory(itemHistory);
        } else {
            setFormItemHistory([]);
        }
    };

    // ใช้สำหรับค้นหาที่ API_1101_WH_ITEM_ONHAND (สินค้าคงคลัง)
    const [searchTermOnHandCaseTab, setSearchTermOnHandCaseTab] = useState('');
    const handleSearchOnHandCaseTab = async () => {
        let query = `AND WH_Id = ${warehouseId} `;

        if (searchTermOnHandCaseTab) {
            query += `AND (Item_Code LIKE '%${searchTermOnHandCaseTab}%' OR Item_Name LIKE '%${searchTermOnHandCaseTab}%') `;
        }

        query += `ORDER BY Item_Code ASC`;

        try {
            const itemOnHandCaseTab = await getDataWithComp('API_1101_WH_ITEM_ONHAND', query);

            if (itemOnHandCaseTab && itemOnHandCaseTab.length > 0) {
                setFormItemOnHandCaseTab(itemOnHandCaseTab);
            } else {
                setFormItemOnHandCaseTab([]);
            }
        } catch (error) {
            getAlert('FAILED', error.message);
        }
    };

    return (
        <>
            <Breadcrumbs page={'คลังสินค้า'} items={[
                { name: 'คลังสินค้า', url: '/Warehouse' },
                { name: name, url: '/warehouse-stock' },
                { name: "สร้าง" + name, url: '#' },
            ]} />
            <div className='container-fluid my-2'>
                <div className="row">
                    <div className="col-4">
                        <div className="d-flex align-items-center">
                            <h5 className="text-nowrap card-title mb-0 me-3">ค้นหาสินค้า</h5>
                            <input
                                type="text"
                                className="form-control"
                                value={searchItemTerm}
                                onChange={(e) => setSearchItemTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='col-6'>
                        <div className='d-flex'>
                            <select
                                className="form-select"
                                style={{ maxWidth: '190px' }}
                                value={filterOption}
                                onChange={(e) => setFilterOption(e.target.value)}
                            >
                                <option value="0">แสดงยอดคงเหลือ &#62; 0</option>
                                <option value="1">แสดงยอดคงเหลือ &#62; = 0</option>
                                <option value="2">แสดงยอดคงเหลือ = 0</option>
                                <option value="3">แสดงทุกรายการ</option>
                            </select>
                            <i
                                className="fa fa-search fs-4 mx-4"
                                style={{ cursor: 'pointer' }}
                                aria-hidden="true"
                                onClick={handleItemSearch}
                            />
                            <button className="btn text-white mx-1" style={{ backgroundColor: 'rgb(239, 108, 0)' }} onClick={downloadProductBalancePDF}>
                                <i className="fa fa-file-excel me-1" aria-hidden="true"></i> Export สินค้ายอดคงเหลือ
                            </button>
                            <button className="btn text-white mx-3" style={{ backgroundColor: 'rgb(239, 108, 0)' }} onClick={downloadWarehouseProductsPDF}>
                                <i className="fa fa-warehouse me-1" aria-hidden="true"></i> Export สินค้าแยกตามคลัง
                            </button>
                        </div>
                    </div>
                    <div className='col-2' />
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-6">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                    <table id="basic-datatables" className="table table-striped table-hover">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th className="text-center" style={{ width: '1%' }}>#</th>
                                                <th className="text-center" style={{ width: '17%' }}>รหัสสินค้า</th>
                                                <th className="text-center" style={{ width: '42%' }}>ชื่อสินค้า</th>
                                                <th className="text-center" style={{ width: '10%' }}>หน่วย</th>
                                                <th className="text-center" style={{ width: '10%' }}>คงเหลือ</th>
                                                <th className="text-center" style={{ width: '10%' }}>จุดสั่งซื้อ</th>
                                                <th className="text-center" style={{ width: '10%' }}>จุดสูงสุด</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formItemList.length > 0 ? (
                                                formItemList.map((item, index) => (
                                                    <tr
                                                        key={item.Item_Id}
                                                        onClick={() => onRowSelectOnHand(item.Item_Id, warehouseId)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <td className="text-center">{index + 1}</td>
                                                        <td className="text-left">{item.Item_Code}</td>
                                                        <td className="text-left">{item.Item_Name}</td>
                                                        <td className="text-center">{item.Item_Unit_ST}</td>
                                                        <td className="text-center">{item.Reft_ItemOnhand}</td>
                                                        <td className="text-center">{item.Item_PoPoint}</td>
                                                        <td className="text-center">{item.Item_MaxOnhand}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={8}>
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
                </div>
                <div className="col-6">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table id="basic-datatables" className="table table-striped table-hover">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th className="text-center" style={{ width: '17%' }}>รหัสสินค้า</th>
                                                <th className="text-center" style={{ width: '47%' }}>ชื่อสินค้า</th>
                                                <th className="text-center" style={{ width: '10%' }}>คงเหลือ</th>
                                                <th className="text-center" style={{ width: '23%' }}>คลังสินค้า</th>
                                                <th className="text-center" style={{ width: '3%' }}>Last_Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formItemOnHand.length > 0 ? (
                                                formItemOnHand.map((item, index) => (
                                                    <tr key={item.Item_Id || index + 1}>
                                                        <td className="text-center">{item.Item_Code}</td>
                                                        <td className="text-left">{item.Item_Name}</td>
                                                        <td className="text-center">{item.Item_Onhand}</td>
                                                        <td className="text-left">{item.WH_Name}</td>
                                                        <td className="text-center">{item.Last_STC_Date ? formatDate(item.Last_STC_Date) : ''}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6}>
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
                </div>
            </div>
            <hr />
            <div className="row mt-2">
                <div className="col-12">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <button style={{ cursor: 'pointer', color: '#EF6C00' }}
                                            className={`nav-link ${activeTab === 1 ? "active" : ""}`}
                                            onClick={() => setActiveTab(1)}>
                                            สินค้าคงคลัง
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button style={{ cursor: 'pointer', color: '#EF6C00' }}
                                            className={`nav-link ${activeTab === 2 ? "active" : ""}`}
                                            onClick={() => setActiveTab(2)}>
                                            ประวัติสินค้า
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="tab-content mt-3">
                                <div
                                    className={`tab-pane fade ${activeTab === 1 ? "show active" : ""}`}
                                    role="tabpanel">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header d-flex justify-content-between align-items-center">
                                                <div className="col-4 d-flex">
                                                    <h4 className="card-title mb-0 me-2">เลือกคลัง</h4>
                                                    <select
                                                        style={{ width: '200px' }}
                                                        className="form-select"
                                                        value={warehouseId}
                                                        onChange={(e) => onChangeWarehouse(e.target.value)}
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
                                                <div className="col-4 d-flex">
                                                </div>
                                                <div className="col-4 d-flex">
                                                    <h4 className="card-title mb-0 me-2">ค้นหา</h4>
                                                    <div className="input-group w-75">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={searchTermOnHandCaseTab}
                                                            onChange={(e) => setSearchTermOnHandCaseTab(e.target.value)}
                                                        />
                                                        <button className="btn btn-outline-secondary" onClick={handleSearchOnHandCaseTab}>
                                                            <i className="fas fa-search" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card-body">
                                                <div className="table-responsive">
                                                    <table id="basic-datatables" className="table table-striped table-hover">
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th className="text-center" style={{ width: '10%' }}>รหัสสินค้า</th>
                                                                <th className="text-center" style={{ width: '60%' }}>ชื่อสินค้า</th>
                                                                <th className="text-center" style={{ width: '6%' }}>คงเหลือ</th>
                                                                <th className="text-center" style={{ width: '12%' }}>คลังสินค้า</th>
                                                                <th className="text-center" style={{ width: '12%' }}>วันที่ทำรายการล่าสุด</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {formItemOnHandCaseTab.length > 0 ? (
                                                                formItemOnHandCaseTab.map((item, index) => (
                                                                    <tr key={item.Item_Id || index + 1}>
                                                                        <td className="text-center">{item.Item_Code}</td>
                                                                        <td className="text-left">{item.Item_Name}</td>
                                                                        <td className="text-center">{item.Item_Onhand}</td>
                                                                        <td className="text-center">{item.WH_Name}</td>
                                                                        <td className="text-center">{item.Last_STC_Date ? formatDate(item.Last_STC_Date) : ''}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={10}>
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
                                </div>
                                <div
                                    className={`tab-pane fade ${activeTab === 2 ? "show active" : ""}`}
                                    role="tabpanel">
                                    <div className="col-12">
                                        <div className="card">
                                            <div className="card-header">
                                                <div className="container-fluid">
                                                    <div className="d-flex flex-row">
                                                        <div className="col-3">
                                                            <div className="d-flex">
                                                                <h4 className="card-title mb-0 me-2">เลือกคลัง</h4>
                                                                <select
                                                                    style={{ width: '200px' }}
                                                                    className="form-select"
                                                                    value={warehouseId}
                                                                    onChange={(e) => onChangeWarehouse(e.target.value)}
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
                                                        <div className='col-3'>
                                                            <div className='d-flex'>
                                                                <label className='fw-bold'>ปี : </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control mx-1"
                                                                    value={year}
                                                                    onChange={(e) => setYear(e.target.value)}
                                                                />
                                                                <select
                                                                    className="form-select"
                                                                    value={month}
                                                                    onChange={(e) => setMonth(e.target.value)}
                                                                >
                                                                    <option value="">กรุณาระบุเดือน</option>
                                                                    <option value="01">มกราคม</option>
                                                                    <option value="02">กุมภาพันธ์ </option>
                                                                    <option value="03">มีนาคม</option>
                                                                    <option value="04">เมษายน</option>
                                                                    <option value="05">พฤษภาคม</option>
                                                                    <option value="06">มิถุนายน</option>
                                                                    <option value="07">กรกฎาคม</option>
                                                                    <option value="08">สิงหาคม</option>
                                                                    <option value="09">กันยายน</option>
                                                                    <option value="10">ตุลาคม</option>
                                                                    <option value="11">พฤศจิกายน</option>
                                                                    <option value="12">ธันวาคม</option>
                                                                </select>
                                                                <button className="btn btn-outline-secondary" onClick={handleHistorySearch}>
                                                                    <i className="fas fa-search"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 mx-5">
                                                            {/* <div className='d-flex'>
                                                                <h4 className="card-title mb-0 me-2">ค้นหา</h4>
                                                                <div className="input-group w-50">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={searchHistoryTerm}
                                                                        onChange={(e) => setSearchHistoryTerm(e.target.value)}
                                                                    />
                                                                    <button className="btn btn-outline-secondary" onClick={handleHistorySearch}>
                                                                        <i className="fas fa-search"></i>
                                                                    </button>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                        <div className="col-2 mx-2">
                                                            <div className='d-flex'>
                                                                <button className="btn text-white btn-lg" onClick={handleWhShow} style={{
                                                                    backgroundColor: 'rgb(239, 108, 0)',
                                                                }}>
                                                                    <i className="fa fa-edit me-1" aria-hidden="true"></i> ปรับปรุงคลัง
                                                                </button>
                                                                <AdjustWhModal
                                                                    whDataList={whDataList}
                                                                    showWhModal={showWhModal}
                                                                    handleWhClose={handleWhClose}
                                                                    itemDetailModal={formItemHistory[0]}
                                                                    warehouseId={warehouseId}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="table-responsive">
                                                    <table id="basic-datatables" className="table table-striped table-hover">
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th className="text-center" style={{ width: '1%' }}>#</th>
                                                                <th className="text-center" style={{ width: '8%' }}>รหัสสินค้า</th>
                                                                <th className="text-center" style={{ width: '31%' }}>ชื่อสินค้า</th>
                                                                <th className="text-center" style={{ width: '8%' }}>Doc_Type</th>
                                                                <th className="text-center" style={{ width: '7%' }}>จำนวน</th>
                                                                <th className="text-center" style={{ width: '7%' }}>จำนวนคงเหลือ</th>
                                                                <th className="text-center" style={{ width: '10%' }}>วันที่ทำรายการ</th>
                                                                <th className="text-center" style={{ width: '12%' }}>WH</th>
                                                                <th className="text-center" style={{ width: '8%' }}>Doc_No</th>
                                                                <th className="text-center" style={{ width: '8%' }}>Doc_NoRef</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {formItemHistory.length > 0 ? (
                                                                formItemHistory.map((item, index) => (
                                                                    <tr key={item.STC_Id}>
                                                                        <td className="text-center">{index + 1}</td>
                                                                        <td className="text-center">{item.Item_Code}</td>
                                                                        <td className="text-left">{item.Item_Name}</td>
                                                                        <td className="text-center">{item.Doc_Type}</td>
                                                                        <td className="text-center">
                                                                            {
                                                                                item.Doc_Type === 'TO'
                                                                                    || item.Doc_Type === 'AO'
                                                                                    || item.Doc_Type === 'OUT' ? '-' : ''
                                                                            }
                                                                            {item.STC_QTY}
                                                                        </td>
                                                                        <td className="text-center">{item.STC_Balance}</td>
                                                                        <td className="text-center">{setCreateDateTime(item.STC_Date)}</td>
                                                                        <td className="text-center">{item.WH_Name}</td>
                                                                        <td className="text-center">{item.Doc_No}</td>
                                                                        <td className="text-center">{item.Doc_NoRef}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={12}>
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
                                </div>
                            </div>
                        </div >
                    </div>
                </div>
            </div>
        </>
    );
}

export default Form;
