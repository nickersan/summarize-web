import {Dispatch, SetStateAction, useEffect, useState} from "react";

function getStorageValue<T>(key: string, defaultValue: T)
{
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved!) : defaultValue;
}

export const useLocalStorage = <T = undefined>(key: string, defaultValue: T | undefined): [T | undefined, Dispatch<SetStateAction<T | undefined>>] =>
{
  const [value, setValue] = useState<T | undefined>(() => getStorageValue(key, defaultValue));

  useEffect(
    () =>
    {
      if (value) localStorage.setItem(key, JSON.stringify(value));
      else localStorage.removeItem(key);
    },
    [key, value]
  );

  return [value, setValue];
};