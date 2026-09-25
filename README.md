# Fake Stack Overflow

A React and Express clone of a question-and-answer board. The client keeps the current page in component state (there is no React Router navigation). The API stores questions, answers, comments, tags, and accounts in MongoDB.

## Local Set-up

MongoDB must be running. Without `MONGO_URL` set, the server uses `mongodb://127.0.0.1:27017/fake_so`.

```bash
# seed sample questions, answers, comments, tags, and one account
cd server
npm install
node init.js

# API on http://localhost:8000
npm start
```

In another terminal:

```bash
cd client
npm install
npm start
```

The client runs at http://localhost:3000 and calls http://localhost:8000.

Seeded login (plaintext password stored by `server/init.js`): username `kyra123`, password `123`. Signup does not log the new account in.

`server/destroy.js` drops the `fake_so` database on `localhost`.

### Docker

`docker-compose.yml` starts MongoDB, the API, and the client. The server service sets `MONGO_URL` to `mongodb://mongodb:27017/fake_so` and runs `npm start` (`node server.js`) after `node init.js`.

## What the app does

Guests can browse questions, tags, and a question’s answers and comments. Asking a question, posting an answer, posting a comment, and voting require a username held in React state after login. That check is only in the UI. The API does not require a session or token.

| Area | Behavior |
|------|----------|
| Questions | List with answer count, comment count, views, author, and relative time. Order by Newest, Active, or Unanswered. |
| Search | Header search on Enter. Words match title or text; `[tag]` matches a tag name. An empty result set shows “No Questions Found”. Clicking a tag searches `[tagname]`. |
| Ask | Title (required, at most 100 characters), body (required), 1–5 tags (each new tag at most 20 characters). Reuses an existing tag name. Markdown-style links must be `[text](https://...)`. |
| Question page | Loads one question and increments its view count. Shows the body (with links turned into anchors), answers, comments on the question, and comments stored on each answer. |
| Answers | Logged-in users post an answer. Same link check as questions. New answers are inserted at the front of the question’s answer list. |
| Comments | Logged-in users comment on the question or on an answer. |
| Votes | Logged-in users up-vote or down-vote a question. The score is up-votes minus down-votes. A username is stored on only one of the two lists. |
| Tags | Page lists each tag and how many questions use it. |
| Accounts | Signup stores username, password, and name. Login sends username and password as query parameters and keeps the returned username in client state. Logout clears that state. Sidebar shows `Welcome` plus the username. |

Question and answer text, and comments, render `[label](https://...)` as links. Other HTML in that text is not escaped.

## API

Base URL `http://localhost:8000`. CORS allows `http://localhost:3000` with credentials.

| Method | Path | Role |
|--------|------|------|
| GET | `/question/getQuestion?order=&search=` | Filter and order questions |
| GET | `/question/getQuestionById/:qid` | One question; increments `views` |
| POST | `/question/addQuestion` | Create a question and its tags |
| GET | `/question/upvoteQuestion?username=&qid=` | Add username to up-votes, remove from down-votes |
| GET | `/question/downvoteQuestion?username=&qid=` | Add username to down-votes, remove from up-votes |
| POST | `/answer/addAnswer` | Create an answer and attach it to `qid` |
| POST | `/comment/addComment` | Create a comment on `qid`, or on `aid` when `aid` is set |
| GET | `/tag/getTagsWithQuestionNumber` | Tag names with question counts |
| POST | `/account/addAccount` | Create an account |
| GET | `/account/authenticateAccount?username=&password=` | Return the username when both username and password match |

There are no answer-vote routes. `client/src/services/commentService.js` also calls `GET /comment/getQuestionById/:id`, which is not implemented. Account fields `role`, `votedQuestions`, and `votedAnswers` are on the schema and are not used by these routes.

## Tests

| Feature | Jest | Cypress component | Cypress e2e |
|---------|------|-------------------|-------------|
| List questions by order and search | `server/tests/server.test.js` (`GET /getQuestion`) | — | — |
| Question by id (views) | `server/tests/server.test.js` (`GET /getQuestionById/:qid`) | — | — |
| Create question | `server/tests/server.test.js` (`POST /addQuestion`) | — | — |
| Create answer | `server/tests/server.test.js` (`POST /addAnswer`) | — | — |
| Tags with question counts | `server/tests/server.test.js` (`GET /getTagsWithQuestionNumber`) | — | — |
| Create account | `server/tests/server.test.js` (`POST /addAccount`) | — | — |
| Login | `server/tests/server.test.js` (`GET /authenticateAccount`) | — | — |
| Existing tag id (`addTag`) | `server/tests/server.test.js` (question util module) | — | — |
| App shell renders | — | `client/cypress/component/fake_so.cy.js` | — |

Order, search, and `addTag` are covered in `server/tests/question.util.test.js` against the real helpers. `client/cypress/e2e/home.cy.js` visits the app at `http://localhost:3000`.

```bash
cd server && npm test
cd client && npm test                  # Cypress e2e
cd client && npx cypress run --component
```
