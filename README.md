# PM-GH Integration Frontend

This is a React frontend for the PM-GH Integration project, which provides a user interface for managing projects, teams, team members, and tickets.

## Technologies Used

- React 18
- React Router v6
- Bootstrap 5
- Axios

## Project Structure

```
src/
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── projects/     # Project-related pages
│   ├── teams/        # Team-related pages
│   ├── team-members/ # Team member-related pages
│   └── tickets/      # Ticket-related pages
├── services/         # API service modules
└── utils/            # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pm-gh-integration-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure the API URL:

Edit the `src/services/api.js` file to point to your backend API server:

```javascript
const API_URL = 'http://localhost:8080'; // Change this to your API server URL
```

### Running the Development Server

```bash
npm start
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
```

This will create an optimized production build in the `build` folder.

## Features

- View, create, edit, and delete projects
- View, create, edit, and delete teams
- View, create, edit, and delete team members
- View, create, edit, and delete tickets
- Associate teams with projects
- Associate team members with teams
- Associate tickets with projects

## API Integration

The frontend integrates with the PM-GH Integration backend API to perform CRUD operations on projects, teams, team members, and tickets.

## License

[MIT License](LICENSE)
