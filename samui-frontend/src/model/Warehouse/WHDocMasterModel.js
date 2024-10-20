import moment from 'moment';

import {
    formatThaiDateUi,
    getCreateDateTime
} from '../../utils/DateUtils';

export const whDocMasterModel = () => {
    return {
        whDocId: null,
        whDocNo: null,
        whDocType: null,
        whDocCustId: null,
        whDocCustCode: null,
        whDocCustName: null,
        whDocDate: formatThaiDateUi(moment()),
        whDocTransDate: formatThaiDateUi(moment()),
        whDocCreatedDate: getCreateDateTime(),
        whDocCreatedBy: window.localStorage.getItem('name'),
        whDocStatus: null,
        whDocSeq: null,
        whDocRemark: null,
        whDocCompId: window.localStorage.getItem('company'),
        whDocShowFront: null
    };
};