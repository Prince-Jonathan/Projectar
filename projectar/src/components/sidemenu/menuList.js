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
    children: [
      { label: "Assigned", value: "assigned-projects" },
      { label: "Managed", value: "managed-projects" },
      { label: "All", value: "all-projects" },
    ],
  },
  {
    label: "Tasks",
    value: "all-tasks",
    icon: "fa-suitcase",
    children: [
      { label: "Outstanding", value: "outstanding-tasks" },
      { label: "Completed", value: "completed-tasks" },
      { label: "All", value: "all-tasks" },
    ],
  },
  { label: "Reports", value: "reports", icon: "fa-book" },
  { divider: true, label: "Others", value: "Others" },
  { label: "Configuration", value: "configuration", icon: "fa-cogs" },
];

export default items;
