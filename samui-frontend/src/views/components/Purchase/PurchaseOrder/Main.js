import React, { useState, useEffect } from 'react';

// Components
import Breadcrumbs from '../../Breadcrumbs';
import DataTable from '../../Content/DataTable';

// Date & Time
import Datetime from 'react-datetime';
import moment from 'moment';

// Utils
import { getAlert } from '../../../../utils/SamuiUtils';
import { formatStringDateToDate, formatThaiDateUi } from '../../../../utils/DateUtils';

// Components Date Filter
import DateFilterTable from '../../Content/DateFilterTable';

function Main({ masterList, detailList, statusColours, statusPaidColours, statusReceiveColours, name, onPageInsert, onRowSelected }) {
    const [dataMasterList, setDataMasterList] = useState([]);
    const [dataDetailList, setDataDetailList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(16);

    // StatusColours
    const [countWaitApprove, setCountWaitApprove] = useState(0);
    const [countInProgress, setCountInProgress] = useState(0);
    const [countCancel, setCountCancel] = useState(0);
    const [countNotApprove, setCountNotApprove] = useState(0);
    const [countClose, setCountClose] = useState(0);

    // StatusPaidColours
    const [countWaitPaid, setCountWaitPaid] = useState(0);
    const [countOverduePaid, setCountOverduePaid] = useState(0);
    const [countPaidInFull, setCountPaidInFull] = useState(0);

    // StatusReceiveColours
    const [countWaitProduct, setCountWaitProduct] = useState(0);
    const [countOverdueProduct, setCountOverdueProduct] = useState(0);
    const [countReceiveProduct, setCountReceiveProduct] = useState(0);

    // ใช้สำหรับค้นหาเอกสาร
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

    // Filter by date & Sort by field
    const [startDate, setStartDate] = useState(formatThaiDateUi(moment().startOf('month').toDate()));
    const [endDate, setEndDate] = useState(formatThaiDateUi(new Date()));
    const [sortOrder, setSortOrder] = useState('');
    const [sortField, setSortField] = useState('');
    const [selectedDateType, setSelectedDateType] = useState('1');

    useEffect(() => {
        initialize();
    }, [masterList, detailList]);

    useEffect(() => {
        filterItems();
    }, [searchTerm, dataMasterList]);


    useEffect(() => {
        setSortField('');
    }, [startDate, endDate]);

    const initialize = async () => {
        try {
            if (masterList && masterList.length > 0) {
                setDataMasterList(masterList);

                // นับข้อมูลสถานะ
                let statusCounts = {
                    'รออนุมัติ': 0,
                    'กำลังดำเนินการ': 0,
                    'ไม่อนุมัติ': 0,
                    'ปิดงาน': 0,
                    'ยกเลิก': 0
                };

                let statusPaidCounts = {
                    'รอจ่าย': 0,
                    'ค้างจ่าย': 0,
                    'จ่ายครบ': 0
                };

                let statusReceiveCounts = {
                    'รอรับสินค้า': 0,
                    'ค้างรับสินค้า': 0,
                    'รับสินค้าครบ': 0
                };

                masterList.forEach(data => {
                    if (data.DocStatus_Name) {
                        statusCounts[data.DocStatus_Name] = (statusCounts[data.DocStatus_Name] || 0) + 1;
                    }
                });

                masterList.forEach(data => {
                    if (data.Doc_Status_PaidName) {
                        statusPaidCounts[data.Doc_Status_PaidName] = (statusPaidCounts[data.Doc_Status_PaidName] || 0) + 1;
                    }
                });

                masterList.forEach(data => {
                    if (data.Doc_Status_ReceiveName) {
                        statusReceiveCounts[data.Doc_Status_ReceiveName] = (statusReceiveCounts[data.Doc_Status_ReceiveName] || 0) + 1;
                    }
                });

                setCountWaitApprove(statusCounts['รออนุมัติ']);
                setCountInProgress(statusCounts['กำลังดำเนินการ']);
                setCountNotApprove(statusCounts['ไม่อนุมัติ']);
                setCountClose(statusCounts['ปิดงาน']);
                setCountCancel(statusCounts['ยกเลิก']);

                setCountWaitPaid(statusPaidCounts['รอจ่าย']);
                setCountOverduePaid(statusPaidCounts['ค้างจ่าย']);
                setCountPaidInFull(statusPaidCounts['จ่ายครบ']);

                setCountWaitProduct(statusReceiveCounts['รอรับสินค้า']);
                setCountOverdueProduct(statusReceiveCounts['ค้างรับสินค้า']);
                setCountReceiveProduct(statusReceiveCounts['รับสินค้าครบ']);

                setCurrentPage(1); // รีเซ็ตหน้าเมื่อมีข้อมูลใหม่
            }

            if (detailList && detailList.length > 0) {
                setDataDetailList(detailList);
            }
        } catch (error) {
            getAlert('FAILED', error.message);
        }
    };

    const filterItems = () => {
        if (searchTerm === '') {
            setFilteredItems(dataMasterList);
        } else {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = dataMasterList.filter(item =>
                Object.values(item).some(value =>
                    typeof value === 'string' &&
                    value.toLowerCase().includes(lowercasedSearchTerm)
                )
            );
            setFilteredItems(filtered);
        }
    };

    // filter วันที่
    const filterItemsByDate = async (type) => {
        let filteredByDate = dataMasterList;

        if (startDate && endDate) {
            const startDefault = formatStringDateToDate(startDate);
            const endDefault = formatStringDateToDate(endDate);
            const start = moment(startDefault).format("YYYY-MM-DD");
            const end = moment(endDefault).format("YYYY-MM-DD");

            filteredByDate = dataMasterList.filter(item => {
                const itemDate = type === 'documentDate'
                    ? moment(item.Doc_Date, "YYYY-MM-DD")
                    : type === 'dueDate'
                        ? moment(item.Doc_DueDate, "YYYY-MM-DD")
                        : null;
                if (!itemDate) return false;

                const isBetween = itemDate.isBetween(start, end, null, '[]');
                return isBetween;
            });
        }

        setFilteredItems(filteredByDate);
    };
    //ค้นหาวันที่และเลขเอกสาร
    const handleSearch = () => {
        const type = selectedDateType === '1' ? 'documentDate' : 'dueDate';
        filterItemsByDate(type);
    };
    // Clear search and date filters
    const handleClear = () => {
        setSearchTerm('');
        setStartDate(formatThaiDateUi(moment().startOf('month').toDate()));
        setEndDate(formatThaiDateUi(new Date()));
        setSelectedDateType('1');
        setFilteredItems(dataMasterList);
        setSortField('')
        setSortOrder('desc ')
    };
    // Sort เรียงลำดับ asc to desc
    const handleSort = () => {
        if (!sortField) return;
        // การเรียงจะขึ้นอยู่กับค่าของ newSortOrder
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);

        const sortedItems = [...filteredItems].sort((a, b) => {
            // ถ้า newSortOrder เป็น 'asc' จะเรียงจากน้อยไปมาก
            if (newSortOrder === 'asc') {
                return a[sortField].localeCompare(b[sortField]);
            } else {
                // ถ้าเป็น 'desc' จะเรียงจากมากไปน้อย
                return b[sortField].localeCompare(a[sortField]);
            }
        });
        setFilteredItems(sortedItems);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // สามารถใช้กรองคำที่จะไม่ใช้ใน Counter Box ได้
    const filteredStatusColours = statusColours.filter(statusObj =>
        !['รออนุมัติ', 'ไม่อนุมัติ'].includes(statusObj.DocSetStaus_Name)
    );

    return (
        <>
            <div className="page-header d-flex justify-content-between align-items-center mb-0">
                <Breadcrumbs page={name} items={[
                    { name: 'จัดซื้อสินค้า', url: '/purchase' },
                    { name: name, url: '/purchase-order' },
                ]} />
            </div>
            {/* Date filter & Sort Asc to Desc */}
            <div className='p-3 rounded-3 my-2 shadow-lg' style={{ backgroundColor: '#ffff', marginLeft: '10rem' }}>
                <div className='row  mb-2'>
                    <div className="col-3 d-flex">
                        <div className="navbar-form nav-search">
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="ค้นหาเอกสาร..."
                                    className="form-control"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="input-group-text">
                                    <i className="fas fa-search"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='col-7 d-flex' style={{ marginLeft: '-135px' }}>
                        <DateFilterTable
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            selectedDateType={selectedDateType}
                            setSelectedDateType={setSelectedDateType}
                            handleSearch={handleSearch}
                        />
                    </div>
                    <div className="col-2 d-flex justify-content-end" style={{ marginLeft: '135px' }}>
                        <button
                            onClick={onPageInsert}
                            className="btn btn-warning text-white ms-2"
                            type="button"
                        >
                            สร้าง{name} <i className="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div className='p-1 px-3 rounded-3 shadow-sm' style={{ backgroundColor: '#f5f7fd' }}>
                    <div className='row'>
                        <small className='d-block p-1 fw-bold' style={{
                            borderLeft: '5px solid #EF6C00',
                            borderRadius: '3px',
                        }}>
                            เรียงลำดับตาม
                        </small>

                        <div className="col-1 d-flex">
                            <div className="radio-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    checked={sortField === 'Doc_No'}
                                    onChange={() => setSortField('Doc_No')}
                                />
                                <label className="text-black">เลขที่เอกสาร</label>
                            </div>
                        </div>
                        <div className="col-1 d-flex">
                            <div className="radio-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    checked={sortField === 'Doc_Date'}
                                    onChange={() => setSortField('Doc_Date')}
                                />
                                <label className="text-black">วันที่เอกสาร</label>
                            </div>
                        </div>
                        <div className="col-1 d-flex">
                            <div className="radio-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    checked={sortField === 'Doc_DueDate'}
                                    onChange={() => setSortField('Doc_DueDate')}
                                />
                                <label className="text-black">Due Date</label>
                            </div>
                        </div>
                        <div className="col-1 d-flex">
                            <button
                                className="btn btn-outline-secondary"
                                onClick={handleSort}
                                style={{ cursor: 'pointer', color: 'black', backgroundColor: 'transparent' }}
                            >
                                <i className={`fas fa-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}></i> Sort
                            </button>
                        </div>
                        <div className='col-8 d-flex justify-content-end'>
                            <button
                                onClick={handleClear}
                                className="btn btn-danger text-white"
                                type="button"
                                style={{ padding: ' 0.9rem' }}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-1">
                    <center>
                        <b>สถานะเอกสาร</b>
                    </center>
                    <br />
                    {filteredStatusColours.map((statusObj, index) => {
                        const { DocSetStaus_Name, DocSetColour } = statusObj;
                        let count;

                        switch (DocSetStaus_Name) {
                            case 'รออนุมัติ':
                                count = countWaitApprove;
                                break;
                            case 'กำลังดำเนินการ':
                                count = countInProgress;
                                break;
                            case 'ไม่อนุมัติ':
                                count = countNotApprove;
                                break;
                            case 'ปิดงาน':
                                count = countClose;
                                break;
                            case 'ยกเลิก':
                                count = countCancel;
                                break;
                            default:
                                count = 0;
                        }

                        return (
                            <div key={index} className="col-12 mb-3">
                                <div className="card text-center" style={{ backgroundColor: DocSetColour }}>
                                    <div className="card-body d-flex flex-column align-items-center text-white">
                                        <div className="row">
                                            <div className="col-12">
                                                <b style={{ fontSize: '20px', textAlign: 'center' }}>{count}</b>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <b style={{ fontSize: '16px', textAlign: 'center' }}>{DocSetStaus_Name}</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <br />
                    <center>
                        <b>สถานะรอจ่าย</b>
                    </center>
                    <br />
                    {statusPaidColours.map((statusObj, index) => {
                        const { DocSetStaus_Name, DocSetColour } = statusObj;
                        let count;

                        switch (DocSetStaus_Name) {
                            case 'รอจ่าย':
                                count = countWaitPaid;
                                break;
                            case 'ค้างจ่าย':
                                count = countOverduePaid;
                                break;
                            case 'จ่ายครบ':
                                count = countPaidInFull;
                                break;
                            default:
                                count = 0;
                        }

                        return (
                            <div key={index} className="col-12 mb-3">
                                <div className="card text-center" style={{ backgroundColor: DocSetColour }}>
                                    <div className="card-body d-flex flex-column align-items-center text-white">
                                        <div className="row">
                                            <div className="col-12">
                                                <b style={{ fontSize: '20px', textAlign: 'center' }}>{count}</b>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <b style={{ fontSize: '16px', textAlign: 'center' }}>{DocSetStaus_Name}</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <br />
                    <center>
                        <b>สถานะรับสินค้า</b>
                    </center>
                    <br />
                    {statusReceiveColours.map((statusObj, index) => {
                        const { DocSetStaus_Name, DocSetColour } = statusObj;
                        let count;

                        switch (DocSetStaus_Name) {
                            case 'รอรับสินค้า':
                                count = countWaitProduct;
                                break;
                            case 'ค้างรับสินค้า':
                                count = countOverdueProduct;
                                break;
                            case 'รับสินค้าครบ':
                                count = countReceiveProduct;
                                break;
                            default:
                                count = 0;
                        }

                        return (
                            <div key={index} className="col-12 mb-3">
                                <div className="card text-center" style={{ backgroundColor: DocSetColour }}>
                                    <div className="card-body d-flex flex-column align-items-center text-white">
                                        <div className="row">
                                            <div className="col-12">
                                                <b style={{ fontSize: '20px', textAlign: 'center' }}>{count}</b>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <b style={{ fontSize: '16px', textAlign: 'center' }}>{DocSetStaus_Name}</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <DataTable
                    currentItems={currentItems}
                    onRowSelected={onRowSelected}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    dataMasterList={filteredItems}
                    itemsPerPage={itemsPerPage}
                    fieldMappings={{
                        no: 'Doc_No',
                        typeName: 'DocType_Name',
                        statusName: 'DocStatus_Name',
                        statusColor: 'DocStatus_Colour',
                        statusReceiveName: 'Doc_Status_ReceiveName',
                        statusReceiveColor: 'Doc_Status_ReceiveColour',
                        date: 'Doc_Date',
                        apCode: 'AP_Code',
                        apName: 'AP_Name',
                        dueDate: 'Doc_DueDate',
                        netTotal: 'NetTotal',
                        createdBy: 'Created_By_Name',
                        updatedBy: 'Update_By_Name'
                    }}
                />
            </div>
        </>
    );
}

export default Main;