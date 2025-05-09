#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const MONKEYTYPE_API_BASE_URL = 'https://api.monkeytype.com';

// Base schema that all tools will extend - no API key parameter, only using environment variable
const BaseApiSchema = z.object({});

// User tools
const CheckNameSchema = BaseApiSchema.extend({
  name: z.string().describe("Username to check for availability")
});

const GetPersonalBestsSchema = BaseApiSchema.extend({
  mode: z.string().optional().describe("Mode for personal bests (time, words, quote, zen). Defaults to 'time'"),
  mode2: z.string().optional().describe("Secondary mode parameter (e.g., 15, 60 for time mode). Defaults to '60'")
});

const GetTagsSchema = BaseApiSchema.extend({});

const GetStatsSchema = BaseApiSchema.extend({});

const GetProfileSchema = BaseApiSchema.extend({});

const SendForgotPasswordEmailSchema = BaseApiSchema.extend({
  email: z.string().email().describe("Email address to send password reset link")
});

const GetCurrentTestActivitySchema = BaseApiSchema.extend({});

const GetStreakSchema = BaseApiSchema.extend({});

// Test results tools
const GetResultsSchema = BaseApiSchema.extend({
  timestamp: z.number().optional().describe("Timestamp of the earliest result to fetch"),
  offset: z.number().optional().describe("Offset of the item at which to begin the response"),
  limit: z.number().optional().describe("Limit results to the given amount")
});

const GetResultByIdSchema = BaseApiSchema.extend({
  resultId: z.string().describe("ID of the result to retrieve")
});

const GetLastResultSchema = BaseApiSchema.extend({});

// Public tools
const GetSpeedHistogramSchema = BaseApiSchema.extend({});

const GetTypingStatsSchema = BaseApiSchema.extend({});

// Leaderboards tools
const GetLeaderboardSchema = BaseApiSchema.extend({
  language: z.string().describe("Language for the leaderboard"),
  mode: z.string().describe("Mode for the leaderboard (time, words, quote, zen)"),
  mode2: z.string().describe("Secondary mode parameter (e.g., 15, 60, etc.)"),
  skip: z.number().optional().describe("Number of entries to skip"),
  limit: z.number().optional().describe("Number of entries to return")
});

const GetLeaderboardRankSchema = BaseApiSchema.extend({
  language: z.string().describe("Language for the leaderboard"),
  mode: z.string().describe("Mode for the leaderboard (time, words, quote, zen)"),
  mode2: z.string().describe("Secondary mode parameter (e.g., 15, 60, etc.)")
});

const GetDailyLeaderboardSchema = BaseApiSchema.extend({
  language: z.string().optional().describe("Language for the leaderboard"),
  mode: z.string().optional().describe("Mode for the leaderboard (time, words, quote, zen)"),
  mode2: z.string().optional().describe("Secondary mode parameter (e.g., 15, 60, etc.)"),
  skip: z.number().optional().describe("Number of entries to skip"),
  limit: z.number().optional().describe("Number of entries to return")
});

const GetWeeklyXpLeaderboardSchema = BaseApiSchema.extend({
  skip: z.number().optional().describe("Number of entries to skip"),
  limit: z.number().optional().describe("Number of entries to return")
});

// PSAs tools
const GetPsasSchema = BaseApiSchema.extend({});

// Quotes tools
const IsSubmissionEnabledSchema = BaseApiSchema.extend({});

// Server configuration tools
const GetConfigurationSchema = BaseApiSchema.extend({});

// Server setup
const server = new Server(
  {
    name: "monkeytype-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Tool implementations
async function callMonkeyTypeApi(endpoint, method, apiKey, params = {}, data = null) {
  try {
    const headers = {
      'Authorization': `ApeKey ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'MonkeyType-MCP-Server/1.0.0'
    };

    const config = {
      headers,
      timeout: 30000,
      validateStatus: status => status < 500
    };

    if (method === 'GET' && Object.keys(params).length > 0) {
      config.params = params;
    }

    let response;
    if (method === 'GET') {
      response = await axios.get(`${MONKEYTYPE_API_BASE_URL}${endpoint}`, config);
    } else if (method === 'POST') {
      response = await axios.post(`${MONKEYTYPE_API_BASE_URL}${endpoint}`, data, config);
    }

    return response.data;
  } catch (error) {
    console.error(`Error calling MonkeyType API: ${error.message}`);
    if (error.response) {
      return { 
        error: error.response.data, 
        statusCode: error.response.status 
      };
    }
    return { 
      error: error.message 
    };
  }
}

// Expose tools to the LLM
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // User Tools
      {
        name: "check_username",
        description: "Check if a username is available on MonkeyType",
        inputSchema: zodToJsonSchema(CheckNameSchema),
      },
      {
        name: "get_personal_bests",
        description: "Get user's personal best typing scores",
        inputSchema: zodToJsonSchema(GetPersonalBestsSchema),
      },
      {
        name: "get_tags",
        description: "Get user's tags",
        inputSchema: zodToJsonSchema(GetTagsSchema),
      },
      {
        name: "get_stats",
        description: "Get user's typing statistics",
        inputSchema: zodToJsonSchema(GetStatsSchema),
      },
      {
        name: "get_profile",
        description: "Get user's profile information",
        inputSchema: zodToJsonSchema(GetProfileSchema),
      },
      {
        name: "send_forgot_password_email",
        description: "Send a forgot password email to a user",
        inputSchema: zodToJsonSchema(SendForgotPasswordEmailSchema),
      },
      {
        name: "get_current_test_activity",
        description: "Get user's current test activity",
        inputSchema: zodToJsonSchema(GetCurrentTestActivitySchema),
      },
      {
        name: "get_streak",
        description: "Get user's typing streak information",
        inputSchema: zodToJsonSchema(GetStreakSchema),
      },
      
      // Test Results Tools
      {
        name: "get_results",
        description: "Get user's typing test results",
        inputSchema: zodToJsonSchema(GetResultsSchema),
      },
      {
        name: "get_result_by_id",
        description: "Get a specific typing test result by ID",
        inputSchema: zodToJsonSchema(GetResultByIdSchema),
      },
      {
        name: "get_last_result",
        description: "Get user's last typing test result",
        inputSchema: zodToJsonSchema(GetLastResultSchema),
      },
      
      // Public Tools
      {
        name: "get_speed_histogram",
        description: "Get speed histogram data",
        inputSchema: zodToJsonSchema(GetSpeedHistogramSchema),
      },
      {
        name: "get_typing_stats",
        description: "Get global typing statistics",
        inputSchema: zodToJsonSchema(GetTypingStatsSchema),
      },
      
      // Leaderboards Tools
      {
        name: "get_leaderboard",
        description: "Get typing test leaderboard",
        inputSchema: zodToJsonSchema(GetLeaderboardSchema),
      },
      {
        name: "get_leaderboard_rank",
        description: "Get user's rank on the leaderboard",
        inputSchema: zodToJsonSchema(GetLeaderboardRankSchema),
      },
      {
        name: "get_daily_leaderboard",
        description: "Get daily typing test leaderboard",
        inputSchema: zodToJsonSchema(GetDailyLeaderboardSchema),
      },
      {
        name: "get_weekly_xp_leaderboard",
        description: "Get weekly XP leaderboard",
        inputSchema: zodToJsonSchema(GetWeeklyXpLeaderboardSchema),
      },
      
      // PSAs Tools
      {
        name: "get_psas",
        description: "Get public service announcements",
        inputSchema: zodToJsonSchema(GetPsasSchema),
      },
      
      // Quotes Tools
      {
        name: "is_submission_enabled",
        description: "Check if quote submission is enabled",
        inputSchema: zodToJsonSchema(IsSubmissionEnabledSchema),
      },
      
      // Server Configuration Tools
      {
        name: "get_configuration",
        description: "Get server configuration",
        inputSchema: zodToJsonSchema(GetConfigurationSchema),
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    // Extract the API key from environment variable only
    const apiKey = process.env.MONKEYTYPE_API_KEY;
    if (!apiKey) {
      throw new Error("MONKEYTYPE_API_KEY environment variable is required. Please set it in your MCP server configuration.");
    }

    // Handle each tool
    switch (name) {
      // User Tools
      case "check_username": {
        const result = await callMonkeyTypeApi(`/api/v1/users/check-name/${args.name}`, 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "get_personal_bests": {
        // Add required mode parameter
        const params = {
          mode: args.mode || "time", // Default to time mode if not specified
          mode2: args.mode2 || "60" // Default to 60 seconds if not specified
        };
        
        // The correct endpoint is /api/v1/users/personalBests
        const result = await callMonkeyTypeApi('/api/v1/users/personalBests', 'GET', apiKey, params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "get_tags": {
        const result = await callMonkeyTypeApi('/api/v1/users/tags', 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "get_stats": {
        const result = await callMonkeyTypeApi('/api/v1/users/stats', 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "get_profile": {
        // The correct endpoint is /api/v1/users/profile
        const result = await callMonkeyTypeApi('/api/v1/users/profile', 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "send_forgot_password_email": {
        const result = await callMonkeyTypeApi('/api/v1/users/forgotPassword', 'POST', apiKey, {}, {
          email: args.email
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "get_current_test_activity": {
        const result = await callMonkeyTypeApi('/api/v1/users/activity/current', 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "get_streak": {
        const result = await callMonkeyTypeApi('/api/v1/users/streak', 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      // Test Results Tools
      case "get_results": {
        const params = {};
        if (args.timestamp) params.timestamp = args.timestamp;
        if (args.offset) params.offset = args.offset;
        if (args.limit) params.limit = args.limit;
        
        const result = await callMonkeyTypeApi('/api/v1/results', 'GET', apiKey, params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "get_result_by_id": {
        const result = await callMonkeyTypeApi(`/api/v1/results/${args.resultId}`, 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "get_last_result": {
        const result = await callMonkeyTypeApi('/api/v1/results/last', 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      // Public Tools
      case "get_speed_histogram": {
        const result = await callMonkeyTypeApi('/api/v1/public/speedHistogram', 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "get_typing_stats": {
        const result = await callMonkeyTypeApi('/api/v1/public/typingStats', 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      // Leaderboards Tools
      case "get_leaderboard": {
        const params = {
          language: args.language,
          mode: args.mode,
          mode2: args.mode2
        };
        
        if (args.skip) params.skip = args.skip;
        if (args.limit) params.limit = args.limit;
        
        const result = await callMonkeyTypeApi('/api/v1/leaderboards', 'GET', apiKey, params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "get_leaderboard_rank": {
        const params = {
          language: args.language,
          mode: args.mode,
          mode2: args.mode2
        };
        
        const result = await callMonkeyTypeApi('/api/v1/leaderboards/rank', 'GET', apiKey, params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "get_daily_leaderboard": {
        const params = {};
        if (args.language) params.language = args.language;
        if (args.mode) params.mode = args.mode;
        if (args.mode2) params.mode2 = args.mode2;
        if (args.skip) params.skip = args.skip;
        if (args.limit) params.limit = args.limit;
        
        const result = await callMonkeyTypeApi('/api/v1/leaderboards/daily', 'GET', apiKey, params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      case "get_weekly_xp_leaderboard": {
        const params = {};
        if (args.skip) params.skip = args.skip;
        if (args.limit) params.limit = args.limit;
        
        const result = await callMonkeyTypeApi('/api/v1/leaderboards/weeklyXp', 'GET', apiKey, params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      // PSAs Tools
      case "get_psas": {
        const result = await callMonkeyTypeApi('/api/v1/psas', 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      // Quotes Tools
      case "is_submission_enabled": {
        const result = await callMonkeyTypeApi('/api/v1/quotes/submission-enabled', 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      // Server Configuration Tools
      case "get_configuration": {
        const result = await callMonkeyTypeApi('/api/v1/configuration', 'GET', apiKey);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MonkeyType MCP Server running on stdio");
  console.error("All MonkeyType API endpoints exposed as tools");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
