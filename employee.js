// ADDING DEPENDENCIES
const dotenv = require('dotenv').congig();
const consoleTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql');

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

            case 'View all Roles':
                viewAllRoles();
                break;

            case 'View all Departments':
                viewAllDepartments();
                break;

            case 'Update Employee Role':
                updateEmployeeRole();
                break;

            case 'Update Employee Manager':
                updateEmployeeManager();
                break;

            case 'View all Employees by Department':
                viewByDepartment();
                break;

            case 'View all Employees by Manager':
                viewByManager();
                break;

            case 'Remove Employee':
                removeEmployee();
                break;

            case 'Remove Role':
                removeRole();
                break;

            case 'Remove Department':
                removeDepartment();
                break;

            case 'DONE':
                portConnection.end();
                break;
        }
    });
};