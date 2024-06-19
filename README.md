# reactionTimeGame
This is a game that test your reaction time (how quick you can hit the space bar). This is a stateful 'CRUD' (create - POST, read - GET, update - PUT, delete - DELETE) game that gives me practice with restful API's.

This repo holds two projects, both run a reactionTimerGame. 
- usingJS- folder holds the game implemented with node.js as the API and NeDB (noSql) for the database with normal html, css, and javascript files to run the client side code.
- usingReact- folder holds the game to implemented with node.js as the API, NeDB, and React.js for the client side code. This project was pretty challening learning some new syntax and how react works, specifically, useEffect and how it passes around state took a bit of figuring out, so the client code in the Home.js file isn't as clean as it could/ should be. I think I made the code more complex than it had to be, but it was a fun learning experience.

How to run:
  - usingJS
    - Download this repo
    - Navigate to the usingJS folder in the terminal
    - Type 'npm install' to download all the dependecies of this project
    - Type 'node index.js', the port number will appear on the next line
    - Go to localhost:{port number}

  - usingReact
    - Download this repo
    - Navigate to the usingReact folder in the terminal
    - cd into the server folder and type 'npm install' followed by 'npm start'
    - (if you want) Go to localhost:{port number}
    - Then cd into the client folder and type 'npm install' followed by 'npm start'
    - The browser page at port: 3000 should appear for you
