# Internship REST API

A Node.js and Express API with SQLite persistence, featuring input validation and pagination.

## Setup Instructions
1. Clone the repository and navigate into the folder.
2. Run `npm install` to install Express and SQLite3.
3. Run `npm start` to launch the server on `http://localhost:3000`.

## Schema & Seed Data
* **Table:** `internships`
* **Columns:** `id` (INTEGER, Primary Key), `role` (TEXT), `company` (TEXT), `domain` (TEXT).
* **Seed Data:** The database automatically seeds two initial internship records upon first startup if the table is empty.

## API Examples
* **List (Paginated):** `GET /api/internships?page=1&limit=10`
* **Detail:** `GET /api/internships/1`
* **Create:** `POST /api/internships`
  * Body: `{"role": "Full Stack Intern", "company": "WebSolutions", "domain": "Full Stack"}`
* **Update:** `PUT /api/internships/1`
  * Body: `{"role": "Senior Frontend Intern", "company": "TechCorp", "domain": "Frontend"}`
* **Delete:** `DELETE /api/internships/1`
