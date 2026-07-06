import { getAllUsers, createAgent, updateUserStatus } from "./userService";

export const getAllAgents = async () => {
  const users = await getAllUsers();
  return users.filter((u) => u.role === "AGENT");
};

export const createAgentAccount = async (agentData) => {
  return await createAgent(agentData);
};

export const updateAgentActiveStatus = async (userId, active) => {
  return await updateUserStatus(userId, active);
};
