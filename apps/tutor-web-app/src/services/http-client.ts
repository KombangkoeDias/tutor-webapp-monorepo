import axios from "axios";

export const JWT_TOKEN_KEY = "JWTToken";

let axiosClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://api.jobtutordream.com/api/v1",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage?.getItem(JWT_TOKEN_KEY); // Get token from storage (or cookies)
    if (token) {
      if (needAuthorizationHeader(config.url ?? "")) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function needAuthorizationHeader(url: string) {
  if (url.includes("r2.cloudflarestorage.com")) {
    return false;
  }
  return true;
}

export default axiosClient;
