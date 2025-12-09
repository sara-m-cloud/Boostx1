// utils/roleMap.js

export const roleMap = {
  Admin: {
    model: "Admin",
    fields: ["adminTransaction"],
  },

  Client: {
    model: "Client",
    fields: ["nationalId", "nationality", "savedPosts"],
  },

  Vendor: {
    model: "Vendor",
    fields: [
      "totalProjects",
      "type",             // freelancer OR agency OR vendor
      "rate",
      "noOfRestricted",
      "skills",
      "totalBalance",
    ],
  },

  Employee: {
    model: "Employee",
    fields: ["rate", "completedTasks", "field"],
  },

  TeamLeader: {
    model: "TeamLeader",
    fields: ["log"],
  },
};
