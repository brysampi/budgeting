export function successMsg(message, data) {
    return { status: 'success', message: message, data: data, boolean: true };
}
export function errorMsg(message) {
    return { status: 'error', message: message, boolean: false };
}
export function refreshPage() {
    window.location.reload();
}