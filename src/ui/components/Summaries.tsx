import {Button, List, Stack} from "@mui/material";
import React, {useEffect, useState} from "react";
import NewFolderDialog from "../dialog/NewFolderDialog";
import {FolderApi} from "../../functions/api/FolderApi";
import {Folder} from "../../domain";
import FolderListItem from "./FolderListItem";
import NewSummaryDialog from "../dialog/NewSummaryDialog";

interface SummariesProps
{
  folderApi: () => FolderApi
}

export default function Summaries({folderApi}: SummariesProps)
{
  enum DialogType { None, NewFolder , NewSummary}

  const [folderStack, setFolderStack] = useState<Folder[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [dialog, setDialog] = useState<DialogType>(DialogType.None);

  const hideDialog = () => setDialog(DialogType.None);

  const newFolder = (name: string) =>
  {
    hideDialog();
    folderApi().newFolder(name, folderStack.length > 0 ? folderStack[folderStack.length - 1] : undefined)
      .then(folder => setFolders([...folders, folder]))
      .catch(e => console.log(e));
  }

  const openFolder = (folder: Folder | undefined)=>
  {
    if (folder) setFolderStack([...folderStack, folder]);
    folderApi().all(folder).then(setFolders).catch(e => console.log(e));
  }

  const previousFolder = () =>
  {
    folderStack.pop();
    openFolder(folderStack.pop())
  }

  const newSummary = () =>
  {

  }

  // TODO: handle errors

  useEffect(() => { folderApi().all().then(setFolders).catch(e => console.log(e)) }, []);

  return (
    <div className='folders'>
      <Stack spacing={2} direction="row">
        <Button variant="text" onClick={() => setDialog(DialogType.NewFolder)}>New Folder</Button>
        <Button variant="text" onClick={() => setDialog(DialogType.NewSummary)}>New Summary</Button>
      </Stack>
      <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
        <FolderListItem key={0} name="..." onClick={previousFolder}/>
        {
          folders.map((folder) => (<FolderListItem key={folder.id} name={folder.name} onClick={() => openFolder(folder)}/>))
        }
      </List>
      <NewFolderDialog open={dialog == DialogType.NewFolder} onNewFolder={newFolder} onCancel={hideDialog}/>
      <NewSummaryDialog open={dialog == DialogType.NewSummary} onNewSummary={newSummary} onCancel={hideDialog}/>
    </div>
  )
}