import {Button, List, Stack} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {ErrorContext} from "../context/ErrorContext";
import {Folder, Summary} from "../../domain";
import NewFolderDialog from "../dialog/NewFolderDialog";
import NewSummaryDialog from "../dialog/NewSummaryDialog";
import {FolderApi, SummaryApi} from "../../functions/api";
import FolderListItem from "./FolderListItem";
import SummaryListItem from "./SummaryListItem";

interface SummariesProps
{
  folderApi: () => FolderApi
  summaryApi: () => SummaryApi
}

export default function Summaries({folderApi, summaryApi}: SummariesProps)
{
  enum DialogType { None, NewFolder , NewSummary}

  const {setError} = useContext(ErrorContext);
  const [folderStack, setFolderStack] = useState<Folder[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [dialog, setDialog] = useState<DialogType>(DialogType.None);

  const hideDialog = () => setDialog(DialogType.None);

  const currentFolder = (): Folder | undefined =>
  {
    return folderStack.length > 0 ? folderStack[folderStack.length - 1] : undefined;
  }

  const previousFolder = () =>
  {
    folderStack.pop();
    openFolder(folderStack.pop())
  }

  const newFolder = (name: string) =>
  {
    hideDialog();
    folderApi().newFolder(name, currentFolder())
      .then(folder => setFolders([...folders, folder]))
      .catch(reason => newFailed("folder", reason));
  }

  const newSummary = (file: File) =>
  {
    hideDialog();
    summaryApi().newSummary(file, currentFolder())
      .then(summary => setSummaries([...summaries, summary]))
      .catch(reason => newFailed("summary", reason));
  }

  const newFailed = (name: string, reason: any) =>
  {
    console.error(`New ${name} failed: [${reason.status}] - ${reason.statusText}`);
    setError(`Failed to create new ${name}, please try again.`);
  }

  const openFolder = (folder: Folder | undefined)=>
  {
    if (folder) setFolderStack([...folderStack, folder]);
    folderApi().all(folder).then(setFolders).catch(openFolderFailed);
  }

  const openFolderFailed = (reason: any) =>
  {
    console.error("Open folder failed: [" + reason.status + "] - " + reason.statusText);
    setError("Failed to open folder, please try again.");
  }

  const loadFailed = (name: string, reason: any) =>
  {
      console.error(`Load ${name} failed: [${reason.status}] - ${reason.statusText}`);
      setError(`Failed to load ${name}, please refresh to try again.`);
  }

  useEffect(() => { folderApi().all().then(setFolders).catch(reason => loadFailed("folders", reason)) }, []);
  useEffect(() => { summaryApi().all().then(setSummaries).catch(reason => loadFailed("summaries", reason)) }, []);

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
        {
          summaries.map((summary) => (<SummaryListItem key={summary.id} name={summary.name}/>))
        }
      </List>
      <NewFolderDialog open={dialog == DialogType.NewFolder} onNewFolder={newFolder} onCancel={hideDialog}/>
      <NewSummaryDialog open={dialog == DialogType.NewSummary} onNewSummary={newSummary} onCancel={hideDialog}/>
    </div>
  )
}