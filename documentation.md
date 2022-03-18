# Documentations
How to use this API for frontend / mobile usage
## 1. Sign up
* ### Endpoint   
  `/api/auth/signup`
* ### Method  
  POST
* ### Headers
  `Content-type: application/json`
* ### Body
  ```
  {
    "name": String,
    "type": String,
    "numberPhone": String,
    "email": String,
    "password": String
  }
  ```
* ### Response success
  ```
  {
    "message": "User signup successfully",
    "user": {
        "fullname": "john doe",
        "type": "personal",
        "numberPhone": 6289123456789,
        "email": "johndoe@gmail.com"
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
* ### Response fail (because one of request body not filled (required))
  ```
  {
    "statusCode": 400,
    "message": "Please input all fields",
    "error": "Bad Request"
  }
  ```
## 2. Login
Login user for manipulate data (CRUD)
* ### Endpoint   
  `/api/auth/login`
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
* ### Response fail (because one of request body not filled (required))
  ```
  {
    "statusCode": 400,
    "message": "Please input all fields",
    "error": "Bad Request"
  }
  ```

## 3. Create new Project 
Token is obtained from login response
* ### Endpoint  
  `/api/projects`
* ### Method
  POST
* ### Headers
  ```
  Content-Type: application/json
  Authorization: `Bearer ${token}`
  ```
* ### Body
  ```
  {
    "title": String,
    "totalContract": Number,
    "startDate": String (YYYYMMDD),
    "finishDate": String (YYYYMMDD),
    "address": String
  }
  ```
* ### Response Success
  ```
  {
    "message": "Created project successfully",
    "data": {
        "id": 35,
        "title": "Pengembangan proyek sengketa",
        "admin": "john doe",
        "dates": {
            "start": "2022-01-07T17:00:00.000Z",
            "finish": "2022-07-07T17:00:00.000Z",
            "duration": "181"
        }
    }
  }
  ```
* ### Response fail (because token not available)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because one of request body not filled (required))
  ```
  {
    "statusCode": 400,
    "message": "Please input all fields",
    "error": "Bad Request"
  }
  ```
## 4. Get all Projects
Token is obtained from login response
* ### Endpoint
  `/api/projects`
* ### Method
  GET
* ### Headers
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Success fetched all projects",
    "data": {
        "projects": [
            {
                "id": 32,
                "name": "Pengembangan proyek homestay",
                "admin": "john doe",
                "contractTotal": 500000000,
                "totalCost": 0,
                "workDuration": "181"
            },
            {
                "id": 33,
                "name": "Pengembangan proyek homestay",
                "admin": "john doe",
                "contractTotal": 500000000,
                "totalCost": 0,
                "workDuration": "181"
            },
            {
                "id": 34,
                "name": "Pengembangan proyek ngawor",
                "admin": "john doe",
                "contractTotal": 500000000,
                "totalCost": 0,
                "workDuration": "181"
            }
        ],
        "budgets": {
            "sumContracts": 1500000000,
            "sumSpendings": 0,
            "remainingBudget": 1500000000
        },
        "percentageBudgets": {
            "spending": 0,
            "remainBudget": 100
        }
    }
  }
  ```
* ### Response fail (because token not available)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
## 5. Get Specified Project
Token is obtained from login response
* ### Endpoint  
  `/api/projects/:projectId`
* ### Method
  GET
* ### Headers
  ```
  Authorization: `Bearer ${token}`
  ```
* ###  Response success 
  ```
  {
      "message": "Fetch single project successfully",
      "project": {
          "id": 32,
          "title": "Pengembangan proyek homestay",
          "admin": "john doe",
          "adminId": 24,
          "totalContract": 500000000,
          "start": "2022-01-07T17:00:00.000Z",
          "finish": "2022-07-07T17:00:00.000Z",
          "address": "Maluku"
      },
      "spendings": [],
      "members": [
          {
              "id": 53,
              "name": "john doe"
          }
      ],
      "tasks": [
          {
              "id": 4,
              "content": "Perancangan Kontruksi",
              "isFinished": 0
          }
      ]
  }
  ```
* ### Response fail (because data not found)
  ```
  {
      "statusCode": 404,
      "message": "Project not found",
      "error": "Not Found"
  }
  ```
* ### Response fail (because token not available)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
## 6. Update Project
Token is obtained from login response
* ### Endpoint  
  `/api/projects/:projectId`
* ### Method
  PUT
* ### Headers
  ```
  Content-Type: application/json
  Authorization: `Bearer ${token}`
  ```
* ### Body
  ```
  {
    "title": String,
    "address": String
  }
  ```
* ### Response Success 
  ```
  {
    "message": "Update project successfully",
    "data": [
        {
            "id": 33,
            "title": "Pembangunan Proyek IKN",
            "address": "Sulawesi Selatan"
        }
    ]
  }
  ```
* ### Response fail (because data not found)
  ```
  {
      "statusCode": 404,
      "message": "Project not found",
      "error": "Not Found"
  }
  ```
* ### Response fail (because token not available)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because not owned data)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized",
      "error": "Unauthorized"
  }
  ```
* ### Response fail (because one of request body not filled (required))
  ```
  {
    "statusCode": 400,
    "message": "Please input all fields",
    "error": "Bad Request"
  }
  ```
## 7. Delete Project
* ### Endpoint  
  `/api/projects/:projectId`
* ### Method
  DELETE
* ### Headers
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Delete project successfully"
  }
  ```
* ### Response fail (because data not found)
  ```
  {
      "statusCode": 404,
      "message": "Project not found",
      "error": "Not Found"
  }
  ```
* ### Response fail (because token not available)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because not owned data)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized",
      "error": "Unauthorized"
  }
  ```