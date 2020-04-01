# Employee Tracker

## Description
Command line employee tracker application that keeps track of employees, roles, and departments. Features include viewing, adding, updating and deleting.

## Technologies
This app was completely backend, so JS for pretty much all of the functionality. Node and the inquirer plugin were used to build the ui in the terminal, mysql for storing the data for the employees.

## Challenges
In general there was a lot of nesting inquirer prompts and connection queries to build the terminal ui and update the database which was super tedious, especially because there are three tables that each require a separate connection query to access. The most annoying thing was definitely working with the ids. Choosing the manager and role when adding a new employee has to show the full name of the roles and managers, but each employee gets assigned the id of the role/manager not their actual name. Additionally, I had to map the data array to only show the names of the roles/mangers. To fix this, I had to loop through all the employees and roles to match the chosen manager/role and assign it's id to a variable used in the connection query. 
  
## Screenshots
![Employee Tracker Screenshot](https://github.com/DMarcusYoung/11-employeeTracker/blob/master/employeeTrackerScreenshot.PNG)
