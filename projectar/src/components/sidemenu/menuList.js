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
    value: "projects",
    icon: "fa-suitcase",
    children: [
      { label: "Assigned", value: "assigned-projects" },
      { label: "Managed", value: "managed-projects" },
      { label: "All", value: "all-projects" },
    ],
  },
  { label: "Reports", value: "reports", icon: "fa-book" },
  { divider: true, label: "Others", value: "Others" },
  { label: "Configuration", value: "configuration", icon: "fa-cogs" },
];

export default items;
