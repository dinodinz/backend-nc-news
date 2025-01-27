const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test.skip("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Response should be stored in an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { allTopics } }) => {
        expect(Array.isArray(allTopics)).toBe(true);
      });
  });

  test("200: Responds with an array with topic objects where it will have the keys 'slug' and 'description' which is of string value", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { allTopics } }) => {
        allTopics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });

  test("200: Response should have a warning message to inform user that the endpoint does not support any query if the request was carrying a query", () => {
    return request(app)
      .get("/api/topics?query=iamgroot")
      .expect(200)
      .then(({ body: { warning } }) => {
        expect(warning).toBe("This endpoint does not support queries");
      });
  });
});

describe("GET *", () => {
  test.skip("404: Should respond with 'Endpoint not found', if a request is sending to an invalid/non existing path", () => {
    return request(app)
      .get("/api/iamgroot")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Endpoint not found");
      });
  });
});
