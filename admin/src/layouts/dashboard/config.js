import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import TicketIcon from "@heroicons/react/24/solid/TicketIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import ChatBubbleBottomCenterIcon from "@heroicons/react/24/solid/ChatBubbleBottomCenterIcon";

import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Events",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <TicketIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Users",
    path: "/users",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Posts",
    path: "/posts",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Comments",
    path: "/comments",
    icon: (
      <SvgIcon fontSize="small">
        <ChatBubbleBottomCenterIcon />
      </SvgIcon>
    ),
  },
];
