import {User} from "../../domain";
import {Api} from "../../Api";

export interface UserApi
{
  currentUser(): Promise<User | undefined>;
}

export const userApi = (accessTokenSupplier: () => string | undefined): UserApi =>
{
  const url = (): string =>
  {
    return Api.url() + "/v1/user";
  }

  return new class implements UserApi
  {
    async currentUser(): Promise<User | undefined>
    {
      const accessToken = accessTokenSupplier();
      //TODO: should this reject?
      if (!accessToken) return Promise.resolve(undefined);

      const requestOptions =
      {
        method: "GET",
        headers: { "Accept": "application/json", "Authorization": "Bearer " + accessToken }
      };

      return fetch(url(), requestOptions)
        .then(response => response.ok ? response.json() : Promise.reject(response.statusText));
    }
  }
}