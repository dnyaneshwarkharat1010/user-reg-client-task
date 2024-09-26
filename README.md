#Project Overview 
This project implements a user registration form using Angular 16. The form integrates with provided APIs to enable dynamic country selection and real-time username validation. A JSON Server is used to simulate the backend API.

#Features 
Username Validation: Validates username availability via the API (GET api/register/{username}).
Country Selection: Populates the country dropdown dynamically from API (GET api/countries).

#Form Validations 
Username is required lowercase, alphanumeric, no spaces, max 20 characters.
Country is required.

#API Submission 
Submits valid form data (username and country) via POST api/register.

#Running the Project
To run the project, you need to start both the Angular development server and the JSON Server.
1. Start the Angular Server: npm start
2. Start the JSON Server: npm run start:json-server --watch ./src/db.json --port 3000.
Note: In this task, the main header of the API is not provided, which is why we use JSON Server for simpler data management.

#How It Works 
Username Validation: Checks if the username is valid and available using real-time validation.
Country Dropdown: Fetches the list of countries from the API on form load.
Form Submission: Submits the form after passing all validations.

#API Endpoints (JSON Server) 
GET /api/register: Check if the username is available.
GET /api/countries: Fetch the list of countries.
POST /api/register: Register the user with selected username and country.

#Error Handling :
Displays appropriate error messages for failed API requests and validation errors.

