const Manager = require("./Manager");
const Engineer = require("./Engineer");
const Intern = require("./Intern");
const path = require("path");
const fs = require("fs");
let team;

const templatesDir = path.resolve(__dirname, "../templates");

const render = employees => {
  team = employees[0].team;
  let employeeObjects = employees.map(employee => {
    if (employee.role === "Manager") {
      return new Manager(employee.name, employee.id, employee.email, employee.officeNumber);
    } else if (employee.role === "Engineer") {
      return new Engineer(employee.name, employee.id, employee.email, employee.github);
    } else if (employee.role === "Intern") {
      return new Intern(employee.name, employee.id, employee.email, employee.school);
    } 
  })
  const managerhtml = [];
  const engineerhtml = [];
  const internhtml = [];

  if (managerhtml.length < 1) {
    console.log(" ");
    console.log("-----------");
    console.log("Please don't forget to add a manger to the team!");
    console.log("-----------");
    console.log(" ");
  }
  
  managerhtml.push(...employeeObjects
    .filter(employee => employee.getRole() === "Manager")
    .map(manager => renderManager(manager))
  );
  engineerhtml.push(...employeeObjects
    .filter(employee => employee.getRole() === "Engineer")
    .map(engineer => renderEngineer(engineer))
  );
  internhtml.push(...employeeObjects
    .filter(employee => employee.getRole() === "Intern")
    .map(intern => renderIntern(intern))
  );

  return renderMain(managerhtml, engineerhtml, internhtml);

};

const renderManager = manager => {
  let template = fs.readFileSync(path.resolve(templatesDir, "manager.html"), "utf8");
  template = replacePlaceholders(template, "name", manager.getName());
  template = replacePlaceholders(template, "role", manager.getRole());
  template = replacePlaceholders(template, "email", manager.getEmail());
  template = replacePlaceholders(template, "id", manager.getId());
  template = replacePlaceholders(template, "officeNumber", manager.getOfficeNumber());
  return template;
};

const renderEngineer = engineer => {
  let template = fs.readFileSync(path.resolve(templatesDir, "engineer.html"), "utf8");
  template = replacePlaceholders(template, "name", engineer.getName());
  template = replacePlaceholders(template, "role", engineer.getRole());
  template = replacePlaceholders(template, "email", engineer.getEmail());
  template = replacePlaceholders(template, "id", engineer.getId());
  template = replacePlaceholders(template, "github", engineer.getGithub());
  return template;
};

const renderIntern = intern => {
  let template = fs.readFileSync(path.resolve(templatesDir, "intern.html"), "utf8");
  template = replacePlaceholders(template, "name", intern.getName());
  template = replacePlaceholders(template, "role", intern.getRole());
  template = replacePlaceholders(template, "email", intern.getEmail());
  template = replacePlaceholders(template, "id", intern.getId());
  template = replacePlaceholders(template, "school", intern.getSchool());
  return template;
};

function renderMain (managers, engineers, interns) {
  let template = fs.readFileSync(path.resolve(templatesDir, "main.html"), "utf8");
  template = replacePlaceholders(template, "team_name", team);
  template = replacePlaceholders(template, "managers", managers.join(""));
  template = replacePlaceholders(template, "engineers", engineers.join(""));
  return replacePlaceholders(template, "interns", interns.join(""));
};

const replacePlaceholders = (template, placeholder, value) => {
  const pattern = new RegExp("{{ " + placeholder + " }}", "gm");
  return template.replace(pattern, value);
};

module.exports = render;
