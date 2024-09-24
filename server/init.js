const mongoose = require('mongoose');
const User = require('./models/user');
const Tag = require('./models/tags');
const Question = require('./models/questions');
const Answer = require('./models/answers');

const dbConnectionString = 'mongodb://localhost:27017/fake_so';

// Initial Data
const users = [
    {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'admin123'
    }
];

const tags = [
    { name: 'JavaScript' },
    { name: 'MongoDB' },
    { name: 'NodeJS' },
    { name: 'ReactJS' }
];

const questions = [
    {
        title: "How to set up a basic React project?",
        summary: "Setup steps for React project",
        text: "Can anyone explain how to set up a basic React project?",
        asked_by: "admin@example.com",
        ask_date_time: new Date(),
        views: 0
    }
];

const answers = [
    {
        text: "You start by using create-react-app.",
        ans_by: "admin@example.com",
        ans_date_time: new Date()
    }
];

async function createInitialData() {
    await mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    
    // Clean up existing data
    await User.deleteMany({});
    await Tag.deleteMany({});
    await Question.deleteMany({});
    await Answer.deleteMany({});

    // Insert initial data
    const createdUsers = await User.insertMany(users);
    const createdTags = await Tag.insertMany(tags);

    const linkedQuestions = questions.map(q => {
        q.tags = [createdTags[0]._id]; 
        return q;
    });

    const createdQuestions = await Question.insertMany(linkedQuestions);
    const linkedAnswers = answers.map(a => {
        a.question = createdQuestions[0]._id;
        return a;
    });

    await Answer.insertMany(linkedAnswers);

    console.log("Database has been initialized with initial data.");
    process.exit();
}

createInitialData().catch(console.error);
