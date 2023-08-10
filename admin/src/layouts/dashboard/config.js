import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import TicketIcon from "@heroicons/react/24/solid/TicketIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import MegaphoneIcon from "@heroicons/react/24/solid/MegaphoneIcon";
import ChatBubbleBottomCenterIcon from "@heroicons/react/24/solid/ChatBubbleBottomCenterIcon";

import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Dashboard",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Events",
    path: "/events",
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
    title: "Notice",
    path: "/notice",
    icon: (
      <SvgIcon fontSize="small">
        <MegaphoneIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Community",
    path: "/community",
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
