# Email Queue with Agenda

This is a basic template for creating a email sending queue with Agenda, without needing Docker and Redis support.

## Installation

```
npm i agenda mongoose
```

## Run
```
node messageQueueServer.js
```

## Instructions:
To integrate this email sending queue into your existing Node.js or Express server, follow these steps:

1. Ensure you have Node.js installed on your server.
2. Place the `messageQueue.js` file alongside your main server file (`server.js/app.js/index.js`).
3. Install the required dependencies by running:
  ```
  npm i agenda mongoose
  ```
4. Open your `package.json` file
5. Add the following script:
```json
"dev-agenda": "node <path of ---> messageQueue.js>"
```
or,
```json
"dev-agenda": "nodemon ./source of -> messageQueueServer.js"
```
