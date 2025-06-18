# BiteSpeeed integration with fluxcart

A Node.js service for identifying contact details on the basis of provided information

## Features included

- Identifying contact details on the basis of provided information

## Tech Stacks used

- Node.js (>=18)
- TypeScript
- Express.js
- PostgreSQL with Sequelize ORM

### Tools needed

- Node.js 18 or higher
- PostgreSQL

### Installation

1. Clone the repository - git clone https://github.com/IAMRAVIRAJESH/BiteSpeed.git and move to main directory using the command "cd BiteSpeed"

2. Install dependencies - run "npm install"

3. Set up environment variables - Create and edit .env file with your database configuration at root directory (current directory)

4. Build the TypeScript code - npm run build

5. Start the server and sync database - "npm run dev". This command will run the server and synchronize the database with models, associations, relations and anything that is described in the model files.

## API Endpoints

- `GET /api/identify` - to identify user(s)

# API testing

- For testing the APIs you can setup on local as stated above or use the link of render
Link: https://bitespeed-0qid.onrender.com/api/identify.

Hit the above link with payload
{
    "email": "biffsucks@hillvalley.edu",
    "phoneNumber": "919191"
}