import { UserPoolClient } from "../services";

export const mockUserPoolClient: jest.Mocked<UserPoolClient> = {
  config: {
    Id: "test",
  },
  createAppClient: jest.fn(),
  getUserByUsername: jest.fn(),
  listUsers: jest.fn(),
  saveUser: jest.fn(),
  listGroups: jest.fn(),
  saveGroup: jest.fn(),
};
