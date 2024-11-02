import {Box, Container, Typography} from "@mui/material";
import React from "react";
import {useParams} from "react-router-dom";
import {User} from "../../domain";
import {Api} from "../../Api";

interface EmailVerifyProps
{
  onEmailVerified: (user: User, accessToken: string, refreshToken: string) => void
}

interface UserAndTokens
{
  user: User;
  accessToken: string;
  refreshToken: string;
}

export default function EmailVerify({onEmailVerified}: EmailVerifyProps)
{
  let { emailVerifyToken } = useParams();

  const doEmailVerified = (userAndTokens: UserAndTokens) =>
  {
    onEmailVerified(userAndTokens.user, userAndTokens.accessToken, userAndTokens.refreshToken);
  }

  const requestOptions =
  {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ token: emailVerifyToken })
  };

  fetch(Api.url() + "/v1/auth/email-verify", requestOptions)
    .then(response => response.ok ? response.json().then(doEmailVerified) : Promise.reject(response));

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
          Email Verify - {emailVerifyToken}
        </Typography>
      </Box>
    </Container>
  );
}