// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // For hashing passwords

const app = express();
const port = 8000;

const dbConnectionString = 'mongodb://localhost:27017/fake_so';

mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(express.json());

const Answer = require('./models/answers');
const Comment = require('./models/comments');
const Question = require('./models/questions');
const Tag = require('./models/tags');

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If authentication is successful, create a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      'your_jwt_secret', // Secret key for signing JWT (keep it secret)
      {
        expiresIn: '1h', // Token expiry time
      }
    );

    // Return the token to the client
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Function to validate the registration form data
const validateRegistration = ({ firstName, lastName, email, password, passwordVerification }) => {
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!firstName || !lastName || !email || !password || !passwordVerification) {
    return 'All fields are required';
  }

  if (!email.match(emailRegex)) {
    return 'Invalid email format';
  }

  if (password.includes(firstName) || password.includes(lastName) || password.includes(email)) {
    return 'Password cannot contain your name or email';
  }

  if (password !== passwordVerification) {
    return 'Passwords do not match';
  }

  return null; // No validation errors
};

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password, passwordVerification } = req.body;

  // Validate the registration form data
  const validationError = validateRegistration({ firstName, lastName, email, password, passwordVerification });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Create a new user with a hashed password
    const newUser = new User({
      firstName,
      lastName,
      email,
      password, // Will be hashed by pre-save hook
    });

    await newUser.save(); // Save to the database
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout endpoint (Client-side should clear JWT token)
app.post('/api/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// API endpoint to fetch questions
/*
app.get('/api/questions', async (req, res) => {
    try {
      let questions;
      const sortType = req.query.sort;
  
        switch (sortType) {
            case 'newest':
            questions = await Question.find().sort({ askDate: -1 });
            break;
            case 'active':
            questions = await Question.find().sort({ 'answers.ansDate': -1 });
            break;
            case 'unanswered':
            questions = await Question.find({ 'answers.0': { $exists: false } });
            break;
            default:
            questions = await Question.find().populate('tags').populate('answers');
            res.json(questions);
            break;
       }

    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
*/
// Endpoint to fetch questions with sorting options
app.get('/api/questions', async (req, res) => {
  try {
    let questions; // Variable to hold the results
    const { sort } = req.query; // Get the sorting parameter from the query string

    // Determine the sorting strategy based on the 'sort' parameter
    switch (sort) {
      case 'newest': // Sort by ask date (newest first)
        questions = await Question.find().sort({ ask_date_time: -1 }).populate('tags').populate('answers');
        break;
      case 'active': // Sort by most recent answer activity
        questions = await Question.find().sort({ 'answers.ans_date_time': -1 }).populate('tags').populate('answers');
        break;
      case 'unanswered': // Find questions with no answers
        questions = await Question.find({ answers: { $size: 0 } }).populate('tags').populate('answers');
        break;
      default: // Default to newest if no sorting is specified
        questions = await Question.find().sort({ ask_date_time: -1 }).populate('tags').populate('answers');
        break;
    }

    res.json(questions); // Send the sorted questions as the response
  } catch (error) {
    console.error('Error fetching sorted questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// API endpoint to post questions
app.post('/api/questions', async (req, res) => {
    const { title, summary, text, tagNames, asked_by, answers } = req.body;  

    try {
        const tags = await Promise.all(tagNames.map(async name => {
            let tag = await Tag.findOne({ name: name });
            if (!tag) {
                tag = new Tag({ name });
                await tag.save();
            }
            return tag._id; 
        }));

        const newQuestion = new Question({
            title,
            summary,
            text,
            tags,  
            answers: [], 
            asked_by,
            ask_date_time: new Date(),
            views: 0
        });

        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error('Error saving question:', error);
        res.status(500).json({ message: 'Failed to save question', error: error.message });
    }
});

// API endpoint to add an answer to a question
app.post('/api/questions/:questionId/answers', async (req, res) => {
    try {
        const { text, ans_by } = req.body;

        const newAnswer = new Answer({ text, ans_by, ans_date_time: new Date() });
        await newAnswer.save();

        const question = await Question.findById(req.params.questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        if (!question.answers) {
            question.answers = [];
        }

        // AUIUAHIUHXWIDUHNCEUDIHNUIWXKJSHLNOIWKLDjxmioklchndeuijkhcendmusijkvgbefnuyokjhrnewduiaj HELpceefldp;
        question.answers.push(newAnswer._id);
        await question.save();

        res.status(201).json({
            message: 'Answer added successfully',
            answer: newAnswer
        });
    } catch (error) {
        console.error('Error in POST /api/questions/:questionId/answers:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
});

// API endpoint to get tags
app.get('/api/tags', async (req, res) => {
    try {
        const tags = await Tag.find({}); 
        const tagOccurrences = await Question.aggregate([
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $lookup: {
                from: 'tags',
                localField: '_id',
                foreignField: '_id',
                as: 'tagDetails'
            } },
            { $unwind: '$tagDetails' },
            { $project: { _id: 0, name: '$tagDetails.name', count: 1 } }
        ]);
        
        res.json(tagOccurrences);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/api/questions/tag/:tagName', async (req, res) => {
    try {
        const tagName = req.params.tagName;
        const tag = await Tag.findOne({ name: tagName });
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        const questions = await Question.find({ tags: tag._id }).populate('tags').populate('answers');
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions for tag:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/*
// API endpoint to search questions
app.get('/api/search', async (req, res) => {
    const { searchTerm } = req.query;
    if (!searchTerm) {
        res.status(400).send('Search term is required');
        return;
    }

    try {
        const questions = await Question.find({ 
            $text: { $search: searchTerm } 
        }, 
        { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .populate('tags')
        .populate('answers');

        res.json(questions);
    } catch (error) {
        console.error('Error searching questions:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
*/
// API endpoint to search questions by search term
app.get('/api/search', async (req, res) => {
  const { searchTerm } = req.query;
  
  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  try {
    // Search for questions matching the search term in the title, text, or tags
    const questions = await Question.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive regex search
        { text: { $regex: searchTerm, $options: 'i' } },
        { tags: { $elemMatch: { name: { $regex: searchTerm, $options: 'i' } } } }
      ]
    }).populate('tags');

    res.json(questions); // Send the results back to the client
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/sorting', async (req, res) => {
  try {
    const { sort } = req.query; // Obtain the 'sort' parameter from the query string
    let questions; // Variable to store sorted questions

    switch (sort) {
      case 'newest':
        questions = await Question.find().sort({ ask_date_time: -1 }).populate('tags').populate('answers');
        break;
      case 'active':
        questions = await Question.find().sort({ 'answers.ans_date_time': -1 }).populate('tags').populate('answers');
        break;
      case 'unanswered':
        questions = await Question.find({ answers: { $size: 0 } }).populate('tags').populate('answers');
        break;
      default:
        questions = await Question.find().populate('tags').populate('answers');
        break;
    }

    res.json(questions); // Return the sorted questions as a JSON response
  } catch (error) {
    console.error('Error fetching sorted questions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile and related data
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const questions = await Question.find({ asked_by: userId }).populate('tags');
    const tags = await Tag.find({ created_by: userId });
    const answers = await Answer.find({ ans_by: userId }).populate('questionId');

    res.json({
      user,
      questions,
      tags,
      answers,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a question by ID
app.delete('/api/questions/:questionId', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await Answer.deleteMany({ _id: { $in: question.answers } }); // Delete all related answers
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Failed to delete question' });
  }
});

// Delete a tag by ID (only if it's not used by others)
app.delete('/api/tags/:tagId', async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.tagId);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    const tagUsedInQuestions = await Question.find({ tags: tag._id });

    if (tagUsedInQuestions.length > 0) {
      return res.status(400).json({ message: 'Tag is used in questions, cannot be deleted' });
    }

    await tag.remove(); // If not used, delete the tag
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ message: 'Failed to delete tag' });
  }
});

// Edit an answer by ID
app.put('/api/answers/:answerId', async (req, res) => {
  try {
    const { text } = req.body;
    const answer = await Answer.findById(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    answer.text = text;
    await answer.save(); // Save the updated answer

    res.status(200).json({ message: 'Answer updated successfully' });
  } catch (error) {
    console.error('Error updating answer:', error);
    res.status(500).json({ message: 'Failed to update answer' });
  }
});

// Delete an answer by ID
app.delete('/api/answers/:answerId', async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    
    res.status(200).json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({ message: 'Failed to delete answer' });
  }
});

app.get('/api/user/:email', async (req, res) => {
  const { email } = req.params; // Extract email from request parameters
  console.log('Received email:', email); // Debug to ensure correct retrieval
  
  try {
    const user = await User.findOne({ email: email.toLowerCase() }); // Find user by email
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch related data for the user
    const questions = await Question.find({ asked_by: user.email }).populate('tags');
    const tags = await Tag.find({ created_by: user.email });
    const answers = await Answer.find({ ans_by: user.email }).populate('questionId');

    res.json({
      user,
      questions,
      tags,
      answers,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.get('/api/answers/:answerId', async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.answerId).populate('comments');
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    res.json(answer);
  } catch (error) {
    console.error('Failed to fetch answer with comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/answers/:answerId/comments', async (req, res) => {
  const { answerId } = req.params;
  const { page = 1, limit = 3 } = req.query; // Default to page 1, 3 comments per page

  try {
    const comments = await Comment.find({ answer: answerId })
                                  .sort({ comment_date_time: -1 })
                                  .skip((page - 1) * limit)
                                  .limit(limit);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new comment
app.post('/api/answers/:answerId/comments', async (req, res) => {
  const { answerId } = req.params;
  const { text, commented_by } = req.body;

  const newComment = new Comment({ text, commented_by, answer: answerId });

  try {
    await newComment.save();
    await Answer.findByIdAndUpdate(answerId, { $push: { comments: newComment._id } });
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/comments/:commentId', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }
    res.json(comment);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// POST /api/answers/:answerId/vote
app.post('/api/answers/:answerId/vote', async (req, res) => {
  const { userId, voteType } = req.body; // voteType: 'up' or 'down'
  try {
    const answer = await Answer.findById(req.params.answerId);
    const user = await User.findById(userId);
    if (voteType === 'up') {
      user.reputation += 5; // Increase reputation
    } else {
      user.reputation -= 10; // Decrease reputation
    }
    await user.save();
    res.status(200).send('Vote registered successfully');
  } catch (error) {
    res.status(500).send('Error processing vote');
  }
});

app.post('/api/questions/:questionId/vote', async (req, res) => {
  const { questionId } = req.params;
  const { voteType } = req.body; // up or down

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }


    res.status(200).json({ message: 'Vote updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

app.post('/api/comments/:commentId/vote', async (req, res) => {
  const { commentId } = req.params;
  const { userId, voteType } = req.body;  // 'up' or 'down'

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).send('Comment not found');
    }
    await comment.save();
    res.json({ message: "Vote updated successfully", votes: comment.votes });
  } catch (error) {
    console.error('Voting error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.toString() });
  }
});

app.get('/api/users/:userId', async (req, res) => {
  try {
      const user = await User.findById(req.params.userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

app.post('/api/:type/:id/vote', async (req, res) => {
  const { id, type } = req.params;
  const { userId, voteType } = req.body; // 'up', 'down', or null

  try {
    const user = await User.findById(userId);
    const PostModel = mongoose.model(type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1));
    const post = await PostModel.findById(id);

    if (!user || !post) return res.status(404).json({ message: 'User or post not found' });

    const currentVote = user.votes[type]?.get(id);
    if (currentVote === voteType) {
      // If same vote, remove vote
      user.votes[type].delete(id);
      post.votes += (voteType === 'up' ? -1 : 1);
    } else {
      user.votes[type].set(id, voteType);
      if (currentVote) {
        post.votes += (currentVote === 'up' ? -2 : 2);
      } else {
        post.votes += (voteType === 'up' ? 1 : -1);
      }
    }

    await user.save();
    await post.save();

    res.json({ message: 'Vote updated successfully', votes: post.votes });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
      const users = await User.find({}).select('_id');
      res.json(users); // Send user IDs as JSON response
  } catch (error) {
      console.error('Failed to fetch user IDs:', error);
      res.status(500).json({ message: 'Failed to fetch user IDs', error: error.message });
  }
});



app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
