class userController{  
    constructor(model, view){
        this.model = model;
        this.view = view;
    }

    async createUser(user, collection){
        this.view.showMessage("User Created Sucessfully");
        return await this.model.createUser(user, collection);
    }

    async deleteUser(filter){
        this.view.showMessage("User Deleted Sucessfully");
        return await this.model.deleteUser(filter);
    }

    updateUser(user, status){
        this.model.updateUser(user, status);
        this.view.showMessage("User Updated Sucessfully");
    }

    async issueBill(student_id, bill){
        return this.model.issueBill(student_id, bill);
    }

    async payBill(student_id, bill_amount){
        return this.model.payBill(student_id, bill_amount);
    }

    async fetchUsers(filter){        
        this.view.showMessage("User Fetched Sucessfully");
        return await this.model.fetchUsers(filter);
    }
}

module.exports = userController;