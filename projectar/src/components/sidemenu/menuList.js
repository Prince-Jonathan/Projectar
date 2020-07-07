const items = [
  { label: "Quick Add", value: "add", icon: "fa-plus-circle " },
  { divider: true, label: "Main navigation", value: "main-nav" },
  {
    label: "Workspace",
    value: "workspace",
    icon: "fa-home",
  },
  {
    label: "Projects",
    value: "projects",
    icon: "fa-suitcase",
    children: [
      { label: "Add", value: "add/project" },
      { label: "Assigned", value: "assigned" },
      { label: "Managed", value: "managed" },
      { label: "All", value: "all/projects" },
    ],
  },
  { label: "Reports", value: "reports", icon: "fa-book" },
  { divider: true, label: "Others", value: "Others" },
  { label: "Configuration", value: "configuration", icon: "fa-cogs" },
  { label: "Quick Add", value: "add", icon: "fa-plus-circle " },
  { divider: true, label: "Main navigation", value: "main-nav" },
  {
    label: "Workspace",
    value: "workspace",
    icon: "fa-home",
    children: [
      {
        label: "Add Role",
        value: "addrole",
        icon: "fa-snapchat",
        children: [
          { label: "item 1.1.1", value: "item1.1.1", icon: "fa-anchor" },
          { label: "item 1.1.2", value: "item1.1.2", icon: "fa-bar-chart" },
        ],
      },
      { label: "Add Person", value: "addperson" },
    ],
  },
  {
    label: "Projects",
    value: "projects",
    icon: "fa-suitcase",
    children: [
      {
        label: "item 2.1",
        value: "item2.1",
        children: [
          { label: "item 2.1.1", value: "item2.1.1" },
          { label: "item 2.1.2", value: "item2.1.2" },
        ],
      },
      { label: "item 2.2", value: "item2.2" },
    ],
  },
  { label: "Reports", value: "reports", icon: "fa-book" },
  { divider: true, label: "Others", value: "Others" },
  { label: "Configuration", value: "configuration", icon: "fa-cogs" },
];

export default items;