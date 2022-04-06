# Food Recipe RESTful API

## Installation
1. Clone the repo ```git clone https://github.com/altrawan/food-recipe-api.git```
2. Run ```npm install``` to install the dependencies
3. Import database ```pijarfood``` to your PostgreSQL ([Backup and Restore PostgreSQL](https://www.postgresql.org/docs/8.1/backup.html#BACKUP-DUMP-RESTORE))
4. Set the environment variables:
    - ```PORT``` : fill for set the API running port
    - ```PGHOST``` : fill with HOSTNAME in your postgreSQL configuration
    - ```PGUSER``` : fill with USERNAME in your postgreSQL configuration
    - ```PGDATABASE``` : fill with the DATABASE NAME or leave it filled with ```pijarfood``` if you isn't rename the database
    - ```PGPASSWORD``` : fill with PASSWORD in your postgreSQL configuration
    - ```PGPORT``` : fill with PORT in your postgreSQL configuration
5. Run with :
    - ```npm run start``` : if you want to run it in client mode (use ```node```) without auto restart on every changing code
    - ```npm run dev``` :  if you want to run it in developer mode (use ```nodemon```) every change and save it will auto restart
6. You are Ready to Go

<b>Note</b> : if you got any problems send email to : <a>muhammadalifputra8888@gmail.com</a>

## Table of contents
- [Features](#Features)
- [Commands](#Commands)
- [Environment Variables](#Environment-Variables)
- [Project Structure](#Project-Structure)
- [API Documentation](#API-Documentation)
- [Error Handling](#Error-Handling)
- [Validation](#Validation)
- [Authentication](#Authentication)
- [Authorization](#Authorization)
- [Linting](#Linting)
- [Contributing](#Contributing)
- [Support Developer](#Support-Developer)
    
## Features
- **SQL database:** using [PostgreSQL](https://www.postgresql.org/)
- **NoSQL database:** using [Redis](https://redis.io/)
- **Validation:** request data validation using [express-validator](https://express-validator.github.io/docs/)
- **API documentation:** with [Postman](https://www.postman.com/)
- **Dependency management:** with [NPM](https://www.npmjs.com/)
- **Environment variables:** using [dotenv](https://github.com/motdotla/dotenv)
- **Security:** set security HTTP headers using [helmet](https://helmetjs.github.io/)
- **Santizing:** sanitize request data against xss and query injection
- **CORS:** Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Hash Password:** using [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Linting:** with [ESlint](https://eslint.org/) and [Prettier](https://prettier.io/)

## Commands
Running in client mode:
```
npm run start
```
Running in developer mode:
```
npm run dev
```
Testing:
```
npm run test
```
Linting:
```
npm run lint -- --fix
```

## Environment Variables
The environment variables can be found and modified in the ```.env``` file. They come with these default values:
```
# Port number
PORT=3001

# Setting PostgreSQL
PGHOST='YOUR HOST'
PGUSER='YOUR USERNAME'
PGDATABASE='YOUR DATABASE'
PGPASSWORD='YOUR PASSWORD'
PGPORT=5432

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
STMP_SERVICE=email-server # example: gmail
STMP_USER=your-email
STMP_PASS=your-password
```

## Project Structure
```
├── public\             # Asset public
├── src\                # Project source code
    ├── config\         # Configuration database
    ├── controllers\    # Route controllers (controller layer)
    ├── helpers\        # Helpers
    ├── middlewares\    # Custom express middlewares
    ├── models\         # Models
    ├── routes\         # Routes
    ├── template\       # Template HTML
    ├── validations\    # Request data validation
    ├── app.js          # Express app
    ├── index.js        # App entry point
├── .env                # Setup environment
├── .gitignore          # File name for not uploaded on github
├── LICENSE             # License this project
└── README.md           # For Readme In github
```

## API Documentation
### API Endpoints
List of available routes:

**Index routes**\
```GET /latest``` - get latest recipe

**Auth Route**\
```POST /auth/register``` - register\
```POST /auth/login``` - login\
```PUT /auth/verify-email``` - verify email\
```POST /auth/refresh-token``` - refresh auth token\
```POST /auth/logout``` - logout

**User Route**\
```GET /users``` - get all users\
```GET /users/:id``` - get user by id\
```PUT /users/change-profile``` - change profile user\
```PUT /users/change-photo``` - change photo user\
```PUT /users/change-password``` - change password\
```PUT /users/delete/:id``` - soft delete user\
```DELETE /users/:id``` - delete permanent user

**Recipe Route**\
**Comment Route**\
**Liked Recipe Route**\
**Saved Recipe Route**

## Error Handling

## Validation

## Authentication

## Authorization

## Linting

## Contributing
Contributions are more than welcome! Please check out the [contributing guide](https://github.com/altrawan/food-recipe-api/blob/master/CONTRIBUTING.md).

## Support Developer
1. Follow my account Github
2. Add a Star 🌟 to this 👆 Repository

<b>Note</b> : if you have any ideas or suggestions for this project contact me at muhammadalifputra8888@gmail.com

<!--
## Tools and Technologies
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

## Packages Included
- NPM dependencies

    ![](https://img.shields.io/badge/bcrypt-v5.0.1-blue)
    ![](https://img.shields.io/badge/body--parser-v1.19.2-blue)
    ![](https://img.shields.io/badge/cors-v2.8.5-blue)
    ![](https://img.shields.io/badge/dotenv-v16.0.0-blue)
    ![](https://img.shields.io/badge/express-v4.17.3-blue)
    ![](https://img.shields.io/badge/express--validator-v5.3.1-blue)
    ![](https://img.shields.io/badge/helmet-v5.0.2-blue)
    ![](https://img.shields.io/badge/pg-v8.7.3-blue)
    ![](https://img.shields.io/badge/uuid-v8.3.2-blue)
    ![](https://img.shields.io/badge/xss--clean-v0.1.1-blue)
- NPM devDependencies
    
    ![](https://img.shields.io/badge/eslint-v8.11.0-brightgreen)
    ![](https://img.shields.io/badge/eslint--config--airbnb--base-v15.0.0-brightgreen)
    ![](https://img.shields.io/badge/eslint--plugin--import-v2.25.4-brightgreen)
    ![](https://img.shields.io/badge/nodemon-v2.0.15-brightgreen)

## Instructions to Use
1. Run ```npm install``` to install packages required
2. Import database ```pijarfood``` to your PostgreSQL ([Backup and Restore PostgreSQL](https://www.postgresql.org/docs/8.1/backup.html#BACKUP-DUMP-RESTORE))
3. Rename ".env example" file to ".env" and set ".env" file in root:
    - ```APP_PORT``` : fill for set the API running port
    - ```PGHOST``` : fill with HOSTNAME in your postgreSQL configuration
    - ```PGUSER``` : fill with USERNAME in your postgreSQL configuration
    - ```PGDATABASE``` : fill with the DATABASE NAME or leave it filled with ```pijarfood``` if you isn't rename the database
    - ```PGPASSWORD``` : fill with PASSWORD in your postgreSQL configuration
    - ```PGPORT``` : fill with PORT in your postgreSQL configuration
4. Run with :
    - ```npm run start``` : if you want to run it in client mode (use ```node```) without auto restart on every changing code
    - ```npm run dev``` :  if you want to run it in developer mode (use ```nodemon```) every change and save it will auto restart
5. You are Ready to Go

<b>Note</b> : DM on <a>discord</a> if you got any problems or email : <a>muhammadalifputra8888@gmail.com</a>

## Documentations

- Flowchart
    - Flowchart Flow Backend\
        [https://drive.google.com/file/d/1Eqtv8oM9QdhSHDFXTcA9BJ7uzCZy5nLk/view?usp=sharing](https://drive.google.com/file/d/1Eqtv8oM9QdhSHDFXTcA9BJ7uzCZy5nLk/view?usp=sharing)
    - Flowchart Food Recipe Application\
        [https://drive.google.com/file/d/1Xi513noYtrvLAQV1w4us84YeVlqIpJ8Y/view?usp=sharing](https://drive.google.com/file/d/1Xi513noYtrvLAQV1w4us84YeVlqIpJ8Y/view?usp=sharing
)
- Database<br>
    [https://drive.google.com/file/d/1efaqywqW42Rlf4-2Wf-NJhFtFiWRBFqG/view?usp=sharing](https://drive.google.com/file/d/1efaqywqW42Rlf4-2Wf-NJhFtFiWRBFqG/view?usp=sharing)
- Postman<br>
    [https://www.postman.com/collections/1e44db0bfaa83e49d791](https://www.postman.com/collections/1e44db0bfaa83e49d791)
- Microsoft Power Point Slide Persentation<br>
    [https://docs.google.com/presentation/d/1KkLHU3mD1022GCdS39r_GaWXMMovH0nc](https://docs.google.com/presentation/d/1KkLHU3mD1022GCdS39r_GaWXMMovH0nc)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
