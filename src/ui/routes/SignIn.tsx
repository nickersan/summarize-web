import React, {useContext} from 'react';
import {Box, Button, Container, TextField, Typography} from "@mui/material";
import {Api} from "../../Api";
import {ErrorContext} from "../context/ErrorContext";

interface SignInProps
{
  onSignIn: () => void
}

interface SignInForm
{
  email: string;
}

export default function SignIn({onSignIn}: SignInProps)
{
  const {setError} = useContext(ErrorContext);

  const signIn = async (signInForm: SignInForm): Promise<any> =>
  {
    const requestOptions =
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(signInForm)
      };

    const response = await fetch(Api.url() + "/v1/auth/sign-in", requestOptions);
    return response.ok ? Promise.resolve() : Promise.reject(response);
  }

  const signInFailed = (reason: any) =>
  {
    console.error("Sign-in failed: [" + reason.status + "] - " + reason.statusText);
    setError("Sign-in failed, please try again.");
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target) as unknown as Iterable<[SignInForm, FormDataEntryValue]>;
    signIn(Object.fromEntries(formData)).then(onSignIn).catch(signInFailed);
  };
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="email" label="Email" name="email" autoComplete="email" autoFocus/>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>OK</Button>
        </Box>
      </Box>
    </Container>
  );
}