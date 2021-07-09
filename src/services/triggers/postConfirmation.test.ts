import { Lambda } from "../lambda";
import { UserPoolClient } from "../userPoolClient";
import { PostConfirmation, PostConfirmationTrigger } from "./postConfirmation";
import { CognitoClient } from "../cognitoClient";
import { mockUserPoolClient } from "../../server/config.test";

describe("PostConfirmation trigger", () => {
  let mockLambda: jest.Mocked<Lambda>;
  let mockCognitoClient: jest.Mocked<CognitoClient>;
  let postConfirmation: PostConfirmationTrigger;

  beforeEach(() => {
    mockLambda = {
      enabled: jest.fn(),
      invoke: jest.fn(),
    };
    mockCognitoClient = {
      getUserPool: jest.fn().mockResolvedValue(mockUserPoolClient),
      getUserPoolForClientId: jest.fn().mockResolvedValue(mockUserPoolClient),
    };
    postConfirmation = PostConfirmation({
      lambda: mockLambda,
      cognitoClient: mockCognitoClient,
    });
  });

  describe.each([
    "PostConfirmation_ConfirmSignUp",
    "PostConfirmation_ConfirmForgotPassword",
  ])("%s", (source) => {
    describe("when lambda invoke fails", () => {
      it("quietly completes", async () => {
        mockLambda.invoke.mockRejectedValue(
          new Error("Something bad happened")
        );

        await postConfirmation({
          userPoolId: "userPoolId",
          clientId: "clientId",
          username: "username",
          userAttributes: [],
          source: source as any,
        });
      });
    });

    describe("when lambda invoke succeeds", () => {
      it("quietly completes", async () => {
        mockLambda.invoke.mockResolvedValue({});

        await postConfirmation({
          userPoolId: "userPoolId",
          clientId: "clientId",
          username: "example@example.com",
          userAttributes: [{ Name: "email", Value: "example@example.com" }],
          source: source as any,
        });

        expect(mockLambda.invoke).toHaveBeenCalledWith("PostConfirmation", {
          clientId: "clientId",
          triggerSource: source,
          userAttributes: { email: "example@example.com" },
          userPoolId: "userPoolId",
          username: "example@example.com",
        });
      });
    });
  });
});
