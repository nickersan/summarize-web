import {Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import FeedIcon from "@mui/icons-material/Feed";
import React, {DragEventHandler} from "react";

interface SummaryListItemProps
{
  key: number | undefined,
  name: string,
  draggable?: boolean | undefined,
  onDragStart?: DragEventHandler,
  onDragEnd?: DragEventHandler
}

export default function SummaryListItem({name, draggable, onDragStart, onDragEnd}: SummaryListItemProps)
{
  return (
    <ListItem draggable={draggable} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <ListItemButton>
        <ListItemAvatar>
          <Avatar>
            <FeedIcon/>
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={name}/>
      </ListItemButton>
    </ListItem>
  );
}