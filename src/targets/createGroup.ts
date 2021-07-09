import { Services } from "../services";
import { Group } from "../services/userPoolClient";

interface Input {
  UserPoolId: string;
  Name: string;
  Description?: string;
  Precedence?: number;
  RoleArn?: string;
}

export type CreateGroupTarget = (body: Input) => Promise<Group | null>;

export const CreateGroup = ({
  cognitoClient,
}: Services): CreateGroupTarget => async (body) => {
  const { UserPoolId, Name, Description, Precedence, RoleArn } = body || {};
  const userPool = await cognitoClient.getUserPool(UserPoolId);
  const group: Group = {
    Name,
    Description,
    Precedence,
    RoleArn,
  };
  await userPool.saveGroup(group);
  return group;
};
