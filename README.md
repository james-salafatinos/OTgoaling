# OT Goaling App

A web application to help occupational therapists manage and track therapeutic goals for children in their care.

## Features

- **Kid Manager**: Add and manage children in your case load
- **Goal Setting**: Create customizable goals with baseline and target metrics
- **Measurement Tracking**: Record progress using a dependence-level Likert scale
- **Progress Visualization**: View progress trends with interactive charts
- **Notes and Documentation**: Add descriptive notes to goals and measurements

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository or navigate to the project directory
2. Install the dependencies:

```bash
npm install
```

3. Start the application:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Guide

1. **Adding a Kid**: Click on "Kid Manager" and use the "Add Kid" button
2. **Creating Goals**: Select a kid from your case load and click "Add Goal"
3. **Recording Measurements**: Navigate to a specific goal and click "Record Measurement"
4. **Viewing Progress**: Charts are automatically generated as you add measurement data

## Technology Stack

- **Backend**: Node.js, Express
- **Database**: SQLite
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Templating**: EJS
- **Charting**: Chart.js

## License

ISC
