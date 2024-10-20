import Axios from 'axios';
import React, { useState, useEffect } from 'react';

// Components
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

import { getAlert, formatCurrency } from '../../utils/SamuiUtils';

function Home() {
  const [countPurchase, setCountPurchase] = useState(0);
  const [countWarehouse, setCountWarehouse] = useState(0);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      // นับจำนวนธุรกรรมของ Purchase ทั้งหมด
      const countPurchase = await Axios.post(`${process.env.REACT_APP_API_URL}/api/count-purchase`,
        {
          comp_id: window.localStorage.getItem('company')
        }, {
        headers: {
          key: process.env.REACT_APP_ANALYTICS_KEY
        }
      });
      setCountPurchase(countPurchase.data[0].Count);

      // นับจำนวนธุรกรรมของ Warehouse ทั้งหมด
      const countWarehouse = await Axios.post(`${process.env.REACT_APP_API_URL}/api/count-warehouse`,
        {
          comp_id: window.localStorage.getItem('company')
        }, {
        headers: {
          key: process.env.REACT_APP_ANALYTICS_KEY
        }
      });
      setCountWarehouse(countWarehouse.data[0].Count);
    } catch (error) {
      getAlert('FAILED', error.message);
    }
  };

  return (
    <div className="Home">
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="container">
            <div className="page-inner">
              <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                <div className="page-header d-flex justify-content-between align-items-center">
                  <Breadcrumbs page={"Dashboard"} items={[]} />
                </div>
              </div>
              <div className="row">
                {/* Card 1 */}
                <div className="col-sm-6 col-md-3" style={{ cursor: 'pointer' }} onClick={() => window.location.replace('/purchase')}>
                  <div className="card card-stats card-round">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-icon">
                          <div
                            className="icon-big text-center icon-primary bubble-shadow-small"
                            style={{ backgroundColor: 'orange' }}
                          >
                            <i className="fas fa-shopping-cart" />
                          </div>
                        </div>
                        <div className="col col-stats ms-3 ms-sm-0">
                          <div className="numbers">
                            <p className="card-category">จัดซื้อสินค้า</p>
                            <h4 className="card-title">{formatCurrency(countPurchase).split('.')[0]} รายการ</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="col-sm-6 col-md-3" style={{ cursor: 'pointer' }} onClick={() => window.location.replace('/warehouse')}>
                  <div className="card card-stats card-round">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-icon">
                          <div
                            className="icon-big text-center icon-primary bubble-shadow-small"
                            style={{ backgroundColor: 'orange' }}
                          >
                            <i className="fas fa-building" />
                          </div>
                        </div>
                        <div className="col col-stats ms-3 ms-sm-0">
                          <div className="numbers">
                            <p className="card-category">คลังสินค้า</p>
                            <h4 className="card-title">{formatCurrency(countWarehouse).split('.')[0]} รายการ</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="col-sm-6 col-md-3" style={{ cursor: 'pointer' }} onClick={() => window.location.replace('/sellproducts')}>
                  <div className="card card-stats card-round">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-icon">
                          <div
                            className="icon-big text-center icon-primary bubble-shadow-small"
                            style={{ backgroundColor: 'orange' }}
                          >
                            <i className="fas fa-tags" />
                          </div>
                        </div>
                        <div className="col col-stats ms-3 ms-sm-0">
                          <div className="numbers">
                            <p className="card-category">ขายสินค้า</p>
                            <h4 className="card-title">0 รายการ</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Card 4 */}
                {/* <div className="col-sm-6 col-md-3">
                  <div className="card card-stats card-round">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-icon">
                          <div
                            className="icon-big text-center icon-primary bubble-shadow-small"
                            style={{ backgroundColor: 'orange' }}
                          >
                            <i className="fas fa-luggage-cart" />
                          </div>
                        </div>
                        <div className="col col-stats ms-3 ms-sm-0">
                          <div className="numbers">
                            <p className="card-category">xxx</p>
                            <h4 className="card-title">1,345</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;