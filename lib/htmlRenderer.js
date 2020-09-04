const Manager = require("./Manager");
const Engineer = require("./Engineer");
const Intern = require("./Intern");
const path = require("path");
const fs = require("fs");
let team;

const templatesDir = path.resolve(__dirname, "../templates");

const render = employees => {
  team = employees[0].team;
  console.log(team);
  let employeeObjects = employees.map(employee => {
    if (employee.role === "Manager") {
      return new Manager(employee.name, employee.id, employee.email, employee.officeNumber);
    } else if (employee.role === "Engineer") {
      return new Engineer(employee.name, employee.id, employee.email, employee.github);
    } else if (employee.role === "Intern") {
      return new Intern(employee.name, employee.id, employee.email, employee.school);
    } 
  })
  const html = [];

  html.push(...employeeObjects
    .filter(employee => employee.getRole() === "Manager")
    .map(manager => renderManager(manager))
  );
  html.push(...employeeObjects
    .filter(employee => employee.getRole() === "Engineer")
    .map(engineer => renderEngineer(engineer))
  );
  html.push(...employeeObjects
    .filter(employee => employee.getRole() === "Intern")
    .map(intern => renderIntern(intern))
  );

  return renderMain(html.join(""));

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

const renderMain = html => {
  let template = fs.readFileSync(path.resolve(templatesDir, "main.html"), "utf8");
  console.log(team);
  template = replacePlaceholders(template, "team_name", team);
  return replacePlaceholders(template, "team", html);
};

const replacePlaceholders = (template, placeholder, value) => {
  const pattern = new RegExp("{{ " + placeholder + " }}", "gm");
  return template.replace(pattern, value);
};

module.exports = render;
