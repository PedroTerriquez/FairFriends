import axios from 'axios';

export function createPayment(data) {
    return axios.post(`${process.env.EXPO_PUBLIC_API}/payments/`, data);
}

export function updatePayment(paymentId, data) {
    return axios.patch(`${process.env.EXPO_PUBLIC_API}/payments/${paymentId}`, data);
}