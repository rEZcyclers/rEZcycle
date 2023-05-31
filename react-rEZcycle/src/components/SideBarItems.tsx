import {
  Diversity1,
  EventAvailable,
  History,
  Home,
  Dashboard,
} from "@mui/icons-material";

export const SideBarItems = [
  {
    name: "home",
    icon: <Home />,
    link: "/",
  },
  {
    name: "profile",
    icon: <Dashboard />,
    link: "/profile",
  },
  {
    name: "history",
    icon: <History />,
    link: "/history",
  },
  {
    name: "friends",
    icon: <Diversity1 />,
    link: "/friends",
  },
  {
    name: "calendar",
    icon: <EventAvailable />,
    link: "/calendar",
  },
];
