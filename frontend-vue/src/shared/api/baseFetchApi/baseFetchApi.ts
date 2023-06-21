import { BASE_LINK } from "../../constants/links/links";

type HTTP_METHODS = "GET" | "POST" | "PUT" | "DELETE";

export const baseFetch = async (endpoint: string, method: HTTP_METHODS) => {
  try {
    const response = await fetch(`${BASE_LINK}${endpoint}`, {
      method: method,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
