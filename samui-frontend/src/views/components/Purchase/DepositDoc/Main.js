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

function Main({ masterList, statusColours, name, onPageInsert, onRowSelected }) {
    const [dataMasterList, setDataMasterList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(16);
    const [countWaitConfirm, setCountWaitConfirm] = useState(0);
    const [countConfirm, setCountConfirm] = useState(0);
    const [countDeposit, setCountDeposit] = useState(0);
    const [countCancel, setCountCancel] = useState(0);

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
    }, [masterList]);

    useEffect(() => {
        filterItems();
    }, [searchTerm, dataMasterList]);

    useEffect(() => {
        setSortField('');
    }, [startDate, endDate])

    const initialize = async () => {
        try {
            if (masterList && masterList.length > 0) {
                setDataMasterList(masterList);

                // นับข้อมูลสถานะ
                let statusCounts = {
                    'รอยืนยัน': 0,
                    'ลค ยืนยันแล้ว': 0,
                    'จ่ายมัดจำแล้ว': 0,
                    'ยกเลิก': 0
                };

                masterList.forEach(data => {
                    if (data.DocStatus_Name) {
                        statusCounts[data.DocStatus_Name] = (statusCounts[data.DocStatus_Name] || 0) + 1;
                    }
                });

                setCountWaitConfirm(statusCounts['รอยืนยัน']);
                setCountConfirm(statusCounts['ลค ยืนยันแล้ว']);
                setCountDeposit(statusCounts['จ่ายมัดจำแล้ว']);
                setCountCancel(statusCounts['ยกเลิก']);
                setCurrentPage(1); // รีเซ็ตหน้าเมื่อมีข้อมูลใหม่
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

    return (
        <>
            <div className="page-header d-flex justify-content-between align-items-center mb-0">
                <Breadcrumbs page={name} items={[
                    { name: 'จัดซื้อสินค้า', url: '/purchase' },
                    { name: name, url: '/deposit-document' },
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

                        <div className="col-1 d-flex justify-content-between">
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
                        <div className="col-1 d-flex justify-content-between">
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
                        <div className="col-1 d-flex justify-content-between">
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
                        <div className="col-1 d-flex justify-content-between">
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
                    {statusColours.map((statusObj, index) => {
                        const { DocSetStaus_Name, DocSetColour } = statusObj;
                        let count;

                        switch (DocSetStaus_Name) {
                            case 'รอยืนยัน':
                                count = countWaitConfirm;
                                break;
                            case 'ลค ยืนยันแล้ว':
                                count = countConfirm;
                                break;
                            case 'จ่ายมัดจำแล้ว':
                                count = countDeposit;
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
                        statusColor: 'docsetcolour',
                        date: 'Doc_Date',
                        apCode: 'AR_Code',
                        apName: 'AR_Name',
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