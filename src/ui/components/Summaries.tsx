import {Button, List, Stack} from "@mui/material";
import React, {DragEventHandler, useContext, useEffect, useState} from "react";
import {ErrorContext} from "../context/ErrorContext";
import {Folder, Summary} from "../../domain";
import NewFolderDialog from "../dialog/NewFolderDialog";
import NewSummaryDialog from "../dialog/NewSummaryDialog";
import {FolderApi, SummaryApi} from "../../functions/api";
import FolderListItem from "./FolderListItem";
import SummaryListItem from "./SummaryListItem";
import {useSearchParams} from "react-router-dom";

interface SummariesProps
{
  folderApi: () => FolderApi
  summaryApi: () => SummaryApi
}

export default function Summaries({folderApi, summaryApi}: SummariesProps)
{
  enum DialogType { None, NewFolder , NewSummary}

  const [searchParams, setSearchParams] = useSearchParams();
  const {setError} = useContext(ErrorContext);
  const [folder, setFolder] = useState<Folder>();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [dialog, setDialog] = useState<DialogType>(DialogType.None);

  const hideDialog = () => setDialog(DialogType.None);

  const getFolderId = (): number | undefined =>
  {
    const folderId = searchParams.get("folderId");
    return folderId ? +folderId : undefined;
  }

  const setFolderId = (folderId: number | undefined)=>
  {
    if (folderId) searchParams.set("folderId", folderId.toString());
    else searchParams.delete("folderId");

    setSearchParams(searchParams);
  }

  const previousFolder = () =>
  {
    setFolderId(folder?.parentId)
  }

  const openFolder = (folder: Folder)=>
  {
    setFolderId(folder.id)
  }

  const newFolder = (name: string) =>
  {
    hideDialog();
    folderApi().create(name, folder?.id)
      .then(folder => setFolders([...folders, folder]))
      .catch(reason => newFailed("folder", reason));
  }

  const newSummary = (file: File) =>
  {
    hideDialog();
    summaryApi().create(file, folderId)
      .then(summary => setSummaries([...summaries, summary]))
      .catch(reason => newFailed("summary", reason));
  }

  const newFailed = (name: string, reason: any) =>
  {
    console.error(`New ${name} failed: [${reason.status}] - ${reason.statusText}`);
    setError(`Failed to create new ${name}, please try again.`);
  }

  const isDragType= (dataTransfer: DataTransfer, dragType: string) =>
  {
    return dataTransfer.types.find(type => type === dragType) !== undefined;
  }

  const folderType = (folder: Folder)=>
  {
    return "folder/" + folder.id;
  }

  const findFolderType = (dataTransfer: DataTransfer): string | undefined =>
  {
    return dataTransfer.types.find(type => type.startsWith("folder/"));
  }

  const dragStartFolder = (dragFolder: Folder): DragEventHandler => (event) =>
  {
    event.dataTransfer.setData(folderType(dragFolder), JSON.stringify(dragFolder));
  }

  const dragOverFolder = (dropFolder: Folder): DragEventHandler => (event) =>
  {
    if (!isDragType(event.dataTransfer, folderType(dropFolder))) event.preventDefault();
  }

  const dragEndFolder = (dragFolder: Folder): DragEventHandler => (event) =>
  {
    // refresh folders
  }

  const dropFolder = (dropFolder: Folder): DragEventHandler => (event) =>
  {
    const folderType = findFolderType(event.dataTransfer);
    if (folderType)
    {
      const dragFolder = JSON.parse(event.dataTransfer.getData(folderType));
      // this should be dealt with in the drag end refresh.
      //setFolders(folders.filter(folder => folder.id !== dragFolder.id));
      dragFolder.parentId = dropFolder.id;
      folderApi().update(dragFolder).catch(reason => updateFailed("folder", reason));
    }
  }

  const loadFailed = (name: string, reason: any) =>
  {
      console.error(`Load ${name} failed: [${reason}]`);
      setError(`Failed to load ${name}, please refresh to try again.`);
  }

  const updateFailed = (name: string, reason: any) =>
  {
    console.error(`Update ${name} failed: [${reason}]`);
    setError(`Failed to update ${name}, please refresh to try again.`);
  }

  const folderId = getFolderId();

  useEffect(() => { if (folderId) folderApi().get(folderId).then(setFolder).catch(reason => loadFailed("folder", reason)) }, [searchParams]);
  useEffect(() => { folderApi().getAll(getFolderId()).then(setFolders).catch(reason => loadFailed("folders", reason)) }, [searchParams]);
  useEffect(() => { summaryApi().getAll(getFolderId()).then(setSummaries).catch(reason => loadFailed("summaries", reason)) }, [searchParams]);

  return (
    <div className='folders'>
      <Stack spacing={2} direction="row">
        <Button variant="text" onClick={() => setDialog(DialogType.NewFolder)}>New Folder</Button>
        <Button variant="text" onClick={() => setDialog(DialogType.NewSummary)}>New Summary</Button>
      </Stack>
      <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
        <FolderListItem key={0} name="..." onClick={previousFolder}/>
        {
          folders.map(
            (folder) =>
              (
                <FolderListItem
                  key={folder.id}
                  name={folder.name}
                  draggable={true}
                  onClick={() => openFolder(folder)}
                  onDragStart={dragStartFolder(folder)}
                  onDragOver={dragOverFolder(folder)}
                  onDragEnd={dragEndFolder(folder)}
                  onDrop={dropFolder(folder)}
                />
              )
          )
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