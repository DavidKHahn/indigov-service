# Indigov Service

A simple Express.js server for managing constituents with CRUD operations and CSV export functionality.

## Requirements

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Setup

1. **Clone the repository:**

   Clone the repository to your local machine:

   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/indigov-service.git

   cd indigov-service

   ```

2. **Install dependencies and start server:**

   `npm install`

   `npm start`

3. **API Endpoint (curl commands):**

   Get cmd

   `curl http://localhost:3000/constituents`

   Add or Update cmd

   `curl -X POST http://localhost:3000/constituents -H "Content-Type: application/json" -d '{"email": "constituent@example.com", "name": "John Doe", "address": "123 Main St"}'`

   Export CSV cmd

   `curl -O http://localhost:3000/export`
