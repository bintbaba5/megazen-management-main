// import { cookies } from "next/headers";

import { getUserToken } from "./getUserToken";

export async function sendRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: unknown
) {
  const url = `${endpoint}`;
  // // const cookieStore = await cookies();
  // // const token = cookieStore.get("authjs.csrf-token")?.value; // Replace "userToken" with your cookie name
  // const cookies = document.cookie.split("; ");
  // const tokenCookie = cookies.find((row) =>
  //   row.startsWith("authjs.csrf-token")
  // );
  // const token = tokenCookie ? tokenCookie.split("=")[1] : null;

  const token = await getUserToken();

  if (!token) {
    // redirect("/api/auth/signin");

    throw new Error("User token not found");
  }

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (data) {
    if (method === "GET") {
      throw new Error("GET request does not support body data");
    }

    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.body = JSON.stringify(data);
      options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
      };
    }
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    if (response.status === 401) {
      // Return status code so the calling function can handle navigation
      return { status: response.status };
    }
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Handle empty response
  const text = await response.text();
  if (!text) {
    return {};
  }

  return JSON.parse(text);
}
