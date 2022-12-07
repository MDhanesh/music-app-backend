const Login = require("../schema/loginSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const jwt_decode = require("jwt-decode");
const { ObjectId } = require("mongodb");

const checkpassword = (password, confirmpassword) => {
  return password !== confirmpassword ? false : true;
};

exports.signup = async (req, res) => {
  try {
    const payload = req.body;
    const existuser = await Login.findOne({ email: req.body.email });
    //if existUser
    if (existuser)
      return res.status(400).send({ msg: "you are an exist user" });
    //password & confirm password validation
    const isSameePassword = checkpassword(
      req.body.password,
      req.body.confirmpassword
    );
    if (!isSameePassword) {
      return res.status(400).send({ msg: "password doesnot match" });
    } else delete req.body.confirmpassword;
    // //password hash
    const randomString = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, randomString);
    //save in DB
    const newEmployee = new Login({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: "member",
    });
    console.log(newEmployee);
    await newEmployee.save((err, data) => {
      // console.log(err);
      // console.log(data);
      if (err) {
        return res.status(400).send({
          message: "Error while adding new employee. Please check the data",
        });
      }
      res.status(201).send({
        employeeId: data._id,
        message: "Employee has been added successfully.",
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
//signin
exports.signin = async (req, res) => {
  try {
    //email validation
    const existuser = await Login.findOne({ email: req.body.email });
    // console.log(existuser);
    if (!existuser) {
      return res
        .status(400)
        .send({ msg: "you are not an exist user. Please signup" });
    }
    //password vaild or not

    const isSamePassword = await bcrypt.compare(
      req.body.password,
      existuser.password
    );
    if (!isSamePassword)
      return res.status(400).send({ msg: "password doesn't match" });

    //token creation
    const token = jwt.sign({ existuser }, process.env.SECERT_KEY, {
      expiresIn: "1hr",
    });
    res.send(token);
  } catch (error) {
    console.log(error);
  }
};
///

exports.Login = async (req, res) => {
  if (!req.headers.token) {
    return res.status(500).send({ message: "Invalid Token" });
  }
  const token = req.headers.token;
  //console.log(token);
  try {
    const users = jwt_decode(token);
    // console.log(users);
    if (!users) {
      return res.status(500).json({ message: "Un Authorize" });
    } else {
      return res.status(200).json(users);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "error not found" });
  }
};
//////////////////

exports.getall = async (req, res) => {
  const options = {
    // sort returned documents in ascending order
    sort: { createdAt: 1 },
    // Include only the following
    // projection : {}
  };

  const cursor = await Login.find(options);
  if (cursor) {
    res.status(200).send({ success: true, data: cursor });
  } else {
    res.status(200).send({ success: true, msg: "No Data Found" });
  }
};
//////Role update

exports.update = async (req, res) => {
  // console.log(req.body.role, req.params._id);
  const filter = { _id: req.params.id };
  const role = req.body.role;
  console.log(filter);

  try {
    const result = await Login.findOneAndUpdate(filter, { role: role });
    res.status(200).send({ user: result });
  } catch (err) {
    console.log(err);
    res.status(400).send({ success: false, msg: err });
  }
};
//////////

exports.delete = async (req, res) => {
  const filter = { _id: req.params.id };
  console.log(filter);
  const result = await Login.deleteOne(filter);
  if (result.deletedCount === 1) {
    res.status(200).send({ success: true, msg: "Data Deleted" });
  } else {
    res.status(200).send({ success: false, msg: "Data Not Found" });
  }
};

///forgot password

exports.forgot = async (req, res) => {
  const { email } = req.body;
  //console.log(email);
  try {
    const existuser = await Login.findOne({ email: req.body.email });
    // console.log(existuser);
    if (!existuser) {
      return res.status(400).send({ msg: "Email not found" });
    }
    const secret = process.env.SECRET_KEY + existuser.password;
    const payload = {
      email: existuser.email,
      id: existuser._id,
    };

    //User exist and now create a one time link valid for 15 minutes
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    console.log(token);
    const link = `https://crm-app-node.netlify.app/reset/${existuser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mgdhanesh98@gmail.com",
        pass: "szqlearjiwuqybxk",
      },
    });
    var mailOptions = {
      from: "mgdhanesh98@gmail.com",
      to: `${existuser.email}`,
      subject: "Password reset link",
      html: `We have received your request for reset password. Click this link to reset your password.<br>
                    <a href = ${link}>Click Here</a><br>
                    <p>This link is valid for 15 minutes from your request initiation for password recovery.</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent:" + info.res);
      }
    });
    res.send({ message: "Email sent successfully" });
  } catch (err) {
    return res.status(400).send(err);
  }
};

//reset password

exports.resetpassword = async (req, res) => {
  const { id, token } = req.params;
  //check if this id exist in database
  const existuser = await Login.findOne({ _id: ObjectId(id) });

  // console.log(existuser);
  if (!existuser) {
    return res.status(400).send({ msg: "Link expried" });
  }
  const secret = process.env.SECRET_KEY + existuser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.send("Verified");
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.resetpassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    //check if this id exist in database
    const existuser = await Login.findOne({ _id: ObjectId(id) });
    if (!existuser) {
      return res.status(400).send({ msg: "User Not Exist" });
    }
    const secret = process.env.SECRET_KEY + existuser.password;

    const checkpassword = (password, confirmpassword) => {
      return password !== confirmpassword ? false : true;
    };
    const isSameePassword = checkpassword(
      req.body.password,
      req.body.confirmpassword
    );
    if (!isSameePassword) {
      return res.status(400).send({ msg: "password doesnot match backend" });
    } else {
      delete req.body.confirmpassword;
      const verify = jwt.verify(token, secret);
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);
      const updatePassword = await Login.updateOne(
        { _id: ObjectId(id) },
        { $set: { password: encryptedPassword } }
      );
      console.log(updatePassword);

      res.send({ message: "Password updated" });
    }
  } catch (err) {
    return res.status(400).send({ msg: "Something went wrong" });
  }
};
