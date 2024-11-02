import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import React from "react";

interface NewFolderDialogProps
{
  open: boolean
  onNewFolder: (name: string) => void
  onCancel: () => void
}

export default function NewFolderDialog({open, onNewFolder, onCancel}: NewFolderDialogProps)
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
            onNewFolder(formJson.name);
          }
        }
      }
    >
      <DialogTitle>New Folder</DialogTitle>
      <DialogContent>
        <DialogContentText>Please enter the name of the new folder.</DialogContentText>
        <TextField id="name" label="Name" name="name" autoComplete="name" autoFocus required fullWidth margin="dense"/>
      </DialogContent>
      <DialogActions>
        <Button type="submit">OK</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}