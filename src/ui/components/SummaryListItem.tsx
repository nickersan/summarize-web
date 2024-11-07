import {Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import FeedIcon from "@mui/icons-material/Feed";
import React from "react";

interface SummaryListItemProps
{
  key: number | undefined,
  name: string
}

export default function SummaryListItem({name}: SummaryListItemProps)
{
  return (
    <ListItem>
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