import { Services } from "../services";

interface Input {
  UserPoolId: string;
  Limit?: number; // TODO: limit number of returned users
  PaginationToken?: string; // TODO: support pagination
}

export interface DynamoDBGroupRecord {
  Name: string;
  Description?: string;
  Precedence?: number;
  RoleArn?: string;
}

interface Output {
  PaginationToken?: string;
  Groups: readonly DynamoDBGroupRecord[];
}

export type ListGroupsTarget = (body: Input) => Promise<Output>;

export const ListGroups = ({
  cognitoClient,
}: Services): ListGroupsTarget => async (body) => {
  const userPool = await cognitoClient.getUserPool(body.UserPoolId);
  const groups = await userPool.listGroups();

  return {
    Groups: groups.map((group) => ({
      Name: group.Name,
      Description: group.Description,
      Precedence: group.Precedence,
      RoleArn: group.RoleArn,
    })),
  };
};
