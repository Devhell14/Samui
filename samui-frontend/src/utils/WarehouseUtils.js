import Axios from "axios";

import {
    getDataWithComp,
    getAlert
} from "./SamuiUtils";

import {
    formatDateTime,
    formatThaiDateUiToDate,
    getCreateDateTime
} from "./DateUtils";

const manageWhItemData = async (
    itemId, // Item ไอดีของสิ่งนั้นๆ
    itemCode, // Item โค้ดของสิ่งนั้นๆ
    itemName, // ชื่อ Item นั้นๆ
    whId, // WarehouseID ของไอเทม
    docType, // ประเภท เช่น IN/OUT/AI/AO/TI/TO
    stcQty, // ค่าจำนวนที่กรอกจากหน้าจอ
    docId, // ไอดีเอกสาร
    docNo, // เลขเอกสาร
    docNoRef, // เลขเอกสารอ้างอิง
    stcRemark // หมายเหตุ
) => {
    try {
        // Find WH_Item_Onhand By comp_id, item_id, wh_id
        let findItemOnHand = await getDataWithComp("WH_ITEM_Onhand", `AND Item_Id = ${itemId} AND WH_Id = ${whId}`);

        // ถ้าเจอให้ Update WH_Item_Onhand แต่ถ้าไม่เจอให้ Insert WH_Item_Onhand
        if (findItemOnHand.length > 0) {
            // UPDATE WH_Item_Onhand
            await Axios.post(`${process.env.REACT_APP_API_URL}/api/update-wh-item-on-hand`, {
                last_qty: stcQty,
                item_on_hand: Number(await calculateNewQty(docType, findItemOnHand[0].Item_Onhand, stcQty)),
                last_stc_seq: formatDateTime(new Date()),
                last_stc_date: formatThaiDateUiToDate(getCreateDateTime()) + ".000",
                item_id: itemId,
                wh_id: whId,
                comp_id: window.localStorage.getItem('company')
            }, {
                headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
            });
        } else {
            // INSERT WH_Item_Onhand
            await Axios.post(`${process.env.REACT_APP_API_URL}/api/insert-wh-item-onhand`, {
                item_id: itemId,
                item_code: itemCode,
                item_name: itemName,
                item_barcode: null,
                last_qty: stcQty,
                item_on_hand: stcQty,
                wh_id: whId,
                zone_id: parseInt("1", 10),
                lt_id: parseInt("1", 10),
                last_stc_seq: formatDateTime(new Date()),
                last_stc_date: formatThaiDateUiToDate(getCreateDateTime()),
                comp_id: window.localStorage.getItem('company')
            }, {
                headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
            });
        }

        // ทำการ Insert WH_ITEM_STC ทุกกรณี
        // Find TOP(1) WH_ITEM_STC By item_id, wh_id,comp_id ORDER BY STC_SEQ DESC; 
        // => ต้องการ STC_Balance เพื่อมาบวกกับจำนวนรับแล้ว INSERT ใหม่
        let findItemStc = await getDataWithComp("WH_ITEM_STC", `AND Item_Id = ${itemId} AND WH_Id = ${whId} ORDER BY STC_SEQ DESC`);

        // ถ้าเจอให้ Insert WH_ITEM_STC เอาค่าเดิมมากบวก แต่ถ้าไม่เจอให้ Insert WH_ITEM_STC เอา 0 + ค่าใหม่
        if (findItemStc.length > 0) {
            // Insert WH_ITEM_STC เอาค่าเดิมมากบวก
            await Axios.post(`${process.env.REACT_APP_API_URL}/api/insert-wh-item-stc`, {
                item_id: itemId,
                item_code: itemCode,
                item_name: itemName,
                doc_type: docType,
                ref_balance: parseInt("0", 10),
                stc_qty: stcQty,
                stc_balance: Number(await calculateNewQty(docType, findItemStc[0].STC_Balance, stcQty)),
                stc_date: formatThaiDateUiToDate(getCreateDateTime()),
                stc_by: window.localStorage.getItem('emp_id'),
                comp_id: window.localStorage.getItem('company'),
                doc_id: docId,
                doc_no: docNo,
                doc_noref: docNoRef,
                stc_remark: stcRemark,
                stc_seq: formatDateTime(new Date()),
                wh_id: whId,
                zone_id: parseInt("1", 10),
                lt_id: parseInt("1", 10)
            }, {
                headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
            });
        } else {
            // Insert WH_ITEM_STC เอา 0 + ค่าใหม่
            await Axios.post(`${process.env.REACT_APP_API_URL}/api/insert-wh-item-stc`, {
                item_id: itemId,
                item_code: itemCode,
                item_name: itemName,
                doc_type: docType,
                ref_balance: parseInt("0", 10),
                stc_qty: stcQty,
                stc_balance: Number(await calculateNewQty(docType, parseInt("0", 10), stcQty)),
                stc_date: formatThaiDateUiToDate(getCreateDateTime()),
                stc_by: window.localStorage.getItem('emp_id'),
                comp_id: window.localStorage.getItem('company'),
                doc_id: docId,
                doc_no: docNo,
                doc_noref: docNoRef,
                stc_remark: stcRemark,
                stc_seq: formatDateTime(new Date()),
                wh_id: whId,
                zone_id: parseInt("1", 10),
                lt_id: parseInt("1", 10)
            }, {
                headers: { key: 'SAMUI1WoV5UbrGPq5iOXS2SS4ODR9999' }
            });
        }
    } catch (error) {
        getAlert("FAILED", error)
        return null;
    }
};

// Method แยกสำหรับคำนวณค่าใหม่
const calculateNewQty = async (docType, currentQty, stcQty) => {
    let newQty;

    switch (docType) {
        case 'IN':
        case 'AI':
        case 'TI':
            newQty = Number(currentQty) + Number(stcQty);
            break;
        case 'OUT':
        case 'AO':
        case 'TO':
            newQty = Number(currentQty) - Number(stcQty);
            break;
        default:
            throw new Error(`Unsupported docType: ${docType}`);
    }

    return newQty;
};

export { manageWhItemData };