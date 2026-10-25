## Security Checklist
- [x] **Rate Limiting:** Implemented `express-rate-limit` to restrict API requests and prevent brute-force attacks.
- [x] **Secure Headers:** Configured `helmet` middleware to set HTTP response headers for enhanced API security.
- [x] **Parameterized Queries:** Utilized SQLite bound parameters (`?`) for all database operations to prevent SQL injection vulnerabilities.
- [x] **Client-Side Validation:** HTML5 form attributes (`required`, `type="email"`) ensure data formatting before submission.
- [x] **Server-Side Validation:** Express API endpoint validates the presence and formatting of `name`, `email`, and `internshipId` before database insertion.

## Test Report
- **UI States:** Verified that the UI displays a "Loading internships..." state while fetching data.
- **Failure & Retry:** Manually disconnected the server; the frontend successfully caught the error, displayed the failure state, and allowed data fetching via the "Retry" button.
- **Validation Testing:** Attempted to submit the application form with empty fields, which was blocked by client-side browser validation. Attempted to bypass client validation via raw cURL requests missing the `@` in the email, which correctly returned a `400 Bad Request` from the server.
