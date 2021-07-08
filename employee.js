// ADDING DEPENDENCIES
const dotenv = require('dotenv').congig();
const consoleTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');
const { resourceLimits } = require('worker_threads');

// PORT
const portConnection = mysql.createConnection( {
    host: process.env.DB_HOST,

    port: 3001,

    user: process.env.DB_USER,

    password: process.env.DB_PASS,

    database: 'employee_db'
});

// FUNCTION DISPLAYING BIG TITLE OVERLAY
const begin = () => {
    console.log(`
        - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        |                                                     |
        |    _____                 _                          |
        |   | ____|_ __ ___  _ __ | | ___  _   _  ___  ___    |
        |   |  _| | '_ ' _ \| '_ \| |/ _ \| | | |/ _ \/ _ \   |
        |   | |___| | | | | | |_) | | (_) | |_| |  __/  __/   |
        |   |_____|_| |_| |_| .__/|_|\___/ \__, |\___|\___|   |
        |                   |_|            |___/              |
        |    __  __                                           |
        |   |  \/  | __ _ _ __   __ _  __ _  ___ _ __         |
        |   | |\/| |/ _' | '_ \ / _' |/ _' |/ _ \ '__|        |
        |   | |  | | (_| | | | | (_| | (_| |  __/ |           |
        |   |_|  |_|\__,_|_| |_|\__,_|\__, |\___|_|           |
        |                             |___/                   |
        |                                                     |
        | _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
    `);

    seeOption();
};

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

// ADDING EMPLOYEE FUNCTION
const addEmployee = () => {
    portConnection.query(`SELECT * FROM role`, (err , res) => {
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
                                .map((res) => res.id)[0]
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
                                .map((res) => res.id)[0]
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
    portConnection.query(`SELECT first_name, last_name, title, salary, department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;`, (err, res) => {
        if (err) throw err;
        console.table(res);
        seeOption();
    });
};

// VIEW EMPLOYEES BY ROLE FUNCTION
const viewByRole = () => {
    portConnection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'viewRole',
                type: 'list',
                message: 'Which department do you want to view?',
                choices: res.map((res) => res.title)
            }
        ])
        .then((answer) => {
            const {viewRole} = answer;

            portConnection.query(`SELECT first_name, last_name, title, salary, department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE title = "${viewRole}"`, (err, res) => {
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
            .prompt([
                {
                    name: 'viewDepartment',
                    type: 'list',
                    message: 'Which department do you want to view?',
                    choices: res.map((res) => res.department)
                }
            ])
            .then((answer) => {
                const {viewDepartment} = answer;

                portConnection.query(`SELECT first_name, last_name, title, salary, department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department = "${viewDepartment}"`, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    seeOption();
                });
            });
    });
};