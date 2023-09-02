import { DOMAIN_URL } from "../../constants/links/links";

type HTTP_METHODS = "GET" | "POST" | "PUT" | "DELETE";

export const baseFetch = async (
  endpoint: string,
  method: HTTP_METHODS,
) => {
  try {
    const response = await fetch(`${DOMAIN_URL}${endpoint}`, {
      method: method,
      headers:{
        "Content-Type":"application/json"
      }
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const baseFetchWithData = async (
  endpoint: string,
  method: HTTP_METHODS,
  data: any
) => {
  console.log('my data',data)
  if(!data){
    return
  }
  try {
    const response = await fetch(`${DOMAIN_URL}${endpoint}`, {
      method: method,
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error(error);
  }
};