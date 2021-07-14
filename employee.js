// ADDING DEPENDENCIES
const dotenv = require('dotenv').config();
const consoleTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');
const { resourceLimits } = require('worker_threads');

// PORT
const portConnection = mysql.createConnection( {
    host: process.env.DB_HOST,

    port: 3306,

    user: process.env.DB_USER,

    password: process.env.DB_PASS,

    database: process.env.DB_NAME
});

// FUNCTION FOR INPUT ACTIONS
const seeOption = () => {
    inquirer
        .prompt( {
            name: 'option',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'Add Employee',
                'Add Role',
                'Add Department',
                'View all Employees',
                'View all Roles',
                'View all Departments',
                'Update Employee Role',
                'Update Employee Manager',
                'View all Employees by Department',
                'View all Employees by Manager',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'DONE'
            ],
    })
    .then((answer) => {
        switch (answer.option) {
            case 'Add Employee':
                addEmployee();
                break;

            case 'Add Role':
                addRole();
                break;

            case 'Add Department':
                addDepartment();
                break;

            case 'View all Employees':
                viewAllEmployees();
                break;

            case 'View all Employees By Role':
                viewByRole();
                break;

            case 'View all Employees By Department':
                viewByDepartment();
                break;

            case 'Update Employee Role':
                updateEmployeeRole();
                break;

            case 'DONE':
                portConnection.end();
                break;
        }
    });
};
seeOption();
// ADDING EMPLOYEE FUNCTION
const addEmployee = () => {
    portConnection.query(`SELECT * FROM roles`, (err , res) => {
        if (err) throw err;

            inquirer
                .prompt( [ 
                    {
                        name: 'addFirstName',
                        type: 'input',
                        message: 'What is their first name?'
                    },
                    {
                        name: 'addLastName',
                        type: 'input',
                        message: 'What is their last name?'
                    },
                    {
                        name: 'addRole',
                        type: 'rawlist',
                        message: 'What is their role?',
                        choices: res.map((role) => role.title)
                    },
                ])
                .then((answer) => {
                    portConnection.query(`INSERT INTO employee SET ?`,
                        {
                            first_name: answer.addFirstName,
                            last_name: answer.addLastName,
                            role_id: res
                                .filter((res) => res.title === answer.role)
                                .map((res) => res.r_id)[0]
                        },
                        (err) => {
                            if (err) throw err;
                            console.log('Employee successfully added.');

                        });
                    seeOption();
                });
        });
};

// ADD ROLE FUNCTION
const addRole = () => {
    portConnection.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;

        inquirer
            .prompt( [
                {
                    name: 'role',
                    type: 'input',
                    message: 'What is the name of this role?'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary of this role?'
                },
                {
                    name: 'departmentNum',
                    type: 'rawlist',
                    message: 'What is the department?',
                    choices: res.map((res) => res.department)
                }
            ])
            .then((answer) => {
                portConnection.query(`INSERT INTO role SET ?`,
                    {
                        title: answer.role,
                        salary: answer.salary,
                        department: res
                                .filter((res) => res.department === answer.departmentNum)
                                .map((res) => res.d_id)[0]
                    });
                    seeOption();
            });
    });
};

// ADD DEPARTMENT FUNCTION
const addDepartment = () => {
    inquirer
        .prompt( [
            {
                name: 'department',
                type: 'input',
                message: 'What is this department?'
            }
        ])
        .then((answer) => {
            portConnection.query(`INSERT INTO department SET ?`,
                {
                    department: answer.department
                });
                seeOption();
        });
};

//  VIEW ALL EMPLOYEES FUNCTION
const viewAllEmployees = () => {
    portConnection.query("SELECT first_name, last_name, title, salary, department FROM employees INNER JOIN roles ON employees.role_id = role.r_id INNER JOIN departments ON roles.department_id = department.d_id;", (err, res) => {
        if (err) throw err;
        console.table(res);
        seeOption();
    });
};

// VIEW EMPLOYEES BY ROLE FUNCTION
const viewByRole = () => {
    portConnection.query(`SELECT * FROM roles`, (err, res) => {
        if (err) throw err;

        inquirer.prompt( [
            {
                name: 'viewRole',
                type: 'list',
                message: 'Which department do you want to view?',
                choices: res.map((res) => res.title)
            }
        ])
        .then((answer) => {
            const {viewRole} = answer;

            portConnection.query(`SELECT first_name, last_name, title, salary, department FROM employees INNER JOIN roles ON employees.role_id = role.r_id INNER JOIN departments ON roles.department_id = department.d_id WHERE title= '${viewRole}';`, (err, res) => {
                if (err) throw err;
                console.table(res);
                seeOption();
            });
        });
    });
};

// VIEW BY DEPARTMENT FUNCTION
const viewByDepartment = () => {
    portConnection.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;

        inquirer
            .prompt( [
                {
                    name: 'viewDepartment',
                    type: 'list',
                    message: 'Which department do you want to view?',
                    choices: res.map((res) => res.department)
                }
            ])
            .then((answer) => {
                const {viewDepartment} = answer;

                portConnection.query(`SELECT first_name, last_name, title, salary, department FROM employees INNER JOIN roles ON employees.role_id = role.r_id INNER JOIN departments ON roles.department_id = department.d_id WHERE department= '${viewDepartment}';`, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    seeOption();
                });
            });
    });
};

// UPDATE EMPLOYEE ROLE FUNCTION
const updateEmployeeRole = () => {
    portConnection.query(`SELECT * FROM roles`, (err, res) => {
        portConnection.query(`SELECT * FROM employee`, (err, res2) => {
            if (err) throw err;

            inquirer
                .prompt( [
                    {
                        name: 'employee',
                        type: 'rawlist',
                        message: 'Which employee do you want to update?',
                        choices: res2.map((employee) => `${employee.first_name} ${employee.last_name}`)
                    },
                    {
                        name: 'role',
                        type: 'rawlist',
                        message: `What is their role?`,
                        choices: res.map((role) => role.title)
                    }
                ])
                .then((answer) => {
                    const roleNum = res.filter((role) => role.title === answer.role).map((role) => role.id)[0];
                    const firstName = answer.employee.split('')[0];
                    const lastName = answer.employee.split('')[1];
                    portConnection.query(`UPDATE employee SET role_id= ${roleNum} WHERE first_name= ${firstName} AND last_name= ${lastName}`)
                    seeOption();
                });
        });
    });
};