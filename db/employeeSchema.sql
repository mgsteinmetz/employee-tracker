-- SETTING UP DATABASE
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;


-- ALL MY TABLES LISTED BELOW
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    roles_id INT,
	PRIMARY KEY(id)
);

CREATE TABLE roles (
    r_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary INT,
    departments_id INT,
	PRIMARY KEY(r_id)
);

CREATE TABLE department (
    d_id INT NOT NULL AUTO_INCREMENT,
	department VARCHAR(30),
    PRIMARY KEY(d_id)
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

INSERT INTO roles (title, salary, department_id)
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

SELECT * FROM employee;
SElECT * FROM roles;
SElECT * FROM department;