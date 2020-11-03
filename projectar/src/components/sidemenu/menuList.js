const items = [
  {
    label: "Add Task",
    value: "",
    icon: "fa-plus-circle ",
    extras: { addTask: true },
  },
  { divider: true, label: "Main navigation", value: "main-nav" },
  {
    label: "Workspace",
    value: "",
    icon: "fa-home",
  },
  {
    label: "Projects",
    value: "all-projects",
    icon: "fa-suitcase",
  },
  {
    label: "Tasks",
    value: "all-tasks",
    icon: "fa-suitcase",
    children: [
      {
        label: "Outstanding",
        value: "project/all/outstanding-tasks",
        extras: { taskStatus: "allOutstanding" },
      },
      {
        label: "Completed",
        value: "project/all/completed-tasks",
        extras: { taskStatus: "allCompleted" },
      },
      { label: "All", value: "project/all/tasks" },
    ],
  },
  { label: "Reports", value: "reports", icon: "fa-book" },
  { divider: true, label: "Others", value: "Others" },
  {
    label: "Configuration",
    value: "configuration",
    icon: "fa-cogs",
    children: [
      {
        label: "Announcements",
        value: "config/announcement",
      },
    ],
  },
];

export default items;
