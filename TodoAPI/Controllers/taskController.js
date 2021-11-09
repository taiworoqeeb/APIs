const task = require('../models/taskModel');

exports.TaskCreate = async (req, res) => {
    try{
        const savetask = await new task(req.body);
        const savedtask = await savetask.save();

        res.status(200).json({
            status: "Task Successfully Added!",
            savedtask
        });

    } catch(err){
        res.status(500).json({
            message: err
        });
    }
},

exports.TaskRead = async (req, res) => {
    try{
        const readtask = await task.findById(req.params.id);
        res.status(200).json({
            status: "Success",
            readtask
        });

    } catch(err){
        res.status(500).json({
            message: err
        });
    }
},

exports.TaskUpdate = async (req, res) => {
    try{
        const updatetask = await task.findById(req.params.id);
        if(updatetask.userId === req.body.userId){
            await updatetask.updateOne({$set:req.body});
            res.status(200).json({
                status: 'updated successfully',
                updatetask
            });
        } else {
            res.status(403).json({
                status: 'You can only update your task'
            });
        }
    } catch(err){
        res.status(500).json({
            message: err
        });
    }
},

exports.TaskDelete = async (req, res) => {
    try{
        const deletetask = await task.findById(req.params.id);
        if(deletetask.userId === req.body.userId){
            await deletetask.deleteOne()
            res.status(200).json({
                status: 'deleted successfully'
            });
        } else{
            res.status(403).json({
                status: 'You can only delete your task'
            });
        }
    } catch(err){
        res.status(500).json({
            message: err
        });
    }
},

exports.getTask = async (req, res) => {
    try{
        const getTask = await task.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            getTask
        });
    } catch(err){
        res.status(500).json({
           message: err
        });
    }
},

exports.getAllTask = async (req, res) => {
    try{
        const getAllTask = await task.find();
        res.status(200).json({
            status: 'success',
            getAllTask
        });
    } catch(err){
        res.status(500).json({
            message: err
        });
    }
}