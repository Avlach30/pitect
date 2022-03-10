# Documentations
How to use this API for frontend / mobile usage
## 1. Sign up
* ### Endpoint   
  /api/auth/signup
* ### Method  
  POST
* ### Headers
  `Content-type: application/json`
* ### Body
  ```
  {
    "name": String,
    "type": String,
    "email": String,
    "password": String
  }
  ```
* ### Response success
  ```
  {
    "message": "User signup successfully",
    "user": {
        "fullname": "morisson",
        "type": "project owner",
        "email": "morisson@gmail.com"
    }
  }
  ```
* ### Response fail (because email already exist)
  ```
  {
    "statusCode": 400,
    "message": "E-Mail already exist",
    "error": "Bad Request"
  }
  ```
## 2. Login
* ### Endpoint   
  /api/auth/login
* ### Method  
  POST
* ### Headers
  `Content-type: application/json`
* ### Body
  ```
  {
    "email": String,
    "password": String
  }
  ```
* ### Response success
  ```
  {
    "message": "User signup successfully",
    "token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
  ```
* ### Response fail (because email / password wrong)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized",
    "error": "Unauthorized"
  }
  ```
