import { expect } from "chai";
import sinon from "sinon";

import UserRepository from "../../../src/modules/user/user.repository.js";
import User from "../../../src/modules/user/user.model.js";

describe("UserRepository", () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("create", () => {
    it("should create a user", async () => {
      const user = {
        _id: "user-id",
        username: "hanzla",
        email: "hanzla@example.com",
      };

      const createStub = sinon.stub(User, "create").resolves(user as any);

      const result = await repository.create({
        username: "hanzla",
        email: "hanzla@example.com",
        password: "password123",
      });

      expect(createStub.calledOnce).to.equal(true);

      expect(createStub.firstCall.args[0]).to.deep.equal({
        username: "hanzla",
        email: "hanzla@example.com",
        password: "password123",
      });

      expect(result).to.equal(user);
    });
  });

  describe("findByUsername", () => {
    it("should find a user by username", async () => {
      const user = { username: "hanzla" };

      const execStub = sinon.stub().resolves(user);

      sinon.stub(User, "findOne").returns({
        exec: execStub,
      } as any);

      const result = await repository.findByUsername("hanzla");

      expect(
        User.findOne.calledOnceWith({
          username: "hanzla",
        }),
      ).to.equal(true);

      expect(result).to.equal(user);
    });
  });

  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      const user = {
        email: "hanzla@example.com",
      };

      const execStub = sinon.stub().resolves(user);

      sinon.stub(User, "findOne").returns({
        exec: execStub,
      } as any);

      const result = await repository.findByEmail("hanzla@example.com");

      expect(
        User.findOne.calledOnceWith({
          email: "hanzla@example.com",
        }),
      ).to.equal(true);

      expect(result).to.equal(user);
    });
  });

  describe("findByUsernameOrEmail", () => {
    it("should search by username or email", async () => {
      const user = {
        username: "hanzla",
        email: "hanzla@example.com",
      };

      const execStub = sinon.stub().resolves(user);

      sinon.stub(User, "findOne").returns({
        exec: execStub,
      } as any);

      const result = await repository.findByUsernameOrEmail(
        "hanzla",
        "hanzla@example.com",
      );

      expect(
        User.findOne.calledOnceWith({
          $or: [{ username: "hanzla" }, { email: "hanzla@example.com" }],
        }),
      ).to.equal(true);

      expect(result).to.equal(user);
    });
  });

  describe("findByUsernameOrEmailWithPassword", () => {
    it("should find user and select password", async () => {
      const user = {
        username: "hanzla",
      };

      const execStub = sinon.stub().resolves(user);
      const selectStub = sinon.stub().returns({
        exec: execStub,
      });

      sinon.stub(User, "findOne").returns({
        select: selectStub,
      } as any);

      const result =
        await repository.findByUsernameOrEmailWithPassword("hanzla");

      expect(
        User.findOne.calledOnceWith({
          $or: [{ username: "hanzla" }, { email: "hanzla" }],
        }),
      ).to.equal(true);

      expect(selectStub.calledOnceWith("+password")).to.equal(true);
      expect(result).to.equal(user);
    });
  });

  describe("findById", () => {
    it("should find a user by id", async () => {
      const user = {
        _id: "user-id",
      };

      const id = "507f1f77bcf86cd799439011" as any;

      const execStub = sinon.stub().resolves(user);

      sinon.stub(User, "findById").returns({
        exec: execStub,
      } as any);

      const result = await repository.findById(id);

      expect(User.findById.calledOnceWith(id)).to.equal(true);
      expect(result).to.equal(user);
    });
  });
});
