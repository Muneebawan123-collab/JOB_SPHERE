const request = require("supertest");
const app = require("../server");

describe("Authentication API", () => {
  it("should return 200 for valid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 401 for invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: "wrongpass" });

    expect(res.statusCode).toEqual(401);
  });
});
