import Datetime from 'react-datetime';
import moment from 'moment';

const DateFilterTable = ({ startDate, endDate, setStartDate, setEndDate, selectedDateType, setSelectedDateType, handleSearch }) => {
    return (
        <div className='row  justify-content-center'>
            <div className="col-3 d-flex justify-content-center">
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedDateType}
                        onChange={(e) => setSelectedDateType(e.target.value)}
                        style={{ maxWidth: '150px' }}
                    >
                        <option value="1">วันที่เอกสาร</option>
                        <option value="2">วันที่ Due Date</option>
                    </select>
            </div>
            <div className="col-4 d-flex align-items-center" style={{ marginLeft: '-80px' }} >
                <label className='text-black text-center 'style={{ marginLeft: '33px' }} >วันที่ : </label>
                <Datetime
                    className="input-spacing-input-date"
                    value={startDate || null}
                    dateFormat="DD-MM-YYYY"
                    timeFormat={false}
                    onChange={(date) => {
                        setStartDate(moment(date).format("DD-MM-YYYY"));
                    }}
                />
            </div>
            <div className="col-4 d-flex align-items-center" style={{ marginLeft: '-13px' }}>
                <label className='text-black'style={{ marginLeft: '13px' }}>ถึง :</label>
                <Datetime
                    className="input-spacing-input-date"
                    value={endDate || null}
                    dateFormat="DD-MM-YYYY"
                    timeFormat={false}
                    onChange={(date) => {
                        setEndDate(moment(date).format("DD-MM-YYYY"));
                    }}
                />
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    aria-label="Search"
                    onClick={handleSearch}
                >
                    <i className="fas fa-search" />
                </button>
            </div>
            <div className='col-1'></div>
        </div>
    );
};

export default DateFilterTable;