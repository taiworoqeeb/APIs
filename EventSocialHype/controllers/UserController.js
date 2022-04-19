// package imports
const Sequelize = require("sequelize");
const moment = require('moment');

// local imports
const Users = require("../models").User;
const Admins = require("../models").Admin;
const { getRole } = require("../helpers/index")
// imports initialization
const Op = Sequelize.Op;



exports.allUsers = async(req, res, next) => {
    try {
        const users = await Users.findAll({
            where: {
                    deletedAt: {
                        [Op.eq]: null
                    }
            },
            order: [
                ['createdAt', 'DESC']
            ],
        });
        res.render("dashboards/all_users", {
            users: users,
            moment,
            getRole
        });
    } catch (error) {
        req.flash('error', "Server error!");
        res.redirect("/dashboard");
    }
    
}

exports.viewDeletedUsers = (req, res, next) => {
    Users.findAll({
        where: {
            deletedAt: {
                [Op.ne]: null
            }
        },
            paranoid: false,
        })
        .then(users => {
            res.render("dashboards/deleted_users", {
                users: users,
                moment,
                getRole
            });
        })
        .catch(error => {
            res.redirect("/dashboard");
        });
}

exports.deleteUser = (req, res, next) => {
    Users.destroy({
            where: {
                id: {
                    [Op.eq]: req.body.id
                }
            }
        })
        .then(response => {
            req.flash('success', "User deleted successfully");
            res.redirect("back");
        })
        .catch(error => {
            req.flash('error', "something went wrong");
            res.redirect("back");
        });
}

exports.restoreUser = (req, res, next) => {
    Users.restore({
            where: {
                id: {
                    [Op.eq]: req.body.id
                }
            }
        })
        .then(response => {
            req.flash('success', "User deleted successfully");
            res.redirect("back");
        })
        .catch(error => {
            req.flash('error', "something went wrong");
            res.redirect("back");
        });
}

exports.allAdmins = async(req,res,next)=>{
        Admins.findAll({
            where: {
                    deletedAt: {
                        [Op.eq]: null
                    }
            },
            order: [
                ['name', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        })
        .then(users => {
            res.render("dashboards/all_admin", {
                users,
                moment
            });
        })
        .catch(error => {
            res.redirect("/dashboard");
        });
}

exports.viewDeletedAdmins = (req, res, next) => {
       Admins.findAll({
           where: {
               deletedAt: {
                   [Op.ne]: null
               }
           },
               paranoid: false,
           })
           .then(users => {
               res.render("dashboards/deleted_admin", {
                   users: users,
                   moment
               });
           })
           .catch(error => {
               res.redirect("/home");
           });
}

exports.deleteAdmin = (req, res, next) => {
    Admins.destroy({
            where: {
                id: {
                    [Op.eq]: req.body.id
                }
            }
        })
        .then(response => {
            req.flash('success', "User deleted successfully");
            res.redirect("back");
        })
        .catch(error => {
            req.flash('error', "something went wrong");
            res.redirect("back");
        });
}

exports.restoreAdmin = (req, res, next) => {
    Admins.restore({
            where: {
                id: {
                    [Op.eq]: req.body.id
                }
            }
        })
        .then(response => {
            req.flash('success', "User deleted successfully");
            res.redirect("back");
        })
        .catch(error => {
            req.flash('error', "something went wrong");
            res.redirect("back");
        });
}

exports.enableControl = async (req, res) =>{
    try {
        const {id} = req.body;
        console.log(req.body);
        await Users.update({withdrawBtn: false}, {where:{id}});
        return res.status(200).send({
            success: true,
            message: "Button Control Enabled Successfully"
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Unable to update Control Button : "+error
        });
    }
}

exports.disableControl = async (req, res) =>{
    try {
        const {id} = req.body;
        console.log(req.body);

        await Users.update({withdrawBtn: true}, {where:{id}});
        
        return res.status(200).send({
            success: true,
            message: "Button Control Disabled Successfully"
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Unable to update Control Button : "+error
        });
    }
}

exports.editUser = (req, res, next) => {
    const id = req.params.id;
  
    Users.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    })
      .then((user) => {
        if (user) {
          res.render("dashboards/editUser", {
            user: user,
            getRole
          });
        } else {
          res.redirect("back");
        }
      })
      .catch((error) => {
        req.flash("error", "Server error!");
        res.redirect("back");
      });
};
  
exports.postEditUser = async (req, res, next) => {
    try {
      const { amount, userId, account } = req.body;
  
    if (!amount || !account) {
      req.flash("warning", "enter required field");
      res.redirect("back");
    } else if (!helpers.isNumeric(amount)) {
      req.flash("warning", "enter valid ledger amount(digits only)");
      res.redirect("back");
    } else {
        const user = await Users.findOne({
          where: {
            id: {
              [Op.eq]: userId,
            },
          },
        });
          if (account === "wallet") {
            const wallet = Number(user.wallet);
            const newAmt = Number(amount);
            const newBal = wallet + newAmt
  
            
            await Users.update(
              {
                wallet: newBal,
              },
              {
                where: {
                  id: {
                    [Op.eq]: userId,
                  },
                },
              }
            )
            
            
          }else{
            const wallet = Number(user.btc);
            const newAmt = Number(amount);
            const newBal = wallet + newAmt;
            await Users.update(
              {
                btc: newBal,
              },
              {
                where: {
                  id: {
                    [Op.eq]: userId,
                  },
                },
              }
            )
          }
      }
      req.flash("success", "Deposit Successful");
      res.redirect("back");
    } catch (error) {
      req.flash("error", "Server error!");
      res.redirect("back");
    }
};