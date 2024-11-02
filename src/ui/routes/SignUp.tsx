import React from "react";
import {Box, Button, Container, TextField, Typography} from "@mui/material";
import {Api} from "../../Api";

interface SignUpProps
{  
  onSignUp: () => void
}

interface SignUpForm
{
  email: string;
  firstName: string;
  lastName: string;
}

export default function SignUp({onSignUp}: SignUpProps)
{
  const signUp = async (signUpForm: SignUpForm): Promise<any> =>
  {
    const requestOptions =
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(signUpForm)
      };

    const response = await fetch(Api.url() + "/v1/auth/sign-up", requestOptions);
    return response.ok ? Promise.resolve() : Promise.reject(response);
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target) as unknown as Iterable<[SignUpForm, FormDataEntryValue]>;
    signUp(Object.fromEntries(formData)).then(onSignUp).catch(reason => window.alert(reason));
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
          <TextField margin="normal" required fullWidth id="firstName" label="First Name" name="firstName"/>
          <TextField margin="normal" required fullWidth id="lastName" label="Last Name" name="lastName"/>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>OK</Button>
        </Box>
      </Box>
    </Container>
  );
}