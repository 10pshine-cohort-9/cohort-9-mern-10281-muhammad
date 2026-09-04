import { expect } from "chai";
import sinon from "sinon";

import AuthController from "../../../src/modules/auth/auth.controller.js";
import { sendResponse } from "../../../src/utils/send-response.js";

describe("AuthController", () => {
  let controller: AuthController;
  let service: {
    register: sinon.SinonStub;
    login: sinon.SinonStub;
    logout: sinon.SinonStub;
    refresh: sinon.SinonStub;
  };

  let req: any;
  let res: any;

  const user = {
    _id: "user-id",
    username: "hanzla",
    email: "hanzla@example.com",
  };

  beforeEach(() => {
    service = {
      register: sinon.stub(),
      login: sinon.stub(),
      logout: sinon.stub(),
      refresh: sinon.stub(),
    };

    controller = new AuthController(service as any);

    req = {
      body: {},
      cookies: {},
      user,
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("register", () => {
    it("should register the user successfully", async () => {
      req.body = {
        username: "hanzla",
        email: "hanzla@example.com",
        password: "password123",
      };

      service.register.resolves({
        accessToken: "access-token",
        user,
      });

      await controller.register(req, res);

      expect(
        service.register.calledOnceWith(
          res,
          "hanzla",
          "hanzla@example.com",
          "password123",
        ),
      ).to.equal(true);
    });
  });

  describe("login", () => {
    it("should login the user successfully", async () => {
      req.body = {
        usernameOrEmail: "hanzla",
        password: "password123",
      };

      service.login.resolves({
        accessToken: "access-token",
        user,
      });

      await controller.login(req, res);

      expect(
        service.login.calledOnceWith(res, "hanzla", "password123"),
      ).to.equal(true);
    });
  });

  describe("logout", () => {
    it("should logout the authenticated user", async () => {
      service.logout.resolves();

      await controller.logout(req, res);

      expect(service.logout.calledOnceWith(res, user)).to.equal(true);
    });
  });

  describe("me", () => {
    it("should return the authenticated user", () => {
      controller.me(req, res);

      expect(res.status.calledOnceWith(200)).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);

      const response = res.json.firstCall.args[0];

      expect(response.data).to.deep.equal({
        user: {
          id: "user-id",
          username: "hanzla",
          email: "hanzla@example.com",
        },
      });
    });
  });

  describe("refresh", () => {
    it("should refresh the access token", async () => {
      req.cookies.refreshToken = "refresh-token";

      service.refresh.resolves({
        accessToken: "new-access-token",
        user,
      });

      await controller.refresh(req, res);

      expect(service.refresh.calledOnceWith(res, "refresh-token")).to.equal(
        true,
      );
    });
  });
});
