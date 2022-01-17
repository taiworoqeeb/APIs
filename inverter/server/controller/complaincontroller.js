const Complains = require('../model/complainmodel');

exports.getAll = async (req, res)=> {
    try{
        const complains = await Complains.find();
        res.status(200).json(complains)
    } catch(err){
        res.status(404).json({
            message: "not found",
            err
        })

    }
};

exports.getOne = async (req, res) => {
    try {
        const complain = await Complains.findOne(req.params.ticketId)
        res.status(200).json(complain);
    } catch (error) {
        res.status(404).json({
            message: "not found",
            error
        })
    }
}

exports.CreateComplain = async (req, res) => {
    const { title, description } = req.body;

    try {
        
      const complain = new Complains({
            title,
            description,
            ticketId: Complains.ticketId + 1
        });
        await complain.save();

        res.status(200).json({
        message: 'Complain Created Successfully!'
        });
        
    } catch (error) {
        res.status(404).json({
            message: "not found",
            error
        })
    }
}

exports.UpdateComplain = async (req, res) => {
    
}
