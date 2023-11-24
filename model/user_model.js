const { ObjectId } = require("mongodb");
const sbsDB = require("../db/dbConnect");
const Bill = require("./bill_model.js");
require("../db/dbConnect");

class User {
    constructor(type) {
        this.type_of_user = type;
    }

    async createUser(user, collection) {
        let usr, user_schema;
        try {
            const stu_collection = sbsDB.collection(collection);
            console.log(user);
            if (user.type_of_user == "student") {
                usr = new Student({
                    fullname: user.fullname,
                    email: user.email,
                    password: user.password,
                    faculty: user.faculty,
                    semester: user.semester,
                    ph_number: user.ph_number,
                    type_of_user: user.type_of_user,
                    // batch: user.batch
                });

                user_schema = {
                    "fullname": usr.fullname,
                    "email": usr.email,
                    "password": usr.password,
                    "faculty": usr.faculty,
                    "semester": usr.semester,
                    "ph_number": usr.ph_number,
                    "type_of_user": usr.type_of_user,
                    "batch": usr.batch,
                    "account_status": "Pending"
                }
            } else {
                usr = new Staff(user.fullname, user.email, user.password, user.ph_number, user.type_of_user);
                user_schema = {
                    "fullname": usr.fullname,
                    "email": usr.email,
                    "password": usr.password,
                    "ph_number": usr.ph_number,
                    "type_of_user": usr.type_of_user
                }
            }
            return (await stu_collection.insertOne(user_schema)).acknowledged;
        } catch (error) {
            console.error("Error Creating A User", error);
            throw error;
        }
    }

    deleteUsers(filter) {
        const users = sbsDB.collection("users");
        return users.deleteOne(filter);
    }

    async fetchUsers(filter) {
        try {
            const users = sbsDB.collection("users");
            const userArray = await users.find(filter).toArray();
            return userArray;
        } catch (error) {
            console.error("Error Fetching Users:", error);
            throw error;
        }
    }

    updateUser(user, update_doc) {
        const users = sbsDB.collection("users");
        let update_document = {};

        if (update_doc === undefined){
            update_doc = {};
        }

        if (user.type_of_user === "student") {
            update_document = {
                $set: {
                    fullname: user.fullname,
                    email: user.email,
                    password: user.password,
                    ph_number: user.ph_number,
                    faculty: user.faculty,
                    semester: user.semester,
                    account_status: update_doc.account_status,
                    due_amount: update_doc.due_amount
                }
            }

            if (update_doc !== undefined){
                update_document.$set.account_status = update_doc.account_status;
                update_document.$set.due_amount = update_doc.due_amount;
            }
        } else {
            update_document = {
                $set: {
                    fullname: user.fullname,
                    email: user.email,
                    password: user.password,
                    ph_number: user.ph_number,
                    type_of_user: user.type_of_user
                }
            }
        }

        users.updateOne({ _id: user._id }, update_document).then(success => {
            if (success.acknowledged) {
                console.log(success);
                console.log("Sucessfully Updated");
            } else {
                console.log('Failed');
            }
        });
    }
}

class Student extends User {
    constructor({ fullname = '', email = '', password = '', faculty = '', semester = '', ph_number = '', due_amount = '', type_of_user = '', account_status = '', bill_id = '' } = {}) {
        super(type_of_user);
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.faculty = faculty;
        this.semester = semester;
        this.ph_number = ph_number;
        this.due_amount = due_amount;
        this.account_status = account_status;
        this.bill_id = bill_id;
    }

    async payBill(student_id, bill_details) {
        const users = sbsDB.collection("users");
        const student = await users.findOne({ _id: student_id });
    
        const payment_schema = {
            "bill_id": bill_details.bill_id,
            "bill_image": bill_details.bill_image,
            "payment_amount": bill_details.bill_amount,
            "payment_id": bill_details.payment_id,
            "payment_status": "Paid"
        }

        let isBillPresent = false;
        student.bill.forEach(bill => {
            if (JSON.stringify(bill.bill_id) === JSON.stringify(bill_details.bill_id)) {
                isBillPresent = true;
                return isBillPresent;
            }
        })

        if (isBillPresent) {
            return await users.updateOne({_id: student._id},
                {
                    $push : {payment: payment_schema}
                } 
            );
        }else {
            return false;
        }
    }
}

class Staff extends User {
    constructor(fullname, email, password, ph_number, type) {
        super(type);
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.ph_number = ph_number;
    }

    async issueBill(student_id, bill) {
        try {
            const users = sbsDB.collection("users");
            let student = await users.findOne({ _id: student_id, bill: { $exists: true } });
            console.log(`Student : ${student}`);
            if (student === null) {
                const result = await users.updateOne({ _id: student_id }, { $set: { "bill": [bill] } });
                console.log(result);
                return result.modifiedCount;
            } else {
                const result = await users.updateOne({ _id: student_id },
                    {
                        $set: {
                            "bill": [...student.bill, bill]
                        }
                    });
                console.log(result);

                return result.modifiedCount;
            }
        } catch (error) {
            console.error("Error Issuing Bills:", error);
            throw error;
        }
    }
}
module.exports = { User, Student, Staff };
