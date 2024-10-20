import React, { useEffect } from 'react';

// Components
import Sidebar from '../../components/Sidebar';
import Form from '../../components/Warehouse/WarehouseStock/Form';

// Utils
import {
  getAlert
} from '../../../utils/SamuiUtils';

function WarehouseStock() {

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      fetchRealtime(); // เรียกใช้งาน fetchRealtime เพื่อโหลดข้อมูลเมื่อ component โหลดครั้งแรก
    } catch (error) {
      getAlert('FAILED', error.message);
    }
  };

  const fetchRealtime = async () => {
    try {
      // do nothing
    } catch (error) {
      getAlert('FAILED', error.message);
    }
  };

  return (
    <div className="WarehouseStock">
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="container">
            <div className="page-inner">
              <Form
                name={'สต็อกคลังสินค้า'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WarehouseStock;
