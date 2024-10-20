import React, { useState, useEffect } from 'react';

// Components
import Sidebar from '../../components/Sidebar';
import Main from '../../components/SellProducts/BillOfSale/Main';
import Form from '../../components/SellProducts/BillOfSale/Form';
import { getDataWithComp, getDocStatusColour, getAlert, getMaxDocNo } from '../../../utils/SamuiUtils';

const BillOfSale = () => {
  const [mode, setMode] = useState('');
  const [dataMasterList, setDataMasterList] = useState([]);
  const [statusColours, setStatusColours] = useState([]);
  const [maxDocNo, setMaxDocNo] = useState();

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
      const masterList = await getDataWithComp('API_0701_SO_H', 'ORDER BY Doc_No DESC');
      const docStatusColour = await getDocStatusColour('SO', 'Doc_Status');

      if (masterList && masterList.length > 0) {
        const sortedData = masterList.sort((a, b) => a.Doc_Id - b.Doc_Id);
        setDataMasterList(sortedData);
      }

      if (docStatusColour && docStatusColour.length > 0) {
        setStatusColours(docStatusColour);
      }

      // หาค่าสูงของ DocNo ใน SO_H
      const findMaxDocNo = await getDataWithComp('SO_H', 'ORDER BY Doc_No DESC');
      const maxDoc = getMaxDocNo(findMaxDocNo, 'SO');
      setMaxDocNo(maxDoc);
    } catch (error) {
      getAlert('FAILED', error.message);
    }
  };

  const onPageInsert = () => {
    setMode('I')
  };

  const onRowSelected = (docNo) => {
    setMaxDocNo(docNo);
    setMode('U');
  };
  return (
    <div className="PurchaseRequest">
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="container">
            <div className="page-inner">
              {mode === 'S' ? (
                <Main
                  masterList={dataMasterList}
                  statusColours={statusColours}
                  name={'ใบขาย'}
                  onPageInsert={() => onPageInsert()}
                  onRowSelected={(docNo) => onRowSelected(docNo)}
                />
              ) : (
                <Form callInitialize={initialize} mode={mode} name={'ใบขาย'} maxDocNo={maxDocNo} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillOfSale;
