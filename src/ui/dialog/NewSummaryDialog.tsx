import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import React from "react";

interface NewSummaryDialogProps
{
  open: boolean
  onNewSummary: (name: string) => void
  onCancel: () => void
}

export default function NewSummaryDialog({open, onNewSummary, onCancel}: NewSummaryDialogProps)
{
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={
        {
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) =>
          {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            onNewSummary(formJson.name);
          }
        }
      }
    >
      <DialogTitle>New Summary</DialogTitle>
      <DialogContent>
        <DialogContentText>Please enter the name of the new folder and select a recording.</DialogContentText>
        <TextField id="name" label="Name" name="name" autoComplete="name" autoFocus required fullWidth margin="dense"/>
      </DialogContent>
      <DialogActions>
        <Button type="submit">OK</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}