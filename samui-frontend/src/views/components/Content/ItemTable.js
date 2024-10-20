import React from 'react';
import ItemModal from '../Modal/ItemModal';

const ItemTable = ({
    formDetailList,
    handleChangeDetail,
    handleRemoveRow,
    formatCurrency,
    showItemModal,
    handleItemClose,
    itemDataList,
    onRowSelectItem,
    handleItemShow,
    whDataList,
    handleFocus,
    handleBlur,
    disabledRec,
    disabled
}) => {

    // ถ้าเป็นหน้าใบสั่งซื้อและใบรับสินค้า ให้แสดง Column จำนวนรับ / จำนวนค้างรับ
    const isPurchaseOrderOrReceipt = () => {
        return window.location.pathname === '/purchase-order' || window.location.pathname === '/purchase-receipt';
    };

    // ถ้าเป็นหน้าใบสั่งซื้อและใบรับสินค้า ให้กำหนด Width จำนวนรับ / จำนวนค้างรับ
    const getColumnWidth = () => {
        if (window.location.pathname === '/purchase-order') {
            return '13%';
        } else if (window.location.pathname === '/purchase-receipt') {
            return '21%';
        } else {
            return '21%';
        }
    };

    return (
        <div className="col-12">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="card-title">รายละเอียดสินค้า</h4>
                    <button
                        type="button"
                        className="btn custom-button"
                        onClick={handleItemShow}
                        hidden={disabled}>
                        <i className="fa fa-plus"></i> เพิ่มรายการ
                    </button>
                </div>
                <ItemModal
                    showItemModal={showItemModal}
                    handleItemClose={handleItemClose}
                    itemDataList={itemDataList}
                    onRowSelectItem={onRowSelectItem}
                />
                <div className="card-body">
                    <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <table id="basic-datatables" className="table table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th className="text-center" style={{ width: '1%' }}>#</th>
                                    <th className="text-center" style={{ width: '10%' }}>รหัสสินค้า</th>
                                    <th
                                        className="text-center"
                                        style={window.location.pathname === '/purchase-order' ? { width: '15%' } : { width: '23%' }}>
                                        ชื่อสินค้า
                                    </th>
                                    <th className="text-center"
                                        style={{ width: '8%' }}>
                                        จำนวน {window.location.pathname === '/purchase-order' ? '(PO)' : ''}
                                    </th>
                                    <th hidden={window.location.pathname === '/purchase-order' ? false : true}
                                        className="text-center"
                                        style={{ width: '8%' }}>
                                        จำนวนรับ
                                    </th>
                                    <th hidden={!isPurchaseOrderOrReceipt()}
                                        className="text-center"
                                        style={{ width: '8%' }}>
                                        จำนวนค้างรับ {window.location.pathname === '/purchase-order' ? '(PO)' : ''}
                                    </th>
                                    <th className="text-center" style={{ width: '6%' }}>หน่วย</th>
                                    <th className="text-center" style={{ width: '8%' }}>ราคาต่อหน่วย</th>
                                    <th className="text-center" style={{ width: '8%' }}>ส่วนลด</th>
                                    <th className="text-center" style={{ width: '5%' }}>%</th>
                                    <th className="text-center" style={
                                        window.location.pathname === '/deposit-document' ||
                                            window.location.pathname === '/purchase-request' ||
                                            window.location.pathname === '/purchase-order' ?
                                            { width: '10%' } : { width: '7%' }}>
                                        จำนวนเงินรวม
                                    </th>
                                    <th className="text-center"
                                        style={{ width: getColumnWidth() }}
                                        hidden={window.location.pathname === '/deposit-document' ||
                                            window.location.pathname === '/purchase-request' ||
                                            window.location.pathname === '/purchase-order' ||
                                            window.location.pathname === '/quotation' ||
                                            window.location.pathname === '/billofsale' ||
                                            window.location.pathname === '/taxes'}
                                    >
                                        คลังสินค้า
                                    </th>
                                    <th className="text-center" style={{ width: '3%' }}>ลบ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formDetailList.length > 0 ? (
                                    formDetailList.map((item, index) => (
                                        <tr key={item.itemId || index + 1}>
                                            {/* # */}
                                            <td className="text-center">{index + 1}</td>

                                            {/* รหัสสินค้า */}
                                            <td className="text-center">
                                                <span>{item.itemCode || ''}</span>
                                            </td>

                                            {/* ชื่อสินค้า */}
                                            <td className="text-left">
                                                <span>{item.itemName || ''}</span>
                                            </td>

                                            {/* จำนวน */}
                                            <td className="text-center">
                                                <input
                                                    type="text"
                                                    className="form-control text-center"
                                                    value={item.itemQty || 0}
                                                    onChange={(e) => handleChangeDetail(index, 'itemQty', e.target.value)}
                                                    disabled={window.location.pathname === '/product-receipt'
                                                        ? (!disabled || disabledRec ? true : false) : disabled}
                                                    onInput={(e) => {
                                                        if (/^0+/.test(e.target.value)) {
                                                            e.target.value = e.target.value.replace(/^0+/, '');
                                                        }
                                                    }}
                                                />
                                            </td>

                                            {/* จำนวนรับ */}
                                            <td
                                                hidden={window.location.pathname === '/purchase-order' ? false : true}
                                                className="text-center"
                                            >
                                                {/* {disabled ? (
                                                <span>{item.itemRecQty || 0}</span>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="form-control text-center"
                                                    value={item.itemRecQty || 0}
                                                    onChange={(e) => handleChangeDetail(index, 'itemRecQty', e.target.value)}
                                                    disabled={disabled}
                                                />
                                            )} */}
                                                <input
                                                    type="text"
                                                    className="form-control text-center"
                                                    value={item.itemRecQty || 0}
                                                    onChange={(e) => handleChangeDetail(index, 'itemRecQty', e.target.value)}
                                                    disabled={disabled}
                                                    onInput={(e) => {
                                                        if (/^0+/.test(e.target.value)) {
                                                            e.target.value = e.target.value.replace(/^0+/, '');
                                                        }
                                                    }}
                                                />
                                            </td>

                                            {/* จำนวนค้างรับ */}
                                            <td
                                                hidden={!isPurchaseOrderOrReceipt()}
                                                className="text-center">
                                                {/* {disabled ? (
                                                <span>{item.itemRecBalance || 0}</span>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="form-control text-center"
                                                    value={item.itemRecBalance || 0}
                                                    onChange={(e) => handleChangeDetail(index, 'itemRecBalance', e.target.value)}
                                                    disabled={disabled}
                                                />
                                            )} */}
                                                <input
                                                    type="text"
                                                    className="form-control text-center"
                                                    value={item.itemRecBalance || 0}
                                                    onChange={(e) => handleChangeDetail(index, 'itemRecBalance', e.target.value)}
                                                    disabled={disabled}
                                                    onInput={(e) => {
                                                        if (/^0+/.test(e.target.value)) {
                                                            e.target.value = e.target.value.replace(/^0+/, '');
                                                        }
                                                    }}
                                                />
                                            </td>

                                            {/* หน่วย */}
                                            <td className="text-center">
                                                {/* {disabled ? (
                                                <span>{item.itemUnit || ''}</span>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={item.itemUnit || ''}
                                                    disabled={true}
                                                    onChange={(e) => handleChangeDetail(index, 'itemUnit', e.target.value)}
                                                />
                                            )} */}
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={item.itemUnit || ''}
                                                    disabled={true}
                                                    onChange={(e) => handleChangeDetail(index, 'itemUnit', e.target.value)}
                                                />
                                            </td>

                                            {/* ราคาต่อหน่วย */}
                                            <td className="text-end">
                                                {/* {disabled ? (
                                                <span>{formatCurrency(item.itemPriceUnit || 0)}</span>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="form-control text-end"
                                                    value={item.itemPriceUnit || ''}
                                                    onChange={(e) => handleChangeDetail(index, 'itemPriceUnit', e.target.value)}
                                                    onFocus={(e) => handleFocus(index, 'itemPriceUnit')}
                                                    onBlur={(e) => handleBlur(index, 'itemPriceUnit', e.target.value)}
                                                    disabled={disabled}
                                                />
                                            )} */}
                                                <input
                                                    type="text"
                                                    className="form-control text-end"
                                                    value={item.itemPriceUnit || 0}
                                                    onChange={(e) => handleChangeDetail(index, 'itemPriceUnit', e.target.value)}
                                                    onFocus={(e) => handleFocus(index, 'itemPriceUnit')}
                                                    onBlur={(e) => handleBlur(index, 'itemPriceUnit', e.target.value)}
                                                    disabled={disabled}
                                                    onInput={(e) => {
                                                        if (/^0+/.test(e.target.value)) {
                                                            e.target.value = e.target.value.replace(/^0+/, '');
                                                        }
                                                    }}
                                                />
                                            </td>

                                            {/* ส่วนลด */}
                                            <td className="text-end">
                                                {/* {disabled ? (
                                                <span>{formatCurrency(item.itemDiscount || 0)}</span>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="form-control text-end"
                                                    value={item.itemDiscount || ''}
                                                    onChange={(e) => handleChangeDetail(index, 'itemDiscount', e.target.value)}
                                                    onFocus={(e) => handleFocus(index, 'itemDiscount')}
                                                    onBlur={(e) => handleBlur(index, 'itemDiscount', e.target.value)}
                                                    disabled={disabled}
                                                />
                                            )} */}
                                                <input
                                                    type="text"
                                                    className="form-control text-end"
                                                    value={item.itemDiscount || 0}
                                                    onChange={(e) => handleChangeDetail(index, 'itemDiscount', e.target.value)}
                                                    onFocus={(e) => handleFocus(index, 'itemDiscount')}
                                                    onBlur={(e) => handleBlur(index, 'itemDiscount', e.target.value)}
                                                    disabled={disabled}
                                                    onInput={(e) => {
                                                        if (/^0+/.test(e.target.value)) {
                                                            e.target.value = e.target.value.replace(/^0+/, '');
                                                        }
                                                    }}
                                                />
                                            </td>

                                            {/* % */}
                                            <td className="text-center">
                                                {/* {disabled ? (
                                                <span>{item.itemDisType === "1" ? "฿" : item.itemDisType === "2" ? "%" : ""}</span>
                                            ) : (
                                                <select
                                                    className="form-select"
                                                    value={item.itemDisType || ''}
                                                    onChange={(e) => handleChangeDetail(index, 'itemDisType', e.target.value)}
                                                    disabled={disabled}
                                                >
                                                    <option value="1">฿</option>
                                                    <option value="2">%</option>
                                                </select>
                                            )} */}
                                                <select
                                                    className="form-select"
                                                    value={item.itemDisType || ''}
                                                    onChange={(e) => handleChangeDetail(index, 'itemDisType', e.target.value)}
                                                    disabled={disabled}
                                                >
                                                    <option value="1">฿</option>
                                                    <option value="2">%</option>
                                                </select>
                                            </td>

                                            {/* จำนวนเงินรวม */}
                                            <td className="text-end">
                                                <span>{formatCurrency(item.itemTotal || 0)}</span>
                                            </td>

                                            {/* คลังสินค้า */}
                                            <td className="text-center"
                                                hidden={window.location.pathname === '/deposit-document' ||
                                                    window.location.pathname === '/purchase-request' ||
                                                    window.location.pathname === '/purchase-order' ||
                                                    window.location.pathname === '/quotation' ||
                                                    window.location.pathname === '/billofsale' ||
                                                    window.location.pathname === '/taxes'}>
                                                <select
                                                    name="whId"
                                                    value={item.whId}
                                                    onChange={(e) => handleChangeDetail(index, 'whId', e.target.value)}
                                                    className="form-select form-control"
                                                    disabled={window.location.pathname === '/product-receipt'
                                                        ? (!disabled || disabledRec ? true : false) : disabled}
                                                >
                                                    {whDataList.map((warehouse) => (
                                                        <option key={warehouse.WH_Id} value={warehouse.WH_Id}>
                                                            {warehouse.WH_Name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>

                                            {/* ลบ */}
                                            <td className="text-center">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => handleRemoveRow(index)}
                                                    disabled={disabled}
                                                >
                                                    ลบ
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12">
                                            <center>
                                                <h5>ไม่พบรายการสินค้า</h5>
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
    );
};

export default ItemTable;