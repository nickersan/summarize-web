import {Breadcrumbs, Button, Link, List, Stack} from "@mui/material";
import React, {DragEventHandler, useContext, useEffect, useState} from "react";
import {ErrorContext} from "../context/ErrorContext";
import {Folder, Summary} from "../../domain";
import NewFolderDialog from "../dialog/NewFolderDialog";
import NewSummaryDialog from "../dialog/NewSummaryDialog";
import {FolderApi, SummaryApi} from "../../functions/api";
import FolderListItem from "./FolderListItem";
import SummaryListItem from "./SummaryListItem";
import {useSearchParams} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

interface SummariesProps
{
  folderApi: () => FolderApi
  summaryApi: () => SummaryApi
}

export default function Summaries({folderApi, summaryApi}: SummariesProps)
{
  enum DialogType { None, NewFolder , NewSummary }

  const TypePrefixFolder = "folder/";
  const TypePrefixSummary = "summary/";

  const [searchParams, setSearchParams] = useSearchParams();
  const {setError} = useContext(ErrorContext);
  const [folder, setFolder] = useState<Folder>();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderStack, setFolderStack] = useState<Folder[]>([]);
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
    if (folderId)
    {
      searchParams.set("folderId", folderId.toString());
    }
    else
    {
      searchParams.delete("folderId");
      folderLoaded(undefined);
    }

    setSearchParams(searchParams);
  }

  const parentFolder = () =>
  {
    setFolderId(folder?.parentId)
  }

  const openFolder = (folder: Folder)=>
  {
    setFolderId(folder.id)
  }

  const folderLoaded = (folder: Folder | undefined) =>
  {
    setFolder(folder);

    if (folder) refreshFolderStack([], folder);
    else setFolderStack([]);
  }

  const refreshFolderStack = (folderStack: Folder[], folder: Folder) =>
  {
    folderStack = [folder, ...folderStack];

    if (folder.parentId)
    {
      folderApi().get(folder.parentId)
        .then(parentFolder => refreshFolderStack(folderStack, parentFolder))
        .catch(reason => loadFailed("parent folder", reason));
    }
    else
    {
      setFolderStack(folderStack);
    }
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
    summaryApi().create(file, folder?.id)
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

  const isDragTypeSupported = (dataTransfer: DataTransfer): boolean =>
  {
    return dataTransfer.types.find(type => type.startsWith(TypePrefixFolder) || type.startsWith(TypePrefixSummary)) != undefined;
  }

  const folderType = (folder: Folder)=>
  {
    return TypePrefixFolder + folder.id;
  }

  const summaryType = (summary: Summary)=>
  {
    return TypePrefixSummary + summary.id;
  }

  const findType = (dataTransfer: DataTransfer, typePrefix: string): string | undefined =>
  {
    return dataTransfer.types.find(type => type.startsWith(typePrefix));
  }

  const dragStart = (type: string, data: any): DragEventHandler => (event) =>
  {
    event.dataTransfer.setData(type, JSON.stringify(data));
  }

  const dragOverFolder = (folder: Folder): DragEventHandler => (event) =>
  {

    if (!isDragTypeSupported(event.dataTransfer) || !isDragType(event.dataTransfer, folderType(folder))) event.preventDefault();
  }

  const drop = (dropFolder: Folder): DragEventHandler => (event) =>
  {
    const folderType = findType(event.dataTransfer, TypePrefixFolder);
    if (folderType)
    {
      const dragFolder = JSON.parse(event.dataTransfer.getData(folderType));
      dragFolder.parentId = dropFolder.id;
      folderApi().update(dragFolder).catch(reason => updateFailed("folder", reason));
      loadFolders();
    }

    const summaryType = findType(event.dataTransfer, TypePrefixSummary);
    if (summaryType)
    {
      const dragSummary = JSON.parse(event.dataTransfer.getData(summaryType));
      dragSummary.folderId = dropFolder.id;
      summaryApi().update(dragSummary).catch(reason => updateFailed("summary", reason));
      loadSummaries();
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

  const loadFolder = () =>
  {
    const folderId = getFolderId();
    if (folderId) folderApi().get(folderId).then(folderLoaded).catch(reason => loadFailed("folder", reason))
  }

  const loadFolders = () =>
  {
    folderApi().getAll(getFolderId()).then(setFolders).catch(reason => loadFailed("folders", reason));
  }

  const loadSummaries = () =>
  {
    summaryApi().getAll(getFolderId()).then(setSummaries).catch(reason => loadFailed("summaries", reason));
  }

  useEffect(loadFolder, [searchParams]);
  useEffect(loadFolders, [searchParams]);
  useEffect(loadSummaries, [searchParams]);

  return (
    <div>
      <Breadcrumbs sx={{ marginLeft: "5px"}}>
        <Link key="0" sx={{ display: "flex", alignItems: "center" }} color="inherit" href="/">
          <HomeIcon fontSize="inherit" />
        </Link>
        {
          folderStack.map(
            (folder) =>
            (
              <Link key={folder.id} underline="hover" color="inherit" href={"/?folderId=" + folder.id}>{folder.name}</Link>
            )
          )
        }
      </Breadcrumbs>
      <Stack spacing={2} direction="row">
        <Button variant="text" onClick={() => setDialog(DialogType.NewFolder)}>New Folder</Button>
        <Button variant="text" onClick={() => setDialog(DialogType.NewSummary)}>New Summary</Button>
      </Stack>
      <List sx={{width: "100%", maxWidth: 360, bgcolor: "background.paper"}}>
        <FolderListItem key={0} name="..." onClick={parentFolder}/>
        {
          folders.map(
            (folder) =>
            (
              <FolderListItem
                key={folder.id}
                name={folder.name}
                draggable={true}
                onClick={() => openFolder(folder)}
                onDragStart={dragStart(folderType(folder), folder)}
                onDragOver={dragOverFolder(folder)}
                onDragEnd={loadFolders}
                onDrop={drop(folder)}
              />
            )
          )
        }
        {
          summaries.map(
            (summary) =>
            (
              <SummaryListItem
                key={summary.id}
                name={summary.name}
                draggable={true}
                onDragStart={dragStart(summaryType(summary), summary)}
                onDragEnd={loadSummaries}
              />
            )
          )
        }
      </List>
      <NewFolderDialog open={dialog == DialogType.NewFolder} onNewFolder={newFolder} onCancel={hideDialog}/>
      <NewSummaryDialog open={dialog == DialogType.NewSummary} onNewSummary={newSummary} onCancel={hideDialog}/>
    </div>
  )
}