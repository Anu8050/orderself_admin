
import { toast } from 'react-toastify';

export const showToast = (message, statusType = 'success') => {
    switch (statusType) {
        case 'success':
            toast.success(message, {
                position: toast.POSITION.TOP_RIGHT
            }); 
            break;
        case 'error':
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT
            }); 
        break;
        case 'warn':
            toast.warn(message, {
                position: toast.POSITION.TOP_RIGHT
            }); 
            break;        
        default:
            break;
    }
}
