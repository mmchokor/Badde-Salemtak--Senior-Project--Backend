
# Badde Salemtak Backend

This is the backend part of a our senir project.

Our project is based on the hypothesis that many Lebanese have currently emigrated abroad for various reasons. We also understand that many of them visit frequently. By doing this, they typically bring back presents, medicines, or other goods that Lebanese people desire but cannot find in their own country. In order to provide a service where Lebanese expats can get goods that are not available in Lebanon, not only for their family and friends but for anyone who needs them, we want to build software, primarily an application, with the incentive of the good carriers getting paid.
Our project is software that will include a web application and a mobile application to assist many Lebanese people in resolving the issue of attempting to obtain various products that are not readily available in Lebanon for a variety of reasons, such as medication, skin care, clothing, genuine software, and so forth. It will offer a platform for frequent flyers and people who occasionally visit Lebanon to get in touch with people who live there to get what they want or need. The platform will have a number of features that will enable users and providers to interact with each other in a civil and friendly manner because we want to create a secure environment for them.



## Run Locally

Clone the project

```bash
  git clone https://github.com/mmchokor/Badde-Salemtak--Senior-Project--Backend.git
```

Go to the project directory

```bash
  cd Badde-Salemtak--Senior-Project--Backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## API Reference

#### Register a new User request

```http
  POST /api/users/
```

#### User login request

```http
  POST /api/users/login
```

#### Request to initate the reset password procedure

```http
  POST /api/users/forgotPassword
```

#### Get User with token

```http
  GET /api/users/me/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`   | `string` | **Required**. Token of User       |

#### Patch request to change the password when forgeted

```http
  PATCH /api/user/resetPassword/:token
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`   | `string` | **Required**. Token of User       |

#### Patch request to change user information

```http
  PATCH /api/user/updateMe
```

#### Patch request to change user password information

```http
  PATCH /api/user/updateMyPassword
```

## Tech Stack

**Server:** Node, Express


## Demo

https://badde-salemtak-api.vercel.app/
## Authors

- [@mmchokor](https://www.github.com/mmchokor)
- [@NabilMezher](https://www.github.com/NabilMezher)

## License

[MIT](https://choosealicense.com/licenses/mit/)

