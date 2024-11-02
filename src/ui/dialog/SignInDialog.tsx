import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import React from "react";

interface SignInDialogProps
{
  open: boolean
  onSignIn: () => void
  onCancel: () => void
}

export default function SignInDialog({open, onSignIn, onCancel}: SignInDialogProps)
{
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Sign-In</DialogTitle>
      <DialogContent>
        <DialogContentText>Please enter your email to sign-in.</DialogContentText>
        <TextField id="email" label="Email" name="email" autoComplete="email" autoFocus required fullWidth margin="dense"/>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit">Sign-In</Button>
      </DialogActions>
    </Dialog>
  );
}