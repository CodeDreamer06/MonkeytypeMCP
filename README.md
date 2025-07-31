# MonkeyType MCP Server

This is a Model Context Protocol (MCP) server that provides access to all endpoints of the [MonkeyType API](https://api.monkeytype.com/docs/). The server exposes MCP tools that allow Large Language Models (LLMs) to interact with the MonkeyType API.

<a href="https://glama.ai/mcp/servers/@CodeDreamer06/MonkeytypeMCP">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@CodeDreamer06/MonkeytypeMCP/badge" alt="MonkeyType Server MCP server" />
</a>

## Features

- Exposes all MonkeyType API endpoints as MCP tools
- Compatible with any LLM that supports the Model Context Protocol
- Simple API key-based authentication per tool call
- Comprehensive error handling
- Rate limit awareness (respects MonkeyType's rate limits)

## Installation

### Using npx (Recommended)

The easiest way to run the server is using npx:

```bash
npx monkeytype-mcp
```

This will download and run the latest version of the server directly.

### Global Installation

You can also install the package globally:

```bash
npm install -g monkeytype-mcp
monkeytype-mcp
```

### Manual Installation

If you prefer to clone the repository:

```bash
git clone https://github.com/CodeDreamer06/MonkeytypeMCP.git
cd MonkeytypeMCP
npm install
npm start
```

## Available Tools

The server exposes the following MonkeyType API endpoints as MCP tools:

### User Tools
- `check_username` - Check if a username is available
- `get_personal_bests` - Get user's personal bests
- `get_tags` - Get user's tags
- `get_stats` - Get user's stats
- `get_profile` - Get user's profile
- `send_forgot_password_email` - Send forgot password email
- `get_current_test_activity` - Get current test activity
- `get_streak` - Get user's streak

### Test Results Tools
- `get_results` - Get up to 1000 test results
- `get_result_by_id` - Get result by ID
- `get_last_result` - Get last result

### Public Tools
- `get_speed_histogram` - Get speed histogram
- `get_typing_stats` - Get typing stats

### Leaderboards Tools
- `get_leaderboard` - Get leaderboard
- `get_leaderboard_rank` - Get leaderboard rank
- `get_daily_leaderboard` - Get daily leaderboard
- `get_weekly_xp_leaderboard` - Get weekly XP leaderboard

### PSAs Tools
- `get_psas` - Get PSAs

### Quotes Tools
- `is_submission_enabled` - Check if quote submission is enabled

### Server Configuration Tools
- `get_configuration` - Get server configuration

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
9. Copy the generated key

**Important**: Keep your API key secure and never share it publicly.

## Using the MCP Server with LLMs

To use this server with an LLM, you'll need to configure the LLM to use this server for MCP tool calls. You must provide your MonkeyType API key (ApeKey) by setting the `MONKEYTYPE_API_KEY` environment variable in your MCP server configuration.

### Environment Variables

-   `MONKEYTYPE_API_KEY`: (Required) Your MonkeyType API key. You can obtain this from your account settings on monkeytype.com.
-   `MONKEYTYPE_USERNAME`: (Optional) Your MonkeyType username or UID. This can be used by certain tools (like `get_profile`) as a default or when specific keywords are used.

### Example Tool Call

```json
{
  "name": "get_configuration",
  "arguments": {}
}
```

### Integration with LLM Platforms

To integrate this server with LLM platforms like OpenAI, Anthropic, or others:

1. Start the MCP server using one of the installation methods above
2. Configure your LLM platform to use this server as an MCP tool provider
3. Pass the server's stdio as the communication channel

## IDE Integration

### MCP Configuration

To add MonkeyType MCP to your IDE, add this to your IDE's MCP config file:

```json
{
  "mcpServers": {
    "monkeytype": {
      "command": "sh",
      "args": ["-c", "cd $(mktemp -d) && npm install monkeytype-mcp && npx monkeytype-mcp"],
      "env": {
        "MONKEYTYPE_API_KEY": "YOUR_APE_KEY_HERE"
      }
    }
  }
}
```

### Config file locations:

- Cursor: `~/.cursor/mcp.json`
- Windsurf: `~/.codeium/windsurf/mcp_config.json`
- Cline: `~/.cline/mcp_config.json`
- Claude: `~/.claude/mcp_config.json`

### VS Code Integration

To use this MCP server in VS Code:

1. Open VS Code settings
2. Search for "MCP Server"
3. Add a new MCP server with the following configuration:
   - Name: MonkeyType MCP
   - Command: `npx monkeytype-mcp`
   - Type: Standard Input/Output (stdio)

## Available Tools

The server exposes the following MonkeyType API endpoints as MCP tools:

### User Tools
- `check_username` - Check if a username is available
- `get_personal_bests` - Get user's personal bests
- `get_tags` - Get user's tags
- `get_stats` - Get user's stats
- `get_profile` - Get user's profile
- `send_forgot_password_email` - Send forgot password email
- `get_current_test_activity` - Get current test activity
- `get_streak` - Get user's streak

#### `get_profile`

Fetches a user's public profile.

**Parameters:**

*   `uidOrName` (string, optional): The UID or username of the user whose profile is to be fetched.
    *   If you provide a specific username or UID, that user's profile will be fetched.
    *   You can use keywords like "me", "self", "current", or "my". If one of these keywords is used, the tool will use the `MONKEYTYPE_USERNAME` environment variable (if set).
    *   If this parameter is omitted entirely, the tool will also attempt to use the `MONKEYTYPE_USERNAME` environment variable (if set).
    *   If the `uidOrName` parameter is omitted (or a keyword is used) and the `MONKEYTYPE_USERNAME` environment variable is not set, an error will occur.

### Test Results Tools
- `get_results` - Get up to 1000 test results
- `get_result_by_id` - Get result by ID
- `get_last_result` - Get last result

### Public Tools
- `get_speed_histogram` - Get speed histogram
- `get_typing_stats` - Get typing stats

### Leaderboards Tools
- `get_leaderboard` - Get leaderboard
- `get_leaderboard_rank` - Get leaderboard rank
- `get_daily_leaderboard` - Get daily leaderboard
- `get_weekly_xp_leaderboard` - Get weekly XP leaderboard

### PSAs Tools
- `get_psas` - Get PSAs

### Quotes Tools
- `is_submission_enabled` - Check if quote submission is enabled

### Server Configuration Tools
- `get_configuration` - Get server configuration

## Publishing

If you're making changes to this server and want to publish your own version:

```bash
npm login
npm publish
```

## GitHub Repository

This project is hosted on GitHub at [https://github.com/CodeDreamer06/MonkeytypeMCP](https://github.com/CodeDreamer06/MonkeytypeMCP).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [MonkeyType](https://monkeytype.com/) for providing the API
- [Model Context Protocol (MCP)](https://github.com/microsoft/mcp) for the server architecture

## Disclaimer

This project is not officially affiliated with MonkeyType. Use at your own risk and ensure you comply with MonkeyType's terms of service and API rate limits.