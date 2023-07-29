import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import TicketIcon from "@heroicons/react/24/solid/TicketIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import DocumentIcon from "@heroicons/react/24/solid/DocumentIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";

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
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Posts",
    path: "/posts",
    icon: (
      <SvgIcon fontSize="small">
        <DocumentIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Comments",
    path: "/comments",
    icon: (
      <SvgIcon fontSize="small">
        <PencilIcon />
      </SvgIcon>
    ),
  },
];
