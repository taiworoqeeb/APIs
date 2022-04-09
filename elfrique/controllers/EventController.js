require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateUniqueId = require("generate-unique-id");
const uniqueString = require("unique-string");
const nodemailer = require("nodemailer");
//const sequelize = require("../config/db");
const User = require("../models").adminuser;
const ResetPasswords = require("../models").resetpassword;
const Profile = require("../models").profile;
const Event = require("../models").event;
const votingContest = require("../models").votingcontest;
const awardContest = require("../models").awardContest;
const awardCategories = require("../models").awardCategories;
const awardNominees = require("../models").awardNominees;
const eventsTicket = require("../models").eventsTicket;
const Eventjob = require('../models').eventjob;
const AssignJob = require('../models/').assignedjob

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");
const cloudinary = require("../helpers/cloudinary");
const upload = require("../helpers/upload");


//controllers

exports.createEvents = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const adminuserId = req.user.id;
    req.body.adminuserId = adminuserId;
    req.body.image = result.secure_url;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const events = await Event.create(req.body);
    return res.status(200).send({
      events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
           
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const events = await Event.findAll({
      where: { adminuserId },
      include: [
        {
          model: eventsTicket,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.getSingleEvent = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const events = await Event.findOne({
      where: { adminuserId, id: req.params.id },
      include: [
        {
          model: eventsTicket,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const adminuserId = req.user.id;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const events = await Event.destroy({
      where: { adminuserId, id: req.params.id },
    });
    return res.status(200).send({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.editEvent = async (req, res) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.image = result.secure_url;
    }
    const adminuserId = req.user.id;
    const profile = await Profile.findOne({
      where: { adminuserId },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    if (!profile) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    const events = await Event.update(req.body, {
      where: { adminuserId, id: req.params.id },
    });
    return res.status(200).send({
      message: "Event updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.findAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: eventsTicket,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
        {
          model: User,
          include: [
            {
              model: Profile,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
          },
        },
      ],
    });
    return res.status(200).send({
      events,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

//------------------------------------------------------------------------------- JOB ------------------------------------------------------------------------------------------------------
exports.createJob = async(req, res)=>{
  let { job_type, job_description, budget } = req.body;
  job_type = job_type.toLowerCase();
  const eventId = req.params.eventId
  try {
      const event = await Event.findOne({where: {
        id: eventId
      }})
      const result = await cloudinary.uploader.upload(req.file.path);
     const job = new Eventjob({
       eventId: eventId,
       job_type,
       job_description,
       budget,
       location: `${event.venue}, ${event.city}, ${event.state}, ${event.country}`,
       img_id: result.public_id,
       Img_url: result.secure_url,
     })
     await job.save();
     res.status(201).json({
       status: true,
       message: "Job Created Successfully",
       job
     })
  } catch (error) {
    console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
  }
};

exports.updateJob = async( req, res)=> {
  const eventId = req.params.eventId
  try {
    await Eventjob.update( req.body, {
      where: {
        eventId: eventId,
        id: req.params.id
      }
    });

    res.status(200).json({
      status: true,
      message: "Job Successfully Updated"
    })
  } catch (error) {
    console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
  }
}

exports.getJob = async(req, res)=> {
  try {
    await Eventjob.findOne({ where: {
      id: req.params.id
    }}).then((job) => {
      if(job){
        res.status(200).json(job)
      }else{
        res.status(404).json({
          status: false,
          message: "Job not found"
        })
      }
      
    })

  } catch (error) {
    console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
  }
}

exports.getAllJob = async(req, res)=> {
  try {
    await Eventjob.findAll({
      include: [
        {
          model: Event,
          include: [
            {
              model: User,
              include: [
                {
                  model: Profile,
                  attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                  },
                },
              ],
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            }
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
      ]
    }).then((job) => {
      if(job){
        res.status(200).json(job)
      }else{
        res.status(404).json({
          status: false,
          message: "Jobs not found"
        })
      }
      
    })

  } catch (error) {
    console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
  }
}

exports.getAllJobEvent = async(req, res)=> {
  try {
    await Eventjob.findAll({where: {
      eventId: req.params.eventId
    }, 
  include: [
    {
      model: Event,
      include: [
        {
          model: User,
          include: [
            {
              model: Profile,
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        }
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    },
  ]}).then((job) => {
      if(job){
        res.status(200).json(job)
      }else{
        res.status(404).json({
          status: false,
          message: "Jobs not found"
        })
      }
      
    })

  } catch (error) {
    console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
  }
}

exports.deleteJob = async( req, res)=> {
  const eventId = req.params.eventId
  try {
    await Eventjob.delete({
      where: {
        eventId: eventId,
        id: req.params.id
      }
    });

    res.status(200).json({
      status: true,
      message: "Job Successfully Deleted"
    })
  } catch (error) {
    console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
  }
}

exports.assignedJob = async( req, res) =>{
  const jobId = req.params.jobId
  const userId = req.params.userId
  try {
    const assignjob = new AssignJob({
      jobId: jobId,
      userId: userId
    });

    await assignjob.save();

    res.status(200).json({
      status: true,
      message: "Job Successfully Assigned"
    })
  } catch (error) {
    console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
  }
},

exports.viewAllAssignedJob = async(req, res) =>{
  try {
    const jobs = await AssignJob.findAll({
      include: [
        {
          model: Event,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },

        {
          model: User,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },

        }
      ]
    })

    res.status(200).json({
      status: true,
      data: jobs
    })
  } catch (error) {
    console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
  }
};

exports.viewAssignedJob = async(req, res) =>{
  try {
    const jobs = await AssignJob.findAll({ where: {
      jobId: req.params.jobId
    },
      include: [
        {
          model: Event,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },

        {
          model: User,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },

        }
      ]
    })
    res.status(200).json({
      status: true,
      data: jobs
    })
  } catch (error) {
    console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
  }
}

exports.viewAssignedJobUser = async(req, res) =>{
  try {
    const jobs = await AssignJob.findOne({ where: {
      jobId: req.params.jobId,
      userId: req.params.userId
    },
      include: [
        {
          model: Event,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },

        {
          model: User,
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },

        }
      ]
    })
    res.status(200).json({
      status: true,
      data: jobs
    })
  } catch (error) {
    console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
  }
}


exports.searchJob = async(req, res)=>{
    let {job, location} = req.query;
    term = term.toLowerCase();

  try {
    await Eventjob.findAll({ 
      where: {
       [Op.or]: [
         {
           job_type: { [Op.like]: `%${job}%` }
          },
         {
           location: { [Op.like]: `%${location}%` }
          }
      ]
     }, 
     include: [
      {
        model: Event,
        include: [
          {
            model: User,
            include: [
              {
                model: Profile,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
              },
            ],
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          }
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      },
    ]})
     .then((job) => res.send(job))
     .catch(err => console.log(err));
    
  } catch (error) {
    console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
  }
}