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
  
  connection.connect(err => {
      if (err) throw err;
      console.log("connected as id " + connection.threadId);
      promptUser();
    });

const promptUser = () => {
    inquirer.prompt( {
        name: "userAction",
        type: "list",
        message: "What would you like to do?",
        choices: ['View Employees', 'View Employees By Manager', 'View Roles', 'View Departments', 'Add Employee', 'Remove Employee', 'Remove Role', 'Remove Department']
      }).then(res => {
        switch(res.userAction) {
            case 'View Employees':
                view('employees')
                break;
            case 'View Employees By Manager':
                viewEmployeesByManager();
                break;
            case 'View Roles':
                view('roles')
                break;
            case 'View Departments':
                view('departments')
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                remove('employees');
                break;
            case 'Remove Role':
                remove('roles');
                break;
            case 'Remove Department':
                remove('departments');
                break;
        }
  });
}

const view = (table) => {
    connection.query(`SELECT * FROM ${table}`, (err, table) => {
        if(err) throw err;
        console.table(table);
        promptUser();
    })
}

const viewEmployeesByManager = () => {
    connection.query('SELECT * FROM employees', (err, employees) => {
        if(err) throw err;
        let managerIds = [];
        employees.forEach(el => {
            if(el.manager_id != null){
                managerIds.push(el.manager_id);
            }
        })
        let employeesByManagerId;
        const employeeFullNames = employees.map(employee => `${employee.first_name} ${employee.last_name}`)
        let choices = employees.filter(employee => managerIds.includes(employee.id))
        choices = choices.map(employee => `${employee.first_name} ${employee.last_name}`)
        inquirer.prompt( {
            name: "viewByManager",
            type: "list",
            message: "Which manager's employees would you like to view?",
            choices
        }).then(res => {
            employeeFullNames.forEach((el, i) => {
                if(el === res.viewByManager){
                    employeesByManagerId = employees[i].id
                }
            })
            connection.query(`SELECT * FROM employees WHERE manager_id = ${employeesByManagerId}`, (err, employees) => {
                if(err) throw err;
                console.table(employees);
                promptUser();
            })
        });
    });
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
            ]).then(res => {
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
                    err => {
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
        }).then(res => {
            let removedEmployeeId;
            choices.forEach((el, i) => {
                if(el === res.removedEmployee){
                    removedEmployeeId = employees[i].id;
                }
            })
            connection.query(`DELETE FROM employees WHERE id = ${removedEmployeeId}`,  err => {
                    if (err) throw err;
                    console.log('Employee was successfully removed!');
                    promptUser();
                }
            );
        });
    });
}

const remove = (table) => {
    connection.query(`SELECT * FROM ${table}`, (err, tableArr) => {
        if(err) throw err;
        let choices;
        if(table === 'employees') {
            choices = tableArr.map(employee => `${employee.first_name} ${employee.last_name}`)
        } else if (table === 'roles'){
            choices = tableArr.map(role => role.title)
        }else {
            choices = tableArr.map(department => department.name)
        }
            
        inquirer.prompt( {
            name: "removed",
            type: "list",
            message: "Which would you like to remove?",
            choices
        }).then(res => {
            let removedId;
            choices.forEach((el, i) => {
                if(el === res.removed){
                    removedId = tableArr[i].id;
                }
            })
            connection.query(`DELETE FROM ${table} WHERE id = ${removedId}`,  err => {
                    if (err) throw err;
                    console.log('Successfully removed!');
                    promptUser();
                }
            );
        });
    });
}