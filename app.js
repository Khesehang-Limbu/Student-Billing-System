const bodyParser = require("body-parser");
const express = require("express");
const fileUpload = require("express-fileupload");

const path = require("path");

const sbsDB = require("./db/dbConnect");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { ObjectId } = require("mongodb");

const UserModel = require("./model/user_model");

const UserView = require("./views/userView");
const BillModel = require("./model/bill_model.js");

const app = express();

const BillController = require("./controllers/billController.js");
const UserController = require("./controllers/userController");

const studentModel = new UserModel.Student();
const staffModel = new UserModel.Staff();
const userModel = new UserModel.User();

const userView = new UserView();
const billModel = new BillModel();

const userController = new UserController(userModel, userView);

const studentController = new UserController(studentModel, userView);
const staffController = new UserController(staffModel, userView);
const billController = new BillController(billModel);

app.use(cookieParser());
app.use(express.static("public"));
app.disable("view cache");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// For Not Allowing the Logged In Session to be locally cached and shown on pressing the back button
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get("/", function (req, res, next) {
  sbsDB
    .listCollections()
    .toArray()
    .then((collections) => {
      if (collections.length == 0) {
        sbsDB.createCollection("users");
        const admin = sbsDB.createCollection("admin");
        admin.then((collection) => {
          collection.insertOne({ email: "admin", password: "admin@123" });
        });
      }
    });

  if (req.cookies.login !== undefined) {
    const cookie = jwt.decode(req.cookies.login);
    if (cookie.login === "student" || cookie.login === "staff") {
      res.redirect(`/user_dashboard/${cookie.user_name}`);
    } else if (cookie.login === "admin") {
      res.redirect("/dashboard");
    }
  } else {
    res.render("pages/index.ejs");
  }
  next();
});

app.get("/dashboard", function (req, res) {
  const cookie = jwt.decode(req.cookies.login);
  if (req.cookies.login !== undefined && cookie.login === "admin") {
    const users = userController.fetchUsers({});
    users.then((result) => {
      res.render("pages/dashboard.ejs", { users: result, error: "" });
    });
  } else {
    res.render("pages/login.ejs", {
      title: "Admin Login",
      placeholder: "Username",
    });
  }
});

app.get("/user_dashboard/:user_name", function (req, res) {
  const cookie = jwt.decode(req.cookies.login);
  if (req.cookies.login !== undefined) {
    if (cookie.login === "student") {
      const users = studentController.fetchUsers({ email: cookie.user_email });
      users.then((result) => {
        console.log(result);
        if (result.length !== 0) {
          res.render("pages/user_dashboard.ejs", {
            user: result[0],
            user_name: req.params.user_name,
          });
        } else {
          res.redirect("/logout");
        }
      });
    } else if (cookie.login === "staff") {
      const users = studentController.fetchUsers({});
      users.then((result) => {
        res.render("pages/staff_dashboard.ejs", {
          users: result,
          user_name: req.params.user_name,
        });
      });
    } else {
      res.redirect("/login/staff");
    }
  } else {
    res.redirect("/");
  }
});

app.get("/staff", function (req, res) {
  res.redirect("/login/staff");
});

app.get("/admin", function (req, res) {
  const cookie = jwt.decode(req.cookies.login);
  if (req.cookies.login !== undefined && cookie.login === "admin") {
    res.redirect("/dashboard");
  } else {
    res.render("pages/login.ejs", {
      title: "Admin Login",
      placeholder: "Username",
      error: "",
    });
  }
});

app.post("/issue", function (req, res) {
  const { issuer, issued_amount, issued_date, student_id } = req.body;
  const cookie = jwt.decode(req.cookies.login);
  const student_account = userController.fetchUsers({
    email: cookie.user_email,
  });

  student_account.then((result) => {
    if (result) {
      const bill_id = new ObjectId();
      const bill_info = {
        bill_id: bill_id,
        issuer_id: result[0]._id,
        issued_amount: issued_amount,
        issued_date: issued_date,
        issuer: issuer,
        payment_status: "Due",
      };

      staffController
        .issueBill(new ObjectId(student_id), bill_info)
        .then((issueResult) => {
          if (issueResult !== 0) {
            res.redirect("/staff");
          } else {
            res.redirect("/staff");
          }
        });
    }
  });
});

// User Login Section

app.post("/login", function (req, res) {
  // Determine the type of user and the appropriate collection
  const type_of_user = req.body.type_of_user;
  let isAdmin = false;
  let collection;
  if (type_of_user === "student" || type_of_user === "staff") {
    collection = sbsDB.collection("users");
  } else {
    collection = sbsDB.collection("admin");
    isAdmin = true;
  }

  // Check if the username is already present
  let isAuthenticated = false;
  if (req.cookies.login === undefined && !isAuthenticated) {
    
    // If username unique, create a user and send it to the dashboard
    if (type_of_user == "student") {
      collection
        .findOne({
          email: req.body.email,
          type_of_user: type_of_user,
        })
        .then((user) => {
          if (user === null) {
            if (req.body.route === "/") {
              studentController.createUser(req.body, "users");
              const privateKey = process.env.PRIVATE_KEY;
              const token = jwt.sign(
                {
                  login: "student",
                  user_name: req.body.fullname,
                  user_email: req.body.email,
                },
                privateKey
              );

              res.cookie("login", token);
              res.redirect(`/user_dashboard/${req.body.fullname}`);
            } 
            // If the username exists then send the user to the login/student route for login
            else if (req.body.route === "/login/student") {
              res.cookie("error", "User Not Found, Register First!");
              res.redirect("/login/student");
            }
          } 
          // If user exists then compare the passwords and take the user to the dashboard
          else {
            if (user.password == req.body.password) {
              const privateKey = process.env.PRIVATE_KEY;

              const token = jwt.sign(
                {
                  login: "student",
                  user_name: user.fullname,
                  user_email: req.body.email,
                },
                privateKey
              );

              res.cookie("login", token);
              res.redirect(`/user_dashboard/${user.fullname}`);
            } 
            // Else redirect to the login page
            else {
              res.redirect("/login/student");
            }
          }
        });
    } 
    // For Staff Account
    else if (type_of_user === "staff") {
      collection
        .findOne({
          email: req.body.email,
          type_of_user: type_of_user,
        })
        .then((user) => {
          if (user === null) {
            res.redirect("/login/staff");
          } else {
            if (user.password == req.body.password) {
              const privateKey = process.env.PRIVATE_KEY;
              const token = jwt.sign(
                {
                  login: "staff",
                  user_name: user.fullname,
                  user_email: req.body.email,
                },
                privateKey
              );
              res.cookie("login", token);
              res.redirect(`/user_dashboard/${user.fullname}`);
            } else {
              res.redirect("/login/staff");
            }
          }
        });
    } else if (type_of_user === "admin") {
      collection.findOne({ email: req.body.email }).then((user) => {
        if (user === null) {
          res.redirect("/admin");
        } else {
          console.log("Admin");
          if (user.password == req.body.password) {
            const privateKey = process.env.PRIVATE_KEY;
            const token = jwt.sign({ login: "admin" }, privateKey);
            res.cookie("login", token);
            res.redirect("/dashboard");
          } else {
            res.redirect("/admin");
          }
        }
      });
    }
  } else {
    console.log("logged in");
    const token = req.cookies.login;
    const decoded = jwt.verify(token, "userloggedin");
    console.log(decoded);

    if (decoded.login === process.env.TOKEN) {
      isAuthenticated = true;
      console.log(type_of_user);
      if (type_of_user == "student") {
        res.redirect(`/user_dashboard/${decoded.user_name}`);
      } else if (type_of_user == "staff") {
        res.redirect(`/user_dashboard/${decoded.user_name}`);
      } else {
        res.redirect("/dashboard");
      }
    } else {
      res.send("<h2>Log Out of Other Sessions</h2>");
    }
  }
});

app.get("/login/:type", function (req, res) {
  const user_type = req.params.type;
  const cookie = jwt.decode(req.cookies.login);

  if (req.cookies.login !== undefined) {
    if (cookie.login === "student" || user_type === "student") {
      res.redirect(`/user_dashboard/${cookie.user_name}`);
    } else if (cookie.login === "staff" || user_type === "staff") {
      res.redirect(`/user_dashboard/${cookie.user_name}`);
    } else if (cookie.login === "admin" || user_type === "admin") {
      res.redirect("/dashboard");
    } else {
      if (req.params.type === "staff") {
        res.render("pages/login.ejs", {
          title: "Staff Login",
          placeholder: "Email",
          error: req.cookies.error,
        });
      } else if (req.params.type === "student") {
        res.render("pages/login.ejs", {
          title: "Student Login",
          placeholder: "Email",
          error: req.cookies.error,
        });
      } else if (req.params.type === "admin") {
        res.render("pages/login.ejs", {
          title: "Admin Login",
          placeholder: "Username",
          error: req.cookies.error,
        });
      }
    }
  } else {
    if (req.params.type === "staff") {
      res.render("pages/login.ejs", {
        title: "Staff Login",
        placeholder: "Email",
        error: req.cookies.error,
      });
    } else if (req.params.type === "student") {
      res.render("pages/login.ejs", {
        title: "Student Login",
        placeholder: "Email",
        error: req.cookies.error,
      });
    } else if (req.params.type === "admin") {
      res.render("pages/login.ejs", {
        title: "Admin Login",
        placeholder: "Username",
        error: req.cookies.error,
      });
    }
  }
});

app.post("/create_staff", function (req, res) {
  studentController.createUser(req.body, "users").then((result) => {
    res.redirect("/dashboard");
  });
});

app.post("/update_user", function (req, res) {
  const id = req.body.id;
  const updated_user = new UserModel.Student({
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    faculty: req.body.faculty,
    ph_number: req.body.ph_number,
    type_of_user: req.body.type_of_user,
  });

  studentController.fetchUsers({ _id: new ObjectId(id) }).then((user) => {
    updated_user.account_status = user[0].account_status;
    updated_user.bill_id = user[0].bill_id;
    updated_user.type_of_user = user[0].type_of_user;
    updated_user._id = user[0]._id;
    updated_user.due_amount = user[0].due_amount;
    updated_user.semester = user[0].semester;
    studentController.updateUser(updated_user);
    res.redirect("/");
  });
});

app.get("/logout", function (req, res) {
  res.clearCookie("login");
  res.redirect("/");
});

app.post("/reject", function (req, res) {});

app.post("/approval", function (req, res) {
  const id = req.body.id;
  studentController.fetchUsers({ _id: new ObjectId(id) }).then((user) => {
    const update_doc = {
      account_status: "Approved",
      due_amount: req.body.due_amount,
    };
    studentController.updateUser(user[0], update_doc);
    res.redirect("/admin");
  });
});

app.get("/delete/:id", function (req, res) {
  const result = studentModel.deleteUsers({ _id: new ObjectId(req.params.id) });
  result.then((status) => {
    if (status.acknowledged === true) {
      console.log("Sucessfully Deleted");
      res.redirect("/dashboard");
    } else {
      console.log("Failed To Delete");
    }
  });
});

app.post("/payment/:user_name", function (req, res) {
  // Get the file that was set to our field named "image"
  const image = req.files.bill_image;

  // If no image submitted, exit
  if (image === null) return res.sendStatus(400);

  // If does not have image mime type prevent from uploading
  // if (/^image/.test(image.mimetype)) return res.sendStatus(400);
  // console.log(req.files);
  // Move the uploaded image to our upload folder
  const uploadPath = path.join("public/uploads/bills/" + image.name);
  console.log(uploadPath);
  image.mv(uploadPath);

  // // All good
  // res.sendStatus(200);

  res.cookie("sucess", "Fee Successfully Paid, Evaluation waiting");
  const { bill_amount, student_id, bill_id } = req.body;
  const bill_details = {
    bill_image: image.name,
    bill_amount: bill_amount,
    bill_id: new ObjectId(bill_id),
    payment_id: new ObjectId(),
  };

  const bills = sbsDB.collection("bills");
  const users = sbsDB.collection("users");

  studentController
    .payBill(new ObjectId(student_id), bill_details)
    .then((isPaid) => {
      if (isPaid) {
        if (isPaid.acknowledged) {
          users.findOne({ _id: new ObjectId(student_id) }).then((student) => {
            users.updateOne(
              {
                _id: student._id,
              },
              {
                $set: {
                  "bill.$[i].payment_status": "Paid",
                },
              },
              {
                arrayFilters: [{ "i.bill_id": bill_details.bill_id }],
              }
            );
          });
          res.redirect("/");
        } else {
          console.log("error");
        }
      }
    });
});

app.get("/verify", function (req, res) {
  const bill_id = req.query.bill_id;
  const users = sbsDB.collection("users");

  // const payment = async () => {
  //   result = await users.find({
  //     type_of_user: "student",
  //     "bill.0.bill_id" : new ObjectId(bill_id)
  //   }).toArray();

  //   console.log(result);
  // }

  const payment = users
    .find({
      bill: { $elemMatch: { bill_id: new ObjectId(bill_id) } },
    })
    .project({
      payment: {
        $elemMatch : {
          bill_id : new ObjectId(bill_id)
        }
      }
    })
    .next();

  const result = payment.then(result => {
    try {
      if (result){
        const {bill_amount, bill_img} = result.payment[0];
        res.send(result.payment[0]);
        resolve(result);
      }else{
        reject("404");
      }
    } catch (error) {
      return error;
    }
  })
  // result.then(r => {
  //   const {bill_img, bill_amount} = r.payment[0];
  //   res.send({
  //     bill_amount: bill_amount,
  //     bill_img: bill_img,
  //   });
  // }) 
});

app.post("/verify", function (req, res) {
  res.redirect("/");
});

module.exports = app;
