const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "employeeDB"
  });
  
  connection.connect(function(err) {
      if (err) throw err;
      console.log("connected as id " + connection.threadId);
      promptUser();
    });

const promptUser = () => {
    inquirer.prompt( {
        name: "userAction",
        type: "list",
        message: "What would you like to do?",
        choices: ['View Employees', 'Add Employee', 'Remove Employee']
      }).then(function(res) {
          console.log(res)
        switch(res.userAction) {
            case 'View Employees':
                viewEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
        }
  });
}

const viewEmployees = () => {
    connection.query('SELECT * FROM employees', (err, employees) => {
        if(err) throw err;
        console.log(employees);
        promptUser();
    })
}

const addEmployee = () => {
    connection.query('SELECT * FROM roles', (err, roles) => {
        if(err) throw err;
        roles = ['biba']
        inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: "What is the employee's first name?"
        },{
            name: 'lastName',
            type: 'input',
            message: "What is the employee's last name?"
        },{
            name: 'role',
            type: 'list',
            message: "What is the employee's role?",
            choices: roles
        }
        ]).then(function(res) {
            // roles.forEach(el => {
                
            // })
            connection.query(
                "INSERT INTO employees SET ?",
                {
                  first_name: res.firstName,
                  last_name: res.lastName,
                //   role_id: response.startingBid,
                //   manager_id: response.startingBid
                },   
                function(err){
                  if (err) throw err;
                  console.log('Employee was successfully added!');
                  promptUser();
                }
            );
        });     
    })
};
