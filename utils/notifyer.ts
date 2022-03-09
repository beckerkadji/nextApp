import {toast} from "react-toastify";

interface INotifyer {
    status : notifyerStatus,
    message : string
}

export enum notifyerStatus {
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
    ERROR = "error",
    DEFAULT = "default"
}

const toastConfig : any = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}

export const notifyer = ({status, message} : INotifyer) : void => {
    switch (status) {
        case notifyerStatus.DEFAULT:
            toast(message, toastConfig);
            break;
        case notifyerStatus.ERROR:
            toast.error(message, toastConfig);
            break;
        case notifyerStatus.WARNING:
            toast.warn(message, toastConfig);
            break;
        case notifyerStatus.SUCCESS:
            toast.success(message, toastConfig);
            break;
        case notifyerStatus.INFO:
            toast.info(message, toastConfig);
            break;
    }
}