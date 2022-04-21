# Documentations
How to use this API for frontend / mobile usage  
Base URL: Localhost (temporary)
# Table of Contents
* Authentication  
  * [sign up](#sign-up)
  * [login](#login)  
* Project management  
  * [create new project](#create-new-project)
  * [get all projects](#get-all-projects)
  * [get specified project](#get-specified-project)
  * [update project](#update-project)
  * [delete project](#delete-project)
* Logged user management
  * [get logged user data](#get-logged-user-data)
  * [update logged user](#update-logged-user)
  * [delete logged user](#delete-logged-user)
* Project collaborator management 
  * [search user](#search-user-by-fullname)
  * [add new collaborator](#add-new-project-collaborator)
  * [delete collaborator](#delete-project-collaborator)
* Spending and budget management
  * [get project spendings](#get-all-project-spending)
  * [add project spendings](#add-new-project-spending)
  * [delete project spending](#delete-existing-project-spending)
  * [update total budget](#update-total-budget-of-project)
* Task management
  * [get single task](#get-single-task)
  * [create task](#create-a-new-task)
  * [update task](#update-task)
  * [delete task](#delete-task)
  * [finish task](#finish-task)
* Project report
  * [get project report](#get-specified-project-report)
* Admin dashboard
  * [get all projects & users](#get-all-projects-and-users)
* Marketplace
  * [get all catalogs](#get-all-marketplace-catalogs)
  * [search catalogs (by title)](#search-marketplace-catalog)
  * [filter catalog (by category)](#filter-marketplace-catalog-category)
  * [filter catalog (by range price)](#filter-marketplace-catalog-price)
* Marketplace wishlists
  * [add to wishlist](#add-to-wishlist)
  * [get wishlists](#get-all-wishlists)
  * [delete from wishlist](#delete-from-wishlist)
* Matketplace data management
  * [create new product](#create-a-new-product)
  * [create new service](#create-a-new-service)
  * [get all catalogs](#get-all-marketplace-catalogs)
  * [get specified catalog](#get-specified-catalog)
  * [filter catalog (by range price)](#filter-marketplace-catalog-price)  
  * [get specified catalog](#get-specified-catalog)
  * [update existing product](#update-existing-product)  
## Sign up
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
## Login
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

## Create new Project 
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
* ### Response fail (because token not available or expired)
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
## Get all Projects
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
                "totalContract": 15000000,
                "duration": 52,
                "address": "Sulawesi Selatan",
                "cost": 3500000
            },
            {
                "id": 30,
                "name": "Pembangunan Wc",
                "admin": "rocketmail",
                "totalContract": 22000000,
                "duration": 52,
                "address": "Sulawesi Selatan",
                "cost": 1000000
            }
        ],
        "projectsCollab": [
            {
                "id": 32,
                "name": "Pengembangan proyek homestay",
                "admin": "john doe",
                "totalContract": 500000000,
                "duration": 181,
                "address": "Maluku",
                "cost": 0
            },
            {
                "id": 33,
                "name": "Pembangunan Proyek IKN",
                "admin": "john doe",
                "totalContract": 500000000,
                "duration": 181,
                "address": "Sulawesi Selatan",
                "cost": 3150000
            },
            {
                "id": 35,
                "name": "Pengembangan proyek sengketa",
                "admin": "john doe",
                "totalContract": 500000000,
                "duration": 181,
                "address": "Maluku",
                "cost": 0
            }
        ],
        "budgets": {
            "sumContracts": 1537000000,
            "sumSpendings": 7650000,
            "remainingBudget": 1529350000
        },
        "percentageBudgets": {
            "spending": 0.4977228366948601,
            "remainBudget": 99.50227716330514
        }
    }
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
## Get Specified Project
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
        "id": 29,
        "title": "Pembangunan Jembatan",
        "admin": "rocketmail",
        "adminId": 27,
        "totalContract": 15000000,
        "start": "2021-12-22T17:00:00.000Z",
        "finish": "2022-02-12T17:00:00.000Z",
        "address": "Sulawesi Selatan"
    },
    "spendings": [
        {
            "id": 19,
            "content": "Penyewaan jasa aduk semen dengan pasir",
            "cost": 2000000
        },
        {
            "id": 33,
            "content": "Pengecoran",
            "cost": 1500000
        }
    ],
    "members": [
        {
            "id": 49,
            "name": "rocketmail"
        },
        {
            "id": 50,
            "name": "john doe"
        }
    ],
    "tasks": [
        {
            "id": 1,
            "content": "Perancangan Kontruksi",
            "isFinished": 1
        },
        {
            "id": 10,
            "content": "Pengadukan Semen",
            "isFinished": 1
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
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
## Update Project
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
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because not owned data)
  ```
  {
    "statusCode": 403,
    "message": "Unpermission to access",
    "error": "Forbidden"
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
## Delete Project
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
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because not owned data)
  ```
  {
    "statusCode": 403,
    "message": "Unpermission to access",
    "error": "Forbidden"
  }
  ```

## Get Logged User Data
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
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```

## Update logged user
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
* ### Response fail (because token not available or expired)
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
## Delete logged user
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
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
## Search User by Fullname
Token is obtained from login response  
* ### Endpoint  
  `/api/user`
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
    "name": String
  }
  ```
* ### Response Success
  ```
  {
    "searchResult": [
        {
            "USERID": 25,
            "FULLNAME": "jane doe",
            "EMAIL": "janedoe@gmail.com"
        },
        {
            "USERID": 28,
            "FULLNAME": "john morisson",
            "EMAIL": "morisson@gmail.com"
        }
    ]
  }
  ```
* ### Response fail (because request body not filled (required))
  ```
  {
    "statusCode": 400,
    "message": "Please input this fields",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```

## Add new Project Collaborator
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
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because logged user isn't project admin/owner) 
  ```
  {
    "statusCode": 403,
    "message": "Unpermission to access",
    "error": "Forbidden"
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
## Delete Project Collaborator
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
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because logged user isn't project admin/owner) 
  ```
  {
    "statusCode": 403,
    "message": "Unpermission to access",
    "error": "Forbidden"
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
## Get all project spending  
Token is obtained from login response
* ### Endpoint  
  `/api/projects/:projectId/budgets`
* ### Method
  GET
* ### Headers
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success  
  ```
  {
    "message": "Fetch budgets successfully",
    "data": {
        "budgets": [
            {
                "id": 19,
                "projectId": 29,
                "date": "2022-03-16T17:00:00.000Z",
                "content": "Penyewaan jasa aduk semen dengan pasir",
                "amount": 20,
                "cost": 2000000
            }
        ],
        "report": {
            "totalBudget": 15000000,
            "totalSpending": 2000000,
            "remainBudget": 13000000
        }
    }
  }
  ```
* ### Response fail (because token not available or expired)
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
      "message": "Data not found",
      "error": "Not Found"
  }
  ```
## Add new project spending  
Token is obtained from login response
* ### Endpoint  
  `/api/projects/:projectId/budgets`
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
    "date": String (YYYY-MM-DD),
    "content": String,
    "amount": Number,
    "cost": Number
  }
  ```
* ### Response Success
  ```
  {
    "message": "Add new project spending successfully"
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
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because project admin isn't logged user)
  ```
  {
    "statusCode": 403,
    "message": "Unpermission to access",
    "error": "Forbidden"
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
## Delete existing project spending  
Token is obtained from login response  
* ### Endpoint  
  `/api/projects/:projectId/budgets/:budgetId`
* ### Method
  DELETE
* ### Headers
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Delete existing project spending successfully"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because project admin isn't logged user)
  ```
  {
    "statusCode": 403,
    "message": "Unpermission to access",
    "error": "Forbidden"
  }
  ```
* ### Response fail (because project not found)
  ```
  {
      "statusCode": 404,
      "message": "Data not found",
      "error": "Not Found"
  }
  ```
## Update total budget of project  
Token is obtained from login response  
* ### Endpoint  
  `/api/projects/:projectId/updateBudget`
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
    "budget": Number
  }
  ```
* ### Response Success
  ```
  {
    "message": "Update budget contract successfully",
    "updatedBudget": 22000000
  }
  ```
* ### Response fail (because request body not filled (required))
  ```
  {
    "statusCode": 400,
    "message": "Please input this fields",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because project admin isn't logged user)
  ```
  {
    "statusCode": 403,
    "message": "Unpermission to access",
    "error": "Forbidden"
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
## Get single task  
Token is obtained from login response
* ### Endpoint  
  `/api/projects/:projectId/task/:taskId`
* ### Method
  GET
* ### Headers
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response success
  ```
  {
    "message": "Fetch single task successfully",
    "data": {
        "id": 4,
        "content": "Perancangan Kontruksi",
        "isFinished": 0,
        "projectId": 32
    }
  }
  ```

* ### Response fail (because task not found)
  ```
  {
      "statusCode": 404,
      "message": "Data not found",
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
## Create a new task  
Token is obtained from login response
* ### Endpoint  
  `/api/projects/:projectId/task`
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
    "content": String
  }
  ```
* ### Response success
  ```
  {
    "message": "Create new project task successfully",
    "task": "Pengecoran"
  }
  ```
* ### Response fail (because request body not available (required))
  ```
  {
    "statusCode": 400,
    "message": "Please input this fields",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```
* ### Response fail (because project admin isn't logged user)
  ```
  {
    "statusCode": 403,
    "message": "Unpermission to access",
    "error": "Forbidden"
  }
  ```
* ### Response fail (because project or task not found)
  ```
  {
      "statusCode": 404,
      "message": "Data not found",
      "error": "Not Found"
  }
  ```
## Update task  
Token is obtained from login response
* ### Endpoint  
  `/api/projects/:projectId/task/:taskId`
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
    "content": String
  }
  ```
* ### Response success
  ```
  {
    "message": "Update project task successfully",
    "updatedTask": "Pengadukan Semen"
  }
  ```
* ### Response fail (because request body not available (required))
  ```
  {
    "statusCode": 400,
    "message": "Please input this fields",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```
* ### Response fail (because project admin isn't logged user)
  ```
  {
    "statusCode": 403,
    "message": "Unpermission to access",
    "error": "Forbidden"
  }
  ```
* ### Response fail (because project or task not found)
  ```
  {
      "statusCode": 404,
      "message": "Data not found",
      "error": "Not Found"
  }
  ```
## Delete Task
Token is obtained from login response
* ### Endpoint  
  `/api/projects/:projectId/task/:taskId`
* ### Method
  DELETE
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Delete project task successfully"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```
* ### Response fail (because project admin isn't logged user)
  ```
  {
    "statusCode": 403,
    "message": "Unpermission to access",
    "error": "Forbidden"
  }
  ```
* ### Response fail (because project or task not found)
  ```
  {
      "statusCode": 404,
      "message": "Data not found",
      "error": "Not Found"
  }
  ```
## Finish task  
Token is obtained from login response
* ### Endpoint  
  `/api/projects/:projectId/task/:taskId/finish`
* ### Method
  POST
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Task finished",
    "finishedTask": "Perancangan Kontruksi",
    "finishedBy": "rocketmail@gmail.com"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```
* ### Response fail (because project collaborator isn't logged user)
  ```
  {
    "statusCode": 403,
    "message": "Unpermission to access",
    "error": "Forbidden"
  }
  ```
* ### Response fail (because project or task not found)
  ```
  {
      "statusCode": 404,
      "message": "Data not found",
      "error": "Not Found"
  }
  ```
## Get specified project report   
Token is obtained from login response
* ### Endpoint  
  `/api/projects/:projectId/report`
* ### Method
  GET
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Fetch project report successfully",
    "project": {
        "id": 32,
        "title": "Pengembangan proyek homestay",
        "address": "Maluku",
        "start": "2022-01-07T17:00:00.000Z",
        "finish": "2022-07-07T17:00:00.000Z",
        "duration": 181,
        "status": "On Going"
    },
    "reports": {
        "workDay": 76,
        "remainingDay": 105,
        "totalBudget": 500000000,
        "totalSpending": 0,
        "remainingBudget": 500000000,
        "totalTask": 3,
        "finishedTask": 1
    },
    "percentages": {
        "workDay": 42,
        "remainingDay": 58,
        "totalSpending": 0,
        "remainingBudget": 100,
        "task": 33,
        "total": 21
    }
  }
  ```
* ### Response fail (because token not available or expired)
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
      "message": "Data not found",
      "error": "Not Found"
  }
  ```
## Get all projects and users  
Token is obtained from login response  
* ### Endpoint  
  `/api/admin/dashboard`
* ### Method
  GET
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Fetching all project and user successfully",
    "projects": {
        "data": [
            {
                "id": 29,
                "title": "Pembangunan Jembatan",
                "admin": "rocketmail",
                "totalContract": 15000000,
                "address": "Sulawesi Selatan",
                "startDate": "2021-12-22T17:00:00.000Z",
                "finishDate": "2022-02-12T17:00:00.000Z",
                "duration": 52
            },
            {
                "id": 30,
                "title": "Pembangunan Wc",
                "admin": "rocketmail",
                "totalContract": 22000000,
                "address": "Sulawesi Selatan",
                "startDate": "2021-12-22T17:00:00.000Z",
                "finishDate": "2022-02-12T17:00:00.000Z",
                "duration": 52
            },
            {
                "id": 32,
                "title": "Pengembangan proyek homestay",
                "admin": "john doe",
                "totalContract": 500000000,
                "address": "Maluku",
                "startDate": "2022-01-07T17:00:00.000Z",
                "finishDate": "2022-07-07T17:00:00.000Z",
                "duration": 181
            },
            {
                "id": 33,
                "title": "Pembangunan Proyek IKN",
                "admin": "john doe",
                "totalContract": 500000000,
                "address": "Sulawesi Selatan",
                "startDate": "2022-01-07T17:00:00.000Z",
                "finishDate": "2022-07-07T17:00:00.000Z",
                "duration": 181
            },
            {
                "id": 35,
                "title": "Pengembangan proyek sengketa",
                "admin": "john doe",
                "totalContract": 500000000,
                "address": "Maluku",
                "startDate": "2022-01-07T17:00:00.000Z",
                "finishDate": "2022-07-07T17:00:00.000Z",
                "duration": 181
            },
            {
                "id": 36,
                "title": "Pengembangan proyek kolam renang",
                "admin": "john doe",
                "totalContract": 20000000,
                "address": "Yogyakarta",
                "startDate": "2022-03-25T17:00:00.000Z",
                "finishDate": "2022-07-25T17:00:00.000Z",
                "duration": 122
            },
            {
                "id": 37,
                "title": "Pengembangan proyek kolam renang",
                "admin": "john morisson",
                "totalContract": 20000000,
                "address": "Yogyakarta",
                "startDate": "2022-03-25T17:00:00.000Z",
                "finishDate": "2022-07-25T17:00:00.000Z",
                "duration": 122
            }
        ],
        "total": 7
    },
    "users": {
        "data": [
            {
                "id": 24,
                "name": "john doe",
                "type": "personal",
                "isVerified": 0,
                "numPhone": "089123456789",
                "email": "johndoe@gmail.com"
            },
            {
                "id": 25,
                "name": "jane doe",
                "type": "organization",
                "isVerified": 0,
                "numPhone": "089123456789",
                "email": "janedoe@gmail.com"
            },
            {
                "id": 27,
                "name": "rocketmail",
                "type": "company",
                "isVerified": 0,
                "numPhone": "089123456789",
                "email": "rocketmail@gmail.com"
            },
            {
                "id": 28,
                "name": "john morisson",
                "type": "company",
                "isVerified": 0,
                "numPhone": "088987654321",
                "email": "morisson@gmail.com"
            }
        ],
        "total": 4,
        "information": {
            "verified": 0,
            "unVerified": 4
        }
    }
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```
## Create a new product
Create a new product for marketplace (with image upload)  
Token is obtained from login response  
* ### Endpoint  
  `/api/marketplace/product`
* ### Method
  POST
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  Content-type: multipart/form-data
  ```
* ### Body  
  Because this endpoint contains file upload, make sure you added an attribute `enctype` with value `multipart/form-data` in your form. Then make sure you append each of body field in `formData()`.
  ```
    "image": File,
	"title": String,
	"description": String,
	"category": String,
	"cost": Number
  ```
* ### Response Success
  ```
  {
    "Message": "Insert new product successfully",
    "data": {
        "title": "desain stadion",
        "category": "design",
        "isProduct": true,
        "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/591e035b-a4f9-4538-af69-a9fd212b11b0.jpeg"
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
* ### Response fail (because image not uploaded (required))
  ```
  {
    "statusCode": 400,
    "message": "Please, upload an image",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because uploaded file not an image)
  ```
  {
    "statusCode": 400,
    "message": "Invalid Image File Type",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```
* ### Response fail (because uploaded image size is larger than limit)
  ```
  {
    "statusCode": 413,
    "message": "File too large",
    "error": "Payload Too Large"
  }
  ```
## Create a new service
Create a new service for marketplace (with image upload)  
Token is obtained from login response  
* ### Endpoint  
  `/api/marketplace/service`
* ### Method
  POST
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  Content-type: multipart/form-data
  ```
* ### Body  
  Because this endpoint contains file upload, make sure you added an attribute `enctype` with value `multipart/form-data` in your form. Then make sure you append each of body field in `formData()`.
  ```
  "image": File,
  "title": String,
  "description": String,
  "category": String,
  "cost": Number,
  "infoTitle1": String,
  "infoContent1": String,
  "infoDuration1": Number,
  "infoCost2": Number,
  "infoTitle2": String,
  "infoContent2": String,
  "infoDuration2": Number,
  "infoCost2": Number,
  "infoTitle3": String,
  "infoContent3": String,
  "infoDuration3": Number,
  "infoCost3": Number
  ```
* ### Response Success
  ```
  {
    "Message": "Insert new service successfully",
    "data": {
        "title": "Rancangan Rumah tipe 36",
        "category": "Services",
        "isProduct": false,
        "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/db5ab1ce-142d-43db-9013-1ed3e8a92a40.jpeg"
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
* ### Response fail (because image not uploaded (required))
  ```
  {
    "statusCode": 400,
    "message": "Please, upload an image",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because uploaded file not an image)
  ```
  {
    "statusCode": 400,
    "message": "Invalid Image File Type",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```
* ### Response fail (because uploaded image size is larger than limit)
  ```
  {
    "statusCode": 413,
    "message": "File too large",
    "error": "Payload Too Large"
  }
  ```
## Get all marketplace catalogs  
Get all marketplace catalog, contains all product and service  
Token is obtained from login response  
* ### Endpoint  
  `/api/marketplace`
* ### Method
  GET
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Get all marketplace catalogs successfully",
    "data": {
        "allCatalogs": [
            {
                "id": 2,
                "title": "desain tugu sepeda",
                "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/84dc9c5b-fe8b-491f-8070-c455ecfb0f63.jpeg",
                "cost": 2000000,
                "category": "Traditional",
                "owner": "rocketmail"
            },
            {
                "id": 11,
                "title": "Rancangan kantor pos",
                "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/b2727586-07c2-4842-b034-4618cc3ee828.png",
                "cost": 2500000,
                "category": "Minimalis",
                "owner": "rocketmail"
            },
            {
                "id": 14,
                "title": "Rancangan Rumah tipe 36",
                "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/db5ab1ce-142d-43db-9013-1ed3e8a92a40.jpeg",
                "cost": 3000000,
                "category": "Modern",
                "owner": "rocketmail"
            },
            {
                "id": 15,
                "title": "desain stadion",
                "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/591e035b-a4f9-4538-af69-a9fd212b11b0.jpeg",
                "cost": 5000000,
                "category": "Modern",
                "owner": "john doe"
            },
            {
                "id": 16,
                "title": "Desain rancangan jembatan Sumatra - Jawa",
                "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/d4e93a5d-b379-463d-a822-92fa63cbe940.jpeg",
                "cost": 5000000,
                "category": "Modern",
                "owner": "john doe"
            }
        ],
        "userCatalogs": [
            {
                "id": 15,
                "title": "desain stadion",
                "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/591e035b-a4f9-4538-af69-a9fd212b11b0.jpeg",
                "cost": 5000000,
                "category": "Modern",
                "owner": "john doe"
            },
            {
                "id": 16,
                "title": "Desain rancangan jembatan Sumatra - Jawa",
                "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/d4e93a5d-b379-463d-a822-92fa63cbe940.jpeg",
                "cost": 5000000,
                "category": "Modern",
                "owner": "john doe"
            }
        ]
    },
    "metaInfo": {
        "totalCatalogs": 5,
        "totalUserCatalogs": 2
    }
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```
## Search marketplace catalog  
Search from all catalogs by title  
Token is obtained from login response  
* ### Endpoint  
  `/api/marketplace`
* ### Method
  POST
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  Content-type: application/json
  ```
* ### Body
  ```
  {
    "search": String
  }
  ```
* ### Response Success
  ```
  {
    "filteredResult": [
        {
            "id": 2,
            "title": "desain tugu sepeda",
            "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/84dc9c5b-fe8b-491f-8070-c455ecfb0f63.jpeg",
            "cost": 2000000,
            "category": "Traditional",
            "owner": "rocketmail"
        },
        {
            "id": 15,
            "title": "desain stadion",
            "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/591e035b-a4f9-4538-af69-a9fd212b11b0.jpeg",
            "cost": 5000000,
            "category": "Modern",
            "owner": "john doe"
        },
        {
            "id": 16,
            "title": "Desain rancangan jembatan Sumatra - Jawa",
            "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/d4e93a5d-b379-463d-a822-92fa63cbe940.jpeg",
            "cost": 5000000,
            "category": "Modern",
            "owner": "john doe"
        }
    ]
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```
## Filter marketplace catalog (category)
Filter marketplace catalogs by category  
Token is obtained from login response  
* ### Endpoint  
  `/api/marketplace`
* ### Method
  POST
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  Content-type: application/json
  ```
* ### Body
  ```
  {
    "category": String
  }
  ```
* ### Response Success
  ```
  {
    "filteredResult": [
        {
            "id": 14,
            "title": "Rancangan Rumah tipe 36",
            "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/db5ab1ce-142d-43db-9013-1ed3e8a92a40.jpeg",
            "cost": 3000000,
            "category": "Modern",
            "owner": "rocketmail"
        },
        {
            "id": 15,
            "title": "desain stadion",
            "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/591e035b-a4f9-4538-af69-a9fd212b11b0.jpeg",
            "cost": 5000000,
            "category": "Modern",
            "owner": "john doe"
        },
        {
            "id": 16,
            "title": "Desain rancangan jembatan Sumatra - Jawa",
            "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/d4e93a5d-b379-463d-a822-92fa63cbe940.jpeg",
            "cost": 5000000,
            "category": "Modern",
            "owner": "john doe"
        }
    ]
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```
## Filter marketplace catalog (price)  
Filter marketplace catalogs by range of price (minimum and maximum price)  
Token is obtained from login response  
* ### Endpoint  
  `/api/marketplace`
* ### Method
  POST
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  Content-type: application/json
  ```
* ### Body
  ```
  {
    "minPrice": Number, 
    "maxPrice": Number
  }
  ```
* ### Response Success
  ```
  {
    "filteredResult": [
        {
            "id": 11,
            "title": "Rancangan kantor pos",
            "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/b2727586-07c2-4842-b034-4618cc3ee828.png",
            "cost": 2500000,
            "category": "Minimalis",
            "owner": "rocketmail"
        },
        {
            "id": 14,
            "title": "Rancangan Rumah tipe 36",
            "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/db5ab1ce-142d-43db-9013-1ed3e8a92a40.jpeg",
            "cost": 3000000,
            "category": "Modern",
            "owner": "rocketmail"
        },
        {
            "id": 15,
            "title": "desain stadion",
            "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/591e035b-a4f9-4538-af69-a9fd212b11b0.jpeg",
            "cost": 5000000,
            "category": "Modern",
            "owner": "john doe"
        },
        {
            "id": 16,
            "title": "Desain rancangan jembatan Sumatra - Jawa",
            "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/d4e93a5d-b379-463d-a822-92fa63cbe940.jpeg",
            "cost": 5000000,
            "category": "Modern",
            "owner": "john doe"
        }
    ]
  }
  ```
* ### Response fail (because minimum price is larger than maximum price)  
  ```
  {
    "statusCode": 400,
    "message": "Sorry, filter input for minimum price must smaller than maximum price",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```
## Get specified catalog  
Get single or specified marketplace catalog, for more details about catalog  
Token is obtained from login response  
* ### Endpoint  
  `/api/marketplace/catalogs/:catalogId`
* ### Method
  GET
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Get single catalog successfully",
    "data": {
        "result": {
            "id": 16,
            "title": "Desain rancangan jembatan Sumatra - Jawa",
            "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/d4e93a5d-b379-463d-a822-92fa63cbe940.jpeg",
            "description": "Jasa desain untuk rancangan konstruksi jembatan Sumatra - Jawa",
            "cost": 5000000,
            "category": "Modern",
            "owner": "john doe"
        },
        "info": [
            {
                "id": 19,
                "title": "standard",
                "content": "desain dengan fitur seperti biasa",
                "duration": 2,
                "cost": 2000000
            },
            {
                "id": 20,
                "title": "advanced",
                "content": "Penambahan fitur revisi desain 1 x",
                "duration": 4,
                "cost": 3500000
            },
            {
                "id": 21,
                "title": "professional",
                "content": "Konsultrasi gratis, penyaluran dengan kontraktor professional",
                "duration": 7,
                "cost": 5000000
            }
        ]
    }
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
    "statusCode": 401,
    "message": "Unauthorized"
  }
  ```
* ### Response fail (because data not found)
  ```
  {
      "statusCode": 404,
      "message": "Data not found",
      "error": "Not Found"
  }
  ```
## Add to wishlist  
Add existing catalog to wishlist  
Token is obtained from login response  
* ### Endpoint  
  `/api/marketplace/wishlists`
* ### Method  
  POST
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  Content-type: application/json
  ```
* ### Body
  ```
  {
    "catalogId": Number
  }
  ```
* ### Response Success
  ```
  {
    "message": "Insert to wishlist successfully"
  }
  ```
* ### Response fail (because catalog already exist in wishlists)
  ```
  {
    "statusCode": 400,
    "message": "Catalog already added",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
## Get all wishlists  
Get all wishlist catalog's from logged user  
Token is obtained from login response  
* ### Endpoint  
  `/api/marketplace/wishlists`
* ### Method  
  GET
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Get wishlists successfully",
    "user": "john doe",
    "data": [
        {
            "id": 6,
            "catalog": {
                "id": 16,
                "title": "Desain rancangan jembatan Sumatra - Jawa",
                "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/d4e93a5d-b379-463d-a822-92fa63cbe940.jpeg",
                "cost": 5000000,
                "category": "Modern"
            }
        },
        {
            "id": 9,
            "catalog": {
                "id": 2,
                "title": "desain tugu sepeda",
                "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/84dc9c5b-fe8b-491f-8070-c455ecfb0f63.jpeg",
                "cost": 2000000,
                "category": "Traditional"
            }
        },
        {
            "id": 10,
            "catalog": {
                "id": 11,
                "title": "Rancangan kantor pos",
                "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/b2727586-07c2-4842-b034-4618cc3ee828.png",
                "cost": 2500000,
                "category": "Minimalis"
            }
        },
        {
            "id": 12,
            "catalog": {
                "id": 14,
                "title": "Rancangan Rumah tipe 36",
                "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/db5ab1ce-142d-43db-9013-1ed3e8a92a40.jpeg",
                "cost": 3000000,
                "category": "Modern"
            }
        }
    ]
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
## Delete from wishlist  
Delete existing wishlist catalog from logged user  
Token is obtained from login response  
* ### Endpoint  
  `/api/marketplace/wishlists/:wishlistId`
* ### Method  
  DELETE
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  ```
* ### Response Success
  ```
  {
    "message": "Catalog removed from wishlists"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because data not found)
  ```
  {
      "statusCode": 404,
      "message": "Data not found",
      "error": "Not Found"
  }
  ```
## Update existing product  
Update existing product in marketplace  
Token is obtained from login response  
* ### Endpoint  
  `/api/marketplace/product/:productId`
* ### Method  
  PUT
* ### Headers  
  ```
  Authorization: `Bearer ${token}`
  Content-type: multipart/form-data
  ```
* ### Body  
  Because this endpoint contains file upload, make sure you added an attribute `enctype` with value `multipart/form-data` in your form. Then make sure you append each of body field in `formData()`.
  ```
    "image": File,
	"title": String,
	"description": String,
	"category": String,
	"cost": Number,
  "imageUrl": String
  ```
* ### Response success
  ```
  {
    "message": "Success update product data",
    "data": {
        "title": "Rancangan stadion",
        "description": "Desain / rancangan bangunan stadion bernuansa modern dan futuristik",
        "image": "https://pitect-services.s3.ap-southeast-1.amazonaws.com/marketplace/6c4b01fb-6ccd-4581-8c52-a35240b582fb.jpeg"
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
* ### Response fail (because uploaded file not an image)
  ```
  {
    "statusCode": 400,
    "message": "Invalid Image File Type",
    "error": "Bad Request"
  }
  ```
* ### Response fail (because token not available or expired)
  ```
  {
      "statusCode": 401,
      "message": "Unauthorized"
  }
  ```
* ### Response fail (because not owned data)
  ```
  {
      "statusCode": 403,
      "message": "Forbidden to access",
      "error": "Forbidden"
  }
  ```
* ### Response fail (because data not found)
  ```
  {
      "statusCode": 404,
      "message": "Data not found",
      "error": "Not Found"
  }
  ```
* ### Response fail (because uploaded image size is larger than limit)
  ```
  {
    "statusCode": 413,
    "message": "File too large",
    "error": "Payload Too Large"
  }
  ```