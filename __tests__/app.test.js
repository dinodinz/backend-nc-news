const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const jestSorted = require("jest-sorted");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");
const db = require("../db/connection");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array with topic objects where it will have the keys 'slug' and 'description' which is of string value", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { allTopics } }) => {
        expect(Array.isArray(allTopics)).toBe(true);
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

describe("GET all bad URLs", () => {
  test("404: Should respond with 'Endpoint not found', if a request is sending to an invalid/non existing path", () => {
    return request(app)
      .get("/api/iamgroot")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Endpoint not found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Should respond with 200 status when successfully fetching an article", () => {
    return request(app).get("/api/articles/1").expect(200);
  });

  test("200: Should respond with an article object which has author,title,article_id,body,topic,created_at,votes,article_img_url properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(1);
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        );
      });
  });

  test("404: Should respond with a 404 error Not Found if the article_id was non existing in the database", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not found");
        expect(response.body.msg).toBe("Article ID does not exist");
      });
  });

  test("400: Should respond with a 400 error Bad Request if the article_id was of invalid format", () => {
    return request(app)
      .get("/api/articles/A")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
        expect(response.body.msg).toBe("Invalid input syntax for Article ID");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Should respond with 200 status when successfully fetching all object articles which should have the expected properties without the body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { allArticles } }) => {
        expect(allArticles).toBeSortedBy("created_at", { descending: true }); //checks if the response is sorted by created_at using descending order by default
        allArticles.forEach((article) => {
          expect(article).not.toHaveProperty("body"); //to check if key/property is not existing
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test(`200: Should respond with 200 status when successfully fetching all comments 
             from the specified article_id which should have their respective object properties and must be
             sorted by created_at in descending order by default `, () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { allComments } }) => {
        expect(Array.isArray(allComments)).toBe(true); //checks if value returned should be an array
        expect(allComments).toBeSortedBy("created_at", { descending: true }); //checks if response array is sorted by created_at using descending order

        allComments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      });
  });

  test("400: Should respond with 400 Bad Request if the request was carrying a different format for article_id", () => {
    return request(app)
      .get("/api/articles/A/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
        expect(response.body.msg).toBe("Invalid input syntax for Article ID");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Should respond with 201 status along with the posted comment when successfully posting a comment for an article", () => {
    const payload = { username: "icellusedkars", body: "I AM GROOOT!!" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(payload)
      .expect(201)
      .then(({ body: { postedComment } }) => {
        expect(postedComment).toBe("I AM GROOOT!!");
      });
  });

  test("404: Should respond with 404 Not Found if article ID is valid but doesn't exist", () => {
    const payload = { username: "icellusedkars", body: "I AM GROOOT!!" };

    return request(app)
      .post("/api/articles/999/comments")
      .send(payload)
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not found");
        expect(response.body.msg).toBe(
          'Key (article_id)=(999) is not present in table "articles".'
        ); //not sure if this is the right approach to test as i am mapping msg to detail which might be dynamic
      });
  });

  test("400: Should respond with 400 Bad Request if the article ID carried on the request was using a different format", () => {
    const payload = { username: "icellusedkars", body: "I AM GROOOT!!" };

    return request(app)
      .post("/api/articles/A/comments")
      .send(payload)
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
        expect(response.body.msg).toBe("Invalid input syntax for Article ID");
      });
  });

  test("404: Should respond with 404 Not found if the username on the request body is not an existing username on the users table, this goes the same for blank username values", () => {
    const payload = { username: "Groot", body: "I AM GROOOT!!" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(payload)
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not found");
        expect(response.body.msg).toBe(
          'Key (author)=(Groot) is not present in table "users".'
        );
      });
  });

  test("400: Should respond with 400 Bad request if the username or body key value pairs was not on the request body", () => {
    const payload = { body: "I AM GROOOT!!" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(payload)
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
        expect(response.body.msg).toBe("Invalid request body format");
      });
  });

  test("400: Should respond with 400 Bad request if there was no request body sent", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request");
        expect(response.body.msg).toBe("Invalid request body format");
      });
  });
});
