# Documentations
How to use this API for frontend / mobile usage  
Base URL: Localhost (temporary)
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
        "projectsOwned": [
            {
                "id": 29,
                "name": "Pembangunan Jembatan",
                "admin": "rocketmail",
                "contractTotal": 15000000,
                "totalCost": 4000000,
                "workDuration": 52
            },
            {
                "id": 30,
                "name": "Pembangunan Wc",
                "admin": "rocketmail",
                "contractTotal": 2000000,
                "totalCost": 2000000,
                "workDuration": 52
            }
        ],
        "projectsCollab": [
            {
                "id": 32,
                "name": "Pengembangan proyek homestay",
                "admin": "john doe",
                "contractTotal": 500000000,
                "totalCost": 0,
                "workDuration": 181
            },
            {
                "id": 35,
                "name": "Pengembangan proyek sengketa",
                "admin": "john doe",
                "contractTotal": 500000000,
                "totalCost": 0,
                "workDuration": 181
            }
        ],
        "budgets": {
            "sumContracts": 17000000,
            "sumSpendings": 6000000,
            "remainingBudget": 11000000
        },
        "percentageBudgets": {
            "spending": 35,
            "remainBudget": 65
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

## 8. Get Logged User Data
Token is obtained from login response
* ### Endpoint  
  `/api/profile`
* ### Method
  GET
* ### Headers
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Fetch user logged in successfully",
    "data": {
        "name": "rocketmail",
        "accountType": "company",
        "isVerified": 0,
        "numberPhone": 6289123456789,
        "email": "rocketmail@gmail.com"
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

## 9. Update logged user
Token is obtained from login response
* ### Endpoint  
  `/api/profile`
* ### Method
  PUT
* ### Headers
  ```
  Authorization: `Bearer ${token}`
  Content-Type: application/json
  ```
* ### Body
  ```
  {
    "name": String,
    "type": String,
    "numberPhone": String,
    "email": String
  }
  ```
* ### Response Success
  ```
  {
    "message": "Update user logged in successfully",
    "data": {
        "name": "john revisian",
        "accountType": "organization",
        "numberPhone": 6288123456789,
        "email": "revisian@gmail.com"
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
## 10. Delete logged user
Token is obtained from login response
* ### Endpoint  
  `/api/profile`
* ### Method
  DELETE
* ### Headers
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Delete user successfully"
  }
  ```
* ### Response fail (because token not available)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
## 11. Add new Project Collaborator
Token is obtained from login response
* ### Endpoint  
  `/api/projects/:projectId`
* ### Method
  POST
* ### Headers
  ```
  Authorization: `Bearer ${token}`
  Content-Type: application/json
  ```
* ### Body
  ```
  {
    "userId": String
  }
  ```
* ### Response Success
  ```
  {
    "message": "Add new projects collaborator successfully",
    "affectedData": {
        "projectId": 33,
        "userId": 25
    }
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
* ### Response fail (because logged user already added) 
  ```
  {
    "statusCode": 400,
    "message": "Logged user already added",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because user result already added)
  ```
  {
    "statusCode": 400,
    "message": "User already added",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because token not available)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because logged user isn't project admin/owner) 
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because project not found)
  ```
  {
      "statusCode": 404,
      "message": "Project not found",
      "error": "Not Found"
  }
  ```
## 12. Delete Project Collaborator
Token is obtained from login response
* ### Endpoint  
  `/api/projects/:projectId/members/:userId`
* ### Method
  DELETE
* ### Headers
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Delete project's collaborator successfully"
  }
  ```
* ### Response fail (because logged user can't delete from project collaboration) 
  ```
  {
    "statusCode": 400,
    "message": "Cannot delete collaborator from logged user",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because token not available)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because logged user isn't project admin/owner) 
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because project not found)
  ```
  {
      "statusCode": 404,
      "message": "Project not found",
      "error": "Not Found"
  }
  ```
* ### Response fail (because user not found)
  ```
  {
    "statusCode": 404,
    "message": "Collaborator id not found",
    "error": "Not Found"
  }
  ```