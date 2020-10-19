const items = [
  { label: "Quick Add", value: "add", icon: "fa-plus-circle " },
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
        extras: "allOutstanding",
      },
      {
        label: "Completed",
        value: "project/all/completed-tasks",
        extras: "allCompleted",
      },
      { label: "All", value: "project/all/tasks" },
    ],
  },
  { label: "Reports", value: "reports", icon: "fa-book" },
  { divider: true, label: "Others", value: "Others" },
  { label: "Configuration", value: "configuration", icon: "fa-cogs" },
];

export default items;
