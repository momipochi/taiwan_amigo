import { baseFetch } from "../../../shared/api/baseFetchApi/baseFetchApi";
import { API_ROUTES } from "../../../shared/constants/links/links";

const LAST_ACCESS = "lastAccessed";

export const recordNewUser = async () => {
  const data = localStorage.getItem(LAST_ACCESS);
  const date = new Date();
  const today = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
  if(data === today){
    return  
  }
  localStorage.setItem(LAST_ACCESS,today)
  try {
    const response = await baseFetch(API_ROUTES.LOG_NEW_USER, "PUT");
    if (response?.status !== 200) {
      throw new Error("Record new user error");
    }
  } catch (error) {
    console.error(error);
  }
};
