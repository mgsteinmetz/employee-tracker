-- SETTING UP DATABASE
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;


-- ALL MY TABLES LISTED BELOW
CREATE TABLE employee (
    id INTEGER PRIMARY KEY NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);

CREATE TABLE role (
    id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(9,2) NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL
);


-- ADDING INPUT OPTIONS FOR TABLES
INSERT INTO employee (first_name, last_name, role_id)
VALUES
    ('MIKE', 'STEINMETZ', 1),
    ('ADAM', 'THIELEN', 2),
    ('DALVIN', 'COOK', 3),
    ('KIRK', 'COUSINS', 4),
    ('JUSTIN', 'JEFFERSON', 4),
    ('PATRICK', 'PETERSON', 5),
    ('DALVIN', 'TOMLINSON', 6),
    ('DANIELLE', 'HUNTER', 7);

INSERT INTO role (title, salary, department_id)
VALUES
    ('SALES LEAD', 100000, 1),
    ('SALESPERSON', 80000, 1),
    ('LEAD ENGINEER', 150000, 2),
    ('SOFTWARE ENGINEER', 120000, 2),
    ('ACCOUNTANT', 125000, 3),
    ('LEGAL TEAM LEAD', 250000, 4),
    ('LAWYER', 190000, 4);

INSERT INTO department (name)
VALUES
    ('SALES')
    ('ENGINEERING')
    ('FINCANCE')
    ('LEGAL');