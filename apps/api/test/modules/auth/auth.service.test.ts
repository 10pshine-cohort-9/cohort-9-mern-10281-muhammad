import { expect } from "chai";
import sinon from "sinon";
import mongoose from "mongoose";

import AuthService from "../../../src/modules/auth/auth.service.js";
import UserRepository from "../../../src/modules/user/user.repository.js";
import {
  compareRefreshToken,
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
  verifyRefreshToken,
} from "../../../src/utils/jwt.js";

describe("AuthService", () => {
  let service: AuthService;
  let repository: sinon.SinonStubbedInstance<UserRepository>;

  let res: any;
  let user: any;

  beforeEach(() => {
    repository = {
      create: sinon.stub(),
      findByUsername: sinon.stub(),
      findByEmail: sinon.stub(),
      findByUsernameOrEmail: sinon.stub(),
      findByUsernameOrEmailWithPassword: sinon.stub(),
      findById: sinon.stub(),
    } as sinon.SinonStubbedInstance<UserRepository>;

    service = new AuthService(repository as unknown as UserRepository);

    res = {
      cookie: sinon.stub(),
      clearCookie: sinon.stub(),
    };

    user = {
      _id: {
        toString: () => "user-id",
      },
      username: "hanzla",
      email: "hanzla@example.com",
      password: "hashed-password",
      refreshToken: null,
      save: sinon.stub().resolves(),
      comparePassword: sinon.stub(),
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("register", () => {
    it("should register a new user and issue tokens", async () => {
      repository.findByUsernameOrEmail.resolves(null);
      repository.create.resolves(user);

      sinon.stub(createAccessToken as any);
      sinon.stub(createRefreshToken as any);
      sinon.stub(hashRefreshToken as any);
    });

    it("should throw ConflictError when username or email already exists", async () => {
      repository.findByUsernameOrEmail.resolves(user);

      try {
        await service.register(
          res,
          "hanzla",
          "hanzla@example.com",
          "password123",
        );

        expect.fail("Expected register to throw");
      } catch (error: any) {
        expect(error.message).to.equal("Username or email already exists.");
      }

      expect(repository.create.called).to.equal(false);
    });

    it("should propagate repository errors", async () => {
      const error = new Error("Database error");

      repository.findByUsernameOrEmail.rejects(error);

      try {
        await service.register(
          res,
          "hanzla",
          "hanzla@example.com",
          "password123",
        );

        expect.fail("Expected register to throw");
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      repository.findByUsernameOrEmailWithPassword.resolves(user);
      user.comparePassword.resolves(true);

      const result = await service.login(res, "hanzla", "password123");

      expect(result.user).to.equal(user);
      expect(result.accessToken).to.be.a("string");
      expect(
        repository.findByUsernameOrEmailWithPassword.calledOnceWith("hanzla"),
      ).to.equal(true);
      expect(user.comparePassword.calledOnceWith("password123")).to.equal(true);
      expect(res.cookie.calledOnce).to.equal(true);
      expect(user.save.calledOnce).to.equal(true);
    });

    it("should throw UnauthorizedError when user does not exist", async () => {
      repository.findByUsernameOrEmailWithPassword.resolves(null);

      try {
        await service.login(res, "unknown", "password123");

        expect.fail("Expected login to throw");
      } catch (error: any) {
        expect(error.message).to.equal("Invalid credentials");
      }

      expect(user.comparePassword.called).to.equal(false);
    });

    it("should throw UnauthorizedError when password is invalid", async () => {
      repository.findByUsernameOrEmailWithPassword.resolves(user);
      user.comparePassword.resolves(false);

      try {
        await service.login(res, "hanzla", "wrong-password");

        expect.fail("Expected login to throw");
      } catch (error: any) {
        expect(error.message).to.equal("Invalid credentials");
      }

      expect(user.comparePassword.calledOnceWith("wrong-password")).to.equal(
        true,
      );
      expect(user.save.called).to.equal(false);
    });
  });

  describe("logout", () => {
    it("should clear refresh token and cookie", async () => {
      await service.logout(res, user);

      expect(user.refreshToken).to.equal(null);
      expect(user.save.calledOnce).to.equal(true);
      expect(res.clearCookie.calledOnce).to.equal(true);
      expect(res.clearCookie.firstCall.args[0]).to.equal("refreshToken");
    });

    it("should propagate save errors", async () => {
      const error = new Error("Database error");

      user.save.rejects(error);

      try {
        await service.logout(res, user);

        expect.fail("Expected logout to throw");
      } catch (err) {
        expect(err).to.equal(error);
      }

      expect(res.clearCookie.called).to.equal(false);
    });
  });

  describe("refresh", () => {
    it("should throw when refresh token is missing", async () => {
      try {
        await service.refresh(res, "");

        expect.fail("Expected refresh to throw");
      } catch (error: any) {
        expect(error.message).to.equal("Refresh token not found");
      }

      expect(repository.findById.called).to.equal(false);
    });

    it("should throw when refresh token is invalid", async () => {
      sinon
        .stub({ verifyRefreshToken }, "verifyRefreshToken")
        .throws(new Error("Invalid token"));

      try {
        await service.refresh(res, "invalid-token");

        expect.fail("Expected refresh to throw");
      } catch (error: any) {
        expect(error.message).to.equal("Invalid token");
      }
    });

    it("should throw when user does not exist", async () => {
      const userId = new mongoose.Types.ObjectId();
      const refreshToken = createRefreshToken(userId.toString());

      repository.findById.resolves(null);

      try {
        await service.refresh(res, refreshToken);

        expect.fail("Expected refresh to throw");
      } catch (error: any) {
        expect(error.message).to.equal("Invalid refresh token");
      }

      expect(repository.findById.calledOnce).to.equal(true);
    });
  });
});
