// export const DOMAIN_URL = "http://localhost:8000/";
// export const DOMAIN_URL = "https://610amigo.azurewebsites.net/";
const PROD_URL = import.meta.env['BASE_URL'];
const DEV_URL = "http://localhost:8000/";
export const DOMAIN_URL =  PROD_URL ? PROD_URL : DEV_URL
// export const DOMAIN_URL = "https://192.168.147.30:3001/";
// export const DOMAIN_URL = "https://192.168.0.103:3001/";

export const API_ROUTES = {
  LOG_NEW_USER: "Wassup",
  TOTAL_WAIT_TIME: "totalWaitTime"
};
