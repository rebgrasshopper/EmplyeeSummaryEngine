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

async function getEmployeeData(answers){
    fs.readFile("./output/employeeFile.json", { encoding:"utf8" }, function(error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log("I'm returning!");
            console.log(data);
            employeeData = JSON.parse(data);
            console.log(employeeData);
            console.log(answers);
            console.log("---------");
            employeeData.push(answers);
            console.log(employeeData);
            fs.writeFile("./output/employeeFile.json", JSON.stringify(employeeData, null, 4), function(error){
                if (error) {
                    return console.log(error);
                }
                console.log("Employee written to file");
            })
        }
    })
}
const questions = [
    {
        type: "input",
        message: "Employee name: ",
        name: "name"
    },
    {
        type: "input",
        message: "Employee ID: ",
        name: "id",
    },
    {
        type: "input",
        message: "Employee email: ",
        name: "email",
    },
    {
        type:"list",
        message: "Choose which role the employee is fulfilling: ",
        choices: ["Engineer", "Intern", "Manager"],
        name: "role",
    },
    {
        type: "input",
        message: "Employee GitHub username: ",
        name: "github",
        when: (answers) => answers.role === "Engineer",
    },
    {
        type: "input",
        message: "Employee school: ",
        name: "school",
        when: (answers) => answers.role === "Intern",
    },
    {
        type: "input",
        message: "Employee office phone number: ",
        name: "officeNumber",
        when: (answers) => answers.role === "Manager",
    },
];

inquirer.prompt(questions).then(function(answers){
    getEmployeeData(answers)



})
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
// for the provided `render` function to work! ```
