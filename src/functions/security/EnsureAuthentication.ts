import {User} from "../../domain";
import {ensureToken} from "./EnsureToken";
import {refreshAccessToken} from "./RefreshAccessToken";
import {userApi} from "../api/UserApi";

const onAccessToken = (accessTokenSetter: (accessToken: string) => void) => (accessToken: string): Promise<string> =>
{
  accessTokenSetter(accessToken);
  return Promise.resolve(accessToken);
}

const getUser = (accessToken: string): Promise<User | undefined> =>
{
  return userApi(() => accessToken).currentUser();
}

export const ensureAuthentication = (
  refreshToken: string | undefined,
  accessToken: string | undefined,
  accessTokenSetter: (accessToken: string | undefined) => void,
  userSetter: (user: User | undefined) => void
): Promise<void> =>
{
  if (ensureToken(refreshToken))
  {
    if (!ensureToken(accessToken))
    {
      return refreshAccessToken(refreshToken!)
        .then(onAccessToken(accessTokenSetter))
        .then(getUser)
        .then(user => userSetter(user))
        //TODO: log error
        .catch(_ => { accessTokenSetter(undefined); userSetter(undefined); });
    }
  }

  return Promise.resolve();
}