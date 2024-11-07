import React from 'react';
import {Button, Stack, Typography} from "@mui/material";
import {User} from "../../domain";
import {useNavigate} from "react-router-dom";
import {Path} from "../../Path";
import Summaries from "../components/Summaries";
import {FolderApi} from "../../functions/api/FolderApi";
import {SummaryApi} from "../../functions/api/SummaryApi";

export interface MainProps {
  user?: User
  folderApi: () => FolderApi
  summaryApi: () => SummaryApi
  onSignOut: () => void
}

export default function Main({folderApi, summaryApi, user, onSignOut}: MainProps)
{
  const navigate = useNavigate();

  const signOut = () =>
  {
    onSignOut();
    navigate(Path.Main);
  }

  return (
    <div className='main'>
      {
        user ?
        (
          <Stack spacing={2} direction="column">
            <Typography variant="h2">{user.firstName + " " + user.lastName}</Typography>
            <Button variant="text" onClick={signOut}>Sign-Out</Button>
            <Summaries folderApi={folderApi} summaryApi={summaryApi}/>
          </Stack>
        ) :
        (
          <Stack spacing={2} direction="row">
            <Button variant="text" onClick={() => navigate(Path.SignIn)}>Sign-In</Button>
            <Button variant="text" onClick={() => navigate(Path.SignUp)}>Sign-Up</Button>
          </Stack>
        )
      }
    </div>
  );
}