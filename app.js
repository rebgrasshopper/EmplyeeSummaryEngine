const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve("./output", "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

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
        for (let employee in employeeData){
            if (`${employeeData[employee].name}, Team: ${employeeData[employee].team}` === answers.unemploy) {
                index = employee;
            }
        }
        employeeData.splice(index, 1);

        //write new employeeData file without thisEmployee
        fs.writeFile("./output/employeeFile.json", JSON.stringify(employeeData, null, 4), function(error){
            if (error) {
                return console.log(error);
            }
            console.log("Employee removed from team, rendering new team HTML");
            let thisTeam = employeeData.filter(employee => employee.team === employeeData[index].team)
            finalHTML = render(thisTeam);
            fs.writeFile(`./output/${employeeData[index].team.replace(/ /g, "")}.html`, finalHTML, function(error){
                if (error) {
                    return console.log(error);
                }
                console.log("HTML file written.");
            });
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
    {
        type: "list",
        message: "What would you like to do? ",
        name: "action",
        choices: ["Add an employee", "Remove an Employee", "Re-render a team page"]
    },
    {
        type: "list",
        message: "Which team's page would you like to re-render? ",
        name: "reteam",
        when: (answers) => answers.action === "Re-render a team page",
        choices: teamList
    },
    {
        type: "list",
        message: "Which employee would you like to remove? ",
        name: "unemploy",
        when: (answers) => answers.action === "Remove an Employee",
        choices: employeeList,
    },
    {
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

initialEmployeeData();
inquirer.prompt(questions).then(function(answers){
    getEmployeeData(answers);



});
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! 
