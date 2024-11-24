import {Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import React, {DragEventHandler} from "react";

interface FolderListItemProps
{
  key: number | undefined,
  name: string,
  draggable?: boolean | undefined,
  onClick: () => void,
  onDragStart?: DragEventHandler,
  onDragOver?: DragEventHandler,
  onDragEnd?: DragEventHandler,
  onDrop?: DragEventHandler
}

export default function FolderListItem({name, draggable, onClick, onDragStart, onDragOver, onDragEnd, onDrop}: FolderListItemProps)
{
  return (
    <ListItem
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
    >
      <ListItemButton onClick={(event) => { event.preventDefault(); onClick(); } }>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon/>
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={name}/>
      </ListItemButton>
    </ListItem>
  );
}