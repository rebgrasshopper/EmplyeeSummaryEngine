const Employee = require("./Employee");

//class Manager inherited from Employee, additional argument officeNumber, function getOfficeNumber
class Manager extends Employee {
    constructor(name, id, email, officeNumber){
        super(name, id, email);
        this.officeNumber = officeNumber;
    }

    getRole = () => "Manager";

    getOfficeNumber = () => this.officeNumber;
    
}

module.exports = Manager;