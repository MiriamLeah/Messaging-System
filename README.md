# Messaging System - Full Stack Project

This project is a real-time messaging application consisting of an Angular frontend and an ASP.NET Core Web API backend.


**Clone the Project**

git clone [https://github.com/MiriamLeah/Messaging-System.git](https://github.com/MiriamLeah/Messaging-System.git)
cd Messaging-System

**Setup and Run the Backend (Server)**
Open a terminal and run these commands one by one:
Navigate to the API project folder
cd ChatApp.Server/WebApplication1
dotnet dev-certs https --trust
dotnet run --launch-profile https
Wait for the message: Now listening on: https://localhost:7004

**Setup and Run the Frontend (Client)**
Open a new terminal window and run these commands:
Navigate to the frontend folder
cd messaging-app
npm install
Open your browser and go to: http://localhost:4200
ng serve
