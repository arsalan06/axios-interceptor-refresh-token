import axios from "axios";

const refreshToeken = async () => {
  const response = await axios.post(
    "http://localhost:5000/api/user/refreshToken",
    {
      user: JSON.parse(localStorage.getItem("user")),
    }
  );
  return response;
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("user")).token;
    console.log({ token });
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        const response = await refreshToeken();

        try {
          if (response?.data) {
            localStorage.setItem("user", JSON.stringify(response.data));
          }

          return axiosInstance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
  }
);

axiosInstance.interceptors.response.use();

export default axiosInstance;
