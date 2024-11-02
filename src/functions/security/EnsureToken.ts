import {jwtDecode} from "jwt-decode";
import {secondsToMillis, utc} from "../util/DateTime";

const expiryBufferSeconds = 5;

export const ensureToken = (token: string | undefined): boolean =>
{
  if (!token) return false;

  const jwt = jwtDecode(token);
  if (!jwt.exp) return false;

  const expiry = secondsToMillis(jwt.exp - expiryBufferSeconds)
  const currentUtc = utc();

  return expiry > currentUtc;
}