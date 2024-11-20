covid19-full-stack-application
├── client                           # Frontend code (React-based)
│   ├── node_modules                 # Dependencies installed via npm
│   ├── public                       # Publicly accessible static files
│   │   ├── favicon.ico              # App icon displayed in the browser tab
│   │   ├── index.html               # Main HTML file for the React app
│   │   ├── lolo192.png              # Icon for PWA (used on devices)
│   │   ├── logo512.png              # Another PWA icon (used for different screen sizes)
│   │   ├── manifest.json            # Metadata for the PWA (name, icons, etc.)
│   │   └── robots.txt               # Instructions for web crawlers (SEO related)
│   ├── src                          # React app source code
│   │   ├── actions                  # Redux actions to manage state changes
│   │   │   ├── constants.js         # Constant values, like action types
│   │   │   └── index.js             # Redux action creators (functions for dispatching actions)
│   │   ├── components               # Reusable React UI components
│   │   │   ├── map                  # Components related to displaying and managing the map
│   │   │   │   ├── MapComponent.js  # Renders the map and its markers
│   │   │   │   └── MapProvider.js   # Context or state provider for the map's data
│   │   │   └── statistics           # Components related to showing COVID statistics
│   │   │       ├── CoronoStatisticsContainer.js  # Main container component for statistics
│   │   │       └── CoronoStatisticsProvider.js   # Context or state provider for statistics
│   │   ├── reducers                 # Redux reducers to manage the app's state
│   │   │   ├── countryStaticsReducer.js  # Handles state updates related to country statistics
│   │   │   ├── index.js             # Combines all reducers into one (root reducer)
│   │   │   ├── mapStyleReducer.js   # Manages the map's appearance and style
│   │   │   ├── markerReducer.js     # Manages the state of map markers
│   │   │   ├── setActionReducer.js  # May handle various UI state actions
│   │   │   └── statisticsReducer.js # Manages the global statistics data
│   │   ├── store                    # Redux store configuration
│   │   │   └── index.js             # Configures and exports the Redux store
│   │   ├── App.css                  # Global CSS styles for the app
│   │   ├── App.js                   # Main React component that renders the UI structure
│   │   ├── App.test.js              # Unit tests for the App component
│   │   ├── index.css                # Additional global styles for the app
│   │   ├── index.js                 # Entry point of the React app, renders App component to DOM
│   │   ├── logo.svg                 # Logo image used in the app
│   │   ├── serviceWorker.js         # Service worker for offline capabilities and performance optimization
│   │   └── setupTests.js            # Sets up the testing environment
├── screenshots                      # Folder for storing screenshots (may be used for project documentation)
├── server                           # Backend code (Node.js server)
│   ├── app.js                       # Main server application file, handling routes and API endpoints
│   ├── country_list.json            # JSON file containing a list of countries, potentially with COVID data
│   └── package.json                 # Backend dependencies and scripts
├── dummy_statistic.json             # Sample COVID statistics data (possibly used for testing or development)
└── readme.md                        # Project documentation (explains app functionality, setup, etc.)

Based on the file structure you provided, here's a breakdown of the purpose of each part:

Client Folder (Frontend)
node_modules: Contains all the dependencies (libraries) that are installed via npm (Node Package Manager).
public: Static files served directly by the server, such as:
index.html: The main HTML page of your React app.
favicon.ico: The app's icon displayed in the browser tab.
lolo192.png and logo512.png: Icons used for the Progressive Web App (PWA) setup.
manifest.json: Contains metadata for the PWA, such as name, icons, and theme colors.
robots.txt: Instructions for web crawlers.
src: Contains all the React app's JavaScript/JSX, styles, and logic.
actions: Contains files for Redux actions to update the app state.
constants.js: Likely stores constant values used across actions (e.g., action types).
index.js: Contains Redux action creators for dispatching actions.
components: Contains reusable UI components.
map: Holds components related to displaying and managing the map.
MapComponent.js: Likely renders the map and its features.
MapProvider.js: Could provide context or state related to the map.
statistics: Contains components related to displaying COVID statistics.
CoronoStatisticsContainer.js: Likely the main container that renders the statistics.
CoronoStatisticsProvider.js: May provide state or context for the statistics component.
reducers: Contains Redux reducers to handle state updates in response to actions.
countryStaticsReducer.js: Likely manages the state related to COVID statistics by country.
mapStyleReducer.js: Manages state related to the map's appearance.
markerReducer.js: Manages state related to map markers (e.g., for each country or region).
setActionReducer.js: May handle actions for setting various states in the app.
statisticsReducer.js: Manages the statistics data in the app's Redux state.
index.js: Combines and exports all reducers.
store: Contains Redux store setup.
index.js: Configures and exports the Redux store.
Other files:
App.js: Main React component that brings together the entire UI structure.
App.css: Styles for the App component.
App.test.js: Unit tests for the App component.
index.js: Entry point of the React app, rendering the App component into the DOM.
serviceWorker.js: Registers a service worker to enable offline capabilities and performance improvements.
setupTests.js: Sets up the testing environment for unit tests.
Server Folder (Backend)
app.js: The main server-side application, likely responsible for handling API requests related to COVID statistics.
country_list.json: Contains a list of countries, possibly with related COVID data.
package.json: Contains the backend dependencies and scripts to run the server.
Other Files
dummy_statistic.json: Likely a file that contains dummy or sample COVID statistics to be used during development or testing.
readme.md: A markdown file containing project documentation, explaining the app's functionality, setup instructions, etc.

