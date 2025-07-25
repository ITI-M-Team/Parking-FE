import axios from 'axios';


const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});
// export default instance


// src/api/axios.js
// src/api/axios.js
// import axios from "axios";

// إنشاء instance من axios
const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// دالة للحصول على التوكنات
const getTokens = () => {
  const tokensStr =
    localStorage.getItem("authTokens") || sessionStorage.getItem("authTokens");
  return tokensStr ? JSON.parse(tokensStr) : null;
};

// دالة لحفظ التوكنات
const saveTokens = (tokens) => {
  const storage = localStorage.getItem("authTokens") ? localStorage : sessionStorage;
  storage.setItem("authTokens", JSON.stringify(tokens));
};

// دالة لحذف التوكنات
const clearTokens = () => {
  localStorage.removeItem("authTokens");
  sessionStorage.removeItem("authTokens");
};

// متغيرات للتحكم في عملية التجديد
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 🔁 Interceptor للطلبات: بيشيّك قبل أي طلب لو التوكن منتهي ويجدده
API.interceptors.request.use(
  async (config) => {
    const tokens = getTokens();

    if (!tokens?.access) return config;

    const payload = JSON.parse(atob(tokens.access.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired && tokens.refresh) {
      // إذا كان هناك عملية تجديد جارية بالفعل، انتظر حتى تنتهي
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          config.headers["Authorization"] = `Bearer ${token}`;
          return config;
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;
      config._retry = true; // وضع علامة على الطلب الأصلي لإعادة المحاولة

      try {
        const response = await axios.post("http://localhost:8000/api/token/refresh/", {
          refresh: tokens.refresh,
        });

        const newAccess = response.data.access;
        const newTokens = { ...tokens, access: newAccess };
        saveTokens(newTokens);

        config.headers["Authorization"] = `Bearer ${newAccess}`;
        processQueue(null, newAccess); // حل الطلبات المعلقة
        return config;
      } catch (error) {
        console.error("Error refreshing token in request interceptor:", error);
        clearTokens();
        processQueue(error, null); // رفض الطلبات المعلقة
        window.location.href = "/login"; // إعادة توجيه للـ login فقط عند فشل التجديد
        return Promise.reject(error); // رفض الطلب الأصلي
      } finally {
        isRefreshing = false;
      }
    } else {
      config.headers["Authorization"] = `Bearer ${tokens.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Interceptor للرد لو حصل 401 فجأة، بيحاول يعيد الطلب بعد تجديد التوكن
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // إذا كان الخطأ 401 والطلب لم يتم إعادة محاولته من قبل
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/token/refresh/") // تجنب التكرار اللانهائي
    ) {
      // إذا كان هناك عملية تجديد جارية بالفعل، انتظر حتى تنتهي
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return API(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      const tokens = getTokens();
      if (!tokens?.refresh) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post("http://localhost:8000/api/token/refresh/", {
          refresh: tokens.refresh,
        });

        const { access } = response.data;
        const newTokens = { ...tokens, access };
        saveTokens(newTokens);

        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        processQueue(null, access); // حل الطلبات المعلقة
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token in response interceptor:", refreshError);
        clearTokens();
        processQueue(refreshError, null); // رفض الطلبات المعلقة
        window.location.href = "/login"; // إعادة توجيه للـ login فقط عند فشل التجديد
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
