import React from 'react';
import ItemWhModal from '../Modal/ItemWhModal';

const ItemWhTable = ({
  mode,
  showItemModal,
  handleItemClose,
  itemDataList,
  onRowSelectItem,
  formDetailList,
  handleItemShow,
  handleQuantityChange,
  handleRemoveRow,
  disabled
}) => {
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title">รายละเอียดสินค้า</h4>
        <button
          type="button"
          className="btn custom-button"
          onClick={handleItemShow}
          disabled={disabled}>
          <i className="fa fa-plus" /> เพิ่มรายการ
        </button>
      </div>
      <ItemWhModal
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
                <th className="text-center" style={{ width: '2%' }}>#</th>
                <th className="text-center" style={{ width: '8%' }}>รหัสสินค้า</th>
                <th
                  className="text-center"
                  style={mode === 'FA' ? { width: '30%' } : { width: '40%' }}
                >
                  ชื่อสินค้า
                </th>
                <th className="text-center" style={{ width: '10%' }}>Todo</th>
                <th className="text-center" style={{ width: '10%' }}>จำนวนคงคลัง</th>

                {mode === 'FA' ? (
                  <>
                    <th className="text-center" style={{ width: '10%' }}>เพิ่ม</th>
                    <th className="text-center" style={{ width: '10%' }}>ลด</th>
                  </>
                ) : (
                  <th className="text-center" style={{ width: '10%' }}>จำนวน</th>
                )}

                <th className="text-center" style={{ width: '10%' }}>จำนวนคงเหลือ</th>
                <th className="text-center" style={{ width: '5%' }}>หน่วย</th>
                <th className="text-center" style={{ width: '5%' }}>ลบ</th>
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

                    {/* Todo */}
                    <td className="text-center">
                      <span>{item.docType || ''}</span>
                    </td>

                    {/* จำนวนคงคลัง */}
                    <td className="text-center">
                      <span>{item.itemOnHand || 0}</span>
                    </td>

                    {mode === 'FA' ? (
                      <>
                        {/* เพิ่ม */}
                        <td className="text-center">
                          <input
                            type="text"
                            className="form-control text-center"
                            value={item.itemIncrease || ''}
                            onChange={(e) => handleQuantityChange(index, 'increase', e.target.value, item.itemOnHand)}
                            onInput={(e) => {
                              if (/^0+/.test(e.target.value)) {
                                e.target.value = e.target.value.replace(/^0+/, '');
                              }
                            }}
                          />
                        </td>

                        {/* ลด */}
                        <td className="text-center">
                          <input
                            type="text"
                            className="form-control text-center"
                            value={item.itemDecrease || ''}
                            onChange={(e) => handleQuantityChange(index, 'decrease', e.target.value, item.itemOnHand)}
                            onInput={(e) => {
                              if (/^0+/.test(e.target.value)) {
                                e.target.value = e.target.value.replace(/^0+/, '');
                              }
                            }}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        {/* จำนวน */}
                        <td className="text-center">
                          <input
                            type="text"
                            className="form-control text-center"
                            value={item.itemDecrease || ''}
                            onChange={(e) => handleQuantityChange(index, 'decrease', e.target.value, item.itemOnHand)}
                            onInput={(e) => {
                              if (/^0+/.test(e.target.value)) {
                                e.target.value = e.target.value.replace(/^0+/, '');
                              }
                            }}
                          />
                        </td>
                      </>
                    )}

                    {/* จำนวนคงเหลือ */}
                    <td className="text-center">
                      <span>{item.itemBalance || 0}</span>
                    </td>

                    {/* หน่วย */}
                    <td className="text-center">
                      <span>{item.itemUnit || ''}</span>
                    </td>

                    {/* ลบ */}
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleRemoveRow(index)}>
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10">
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
    </div >
  );
};

export default ItemWhTable;
