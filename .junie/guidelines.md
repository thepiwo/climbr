# Bicycle Steepness Calculator - Project Guidelines

## Project Overview
This project is a web-based tool to calculate acceptable steepness for bicycle riding from a GPX track based on given gear ratios. The application is built using React and Vite as a frontend-only solution.

## Project Goals
1. Allow users to upload GPX track files
2. Enable users to input their bicycle's gear ratios
3. Calculate and display the acceptable steepness for riding based on the track elevation data and gear ratios
4. Provide a user-friendly interface for cyclists to plan their routes

## Technical Implementation

### GPX File Processing
- The application should parse GPX files to extract elevation data and track points
- Calculate gradients between consecutive track points
- Identify steep sections that may be challenging based on the provided gear ratios

### Gear Ratio Analysis
- Accept input of gear ratios in standard format (e.g., "34/50, 11/32")
- Calculate the mechanical advantage provided by each gear combination
- Determine the maximum gradient that can be comfortably climbed with the available gears

### User Interface
- Clean, responsive design that works on both desktop and mobile devices
- Clear feedback on file upload status and processing results
- Visual representation of the track profile with highlighted sections based on steepness

## Development Guidelines

### Code Structure
- Maintain a clean component structure with separation of concerns
- Keep business logic (calculations) separate from UI components
- Use appropriate hooks for state management
- Document complex calculations with clear comments

### Styling
- Use CSS modules or styled components for component-specific styling
- Ensure responsive design for all screen sizes
- Maintain a consistent color scheme and typography

### Performance Considerations
- Optimize file parsing for large GPX files
- Consider using Web Workers for heavy calculations to avoid blocking the UI
- Implement proper error handling for invalid files or inputs

## Maintenance Guidelines
- Always keep these guidelines up-to-date as the project evolves
- Document any new features or significant changes
- Before committing changes, always build the project to ensure it's working correctly
- Run `npm run build` to verify the production build works as expected
- Test the application with various GPX files of different sizes and complexities

## Getting Started
1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Build the project with `npm run build` to create a production-ready version

## Future Enhancements
- Add visualization of the track on a map
- Implement saving/loading of favorite gear setups
- Add export functionality for analysis results
- Integrate with popular cycling platforms for direct track import

Remember to always build the project before committing changes to ensure everything is working correctly!