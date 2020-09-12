const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const render = require("./lib/htmlRenderer");

const OUTPUT_DIR = path.resolve("./output", "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

let employeeData;
let finalHTML;
let teamList = [];
let employeeList = [];

//read employeeFile and save data to employeeData, also creating a total list of employees and teams
function initialEmployeeData() {
    fs.readFile("./output/employeeFile.json", { encoding:"utf8" }, function(error, data) {
        if (error) {
            console.log(error);
        } else {
            employeeData = JSON.parse(data);

            //make an array of all poossible teams, and one of all employees
            for (let employee of employeeData) {
                if (!(teamList.includes(employee.team))) {
                    teamList.push(employee.team);
                }
                if (!(employeeList.includes(`${employee.name}, Team: ${employee.team}`))) {
                    employeeList.push(`${employee.name}, Team: ${employee.team}`);
                }
            }
        }
    })
}


//process all answers and write team html files
async function getEmployeeData(answers){
    if (answers.action === "Remove an Employee") {
        //find and remove employee from employeeData
        let index;
        let teamName;
        for (let employee in employeeData){
            if (`${employeeData[employee].name}, Team: ${employeeData[employee].team}` === answers.unemploy) {
                teamName = employeeData[employee].team;
                index = employee;
            }
        }
        employeeData.splice(index, 1);
        //write new employeeData file without thisEmployee
        fs.writeFile("./output/employeeFile.json", JSON.stringify(employeeData, null, 4), function(error){
            if (error) {
                return console.log(error);
            }
            console.log("Employee removed from team");
            //render team without removed employee
            let thisTeam = employeeData.filter(employee => employee.team === teamName)
            if (thisTeam.length > 0){
                console.log("Rendering updated HTML file");
                finalHTML = render(thisTeam);
                fs.writeFile(`./output/${teamName.replace(/ /g, "")}.html`, finalHTML, function(error){
                    if (error) {
                        return console.log(error);
                    }
                    console.log("HTML file written.");
                });
            }
        });

    } else if (answers.action === "Re-render a team page") {
        //find all employees matching the team to re-render, and pass them to render function
        let thisTeam = employeeData.filter(employee => employee.team === answers.reteam)
            finalHTML = render(thisTeam);
            fs.writeFile(`./output/${answers.reteam.replace(/ /g, "")}.html`, finalHTML, function(error){
                if (error) {
                    return console.log(error);
                }
                console.log("HTML file written.");
            });

    } else {
        //add new employee to employeeData, and re-write employeeFile
        employeeData.push(answers);
        fs.writeFile("./output/employeeFile.json", JSON.stringify(employeeData, null, 4), function(error){
            if (error) {
                return console.log(error);
            }
            console.log("Employee written to file, rendering HTML");

            //find all employees with a matching team name, and pass them to render file
            let thisTeam = employeeData.filter(employee => employee.team === answers.team)
            finalHTML = render(thisTeam);
            fs.writeFile(`./output/${answers.team.replace(/ /g, "")}.html`, finalHTML, function(error){
                if (error) {
                    return console.log(error);
                }
                console.log("HTML file written.");
            })
        })
    }
}

//inquirer prompts
const questions = [
    {//pick one of three actions for the program
        type: "list",
        message: "What would you like to do? ",
        name: "action",
        choices: ["Add an employee", "Remove an Employee", "Re-render a team page"]
    },
    {//Action 3: re-render team page
        type: "list",
        message: "Which team's page would you like to re-render? ",
        name: "reteam",
        when: (answers) => answers.action === "Re-render a team page",
        choices: teamList
    },
    {//Action 2: remove employee
        type: "list",
        message: "Which employee would you like to remove? ",
        name: "unemploy",
        when: (answers) => answers.action === "Remove an Employee",
        choices: employeeList,
    },
    {//Action 1: add employee data
        type: "input",
        message: "Employee name: ",
        name: "name",
        when: (answers) => answers.action === "Add an employee",
    },
    {
        type: "input",
        message: "Employee ID: ",
        name: "id",
        when: (answers) => answers.action === "Add an employee",
    },
    {
        type: "input",
        message: "Employee email: ",
        name: "email",
        when: (answers) => answers.action === "Add an employee",
    },
    {
        type:"list",
        message: "Choose which role the employee is fulfilling: ",
        choices: ["Engineer", "Intern", "Manager"],
        name: "role",
        when: (answers) => answers.action === "Add an employee",
    },
    {
        type: "input",
        message: "Employee GitHub username: ",
        name: "github",
        when: (answers) => ((answers.action === "Add an employee") && (answers.role === "Engineer")),
    },
    {
        type: "input",
        message: "Employee school: ",
        name: "school",
        when: (answers) => ((answers.action === "Add an employee") && (answers.role === "Intern")),
    },
    {
        type: "input",
        message: "Employee office phone number: ",
        name: "officeNumber",
        when: (answers) => ((answers.action === "Add an employee") && (answers.role === "Manager")),
        //phone number validation from Inquirer documentation
        validate: function (value) {
            var pass = value.match(
              /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
            );
            if (pass) {
              return true;
            }
      
            return 'Please enter a valid phone number';
          },
    },
    {
        type: "input",
        message: "What team is this employee being added to? ",
        name: "team",
        when: (answers) => answers.action === "Add an employee",
    },

];

//init
initialEmployeeData();
inquirer.prompt(questions).then(function(answers){
    getEmployeeData(answers);



});