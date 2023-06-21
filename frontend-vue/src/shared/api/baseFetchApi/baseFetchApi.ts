import { DOMAIN_URL } from "../../constants/links/links";

type HTTP_METHODS = "GET" | "POST" | "PUT" | "DELETE";

export const baseFetch = async (endpoint: string, method: HTTP_METHODS) => {
  try {
    const response = await fetch(`${DOMAIN_URL}${endpoint}`, {
      method: method,
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};
