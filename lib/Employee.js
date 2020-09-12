// Employee Class, initialized with name, id, email, has getRole function
class Employee {
    constructor(name, id, email){
        this.name = name;
        this.id = id;
        this.email = email;
    }

    getName = () => this.name;

    getId = () => this.id;

    getEmail = () => this.email;

    getRole = () => "Employee";
}

module.exports = Employee;