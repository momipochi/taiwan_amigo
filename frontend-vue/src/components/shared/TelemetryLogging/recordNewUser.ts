import { baseFetch } from "../../../shared/api/baseFetchApi/baseFetchApi";
import { API_ROUTES } from "../../../shared/constants/links/links";

export const recordNewUser = async () => {
  try {
    const response = await baseFetch(API_ROUTES.LOG_NEW_USER, "PUT");
    if (response?.status !== 200) {
      throw new Error("Record new user error");
    }
  } catch (error) {
    console.error(error);
  }
};
