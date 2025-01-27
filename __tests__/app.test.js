const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test.only("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
