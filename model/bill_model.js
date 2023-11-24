const sbsDB = require("../db/dbConnect.js");

class BillModel {
    issueDate;
    
    constructor(){
    }

    async createBill(student_id, issued_amount, issued_date, issuer){
        let bill_schema;
        const bill_collection = sbsDB.collection("bill");
        
        bill_schema = {
            "issued_amount": issued_amount,
            "issued_date" : issued_date,
            "issuer" : issuer,
            "student_id" : student_id
        }

        return await bill_collection.insertOne(bill_schema);
    }
 
    updateBill(issueAmount, issueDate, issuer){


    }
    

    
}

module.exports =  BillModel;
