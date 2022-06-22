<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/altrawan/food-recipe-api">
    <img src="https://lh3.googleusercontent.com/d/1AuO1tJ469WqoXQufUeR-OkzqAW258aXT" alt="Logo" width="150px">
  </a>

  <h3 align="center">Mama Recipe : Backend Food Recipe</h3>

  <p align="center">
    Create a Node.js app for building food recipe RESTful APIs using Express.
    <br />
    <a href="#table-of-contents"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://mama-recipe.herokuapp.com/">View Web Service</a>
    ·
    <a href="https://github.com/altrawan/food-recipe-api/issues">Report Bug</a>
    ·
    <a href="https://github.com/altrawan/food-recipe-api/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
## Table of Contents
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#requirements">Requirements</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#setup-env-example">Setup .env example</a></li>
      </ul>
    </li>
    <li><a href="#rest-api">REST API</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#related-project">Related Project</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
Create a Node.js app for building food recipe RESTful APIs using Express.

### Built With
This app was built with some technologies below:
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/about/)
- [PostgreSQL](https://www.postgresql.org/)
- and other

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* [Node.js](https://nodejs.org/en/download/)

### Requirements
* [Node.js](https://nodejs.org/en/)
* [Postman](https://www.getpostman.com/) for testing
* [Database](./blanja.sql)

### Installation

- Clone the Repo
```
git clone https://github.com/altrawan/food-recipe-api.git
```
- Go To Folder Repo
```
cd food-recipe-api
```
- Install Module
```
npm install
```
- Make a new database and import [mama_recipe.sql](./blanja.sql)
- <a href="#setup-env-example">Setup .env</a>
- Type ` npm run dev` To Start Development
- Type ` npm run start` To Start Production

<p align="right">(<a href="#top">back to top</a>)</p>

### Setup .env example

Create .env file in your root project folder.

```env
# app
PORT='YOUR PORT'

# Setting PostgreSQL
PG_HOST='YOUR HOST'
PG_USER='YOUR USERNAME'
PG_DATABASE='YOUR DATABASE'
PG_PASSWORD='YOUR PASSWORD'
PG_PORT=5432

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
STMP_SERVICE=email-server # example: gmail
STMP_USER=your-email
STMP_PASS=your-password
```

<p align="right">(<a href="#top">back to top</a>)</p>

## REST API

You can view my Postman collection [here](https://www.postman.com/warped-shadow-374852/workspace/food-recipe/overview)
</br>
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/19659051-a8f34c89-7c8f-409f-8665-ecac960c85df?action=collection%2Ffork&collection-url=entityId%3D19659051-a8f34c89-7c8f-409f-8665-ecac960c85df%26entityType%3Dcollection%26workspaceId%3D783fdc2c-762c-4182-8433-bf1de8619a50)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

## Related Project
:rocket: [`Backend Mama Recipe`](https://github.com/altrawan/food-recipe-api)

:rocket: [`Frontend Mama Recipe`](https://github.com/altrawan/mama-recipe-app)

:rocket: [`Web Service`](https://mama-recipe.herokuapp.com/)

:rocket: [`Demo Mama Recipe`](https://bit.ly/mama-recipe-app)

<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

My Email : muhammadalifputra8888@gmail.com

Project Link: [https://github.com/altrawan/food-recipe-api](https://github.com/altrawan/food-recipe-api)

<p align="right">(<a href="#top">back to top</a>)</p>

## License
Distributed under the [MIT](/LICENSE) License.

<p align="right">(<a href="#top">back to top</a>)</p>

