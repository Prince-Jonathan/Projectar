import React from "react";
export default [
  {
    title: "Dashboard",
    iconClassName: "fa fa-dashboard",
    icon: "",
    to: "/simple-side-menu",
  },
  {
    title: "Group",
    isCollapsible: true,
    icon: "group",
    subItems: [
      {
        title: "New group",
        icon: "group_add",
        to: "/simple-side-menu/group/new",
      },
      {
        title: "New person",
        icon: "person_add",
        to: "/simple-side-menu/group/person/new",
      },
    ],
  },
  {
    title: "Notifications",
    icon: "notifications",

    subItems: [
      {
        title: "Active",
        icon: "notifications_active",
        to: "/simple-side-menu/notifications/active",
      },
      {
        title: "Off",
        icon: "notifications_off",
        to: "/simple-side-menu/notifications/off",
      },
    ],
  },
  {
    title: "Settings",
    isCollapsible: true,
    iconClassName: "ion-gear-b",
    subItems: [
      {
        title: "Profile",
        icon: "person",
        to: "/simple-side-menu/settings/profile",
      },
      {
        title: "Applications",
        icon: <i className="material-icons">apps</i>,
        to: "/simple-side-menu/settings/apps",
      },
    ],
  },
  {
    title: "Sign out",
    icon: <i className="ion-log-out" />,
    to: "/simple-side-menu/sign-out",
  },
];
