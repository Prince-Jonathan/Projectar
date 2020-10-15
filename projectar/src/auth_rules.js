const rules = {
  // super_admin can manage all aspects of the application
  super_admin: { static: [], dynamic: {} },

  // project_admin can manage all projects and tasks
  project_admin: { static: ["tasks:list", "tasks:add","tasks:edit","tasks:delete",], dynamic: {} },

  // viewer can view all projects and tasks (Read only)
  viewer: { static: [], dynamic: {} },

  // user can only access projects where he is a manager ,consultant or team member
  user: { static: ["tasks:add"], dynamic: {
    "tasks:edit": ({ userId, taskCreatorId }) => {
      if (!userId || !taskCreatorId) return false;
      return userId === taskCreatorId;
    },
    "tasks:execute": ({ userId, assignedPersonnel }) => {
      if (!userId || !assignedPersonnel.length) return false;
      return taskOwnerId.includes(userId);
    },},



  visitor: {
    static: ["posts:list", "home-page:visit"],
  },
  writer: {
    static: [
      "posts:list",
      "posts:create",
      "users:getSelf",
      "home-page:visit",
      "dashboard-page:visit",
    ],
    dynamic: {
      "posts:edit": ({ userId, postOwnerId }) => {
        if (!userId || !postOwnerId) return false;
        return userId === postOwnerId;
      },
    },
  },
  admin: {
    static: [
      "posts:list",
      "posts:create",
      "posts:edit",
      "posts:delete",
      "users:get",
      "users:getSelf",
      "home-page:visit",
      "dashboard-page:visit",
    ],
  },
};

export default rules;
