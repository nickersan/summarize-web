import React, {useEffect, useState} from 'react';
import './App.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import Main from "./ui/routes/Main";
import SignUp from "./ui/routes/SignUp";
import SignIn from "./ui/routes/SignIn";
import {User} from "./domain";
import {Path} from "./Path";
import EmailCheck from "./ui/routes/EmailCheck";
import EmailVerify from "./ui/routes/EmailVerify";
import {useLocalStorage} from "./hooks/UseLocalStorage";
import {ensureAuthentication} from "./functions/security/EnsureAuthentication";
import {folderApi} from "./functions/api/FolderApi";
import {summaryApi} from "./functions/api/SummaryApi";
import {Alert} from "@mui/material";
import {ErrorContext} from "./ui/context/ErrorContext";

export default function App()
{
  const [refreshToken, setRefreshToken] = useLocalStorage<string>("refreshToken", undefined);
  const [accessToken, setAccessToken] = useState<string>();
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string | undefined>(undefined)

  const navigate = useNavigate();

  const onAuthenticated = (user: User, accessToken: string, refreshToken: string) =>
  {
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    navigate(Path.Main);
  }

  const onSignOut = () =>
  {
    setUser(undefined);
    setAccessToken(undefined);
    setRefreshToken(undefined);
  }

  const onAuthenticationFailed = (reason: any) =>
  {
    console.error("Authentication failed: " + reason);
    setRefreshToken(undefined);
  }

  // TODO: log error
  useEffect(() => { ensureAuthentication(refreshToken, accessToken, setAccessToken, setUser).catch(onAuthenticationFailed) });

  return (
    <ErrorContext.Provider value={{error: error, setError: setError}}>
      <div>
        { error && <Alert severity="error"  onClose={() => setError(undefined)}>{error}</Alert> }
        <Routes>
          <Route
            path='/'
            element=
            {
              <Main
                user={user}
                folderApi={() => folderApi(() => accessToken)}
                summaryApi={() => summaryApi(() => accessToken)}
                onSignOut={onSignOut}
              />
            }
          />
          <Route path={'/' + Path.EmailCheck} element={<EmailCheck/>}/>
          <Route path={'/' + Path.EmailVerify} element={<EmailVerify onEmailVerified={onAuthenticated}/>}/>
          <Route path={'/' + Path.SignIn} element={<SignIn onSignIn={() => navigate(Path.EmailCheck)}/>}/>
          <Route path={'/' + Path.SignUp} element={<SignUp onSignUp={() => navigate(Path.EmailCheck)}/>}/>
        </Routes>
      </div>
    </ErrorContext.Provider>
  );
}