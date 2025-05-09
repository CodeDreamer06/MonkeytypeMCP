const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const MONKEYTYPE_API_BASE_URL = 'https://api.monkeytype.com';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to check for API key
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({ 
      message: 'API key is required. Please provide it in the x-api-key header or as an apiKey query parameter.' 
    });
  }
  
  // Store the API key for use in the routes
  req.monkeytypeApiKey = apiKey;
  next();
};

// Apply API key validation middleware to all routes
app.use(validateApiKey);

// Proxy function to forward requests to Monkeytype API
const proxyRequest = async (req, res, method, endpoint, data = null) => {
  try {
    const headers = {
      'Authorization': `ApeKey ${req.monkeytypeApiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'MonkeyType-MCP-Server/1.0.0'
    };

    const url = `${MONKEYTYPE_API_BASE_URL}${endpoint}`;
    console.log(`Making ${method} request to: ${url}`);
    console.log('Headers:', JSON.stringify(headers, null, 2));
    
    // Remove apiKey from query parameters if present as we're sending it in the header
    const queryParams = { ...req.query };
    delete queryParams.apiKey;
    
    // Configure axios request with timeout and proper error handling
    const axiosConfig = {
      headers,
      timeout: 30000, // 30 second timeout
      validateStatus: status => status < 500, // Handle 4xx responses as successful requests
      maxRedirects: 5
    };
    
    if (method === 'GET') {
      axiosConfig.params = queryParams;
    }
    
    let response;
    try {
      if (method === 'GET') {
        response = await axios.get(url, axiosConfig);
      } else if (method === 'POST') {
        response = await axios.post(url, data || req.body, axiosConfig);
      } else if (method === 'PUT') {
        response = await axios.put(url, data || req.body, axiosConfig);
      } else if (method === 'DELETE') {
        response = await axios.delete(url, { ...axiosConfig, data: data || req.body });
      }
      
      console.log(`Response status: ${response.status}`);
      res.status(response.status).json(response.data);
    } catch (axiosError) {
      console.error(`Axios error for ${endpoint}:`, axiosError.message);
      
      // Handle axios errors
      if (axiosError.response) {
        // The request was made and the server responded with a status code outside of 2xx-4xx range
        console.error('API Error Response:', axiosError.response.status, axiosError.response.data);
        return res.status(axiosError.response.status).json({
          message: 'MonkeyType API error',
          error: axiosError.response.data
        });
      } else if (axiosError.request) {
        // The request was made but no response was received
        console.error('No response received:', axiosError.request);
        return res.status(504).json({
          message: 'No response received from MonkeyType API',
          error: 'Gateway Timeout'
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', axiosError.message);
        return res.status(500).json({
          message: 'Error setting up request to MonkeyType API',
          error: axiosError.message
        });
      }
    }
  } catch (error) {
    // Catch any other unexpected errors
    console.error(`Unexpected error proxying to ${endpoint}:`, error);
    
    res.status(500).json({ 
      message: 'An unexpected error occurred while communicating with the Monkeytype API',
      error: error.message,
      details: error.stack
    });
  }
};

// ==================== ROUTES ====================

// ============= Users Routes =============
// Check name
app.get('/users/check-name/:name', (req, res) => {
  proxyRequest(req, res, 'GET', `/users/check-name/${req.params.name}`);
});

// Get personal bests
app.get('/users/personalBests', (req, res) => {
  proxyRequest(req, res, 'GET', '/users/personalBests');
});

// Get tags
app.get('/users/tags', (req, res) => {
  proxyRequest(req, res, 'GET', '/users/tags');
});

// Get stats
app.get('/users/stats', (req, res) => {
  proxyRequest(req, res, 'GET', '/users/stats');
});

// Get profile
app.get('/users/profile', (req, res) => {
  proxyRequest(req, res, 'GET', '/users/profile');
});

// Send forgot password email
app.post('/users/forgotPassword', (req, res) => {
  proxyRequest(req, res, 'POST', '/users/forgotPassword');
});

// Get current test activity
app.get('/users/activity/current', (req, res) => {
  proxyRequest(req, res, 'GET', '/users/activity/current');
});

// Get streak
app.get('/users/streak', (req, res) => {
  proxyRequest(req, res, 'GET', '/users/streak');
});

// ============= Test Results Routes =============
// Get results
app.get('/results', (req, res) => {
  proxyRequest(req, res, 'GET', '/results');
});

// Get result by id
app.get('/results/:resultId', (req, res) => {
  proxyRequest(req, res, 'GET', `/results/${req.params.resultId}`);
});

// Get last result
app.get('/results/last', (req, res) => {
  proxyRequest(req, res, 'GET', '/results/last');
});

// ============= Public Routes =============
// Get speed histogram
app.get('/public/speedHistogram', (req, res) => {
  proxyRequest(req, res, 'GET', '/public/speedHistogram');
});

// Get typing stats
app.get('/public/typingStats', (req, res) => {
  proxyRequest(req, res, 'GET', '/public/typingStats');
});

// ============= Leaderboards Routes =============
// Get leaderboard
app.get('/leaderboards', (req, res) => {
  proxyRequest(req, res, 'GET', '/leaderboards');
});

// Get leaderboard rank
app.get('/leaderboards/rank', (req, res) => {
  proxyRequest(req, res, 'GET', '/leaderboards/rank');
});

// Get daily leaderboard
app.get('/leaderboards/daily', (req, res) => {
  proxyRequest(req, res, 'GET', '/leaderboards/daily');
});

// Get weekly xp leaderboard
app.get('/leaderboards/weeklyXp', (req, res) => {
  proxyRequest(req, res, 'GET', '/leaderboards/weeklyXp');
});

// ============= PSAs Routes =============
// Get PSAs
app.get('/psas', (req, res) => {
  proxyRequest(req, res, 'GET', '/psas');
});

// ============= Quotes Routes =============
// Is submission enabled
app.get('/quotes/submission-enabled', (req, res) => {
  proxyRequest(req, res, 'GET', '/quotes/submission-enabled');
});

// ============= Server Configuration Routes =============
// Get configuration
app.get('/configuration', (req, res) => {
  proxyRequest(req, res, 'GET', '/configuration');
});

// ============= API Information and Status =============
app.get('/', (req, res) => {
  res.json({
    name: 'MonkeyType API MCP Server',
    version: '1.0.0',
    description: 'An MCP server for the MonkeyType API',
    documentation: 'https://api.monkeytype.com/docs/',
    endpoints: [
      '/users/check-name/:name',
      '/users/personalBests',
      '/users/tags',
      '/users/stats',
      '/users/profile',
      '/users/forgotPassword',
      '/users/activity/current',
      '/users/streak',
      '/results',
      '/results/:resultId',
      '/results/last',
      '/public/speedHistogram',
      '/public/typingStats',
      '/leaderboards',
      '/leaderboards/rank',
      '/leaderboards/daily',
      '/leaderboards/weeklyXp',
      '/psas',
      '/quotes/submission-enabled',
      '/configuration'
    ]
  });
});

// Start the server
app.listen(port, () => {
  console.log(`MonkeyType API MCP Server listening at http://localhost:${port}`);
});
