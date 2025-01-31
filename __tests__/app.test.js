const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const jestSorted = require("jest-sorted");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const { checkCommentIdExists } = require("../db/seeds/utils");
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

  test("200: Should respond with an article object which has author,title,article_id,body,topic,created_at,votes,article_img_url properties,comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: 11,
          })
        );
      });
  });

  test("404: Should respond with a 404 error Not Found if the article_id was non existing in the database", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe(
          "Not found: Article ID does not exist"
        );
      });
  });

  test("400: Should respond with a 400 error Bad Request if the article_id was of invalid format", () => {
    return request(app)
      .get("/api/articles/A")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request: Invalid input syntax");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Should respond with 200 status when successfully fetching all object articles which should have the expected properties without the body, and must be in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { allArticles } }) => {
        expect(allArticles).toBeSortedBy("created_at", { descending: true });
        allArticles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });

  test("200: Responds with an array of article objects that are sorted by based on the sort_by query from the request using the default order DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body: { allArticles } }) => {
        expect(allArticles).toBeSortedBy("article_id", { descending: true });
      });
  });

  test("200: Responds with an array of article objects that are sorted by based on the sort_by with an order based on the order query value", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=ASC")
      .expect(200)
      .then(({ body: { allArticles } }) => {
        expect(allArticles).toBeSortedBy("comment_count", {
          ascending: true,
        });
      });
  });

  test("200: Should allow users to only carry order on the query and change the default DESC order but still sorted by default created_at", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { allArticles } }) => {
        expect(allArticles).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });

  test("400: Should respond with 400 Bad Request if sort_by value was not a valid value", () => {
    return request(app)
      .get("/api/articles?sort_by=GROOT")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request: Invalid sort by value");
      });
  });

  test("400: Should respond with 400 Bad Request if order value was not a valid value", () => {
    return request(app)
      .get("/api/articles?order=GROOT")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request: Invalid order value");
      });
  });

  test("200: Response should be filtered using the topic value instead of showing everything from the table.", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { allArticles } }) => {
        allArticles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("200: Should be capable of handling sort_by=article_id and order=asc along with topic=mitch query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc&topic=mitch")
      .expect(200)
      .then(({ body: { allArticles } }) => {
        expect(allArticles).toBeSortedBy("article_id", { ascending: true });
        allArticles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("404: Should respond with 404 error if the topic slug is not existing in the table topic", () => {
    return request(app)
      .get("/api/articles?topic=space")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not found: Topic does not exist");
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
        expect(Array.isArray(allComments)).toBe(true);
        expect(allComments).toBeSortedBy("created_at", { descending: true });

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
        expect(response.body.error).toBe("Bad Request: Invalid input syntax");
      });
  });

  test("200: Should respond with 200 status and an empty array for valid existing article_ids that doesn't have any comment", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.allComments.length).toBe(0);
        expect(response.body.allComments).toEqual([]);
      });
  });

  test("404: Should respond with 404 Not found if the request was carrying a valid but not an existing article_id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe(
          "Not found: Article ID does not exist"
        );
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
        expect(response.body.error).toBe(
          `Not found: Key (article_id)=(999) is not present in table "articles".`
        );
      });
  });

  test("400: Should respond with 400 Bad Request if the article ID carried on the request was using a different format", () => {
    const payload = { username: "icellusedkars", body: "I AM GROOOT!!" };

    return request(app)
      .post("/api/articles/A/comments")
      .send(payload)
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request: Invalid input syntax");
      });
  });

  test("404: Should respond with 404 Not found if the username on the request body is not an existing username on the users table, this goes the same for blank username values", () => {
    const payload = { username: "Groot", body: "I AM GROOOT!!" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(payload)
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe(
          `Not found: Key (author)=(Groot) is not present in table "users".`
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
        expect(response.body.error).toBe(
          "Bad Request: Invalid request body format"
        );
      });
  });

  test("400: Should respond with 400 Bad request if there was no request body sent", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe(
          "Bad Request: Invalid request body format"
        );
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Should respond with 200 status along with the updated article object with updated vote value", () => {
    const payload = { inc_votes: 100 };

    return request(app)
      .patch("/api/articles/1")
      .send(payload)
      .expect(200)
      .then(({ body: { editedArticle } }) => {
        expect(editedArticle).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 200,
            article_img_url: expect.any(String),
          })
        );
      });
  });

  test("200: Should respond with 200 status and decrement the current vote value if a negative value was sent for inc_votes then return the updated article object", () => {
    const payload = { inc_votes: -300 };

    return request(app)
      .patch("/api/articles/1")
      .send(payload)
      .expect(200)
      .then(({ body: { editedArticle } }) => {
        expect(editedArticle.votes).toBe(-200);
      });
  });

  test("400: Should respond with 400 Bad Request if the request was carrying a different format for article_id", () => {
    const payload = { inc_votes: 100 };

    return request(app)
      .patch("/api/articles/A")
      .send(payload)
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request: Invalid input syntax");
      });
  });

  test("404: Should respond with 404 Not found if the request was carrying a valid but not an existing article_id", () => {
    const payload = { inc_votes: 100 };

    return request(app)
      .patch("/api/articles/999")
      .send(payload)
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe(
          "Not found: Article ID does not exist"
        );
      });
  });

  test("400: Should respond with 400 Bad request if the request payload didnt have values OR if there was no request body sent at all", () => {
    const payload = {};

    return request(app)
      .patch("/api/articles/1")
      .send(payload)
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe(
          "Bad Request: Invalid request body format"
        );
      });
  });

  test("400: Should respond with 400 Bad request if the request payload has a different format than what the server expects", () => {
    const payload = { inc_votes: "A" };

    return request(app)
      .patch("/api/articles/1")
      .send(payload)
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request: Invalid input syntax");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Should respond with 204 status with response body", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then(() => {
        return expect(checkCommentIdExists(2)).rejects.toMatchObject({
          status: 404,
          error: "Not found",
          detail: "Comment ID does not exist",
        });
      });
  });

  test("400: Should respond with 400 Bad Request if the request was carrying a different format for comment_id", () => {
    return request(app)
      .delete("/api/comments/A")
      .expect(400)
      .then((response) => {
        expect(response.body.error).toBe("Bad Request: Invalid input syntax");
      });
  });

  test("404: Should respond with 404 Not found if the request was carrying a valid but not an existing comment_id", () => {
    return request(app)
      .delete("/api/comments/888")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe(
          "Not found: Comment ID does not exist"
        );
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects which should have the keys 'username','name' and 'avatar_url'", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { allUsers } }) => {
        expect(Array.isArray(allUsers)).toBe(true);

        allUsers.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Responds with user object with the properties username,avatar_url,name", () => {
    return request(app)
      .get("/api/users/lurker")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: expect.any(String),
            avatar_url: expect.any(String),
            name: expect.any(String),
          })
        );
      });
  });

  test("404: Responds with 404 Not found if the username doesn't exist in the username table", () => {
    return request(app)
      .get("/api/users/groot")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Not found: Username does not exist");
      });
  });
});
