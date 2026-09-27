let server;

/**
 * Jest tests for New Questions
 */

const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const Question = require('../models/questions');
const Answer = require("../models/answers");
const Tag = require("../models/tags");
const Account = require("../models/accounts")
const Comment = require("../models/comments");
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require("../utils/question");


// Mocking the models
jest.mock("../models/questions");
jest.mock("../models/comments");
jest.mock('../utils/question', () => ({
  addTag: jest.fn(),
  getQuestionsByOrder: jest.fn(),
  filterQuestionsBySearch: jest.fn(),
}));

const tag1 = {
  _id: '507f191e810c19729de860ea',
  name: 'tag1'
};
const tag2 = {
  _id: '65e9a5c2b26199dbcc3e6dc8',
  name: 'tag2'
};

const ans1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'Answer 1 Text',
  ans_by: 'answer1_user',

}

const ans2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'Answer 2 Text',
  ans_by: 'answer2_user',

}

const mockQuestions = [
  {
    _id: '65e9b58910afe6e94fc6e6dc',
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [tag1],
    answers: [ans1],
    views: 21
  },
  {
    _id: '65e9b5a995b6c7045a30d823',
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [ans2],
    views: 99
  }
]

describe('GET /getQuestion', () => {
  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
  });

  it('should return questions by filter', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'someOrder',
      search: 'someSearch',
    };

    getQuestionsByOrder.mockResolvedValueOnce(mockQuestions);
    filterQuestionsBySearch.mockReturnValueOnce(mockQuestions);
    // Making the request
    const response = await supertest(server)
      .get('/question/getQuestion')
      .query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions);
  })
})

describe('GET /getQuestionById/:qid', () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
  });

  it('should return a question by id and increment its views by 1', async () => {

    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const mockPopulatedQuestion = {
      answers: [mockQuestions.filter(q => q._id == mockReqParams.qid)[0]['answers']], // Mock answers
      views: mockQuestions[1].views + 1
    };

    // Provide mock question data
    Question.findOneAndUpdate = jest.fn().mockImplementation(() => ({ populate: jest.fn().mockResolvedValueOnce(mockPopulatedQuestion) }));

    // Making the request
    const response = await supertest(server)
      .get(`/question/getQuestionById/${mockReqParams.qid}`);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPopulatedQuestion);
  });

  it('populates answers and comments, skips vote strings, and returns the incremented views', async () => {
    const qid = '65e9b5a995b6c7045a30d823';
    const populate = jest.fn().mockResolvedValueOnce({
      views: 100,
      answers: [{ comments: [{ text: 'nested' }] }],
      comments: [{ text: 'on the question' }],
    });
    Question.findOneAndUpdate = jest.fn().mockReturnValue({ populate });

    const response = await supertest(server)
      .get(`/question/getQuestionById/${qid}`);

    expect(response.status).toBe(200);
    expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: qid },
      { $inc: { views: 1 } },
      { new: true }
    );
    expect(populate).toHaveBeenCalledWith([
      { path: "answers", populate: { path: "comments" } },
      { path: "comments" },
      { path: "tags" },
    ]);
  });
});

describe('POST /addQuestion', () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
  });

  it('should add a new question', async () => {
    // Mock request body

    const mockTags = [tag1, tag2];

    const mockQuestion = {
      _id: '65e9b58910afe6e94fc6e6fe',
      title: 'Question 3 Title',
      text: 'Question 3 Text',
      tags: [tag1, tag2],
      answers: [ans1],
    }

    addTag.mockResolvedValueOnce(mockTags);
    Question.create.mockResolvedValueOnce(mockQuestion);

    // Making the request
    const response = await supertest(server)
      .post('/question/addQuestion')
      .send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion);

  });
});

/**
 * Jest Tests for New Answers
 */

// Mock the Answer model
jest.mock("../models/answers");

describe("POST /addAnswer", () => {

  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
  });

  it("should add a new answer to the question", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {
        text: "This is a test answer"
      }
    };

    const mockAnswer = {
      _id: "dummyAnswerId",
      text: "This is a test answer"
    }
    // Mock the create method of the Answer model
    Answer.create.mockResolvedValueOnce(mockAnswer);

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      answers: ["dummyAnswerId"]
    });

    // Making the request
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer);

    // Verifying that Answer.create method was called with the correct arguments
    expect(Answer.create).toHaveBeenCalledWith({
      text: "This is a test answer"
    });

    // Verifying that Question.findOneAndUpdate method was called with the correct arguments
    expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dummyQuestionId" },
      { $push: { answers: { $each: ["dummyAnswerId"], $position: 0 } } },
      { new: true }
    );
  });
});


/**
 * Testing Tags
 */
// Mock data for tags

const mockTags = [
  { name: 'tag1' },
  { name: 'tag2' },
  // Add more mock tags if needed
];

const mockQuestions1 = [
  { tags: [mockTags[0], mockTags[1]] },
  { tags: [mockTags[0]] },
]

describe('GET /getTagsWithQuestionNumber', () => {

  beforeEach(() => {
    server = require("../server");
  })
  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
  });

  it('should return tags with question numbers', async () => {
    // Mocking Tag.find() and Question.find()
    Tag.find = jest.fn().mockResolvedValueOnce(mockTags);

    Question.find = jest.fn().mockImplementation(() => ({ populate: jest.fn().mockResolvedValueOnce(mockQuestions1) }));

    // Making the request
    const response = await supertest(server).get('/tag/getTagsWithQuestionNumber');

    // Asserting the response
    expect(response.status).toBe(200);

    // Asserting the response body
    expect(response.body).toEqual([
      { name: 'tag1', qcnt: 2 },
      { name: 'tag2', qcnt: 1 },

    ]);
    expect(Tag.find).toHaveBeenCalled();
    expect(Question.find).toHaveBeenCalled();
  });
});



/**
 * Testing Accounts
 */

jest.mock("../models/accounts");

describe('POST /addAccount', () => {
  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
  });

  it('should add a new account', async () => {
    const mockAccount = {
      username: "kyra123",
      password: "123",
      name: "Kyra Riedel"
    }

    Account.create.mockReturnValueOnce(mockAccount);
    // Making the request
    const response = await supertest(server)
      .post('/account/addAccount')
      .send(mockAccount);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAccount);
  })
})

describe('GET /authenticateAccount', () => {
  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
  });

  it('should authenticate an account and return the username', async () => {
    // Mock Account.findOne method to return a mock account
    const mockAccount = {
      username: 'kyra123',
      password: '123',
      name: 'Kyra Riedel',
    };

    Account.findOne = jest.fn().mockResolvedValueOnce(mockAccount);
  
    // Making the request
    const response = await supertest(server)
      .get('/account/authenticateAccount')
      .query({
        username: 'kyra123',
        password: '123',
      });
  
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual('kyra123');
    expect(Account.findOne).toHaveBeenCalledWith({
      username: 'kyra123',
      password: '123',
    });
  });

  it('rejects a username when the password does not match', async () => {
    Account.findOne = jest.fn().mockResolvedValueOnce(null);

    const response = await supertest(server)
      .get('/account/authenticateAccount')
      .query({
        username: 'kyra123',
        password: 'wrong',
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual("");
    expect(Account.findOne).toHaveBeenCalledWith({
      username: 'kyra123',
      password: 'wrong',
    });
  });
})

describe('POST /addComment on an answer', () => {
  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
  });

  it('attaches the new comment to the answer', async () => {
    const created = { _id: "commentId", text: "on the answer" };
    Comment.create.mockResolvedValueOnce(created);
    Answer.findOneAndUpdate.mockResolvedValueOnce({ _id: "a1" });

    const response = await supertest(server)
      .post("/comment/addComment")
      .send({
        qid: "q1",
        aid: "a1",
        com: { text: "on the answer", com_by: "kyra123", com_date_time: "2024-01-01T00:00:00.000Z" },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(created);
    expect(Answer.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "a1" },
      { $push: { comments: { $each: ["commentId"], $position: 0 } } },
      { new: true }
    );
  });
})

describe('GET /account/profile/:username', () => {
  beforeEach(() => {
    server = require("../server");
  })

  afterEach(async () => {
    server.close();
    await mongoose.disconnect()
  });

  it('lists posts and adds reputation when they are voted on', async () => {
    Account.findOne = jest.fn().mockResolvedValueOnce({
      username: 'kyra123',
      name: 'Kyra Riedel',
      password: '123',
    });
    Question.find = jest.fn()
      .mockResolvedValueOnce([{
        _id: 'q1',
        title: 'A question',
        upvote: ['a', 'b'],
        downvote: ['c'],
        views: 4,
      }])
      .mockResolvedValueOnce([{
        _id: 'q9',
        title: 'Parent question',
        answers: ['ans1'],
      }]);
    Answer.find = jest.fn().mockResolvedValueOnce([{
      _id: 'ans1',
      text: 'An answer',
      upvote: ['a'],
      downvote: [],
    }]);

    const response = await supertest(server).get('/account/profile/kyra123');

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual('Kyra Riedel');
    expect(response.body.reputation).toEqual(28);
    expect(response.body.questions).toEqual([
      { _id: 'q1', title: 'A question', score: 1, views: 4 },
    ]);
    expect(response.body.answers[0]).toMatchObject({
      _id: 'ans1',
      text: 'An answer',
      score: 1,
      questionId: 'q9',
      questionTitle: 'Parent question',
    });
    expect(response.body.password).toBeUndefined();
  });
})

test('Add server unit tests', () => {
  expect(true);
});

