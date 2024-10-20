// ฟังก์ชันสำหรับจัดรุปแบบวันที่ให้เป็น "dd/mm/yyyy" เพื่อแปลงใส่ DatePicker
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear() + 543;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
};

const formatStringDateToDate = (dateString) => {
    // ตรวจสอบว่า dateString เป็นค่าว่าง, null หรือไม่
    if (!dateString || typeof dateString !== 'string') {
        return null;
    }

    // ตรวจสอบรูปแบบวันที่ที่คาดหวัง (dd-mm-yyyy)
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) {
        return null;
    }

    // แยกวัน เดือน ปี จากสตริงวันที่
    const [day, month, buddhistYear] = dateParts;

    // ตรวจสอบความถูกต้องของวัน, เดือน, ปี
    if (!day || !month || !buddhistYear || isNaN(day) || isNaN(month) || isNaN(buddhistYear)) {
        return null;
    }

    // แปลงพุทธศักราชเป็นคริสต์ศักราช
    const christianYear = parseInt(buddhistYear, 10) - 543;

    // ตรวจสอบความถูกต้องของปีคริสต์ศักราช
    if (isNaN(christianYear) || christianYear < 0) {
        return null;
    }

    // จัดรูปแบบวันที่เป็น "YYYY-MM-DD 00:00:00.000"
    const formattedDate = `${christianYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')} 00:00:00.000`;

    return formattedDate;
};


// ฟังก์ชันสำหรับจัดรุปแบบวันที่ให้เป็น "2024-08-06T17:00:00.000Z เป็น 06/08/2567" เพื่อส่งค่าไปที่ DatePicker
const formatDateToStringDate = (date) => {
    // สร้าง Date object จากสตริงวันที่ที่ได้รับมา
    const d = new Date(date);

    // รับค่าวัน, เดือน, ปี (ปี + 543 สำหรับปีพุทธศักราช)
    const day = ('0' + d.getUTCDate()).slice(-2);
    const month = ('0' + (d.getUTCMonth() + 1)).slice(-2); // เดือนใน JavaScript เริ่มต้นที่ 0
    const year = d.getUTCFullYear() + 543; // เพิ่ม 543 เพื่อให้เป็นปีพุทธศักราช

    // จัดรูปแบบวันที่เป็น dd/mm/yyyy
    return `${day}-${month}-${year}`;
};

const formatThaiDateUi = (dateString) => {
    if (dateString === null) {
        return null;
    } else if (dateString === '') {
        return '';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return null; // คืนค่าเป็น null เมื่อวันที่ไม่ถูกต้อง
    }

    const year = date.getFullYear() + 543;
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${year}`;
};

// ฟังก์ชันเพื่อใช้กับ handleChangeDateMaster ผลลัพธ์ที่ Return คือ "13-08-2567"
const formatDateOnChange = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
    }

    let year = date.getFullYear();
    // ตรวจสอบว่าเป็นปี ค.ศ. หรือ พ.ศ.
    if (year < 2500) {
        year += 543; // แปลงเป็นปี พ.ศ.
    }

    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${year}`;
};

// ฟังก์ชันสำหรับจัดรุปแบบวันที่ให้เป็น "2567-07-18 00:00:00.000 เป็น 2024-07-18 00:00:00.000" เพื่อบันทึกลง Database
const formatThaiDateToDate = (date) => {
    if (!date || typeof date !== 'string') {
        //console.error('Invalid date format:', date);
        return null; // หรือทำการจัดการข้อผิดพลาดที่เหมาะสม
    }

    // แยกวันที่และเวลาจากสตริง
    const [datePart, timePart] = date.split(' ');

    if (!datePart) {
        //console.error('Date part is missing in:', date);
        return null;
    }

    // แยกปี, เดือน, และวัน
    const [year, month, day] = datePart.split('-');

    if (!year || !month || !day) {
        //console.error('Incomplete date parts in:', date);
        return null;
    }

    // แปลงปีพุทธศักราชเป็นคริสต์ศักราช
    const christianYear = Number(year) - 543;

    // ตรวจสอบว่าปี ค.ศ. ถูกต้องหรือไม่
    if (isNaN(christianYear)) {
        //console.error('Invalid year in date:', date);
        return null;
    }

    // รวมปี ค.ศ. เดือน วัน และเวลาเข้าด้วยกัน
    return timePart
        ? `${christianYear}-${month}-${day} ${timePart}`
        : `${christianYear}-${month}-${day}`;
};

// ฟังก์ชันสำหรับจัดรุปแบบวันที่ให้เป็น "YYMMDDHHMMSSZZZ"
const formatDateTime = (date) => {
    const padZero = (number, length) => number.toString().padStart(length, '0');

    const year = date.getFullYear().toString().slice(2);  // ตัดเลขปีให้เหลือ 2 หลัก
    const month = padZero(date.getMonth() + 1, 2);  // เดือน
    const day = padZero(date.getDate(), 2);  // วัน
    const hours = padZero(date.getHours(), 2);  // ชั่วโมง
    const minutes = padZero(date.getMinutes(), 2);  // นาที
    const seconds = padZero(date.getSeconds(), 2);  // วินาที
    const milliseconds = padZero(date.getMilliseconds(), 3);  // มิลลิวินาที

    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
};

// ฟังก์ชันเพื่อแปลงวันที่เป็นปี พ.ศ. yyyy-mm-dd เพื่อแปลงใส่ DatePicker
const formatThaiDate = (dateString) => {
    // ตรวจสอบว่า dateString เป็น null หรือ string ว่าง
    if (dateString === null) {
        return null;
    }
    if (dateString === '') {
        return '';
    }

    // สร้างอ็อบเจ็กต์ Date จาก dateString
    const date = new Date(dateString);

    // ตรวจสอบว่าการสร้าง Date สำเร็จหรือไม่
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
    }

    // แปลงปี ค.ศ. เป็นปี พ.ศ.
    const year = date.getFullYear() + 543;

    // จัดรูปแบบวันที่ในรูปแบบ yyyy-mm-dd
    return `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// ฟังก์ชันสำหรับจัดรุปแบบวันที่ให้เป็น "18-07-2567 เป็น 2024-07-18 00:00:00.000" เพื่อบันทึกลง Database
const formatThaiDateUiToDate = (date) => {
    // ตรวจสอบว่า date มีค่าและเป็น string หรือไม่
    if (!date || typeof date !== 'string') {
        return null; // หรือทำการจัดการข้อผิดพลาดที่เหมาะสม
    }

    // แยกวันที่และเวลาจากสตริง
    const [datePart, timePart] = date.split(' ');

    if (!datePart) {
        return null;
    }

    // แยกปี, เดือน, และวัน
    const [day, month, year] = datePart.split('-');

    if (!day || !month || !year) {
        return null;
    }

    // ตรวจสอบและแปลงปีพุทธศักราชเป็นคริสต์ศักราช
    const christianYear = Number(year) - 543;

    // ตรวจสอบว่าปี ค.ศ. ถูกต้องหรือไม่
    if (isNaN(christianYear) || christianYear < 0) {
        return null;
    }

    // รวมปี ค.ศ. เดือน วัน และเวลาเข้าด้วยกัน
    return timePart
        ? `${christianYear}-${month}-${day} ${timePart}`
        : `${christianYear}-${month}-${day} 00:00:00.000`;
};

// ฟังก์ชันเพื่อแปลงวันที่จาก dd-mm-yyyy โดยเปลี่ยนปี ค.ศ. เป็นปี พ.ศ.
const convertToThaiDate = (dateString) => {
    // ตรวจสอบว่า dateString เป็น null หรือ string ว่าง
    if (dateString === null) {
        return null;
    }
    if (dateString === '') {
        return '';
    }

    // แยกส่วนวันที่ เดือน และปีจาก dateString
    const [day, month, year] = dateString.split('-');

    // ตรวจสอบว่า day, month, year เป็นตัวเลขถูกต้องหรือไม่
    if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
        throw new Error("Invalid date format");
    }

    // แปลงปี ค.ศ. เป็นปี พ.ศ.
    const thaiYear = parseInt(year) + 543;

    // จัดรูปแบบวันที่ในรูปแบบ dd-mm-yyyy
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${thaiYear}`;
};

// ฟังก์ชั่นหลักเพื่อรับปีและเดือนปัจจุบันในปีพ.ศ.
const getCurrentYearMonth = () => {
    const currentYear = (new Date().getFullYear() + 543).toString().slice(-2);
    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    return { currentYear, currentMonth };
};

// SET CreateDateTime
const getCreateDateTime = () => {
    const today = new Date();
    const year = today.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const formattedNewDate = `${day}-${month}-${year}`;
    const formattedTime = today.toTimeString().split(' ')[0]; // แยกเอาเฉพาะเวลา
    return `${formattedNewDate} ${formattedTime}`;
};

const setCreateDateTime = (date) => {
    // ตรวจสอบว่า date เป็น null
    if (date === null) {
        return null;
    }

    // ตรวจสอบว่า date เป็น string ว่าง
    if (date === '') {
        return '';
    }

    // สร้างอ็อบเจ็กต์ Date จาก date
    const today = new Date(date);

    // แปลงเป็นปีพุทธศักราช
    const year = today.getUTCFullYear() + 543;
    const day = today.getUTCDate().toString().padStart(2, '0');
    const month = (today.getUTCMonth() + 1).toString().padStart(2, '0');
    const formattedNewDate = `${day}-${month}-${year}`;

    // จัดรูปแบบเวลา
    const hours = today.getUTCHours().toString().padStart(2, '0');
    const minutes = today.getUTCMinutes().toString().padStart(2, '0');
    const seconds = today.getUTCSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    // คืนค่าที่จัดรูปแบบแล้ว
    return `${formattedNewDate} ${formattedTime}`;
};

export {
    formatDate,
    formatStringDateToDate,
    formatDateToStringDate,
    formatDateTime,
    formatThaiDate,
    formatThaiDateUi,
    formatDateOnChange,
    formatThaiDateToDate,
    formatThaiDateUiToDate,
    convertToThaiDate,
    getCurrentYearMonth,
    getCreateDateTime,
    setCreateDateTime,
};