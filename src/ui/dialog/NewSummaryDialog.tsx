import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React, {useState} from "react";
import FileField from "../components/FileField";

interface NewSummaryDialogProps
{
  open: boolean
  onNewSummary: (file: File) => void
  onCancel: () => void
}

export default function NewSummaryDialog({open, onNewSummary, onCancel}: NewSummaryDialogProps)
{
  const [file, setFile] = useState<File>();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={
        {
          component: "form",
          style: { minWidth: "500px" },
          onSubmit: (event: React.FormEvent<HTMLFormElement>) =>
          {
            event.preventDefault();
            if (file) onNewSummary(file!);
          }
        }
      }
    >
      <DialogTitle>New Summary</DialogTitle>
      <DialogContent>
        <DialogContentText>Please upload a recording file.</DialogContentText>
        <FileField id="file" onChange={setFile}/>
      </DialogContent>
      <DialogActions>
        <Button type="submit">OK</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}