const { Router } = require("express");
const UserModel = require("../Models/user");
const authrouter = Router();
const bcrypt = require("bcrypt");
const moment = require("moment");

authrouter.post("/user/signup", async (req, res) => {
  console.log(req.body);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // email should not exist alreday

  const newUser = new UserModel({
    email: req.body.email,
    password: hashedPassword,
    count: 0,
  });

  newUser
    .save()
    .then(() => {
      res.send({ code: 200, message: "Signup success" });
    })
    .catch((err) => {
      res.send({ code: 500, message: "Signup Err" });
    });
});
authrouter.post("/user/login", async (req, res) => {
  console.log(req.body.email);

  // email and password match

  const date = new Date();

  UserModel.findOne({ email: req.body.email })
    .then(async (result) => {
      console.log(result, "11");
      const bcryptedData = await bcrypt.compare(
        req.body.password,
        result.password
      );
      console.log("bcryptedData", bcryptedData);

      let counter = result.count;

      if (bcryptedData) {
        res.send({
          email: result.email,
          code: 200,
          message: "user Found",
          token: "token",
        });

        const updateData = async (email) => {
          const data = await UserModel.updateMany(
            { email: email },
            {
              $set: {
                count: 0,
                current_hour: 0,
                current_minute: 0,
                current_second: 0,
                current_year: 0,
                current_date: 0,
                current_month: 0,
              },
            }
          );
          console.log(data);
        };

        updateData(result.email);
      } else if (counter >= 4) {
        const updateData = async (email) => {
          const data = await UserModel.updateOne(
            { email: email },
            {
              $set: {
                current_hour: date.getHours(),
                current_minute: date.getMinutes(),
                current_second: date.getSeconds(),
                current_year: date.getFullYear(),
                current_date: date.getDate(),
                current_month: date.getMonth(),
              },
            }
          );
          console.log(data);
        };

        updateData(result.email);
        res.send({
          code: 201,
          message: "Too many attempts",
          current_hour: result.current_hour,
          current_minute: result.current_minute,
          current_date: result.current_date,
          current_month: result.current_month,
          current_second: result.current_second,
          current_year: result.current_year,
        });
      } else {
        const updateData = async (email, counter) => {
          const data = await UserModel.updateOne(
            { email: email },
            { $set: { count: counter } }
          );
          console.log(data);
        };
        counter++;
        updateData(result.email, counter);

        const updateData2 = async (email) => {
          const data = await UserModel.updateOne(
            { email: email },
            {
              $set: {
                current_hour: date.getHours(),
                current_minute: date.getMinutes(),
                current_second: date.getSeconds(),
                current_year: date.getFullYear(),
                current_date: date.getDate(),
                current_month: date.getMonth(),
              },
            }
          );
          console.log(data);
        };

        updateData2(result.email);
        res.send({ code: 404, message: "password wrong" });
      }
    })
    .catch((err) => {
      res.send({ code: 500, message: "user not found" });
    });
});

module.exports = authrouter;
