const rules = {
  // super_admin can manage all aspects of the application
  super_admin: {
    static: [
      "tasks:list",
      "tasks:add",
      "tasks:edit",
      "tasks:delete",
      "attendance:view",
      "announcement:send",
    ],
    dynamic: {},
  },

  // project_admin can manage all projects and tasks
  project_admin: {
    static: [
      "tasks:lists",
      "tasks:add",
      "tasks:edit",
      "tasks:delete",
      "attendance:view",
      "announcement:send",
    ],
    dynamic: {},
  },

  // viewer can view all projects and tasks (Read only)
  viewer: { static: ["tasks:lists"], dynamic: {} },

  // user can only access projects where he is a manager ,consultant or team member
  user: {
    static: ["tasks:add", "tasks:list", "attendance:view"],
    dynamic: {
      "tasks:add": ({ userID, pmcID }) => {
        if (!userID || !pmcID.length) return false;
        return pmcID.includes(parseInt(userID));
      },
      "tasks:edit": ({ userID, taskCreatorID }) => {
        if (!userID || !taskCreatorID) return false;
        return parseInt(userID) === parseInt(taskCreatorID);
      },
      "tasks:execute": ({ userID, pmcID = [] }) => {
        if (!userID || !pmcID.length) return false;
        return pmcID.includes(parseInt(userID));
      },
    },
    "tasks:re-assign": ({ userID, taskCreatorID }) => {
      if (!userID || !taskCreatorID) return false;
      return parseInt(userID) === parseInt(taskCreatorID);
    },
    "tasks:delete": ({ userID, taskCreatorID }) => {
      if (!userID || !taskCreatorID) return false;
      return parseInt(userID) === parseInt(taskCreatorID);
    },
  },
};

export default rules;
