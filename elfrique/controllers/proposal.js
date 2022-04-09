const Proposal = require('../models/proposal');
const Eventjob = require('../models/eventjob');
const Event = require('../models/events')
const User = require('../models/adminuser');

exports.createProposal = async(req, res)=>{
    const { description, price} = req.body;
    try {
        await Proposal.create({
            userId: req.user.id,
            jobId: req.params.jobId,
            description,
            price,
        })
        res.status(201).json({
            status: true,
            message: "Proposal Successfully Created"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
    }
}

exports.getProposalUser = async(req, res)=>{

    try {
        await Proposal.findAll({ where: {
            jobId: req.params.jobId,
            userId: req.user.id,
        }, include:[
            {
                model: Eventjob,
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
                  ],
                attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                  },
            }
        ] })
        .then((proposal) => res.status(200).json(proposal) )
    } catch (error) {
        console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
    }
}
exports.getProposalSeller = async(req, res)=>{

    try {
        await Proposal.findAll({ where: {
            jobId: req.params.jobId,
            userId: req.params.userId,
        }, include:[
            {
                model: Eventjob,
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
                  ],
                attributes: {
                    exclude: ["createdAt", "updatedAt", "deletedAt"],
                  },
            }
        ] })
        .then((proposal) => res.status(200).json(proposal) )
    } catch (error) {
        console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
    }
}

exports.getAllProposal = async(req, res)=> {
    try {
            await Proposal.findAll({ where: {
                jobId: req.params.jobId,
            }, include:[
                {
                    model: Eventjob,
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
                      ],
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "deletedAt"],
                      },
                }
            ] })
            .then((proposal) => res.status(200).json(proposal) )
       
    } catch (error) {
        console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
    }
}

exports.updateProposal = async(req, res)=>{
    try {
        await Proposal.update(req.body, { where: {
            jobId: req.params.jobId,
            userId: req.user.id
        } }).then(proposal => res.status(200).json({
            status: true,
            message: "Proposal Updated Successfully"
        }))
    } catch (error) {
        console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
    }
}

exports.deleteProposal = async(req, res)=> {
    try {
        await Proposal.delete({ where: {
            jobId: req.params.jobId,
            userId: req.user.id
        } }).then(proposal => res.status(200).json({
            status: true,
            message: "Proposal Deleted Successfully"
        }))
    } catch (error) {
        console.error(error)
        return res.status(500).json({
             status: false,
             message: "An Error occured",
         })
    }
}