import axios from "axios";
import Constants from 'expo-constants';
const API = Constants.expoConfig.extra.EXPO_PUBLIC_API;
import { toast } from "./toastService";
import { getSession } from "./sessionGlobalSingleton";
import i18n from '../app/i18n';

const instance = axios.create({
    baseURL: API,
    timeout: 10000,
});

// Add interceptor to inject session headers
instance.interceptors.request.use(
  config => {
    const session = getSession();
    if (session && session.headers) {
      config.headers = {
        ...config.headers,
        ...session.headers,
      };
    }
    config.headers['Accept-Language'] = i18n.language;
    return config;
  },
  error => Promise.reject(error)
);

export async function apiCall(promise) {
  try {
    const response = await Promise.resolve(promise);
    return response;
  } catch (error) {
    if (error.message === "Network Error") {
      //toast("Server unavailable. Please try again later.", "error");
    } else {
      toast(error.response?.data?.errors || "An error occurred", "error");
    }
    return null;
  }
}



// Balances
export const getBalances = () =>
  apiCall(instance.get("/balances"));

export const getBalanceDetail = (id) =>
  apiCall(instance.get(`/balances/${id}`));

export const getBalanceInfo = (id) =>
  apiCall(instance.get(`/balances/${id}/info`));

export const createBalance = (members, name) =>
  apiCall(instance.post("/balances/", { members, name }));

export const createGroup = createBalance;

// Promises
export const getPromises = () =>
  apiCall(instance.get("/promises"));

export const getPromiseDetail = (id) =>
  apiCall(instance.get(`/promises/${id}`));

export const createPromise = (data) =>
  apiCall(instance.post("/promises", data));

export const updatePromise = (id, data) =>
  apiCall(instance.patch(`/promises/${id}`, data));

// Payments
export const createPayment = (data) =>
  apiCall(instance.post("/payments/", data));

export const updatePayment = (id, data) =>
  apiCall(instance.patch(`/payments/${id}`, data));

export const acceptPayment = (id) =>
  apiCall(instance.patch(`/payments/${id}/accept`, { status: 'accepted' }));

export const rejectPayment = (id) =>
  apiCall(instance.patch(`/payments/${id}/reject`, { status: 'rejected' }));

// Users & Auth
export const getProfile = (id) =>
  apiCall(instance.get(`/user/${id || ''}`));

export const login = (email, password) =>
  apiCall(instance.post("/login", { email, password }));

export const signup = (first_name, last_name, email, password, password_confirmation) =>
  apiCall(instance.post("/users", { first_name, last_name, email, password, password_confirmation }));

// Friendships
export const findFriends = (search) =>
  apiCall(instance.post("/friendships/find", { search }));

export const addFriend = (recipient_user_id) =>
  apiCall(instance.post("/friendships", { recipient_user_id }));

export const cancelFriendshipRequest = (friendship_id) =>
  apiCall(instance.post(`/friendships/${friendship_id}/cancel`, {}));

export const rejectFriendshipRequest = (friendship_id) =>
  apiCall(instance.post(`/friendships/${friendship_id}/reject`, {}));

export const acceptFriendshipRequest = (friendship_id) =>
  apiCall(instance.post(`/friendships/${friendship_id}/accept`, {}));

// Notifications
export const getNotifications = () =>
  apiCall(instance.get("/notifications"));

export const patchNotification = (id, status) =>
  apiCall(instance.patch(`/notifications/${id}`, { status }));

// Contacts
export const getContactRequests = () =>
  apiCall(instance.get("/friendships/requests"));

export const findPeople = (search) =>
  apiCall(instance.post("/user/find", { search }));

// Home
export const getHome = () =>
  apiCall(instance.get("/home"));

// Split Promises
export const getSplitPromises = (payment_id) =>
  apiCall(instance.get(`/split_promises/${payment_id}`));
