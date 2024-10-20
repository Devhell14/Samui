import React, { useState, useEffect } from 'react';

// Components
import Sidebar from '../../components/Sidebar';
import Main from '../../components/Warehouse/TreasuryDocuments/Main';
import FormAdjust from '../../components/Warehouse/TreasuryDocuments/FormAdjust';
import FormTransfer from '../../components/Warehouse/TreasuryDocuments/FormTransfer';

// Utils
import {
  getDataWithComp,
  getAlert,
  getMaxAdjNo,
  getMaxTnsNo
} from '../../../utils/SamuiUtils';

const TreasuryDocuments = () => {
  const [mode, setMode] = useState('');
  const [dataMasterList, setDataMasterList] = useState([]);
  const [dataDetailList, setDataDetailList] = useState([]);
  const [maxAdjNo, setMaxAdjNo] = useState();
  const [maxTnsNo, setMaxTnsNo] = useState();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      setMode('S');
      fetchRealtime(); // เรียกใช้งาน fetchRealtime เพื่อโหลดข้อมูลเมื่อ component โหลดครั้งแรก
    } catch (error) {
      getAlert('FAILED', error.message);
    }
  };

  const fetchRealtime = async () => {
    try {
      const masterList = await getDataWithComp('API_1001_WHDOC_H', 'ORDER BY WHDoc_No DESC');
      if (masterList && masterList.length > 0) {
        setDataMasterList(masterList);
      }

      const detailList = await getDataWithComp('API_1002_WHDOC_D', 'ORDER BY Line ASC');
      if (detailList && detailList.length > 0) {
        setDataDetailList(detailList);
      }

      // หาค่าสูงของ WHDocNo ใน WHDOC_H สำหรับ ADJ (ปรับ) & TN (โอน)
      const findMaxAdjNo = await getDataWithComp('WHDoc_H', `AND WHDoc_Type = '1' ORDER BY WHDoc_No DESC`);
      const maxAdj = getMaxAdjNo(findMaxAdjNo);

      const findMaxTnsNo = await getDataWithComp('WHDoc_H', `AND WHDoc_Type = '2' ORDER BY WHDoc_No DESC`);
      const maxTns = getMaxTnsNo(findMaxTnsNo);
      setMaxAdjNo(maxAdj);
      setMaxTnsNo(maxTns);
    } catch (error) {
      getAlert('FAILED', error.message);
    }
  };

  const onChangeMode = (mode) => {
    return () => setMode(mode);
  };

  return (
    <div>
      <div className="TreasuryDocuments">
        <div className="wrapper">
          <Sidebar />
          <div className="main-panel">
            <div className="container">
              <div className="page-inner">
                {mode === 'S' && (
                  <Main
                    name={'จัดการเอกสารงานคลัง'}
                    onChangeMode={onChangeMode}
                    dataMasterList={dataMasterList}
                    dataDetailList={dataDetailList}
                  />
                )}
                {mode === 'FA' && (
                  <FormAdjust
                    callInitialize={initialize}
                    mode={mode}
                    name={'ใบปรับปรุงสินค้า'}
                    whDocNo={maxAdjNo}
                  />
                )}
                {mode === 'FT' && (
                  <FormTransfer
                    callInitialize={initialize}
                    mode={mode}
                    name={'ใบโอนย้ายสินค้า'}
                    whDocNo={maxTnsNo}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryDocuments;
