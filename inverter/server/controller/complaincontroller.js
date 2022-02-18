const Complains = require('../model/complainmodel');
const Comment = require('../model/commentsmodel');
//const Ticket = require('../model/ticketmodel')

exports.getAll = async (req, res)=> {
    try{
        const complains = await Complains.find().populate(['comment']);
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
        const complain = await Complains.findOne(req.params.ticketId).populate(['comment']);
        res.status(200).json(complain);
    } catch (error) {
        res.status(404).json({
            message: "not found",
            error
        })
    }
}

exports.CreateComplain = async (req, res) => {
    const { username, title, description } = req.body;


    try {
        
        const complain = await new Complains({
            username,
            title,
            description
        });
        await complain.save();

       /* const ticket = await Ticket.findById({_id: complain.ticketId})
        ticket.complain.push(complain);
        await ticket.save();

        const comment = await Comment.findById({_id: complain.comment})
        comment.complain.push(complain);
        await comment.save();*/


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

exports.DeleteComplain = async (req, res) => {
    
    try {
        const complain = await Complains.findOne(req.params.ticketId);
        if(complain.ticket_status != "solved"){
            return res.send("Complain not resolved yet, Can't be deleted")
        } else{
            await complain.deleteOne();
        }

    } catch (error) {
        res.status(404).json({
            message: "not found",
            error
        });
    }
}
