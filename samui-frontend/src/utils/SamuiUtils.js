import Axios from "axios";
import Swal from "sweetalert2";
import { getCurrentYearMonth } from "./DateUtils"

// ดึงข้อมูลจาก Table ใดๆ ก็ได้
const getData = async (table, where) => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/get-data`, {
            table: table,
            where: where
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

// ดึงข้อมูลจาก Table ใดๆ ก็ได้ แต่ต้องเป็น Comp_Id ตามล็อกอิน
const getDataWithComp = async (table, order) => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/get-data-with-comp`, {
            table: table,
            order: order,
            comp_id: window.localStorage.getItem('company')
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

// ดึงข้อมูลจาก Table ใดๆ ก็ได้ โดยใช้ DocId
const getByDocId = async (table, docId, andOrder) => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/get-by-doc-id`, {
            table: table,
            doc_id: docId,
            and_order: andOrder
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

// ดึงข้อมูลจาก Table ใดๆ ก็ได้ โดยใช้ RecId
const getByRecId = async (table, recId, andOrder) => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/get-by-rec-id`, {
            table: table,
            rec_id: recId,
            and_order: andOrder
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

// ดึงข้อมูลจาก Table ใดๆ ก็ได้ โดยใช้ PayId
const getByPayId = async (table, payId, andOrder) => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/get-by-pay-id`, {
            table: table,
            pay_id: payId,
            and_order: andOrder
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

// ดึงข้อมูลจาก Tb_Set_Company
const getCompany = async () => {
    try {
        const response = await Axios.get(`${process.env.REACT_APP_API_URL}/api/get-company`, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// ดึงข้อมูลจาก Tb_Set_DocType
const getDocType = async () => {
    try {
        const response = await Axios.get(`${process.env.REACT_APP_API_URL}/api/get-doc-type`, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// ดึงข้อมูลจาก Tb_Set_TransType
const getTransType = async () => {
    try {
        const response = await Axios.get(`${process.env.REACT_APP_API_URL}/api/get-trans-type`, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// ดึงข้อมูลจาก Tb_Set_DocStatusColour
const getDocStatusColour = async (docCode, docField) => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/get-doc-status-colour`, {
            doc_code: docCode,
            doc_field: docField
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// ดึงข้อมูลจาก View_Set_Pr
const getViewPrH = async () => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/get-view-pr-h`, {
            comp_id: window.localStorage.getItem('company')
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// ดึงข้อมูลจาก View_Set_Po
const getViewPoH = async () => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/get-view-po-h`, {
            comp_id: window.localStorage.getItem('company')
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// ดึงข้อมูลจาก View_Set_Ap
const getViewAp = async () => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/get-view-ap`, {
            comp_id: window.localStorage.getItem('company')
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// ดึงข้อมูลจาก View_Set_Item
const getViewItem = async () => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/get-view-item`, {
            comp_id: window.localStorage.getItem('company')
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// Popup แจ้งเตือน ต่างๆ ใช้ status = OK, FAILED
const getAlert = (status, message) => {
    let icon = "";
    let confirmButtonClass = "";

    switch (status) {
        case 'OK':
            icon = "success";
            confirmButtonClass = "btn btn-success";
            break;
        case 'FAILED':
            icon = "error";
            confirmButtonClass = "btn btn-danger";
            break;
        case 'WARNING':
            icon = "warning";
            confirmButtonClass = "btn btn-warning";
            break;
        case 'INFO':
            icon = "info";
            confirmButtonClass = "btn btn-info";
            break;
        default:
            console.error(`Invalid status: ${status}`);
            return;
    }

    // เลื่อนหน้าขึ้นด้านบนสุด
    window.scrollTo(0, 0);

    Swal.fire({
        title: message,
        icon: icon,
        buttonsStyling: false,
        customClass: {
            confirmButton: confirmButtonClass
        }
    });
};

// ฟังก์ชันสำหรับจัดรูปแบบจำนวนเงิน
const formatCurrency = (amount) => {
    // ตรวจสอบว่า amount เป็นประเภท number
    if (typeof amount !== 'number' || isNaN(amount)) {
        return "0.00";
    }

    // แปลงจำนวนเงินให้เป็นทศนิยม 2 ตำแหน่ง
    const formattedAmount = amount.toFixed(2);

    // ตรวจสอบว่ามีรูปแบบที่จัดรูปแบบแล้วอยู่หรือไม่
    const regex = /^\d{1,3}(?:,\d{3})*(?:\.\d{2})?$/;
    // ตรวจสอบว่าค่าเป็นประเภท string และมีรูปแบบที่จัดรูปแบบแล้วหรือไม่
    if (regex.test(formattedAmount)) {
        return formattedAmount; // คืนค่าเดิมถ้ามีการ format เรียบร้อยแล้ว
    }

    // เพิ่ม , เพื่อจัดรูปแบบจำนวนเงิน
    return formattedAmount.replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

// ฟังก์ชันสำหรับแปลงรูปแบบจำนวนเงินกลับไปเป็นตัวเลขธรรมดา
const parseCurrency = (formattedAmount) => {
    // ตรวจสอบว่าค่าที่ได้รับเป็น string หรือไม่
    if (typeof formattedAmount !== 'string') {
        return formattedAmount; // คืนค่าเดิมถ้าไม่ใช่ string
    }

    // ตรวจสอบว่ามีค่าและไม่เป็น NaN หรือ null
    if (formattedAmount == null || isNaN(formattedAmount.replace(/,/g, ''))) {
        return formattedAmount; // คืนค่าเดิมถ้าไม่สามารถแปลงได้
    }

    // ตรวจสอบรูปแบบของจำนวนเงิน (เช่น "1,234,567.89")
    const regex = /^\d{1,3}(?:,\d{3})*(?:\.\d{2})?$/;
    if (!regex.test(formattedAmount)) {
        return formattedAmount; // คืนค่าเดิมถ้ารูปแบบไม่ตรงตามที่คาดหวัง
    }

    // ลบเครื่องหมายพันหลัก (,)
    const numericValue = formattedAmount.replace(/,/g, '');

    // แปลงข้อความที่ได้เป็นจำนวนจริง
    return parseFloat(numericValue);
};

// ฟังก์ชั่นเพิ่ม DocNo (For PR, PO)
const getMaxDocNo = (list, title) => {
    const { currentYear, currentMonth } = getCurrentYearMonth();

    if (!list || list.length < 1) { // ตรวจสอบกรณี list เป็น undefined, null, หรือไม่มีข้อมูล
        return title + currentYear + currentMonth + "0001";
    }

    const maxDoc = list.reduce((max, item) => {
        return item.Doc_No > max ? item.Doc_No : max;
    }, list[0].Doc_No);

    // เช็คปีและเดือนใน DocNo ล่าสุด
    if (maxDoc.slice(2, 4) !== currentYear || maxDoc.slice(4, 6) !== currentMonth) {
        return title + currentYear + currentMonth + "0001";
    }

    return incrementDocNo(maxDoc);
};
// ฟังก์ชั่นเพิ่มเสริม DocNo (For PR, PO)
const incrementDocNo = (docNo) => {
    const prefix = docNo.slice(0, 6); // รวมปีและเดือนใน prefix
    const numPart = parseInt(docNo.slice(6)) + 1;
    return prefix + numPart.toString().padStart(docNo.length - 6, '0');
};

// ฟังก์ชั่นเพิ่ม RecNo
const getMaxRecNo = (list) => {
    const { currentYear, currentMonth } = getCurrentYearMonth();

    if (!list || list.length < 1) { // ตรวจสอบกรณี list เป็น undefined, null, หรือไม่มีข้อมูล
        return `REC${currentYear}${currentMonth}0001`;
    }

    const maxRec = list.reduce((max, item) => {
        return item.Rec_No > max ? item.Rec_No : max;
    }, list[0].Rec_No);

    // เช็คปีและเดือนใน RecNo ล่าสุด
    if (maxRec.slice(3, 5) !== currentYear || maxRec.slice(5, 7) !== currentMonth) {
        return `REC${currentYear}${currentMonth}0001`;
    }

    return incrementRecNo(maxRec);
};
// ฟังก์ชั่นเพิ่มเสริม RecNo
const incrementRecNo = (recNo) => {
    const prefix = recNo.slice(0, 7); // รวมปีและเดือนใน prefix
    const numPart = parseInt(recNo.slice(7)) + 1;
    return prefix + numPart.toString().padStart(4, '0');
};

// ฟังก์ชั่นดึง Max ของ Pay
const getMaxPayNo = (list, givenDate) => {
    const { currentYear, currentMonth } = getCurrentYearMonth();

    // แปลงวันที่จากรูปแบบ "13-09-2567" เป็นปีและเดือน
    let year, month;
    if (givenDate) {
        const [day, monthStr, yearStr] = givenDate.split("-");
        year = yearStr.slice(-2); // ดึงสองหลักสุดท้ายของปี พ.ศ.
        month = monthStr; // เดือน
    } else {
        year = currentYear;
        month = currentMonth;
    }

    // เช็คว่ามีข้อมูล Pay_No หรือไม่
    if (!list || list.length < 1) {
        return `PAY${year}${month}0001`;
    }

    // หาค่าสูงสุดของ Pay_No
    const maxPay = list.reduce((max, item) => {
        return item.Pay_No > max ? item.Pay_No : max;
    }, list[0].Pay_No);

    // เช็คปีและเดือนใน Pay_No ล่าสุด
    const maxPayYear = maxPay.slice(3, 5);
    const maxPayMonth = maxPay.slice(5, 7);

    if (maxPayYear !== year || maxPayMonth !== month) {
        return `PAY${year}${month}0001`;
    }

    return incrementPayNo(maxPay);
};
// ฟังก์ชั่นเพิ่มเสริม PayNo
const incrementPayNo = (payNo) => {
    const prefix = payNo.slice(0, 7); // รวมปีและเดือนใน prefix
    const numPart = parseInt(payNo.slice(7)) + 1;
    return prefix + numPart.toString().padStart(4, '0');
};

// ฟังก์ชั่นดึง Max ของ Line
const getLineByDocId = async (table, docId) => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/get-line-by-doc-id`, {
            table: table,
            doc_id: docId
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

// ฟังก์ชั่นเพิ่ม AdjNo
const getMaxAdjNo = (list) => {
    const { currentYear, currentMonth } = getCurrentYearMonth();

    if (!list || list.length < 1) { // ตรวจสอบกรณี list เป็น undefined, null, หรือไม่มีข้อมูล
        return `ADJ${currentYear}${currentMonth}0001`;
    }

    const maxAdj = list.reduce((max, item) => {
        return item.WHDoc_No > max ? item.WHDoc_No : max;
    }, list[0].WHDoc_No);

    // เช็คปีและเดือนใน RecNo ล่าสุด
    if (maxAdj.slice(3, 5) !== currentYear || maxAdj.slice(5, 7) !== currentMonth) {
        return `ADJ${currentYear}${currentMonth}0001`;
    }

    return incrementAdjNo(maxAdj);
};
// ฟังก์ชั่นเพิ่มเสริม AdjNo
const incrementAdjNo = (adjNo) => {
    const prefix = adjNo.slice(0, 7); // รวมปีและเดือนใน prefix
    const numPart = parseInt(adjNo.slice(7)) + 1;
    return prefix + numPart.toString().padStart(4, '0');
};

// ฟังก์ชั่นเพิ่ม TnsNo
const getMaxTnsNo = (list) => {
    const { currentYear, currentMonth } = getCurrentYearMonth();

    if (!list || list.length < 1) { // ตรวจสอบกรณี list เป็น undefined, null, หรือไม่มีข้อมูล
        return `TNS${currentYear}${currentMonth}0001`;
    }

    const maxTns = list.reduce((max, item) => {
        return item.WHDoc_No > max ? item.WHDoc_No : max;
    }, list[0].WHDoc_No);

    // เช็คปีและเดือนใน RecNo ล่าสุด
    if (maxTns.slice(3, 5) !== currentYear || maxTns.slice(5, 7) !== currentMonth) {
        return `TNS${currentYear}${currentMonth}0001`;
    }

    return incrementTnsNo(maxTns);
};
// ฟังก์ชั่นเพิ่มเสริม TnsNo
const incrementTnsNo = (tnsNo) => {
    const prefix = tnsNo.slice(0, 7); // รวมปีและเดือนใน prefix
    const numPart = parseInt(tnsNo.slice(7)) + 1;
    return prefix + numPart.toString().padStart(4, '0');
};

// Update Status ในข้อมูล
const updateStatusByNo = async (table, field, status, where) => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/update-status`, {
            table: table,
            field: field,
            status: status,
            where: where
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

// Update Qty ในข้อมูล
const updateQty = async (table, updateCode, where) => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/update-qty`, {
            table: table,
            update_code: updateCode,
            where: where
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

// Delete ข้อมูลด้วย Table, Where
const deleteDetail = async (table, where) => {
    try {
        const response = await Axios.post(`${process.env.REACT_APP_API_URL}/api/delete`, {
            table: table,
            where: where
        }, {
            headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};

export {
    getData,
    getDataWithComp,
    getByDocId,
    getByRecId,
    getByPayId,
    getCompany,
    getDocType,
    getTransType,
    getDocStatusColour,
    getViewPrH,
    getViewPoH,
    getViewAp,
    getViewItem,
    getAlert,
    formatCurrency,
    parseCurrency,
    getMaxDocNo,
    getMaxRecNo,
    getMaxPayNo,
    getLineByDocId,
    getMaxAdjNo,
    getMaxTnsNo,
    updateStatusByNo,
    updateQty,
    deleteDetail,
};