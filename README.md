# BorsaZelenchuk Backend

The __BorsaZelenchuk__ backend is a Node.js application built using the Express.js framework. It serves as the server-side component for the BorsaZelenchuk online fruit and vegetable market;

It stores and manages data in Firestore. Firestore provides real-time data synchronization, ensuring that data remains up-to-date for all users interacting with the platform.
# Deployment

This backend application is hosted on [Render](https://render.com/)
### Note 

Render spins down after 15 minutes of inactivity, so the first request after starting the app takes a while, but subsequent requests are faster. 

# Frontend Repository

If you're interested in the frontend code, you can find it in the [frontend repository](https://github.com/KubretiMC/borsa-zelenchuk)

## Scripts
The following scripts are used in the project:

### `npm start`

Starts the Express server in the development mode. The server will listen on the specified port for incoming requests.
### `npm build`

Builds the backend application for production. It ensures that the server is optimized for performance and ready to serve your users in a production environment.

### Usage

You can interact with the backend API by sending HTTP requests to the appropriate endpoints. These endpoints are designed to support the functionalities of the [BorsaZelenchuk](https://github.com/KubretiMC/borsa-zelenchuk) online marketplace.
