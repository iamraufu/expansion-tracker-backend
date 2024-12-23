const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const mongoose = require("mongoose");

// Register a new user
const register = async (req, res) => {
      try {
            const { email, password } = req.body
            const userExist = Boolean(await UserModel.findOne({ email: email.trim() }))

            if (!userExist) {
                  const salt = await bcrypt.genSalt(10);
                  const passwordHash = await bcrypt.hash(password, salt);

                  let user = await UserModel.create(
                        {
                              ...req.body,
                              password: passwordHash
                        }
                  );

                  return res.status(201).send(
                        {
                              status: true,
                              message: "User created successfully!",
                              token: jwt.sign({
                                    name: user.name,
                                    email: user.email,
                                    role: user.role,
                              }, process.env.JWT),
                              user
                        })
            }
            else {
                  return res.status(409).send({
                        status: false,
                        message: `User exist with ${email}`
                  })
            }
      }
      catch (err) {
            res.send({
                  status: false,
                  message: `Error in registration : ${err}`
            })
      }
}

// User Login
const login = async (req, res) => {
      try {
            const { email, password } = req.body
            const user = await UserModel.findOne({ email: email.trim() , isDeleted:false })
            const userWithoutPassword = await UserModel.findOne({ email: email.trim() , isDeleted:false }).select(" -password")
            // .populate(
            //       {
            //             path: 'managers',
            //             select: " -password"
            //       }
            // ).populate(
            //       {
            //             path: 'employees',
            //             select: " -password"
            //       }
            // )
            const userExist = Boolean(user)

            if (!userExist) {
                  return res.status(401).json({
                        status: false,
                        message: `User doesn't exist`
                  })
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!user || !isPasswordValid) {
                  return res.status(401).json({
                        status: false,
                        message: "Invalid email or password"
                  })
            }

            const token = jwt.sign(
                  {
                        email: userWithoutPassword.email,
                        name: userWithoutPassword.name,
                        role: userWithoutPassword.role
                  },
                  process.env.JWT,
                  {
                        expiresIn: '365d'
                  });

            res.status(200).json({
                  status: true,
                  message: "User logged in successfully!",
                  token: `Bearer ${token}`,
                  user: userWithoutPassword
            });
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

// GET all users
const users = async (req, res) => {
      try {
            await search(req, res)
      }
      catch (err) {
            console.log(err);
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

// GET user by Id
const user = async (req, res) => {

      const { id } = req.params

      try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `User Id Incorrect`
                  })
            }

            let foundUser = await UserModel.findById(id).select(" -password").lean()
            .populate(
                  {
                        path: 'managers',
                        select: " -password"
                  }
            ).populate(
                  {
                        path: 'employees',
                        select: " -password"
                  }
            )

            foundUser = {
                  ...foundUser,

            }

            if (!foundUser) {
                  return res.status(404).json({
                        status: false,
                        message: `User not found`,
                  });
            }

            res.status(200).json({
                  status: true,
                  user: foundUser
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

// Update user by Id
const update = async (req, res) => {

      const { id } = req.params
      const { password, newPassword } = req.body
      let userDetails = {}

      try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `User Id incorrect`
                  })
            }

            const user = await UserModel.findById(id)
            const userExist = Boolean(user)

            if (!userExist) {
                  return res.status(401).json({
                        status: false,
                        message: `User doesn't exist`,
                  });
            }

            if (!password && newPassword) {
                  return res.status(401).json({
                        status: false,
                        message: "Please enter old password"
                  });
            }

            if (password && !newPassword) {
                  return res.status(401).json({
                        status: false,
                        message: `Please enter new password`
                  });
            }

            if (password && newPassword) {
                  const isPasswordValid = await bcrypt.compare(password, user.password)

                  if (!isPasswordValid) {
                        return res.status(401).json({
                              status: false,
                              message: "Incorrect old password"
                        });
                  }

                  const salt = await bcrypt.genSalt(10);
                  const passwordHash = await bcrypt.hash(newPassword, salt);

                  userDetails = {
                        ...req.body,
                        password: passwordHash,
                        updatedAt: new Date()
                  }
            }

            else {

                  userDetails = {
                        ...req.body,
                        updatedAt: new Date()
                  }
            }

            let updatedUser = await UserModel.findByIdAndUpdate
                  (
                        id, userDetails,
                        {
                              new: true,
                              runValidators: true
                        }
                  ).select(" -password").populate(
                        {
                              path: 'managers',
                              select: " -password"
                        }
                  ).populate(
                        {
                              path: 'employees',
                              select: " -password"
                        }
                  )

            res.status(201).json({
                  status: true,
                  message: "User updated successfully",
                  user: updatedUser
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const search = async (req, res) => {

      const filter = req.body

      console.log({filter});

      // const pageSize = +req.body.pageSize || 10;
      // const currentPage = +req.body.currentPage || 1;
      // const sortBy = req.body.sortBy || '_id'; // _id or description or code or po or etc.
      // const sortOrder = req.body.sortOrder || 'desc'; // asc or desc

      // const totalItems = await UserModel.find(filter).countDocuments();
      const items = await UserModel.find({...filter, isDeleted: false})
            // .skip((pageSize * (currentPage - 1)))
            // .limit(pageSize)
            // .sort({ [sortBy]: sortOrder })
            .select(" -password")
            // .lean()
            .populate(
                  {
                        path: 'managers',
                        select: " -password"
                  }
            )
            .populate(
                  {
                        path: 'employees',
                        select: " -password"
                  }
            )
      
      console.log({items});

      const responseObject = {
            status: true,
            // totalPages: Math.ceil(totalItems / pageSize),
            // totalItems,
            users: items
      };

      if (items.length) {
            return res.status(200).json(responseObject);
      }

      else {
            return res.status(401).json({
                  status: false,
                  message: "Nothing found",
                  users: items
            });
      }
}

const alive = async (req,res) => {
      res.status(200).json({
            status: true,
            message: "Staying Alive"
      })
}


const changePassword = async (req, res) => {
      try {
          const { userId, newPassword } = req.body;
  
          // Find the user by ID
          const user = await UserModel.findById(userId);
          if (!user) {
              return res.status(404).send({
                  status: false,
                  message: "User not found."
              });
          }
  
          // Hash the new password
          const salt = await bcrypt.genSalt(10);
          const newPasswordHash = await bcrypt.hash(newPassword, salt);
  
          // Update the user's password
          user.password = newPasswordHash;
          await user.save();
  
          return res.status(200).send({
              status: true,
              message: "Password updated successfully."
          });
      } catch (err) {
          return res.status(500).send({
              status: false,
              message: `Error updating password: ${err}`
          });
      }
  };

module.exports = {
      register,
      login,
      users,
      user,
      update,
      alive,
      changePassword
}