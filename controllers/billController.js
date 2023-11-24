class BillController{
    constructor(model){
        this.model = model;
    }
    
    createBill(student_id, issued_amount, issued_date, issuer){
        return this.model.createBill(student_id, issued_amount, issued_date, issuer);         
    }

    updateBill(issuerAmount, issuer){
        this.model.updateBill(issuerAmount, issuer);
    }
    
}


module.exports =  BillController;
