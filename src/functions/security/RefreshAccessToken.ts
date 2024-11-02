import {Api} from "../../Api";

export const refreshAccessToken = async (refreshToken: string): Promise<string> =>
{
  const requestOptions =
  {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: refreshToken })
  };

  return fetch(Api.url() + "/v1/auth/refresh", requestOptions)
    .then(response => response.ok ? response.json().then(json => json.accessToken) : Promise.reject(response?.status));
}