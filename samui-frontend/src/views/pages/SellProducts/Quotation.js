import React, { useState, useEffect } from 'react';

// Components
import Sidebar from '../../components/Sidebar';
import Main from '../../components/SellProducts/Quotation/Main';
import Form from '../../components/SellProducts/Quotation/Form';
import { getDataWithComp, getDocStatusColour, getAlert, getMaxDocNo } from '../../../utils/SamuiUtils';

const Quotation = () => {
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
      // รอพี่คินทำ API_0601_QT_H
      const masterList = await getDataWithComp('QT_H', 'ORDER BY Doc_No DESC');
      // console.debug('masterList =>', masterList);
      // รอพี่คินทำ QT
      const docStatusColour = await getDocStatusColour('QT', 'Doc_Status');
      // console.debug('docStatusColour =>', docStatusColour);

      if (masterList && masterList.length > 0) {
        const sortedData = masterList.sort((a, b) => a.Doc_Id - b.Doc_Id);
        setDataMasterList(sortedData);
      }

      if (docStatusColour && docStatusColour.length > 0) {
        setStatusColours(docStatusColour);
      }

      // หาค่าสูงของ DocNo ใน PR_H
      // รอพี่คินทำ API_0601_QT_H
      const findMaxDocNo = await getDataWithComp('QT_H', 'ORDER BY Doc_No DESC');
      // รอพี่คินทำ QT
      const maxDoc = getMaxDocNo(findMaxDocNo, 'QT');
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
                  name={'ใบเสนอราคา'}
                  onPageInsert={() => onPageInsert()}
                  onRowSelected={(docNo) => onRowSelected(docNo)}
                />
              ) : (
                <Form callInitialize={initialize} mode={mode} name={'ใบเสนอราคา'} maxDocNo={maxDocNo} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotation;
