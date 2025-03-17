
## Northcoders News API

Backend server created for Northcoder project to host database for articles, comments, users and topics. 

## Minimum required versions:

Node.js = v23.3.0
PSQL = 14.14

## 🛠 Tech Stack
- **Node.js** (v23.3.0)
- **Express.js**
- **PostgreSQL** (14.14)
- **pg & pg-format** (for database interaction)
- **Jest & Supertest** (for testing)
- **Husky** (additional layer of testing)

## Instructions:

For anyone cloning this repo, since the environment files are added on the gitignore list, then you will not have a copy of them on your local machine.

You will need to add them manually to connect the dev and test detabases when working on the project.

You can add two new files named ".env.test" and ".env.development" on the root level of your repo directory and add their respective contents which are shown below.

.env.test: PGDATABASE=nc_news_test

.env.development: PGDATABASE=nc_news

## API ENDPOINT HOSTED ON RENDER:

Endpoint: https://northcoders-reddit.onrender.com

Instructions: Add the api path after .com when testing

Example: https://northcoders-reddit.onrender.com/api/topics

NOTE: API paths are availble in the app.js file

## SUMMARY:

This is something similar to Reddit where people can share and post articles and also comment and vote on them. Using Express.js, node-postgres and pg-format mostly on the backend.

## DEPENDENCIES

==============
You will need to install the minimum dependency versions shown on the package.json file to avoid any issues when running the app

If you have installed recent versions and are having issues, then installing the exact versions would be the best option.

To do this you need to use "npm ci" instead of "npm i" as this will install the exact versions on the package.json file.

## SETUP ON YOUR LOCAL MACHINE

1.) Go here https://github.com/dinodinz/be-nc-news

2.) Grab the HTTPS URL by clicking the green button "<> Code"

3.) Go to your machine terminal and run "git clone CODE_URL_HERE"

4.) Open the directory inside your IDE

5.) Run "npm ci" on your terminal to install the exact versions of all dependencies on the package.json file

6.) Create DEV and TEST databases by running "npm run setup-dbs"

7.) Seed DEV database by running "npm run seed"

8.)You can now do some testing by running "npm test"

## IMPORTANT: In order for the whole setup to work, you need to have the .env.test and .env.development files created which was stated at the beggining of this guide.
