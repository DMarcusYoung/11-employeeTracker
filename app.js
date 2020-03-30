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
        switch(res.userAction) {
            case 'View Employees':
                viewEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
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
        connection.query('SELECT * FROM employees', (err, employees) => {
            if(err) throw err;
            const roleChoices = roles.map(role => role.title)
            const managerChoices = employees.map(employee => `${employee.first_name} ${employee.last_name}`)
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
                choices: roleChoices
            },{
                name: 'manager',
                type: 'list',
                message: "Who is the employee's manager?",
                choices: managerChoices
            }
            ]).then(function(res) {
                console.log(res)
                let role_id;
                let manager_id;
                roleChoices.forEach((el, i) => {
                    if(el === res.role){
                        role_id = roles[i].id
                    }
                })
                managerChoices.forEach((el, i) => {
                    if(el === res.manager){
                        manager_id = employees[i].id;
                    }
                })
                connection.query(
                    "INSERT INTO employees SET ?",
                    {
                      first_name: res.firstName,
                      last_name: res.lastName,
                      role_id,
                      manager_id
                    },   
                    function(err){
                      if (err) throw err;
                      console.log('Employee was successfully added!');
                      promptUser();
                    }
                );
            });     
        });
    });
};

const removeEmployee = () => {
    connection.query('SELECT * FROM employees', (err, employees) => {
        if(err) throw err;
        const choices = employees.map(employee => `${employee.first_name} ${employee.last_name}`)
        inquirer.prompt( {
            name: "removedEmployee",
            type: "list",
            message: "Which employee would you like to remove?",
            choices
        }).then(function(res) {
            let removedEmployeeId;
            choices.forEach((el, i) => {
                if(el === res.removedEmployee){
                    removedEmployeeId = employees[i].id
                }
            })
            connection.query(
            "DELETE FROM employees WHERE id = ?",
                [removedEmployeeId],   
                function(err){
                    if (err) throw err;
                    console.log('Employee was successfully removed!');
                    promptUser();
                }
            );
        });
    });
}