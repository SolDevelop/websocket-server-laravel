# Welcome
## This project is made for
Creating a simple websocket serevr so you can send and recieve messages via the ws library in nodejs without having to use pusher or use events

## Why didn't you use pusher or websocket by beyondcode
the reason being that i simply want a simple websocket server easy to setup and easy to use without the need of actually setting up a full websocket server, which means i can use this simple websocket to connect to lets say: a discord bot, another website, python process.

## How do i set it up for my own project:
1. Download all files in this repo
2. Put everything in the following structure:
    *: WebsocketMan.php in app folder
    *: WebsocketServer Folder in the app folder
3. open composer.json for your laravel project put this inside "autoload" key:
    *: ```,
        "files": [
            "app/WebsocketMan.php"
        ]```
4. save the composer.json file and run this command: ```composer dump-autoload```
5. put this in your ENV file:
```
WEBSOCKET_LOOKOUT_PORT=3000
WEBSOCKET_LOOKOUT=localhost
WEBSOCKET_PORT=6001
```
## ENV Variables Definition:
WEBSOCKET_LOOKOUT_PORT the port which the express.js server will run in
WEBSOCKET_LOOKOUT the host which the express.js server will run in
WEBSOCKET_PORT the port which the websocket server will run in

## How do i run it?:
1. open the terminal and go to app/WebsockerServer
2. enter this command: ```node main.js```
3. change the env variables
4. call this function to get the data from the websocket client: ```websocketcall("INFO")```, it might return: NO_FEEDBACK(the client did not submit data on time or did not submit at all) or return the feedback of the client
