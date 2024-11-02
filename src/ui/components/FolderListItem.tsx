import {Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import React from "react";

interface FolderProps
{
  key: number | undefined,
  name: string,
  onClick: () => void
}

export default function FolderListItem({name, onClick}: FolderProps)
{
  return (
    <ListItem>
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