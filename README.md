# MonkeyType API MCP Server

This is a Model Context Protocol (MCP) server that provides access to all endpoints of the [MonkeyType API](https://api.monkeytype.com/docs/). The server acts as a proxy between clients and the MonkeyType API, handling authentication and requests.

## Features

- Exposes all MonkeyType API endpoints
- Easy-to-use RESTful interface
- Handles authentication with ApeKey
- Proper error handling
- Rate limit awareness (respects MonkeyType's rate limits)

## API Endpoints

The server exposes the following MonkeyType API endpoints:

### Users
- `GET /users/check-name/:name` - Check if a username is available
- `GET /users/personalBests` - Get user's personal bests
- `GET /users/tags` - Get user's tags
- `GET /users/stats` - Get user's stats
- `GET /users/profile` - Get user's profile
- `POST /users/forgotPassword` - Send forgot password email
- `GET /users/activity/current` - Get current test activity
- `GET /users/streak` - Get user's streak

### Test Results
- `GET /results` - Get up to 1000 test results
- `GET /results/:resultId` - Get result by ID
- `GET /results/last` - Get last result

### Public
- `GET /public/speedHistogram` - Get speed histogram
- `GET /public/typingStats` - Get typing stats

### Leaderboards
- `GET /leaderboards` - Get leaderboard
- `GET /leaderboards/rank` - Get leaderboard rank
- `GET /leaderboards/daily` - Get daily leaderboard
- `GET /leaderboards/weeklyXp` - Get weekly XP leaderboard

### PSAs
- `GET /psas` - Get PSAs

### Quotes
- `GET /quotes/submission-enabled` - Check if quote submission is enabled

### Server Configuration
- `GET /configuration` - Get server configuration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A MonkeyType API key (ApeKey)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/monkeytype-mcp-server.git
   cd monkeytype-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   MONKEYTYPE_API_KEY=your_ape_key_here
   ```

4. Start the server:
   ```bash
   npm start
   ```

The server will be running at `http://localhost:3000`.

## How to Get Your MonkeyType API Key (ApeKey)

To get your own MonkeyType API key (ApeKey), follow these steps:

1. Sign in to your [MonkeyType](https://monkeytype.com/) account
2. Click on your profile icon in the top right corner
3. Select "Account" from the dropdown menu
4. Navigate to the "Ape Keys" tab
5. Click "Generate New" to create a new API key
6. Give your key a name (e.g., "MCP Server")
7. Select the appropriate scopes based on what endpoints you need to access
8. Click "Generate"
9. Copy the generated key and add it to your `.env` file

**Important**: Keep your API key secure and never share it publicly.

## Using the MCP Server

To use this server, you need to include your MonkeyType API key (ApeKey) in the request. There are two ways to do this:

1. Add the key as an `x-api-key` header:
   ```
   curl -H "x-api-key: YOUR_APE_KEY" http://localhost:3000/users/profile
   ```

2. Include the key as a query parameter:
   ```
   curl http://localhost:3000/users/profile?apiKey=YOUR_APE_KEY
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [MonkeyType](https://monkeytype.com/) for providing the API
- [Model Context Protocol (MCP)](https://github.com/microsoft/mcp) for the server architecture

## Disclaimer

This project is not officially affiliated with MonkeyType. Use at your own risk and ensure you comply with MonkeyType's terms of service and API rate limits.
