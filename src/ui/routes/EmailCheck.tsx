import {Box, Container, Typography} from "@mui/material";
import React from "react";

export default function EmailCheck()
{
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
          Email Check
        </Typography>
      </Box>
    </Container>
  );
}