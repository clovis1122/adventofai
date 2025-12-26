#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Wish storage
const wishes = [];
let nextId = 1;

// Category types
const CATEGORIES = ['toy', 'experience', 'kindness', 'magic'];
const PRIORITIES = ['dream wish', 'hopeful wish', 'small wish'];

// Create server instance
const server = new Server(
  {
    name: "winter-wishlist",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Generate beautiful HTML UI for wishes
function generateWishboxUI(wishes) {
  const wishesHtml = wishes.map(wish => {
    const priorityClass = wish.priority.replace(' ', '-');
    const grantedClass = wish.granted ? 'granted' : '';
    const grantedIcon = wish.granted ? '✨' : '';
    
    return `
      <div class="wish-card ${priorityClass} ${grantedClass}">
        <div class="wish-header">
          <span class="wish-category">${wish.category}</span>
          <span class="wish-priority">${wish.priority}</span>
        </div>
        <div class="wish-content">
          <p class="wish-text">${wish.wish}</p>
          ${wish.granted ? `<span class="granted-badge">${grantedIcon} Granted!</span>` : ''}
        </div>
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Winter Wishbox ✨</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .wishbox-container {
      max-width: 800px;
      width: 100%;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .header h1 {
      font-size: 2.5em;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }

    .header p {
      color: #666;
      font-size: 1.1em;
    }

    .wishes-container {
      display: grid;
      gap: 20px;
    }

    .wish-card {
      background: white;
      border-radius: 15px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border-left: 5px solid #ccc;
    }

    .wish-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .dream-wish {
      border-left-color: #f093fb;
      background: linear-gradient(135deg, #fff 0%, #fef5ff 100%);
      box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
    }

    .dream-wish:hover {
      box-shadow: 0 8px 30px rgba(240, 147, 251, 0.5);
    }

    .hopeful-wish {
      border-left-color: #4facfe;
      background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
    }

    .small-wish {
      border-left-color: #43e97b;
      background: linear-gradient(135deg, #fff 0%, #f0fff5 100%);
    }

    .granted {
      opacity: 0.8;
      position: relative;
      overflow: hidden;
    }

    .granted::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg,
        transparent,
        rgba(255, 215, 0, 0.3),
        transparent
      );
      animation: sparkle 3s infinite;
    }

    @keyframes sparkle {
      0%, 100% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(180deg);
      }
    }

    .wish-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      font-size: 0.85em;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .wish-category {
      color: #667eea;
    }

    .wish-priority {
      color: #764ba2;
    }

    .wish-content {
      position: relative;
    }

    .wish-text {
      font-size: 1.2em;
      color: #333;
      line-height: 1.6;
    }

    .granted-badge {
      display: inline-block;
      margin-top: 10px;
      padding: 5px 15px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border-radius: 20px;
      font-size: 0.9em;
      font-weight: 600;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .empty-state-icon {
      font-size: 4em;
      margin-bottom: 20px;
    }

    .empty-state p {
      font-size: 1.2em;
    }

    .stats {
      display: flex;
      justify-content: space-around;
      margin-top: 30px;
      padding-top: 30px;
      border-top: 2px solid #f0f0f0;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      font-size: 2em;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .stat-label {
      font-size: 0.9em;
      color: #666;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="wishbox-container">
    <div class="header">
      <h1>✨ Winter Wishbox ✨</h1>
      <p>Your magical collection of wishes</p>
    </div>
    
    ${wishes.length > 0 ? `
      <div class="wishes-container">
        ${wishesHtml}
      </div>
      
      <div class="stats">
        <div class="stat">
          <div class="stat-value">${wishes.length}</div>
          <div class="stat-label">Total Wishes</div>
        </div>
        <div class="stat">
          <div class="stat-value">${wishes.filter(w => w.granted).length}</div>
          <div class="stat-label">Granted</div>
        </div>
        <div class="stat">
          <div class="stat-value">${wishes.filter(w => !w.granted).length}</div>
          <div class="stat-label">Pending</div>
        </div>
      </div>
    ` : `
      <div class="empty-state">
        <div class="empty-state-icon">🌟</div>
        <p>Your wishbox is empty</p>
        <p style="margin-top: 10px; font-size: 0.9em;">Make your first wish to get started!</p>
      </div>
    `}
  </div>
</body>
</html>
  `;
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add_wish",
        description: "Add a new wish to the wishbox. Requires the wish text, category (toy/experience/kindness/magic), and priority (dream wish/hopeful wish/small wish).",
        inputSchema: {
          type: "object",
          properties: {
            wish: {
              type: "string",
              description: "The wish text",
            },
            category: {
              type: "string",
              enum: CATEGORIES,
              description: "The category of the wish",
            },
            priority: {
              type: "string",
              enum: PRIORITIES,
              description: "How much you want this wish",
            },
          },
          required: ["wish", "category", "priority"],
        },
      },
      {
        name: "grant_wish",
        description: "Mark a wish as granted. Provide the wish ID or text to identify which wish came true.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The ID of the wish to grant",
            },
            wish_text: {
              type: "string",
              description: "Part of the wish text to identify it",
            },
          },
        },
      },
      {
        name: "remove_wish",
        description: "Remove a wish from the wishbox. Provide the wish ID or text to identify which wish to release.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The ID of the wish to remove",
            },
            wish_text: {
              type: "string",
              description: "Part of the wish text to identify it",
            },
          },
        },
      },
    ],
  };
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "wishbox://ui",
        mimeType: "text/html",
        name: "Wishbox UI",
        description: "Beautiful visual display of all wishes",
      },
      {
        uri: "wishbox://wishes",
        mimeType: "application/json",
        name: "Wishes Data",
        description: "Raw JSON data of all wishes",
      },
    ],
  };
});

// Handle resource reading
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === "wishbox://ui") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/html",
          text: generateWishboxUI(wishes),
        },
      ],
    };
  }

  if (uri === "wishbox://wishes") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(wishes, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "add_wish") {
      const { wish, category, priority } = args;

      if (!wish || !category || !priority) {
        throw new Error("Missing required fields: wish, category, and priority are all required");
      }

      if (!CATEGORIES.includes(category)) {
        throw new Error(`Invalid category. Must be one of: ${CATEGORIES.join(', ')}`);
      }

      if (!PRIORITIES.includes(priority)) {
        throw new Error(`Invalid priority. Must be one of: ${PRIORITIES.join(', ')}`);
      }

      const newWish = {
        id: nextId++,
        wish,
        category,
        priority,
        granted: false,
        createdAt: new Date().toISOString(),
      };

      wishes.push(newWish);

      return {
        content: [
          {
            type: "text",
            text: `✨ Wish added successfully! (ID: ${newWish.id})\n\n${wish}\n\nCategory: ${category}\nPriority: ${priority}`,
          },
          {
            type: "resource",
            resource: {
              uri: "wishbox://ui",
              mimeType: "text/html",
              text: generateWishboxUI(wishes),
            },
          },
        ],
      };
    }

    if (name === "grant_wish") {
      const { id, wish_text } = args;
      let wish;

      if (id) {
        wish = wishes.find(w => w.id === id);
      } else if (wish_text) {
        wish = wishes.find(w => w.wish.toLowerCase().includes(wish_text.toLowerCase()));
      }

      if (!wish) {
        throw new Error("Wish not found. Please provide a valid wish ID or text.");
      }

      wish.granted = true;
      wish.grantedAt = new Date().toISOString();

      return {
        content: [
          {
            type: "text",
            text: `🧚✨ Wish granted!\n\n"${wish.wish}" has come true!`,
          },
          {
            type: "resource",
            resource: {
              uri: "wishbox://ui",
              mimeType: "text/html",
              text: generateWishboxUI(wishes),
            },
          },
        ],
      };
    }

    if (name === "remove_wish") {
      const { id, wish_text } = args;
      let wishIndex;

      if (id) {
        wishIndex = wishes.findIndex(w => w.id === id);
      } else if (wish_text) {
        wishIndex = wishes.findIndex(w => w.wish.toLowerCase().includes(wish_text.toLowerCase()));
      }

      if (wishIndex === -1) {
        throw new Error("Wish not found. Please provide a valid wish ID or text.");
      }

      const removedWish = wishes.splice(wishIndex, 1)[0];

      return {
        content: [
          {
            type: "text",
            text: `🍃 Wish released: "${removedWish.wish}"`,
          },
          {
            type: "resource",
            resource: {
              uri: "wishbox://ui",
              mimeType: "text/html",
              text: generateWishboxUI(wishes),
            },
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Winter Wishlist MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
