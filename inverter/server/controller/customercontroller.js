const customerData = require('../model/customermodel');

exports.GetAll = async (req, res) => {
    try{
        const customers = await customerData.find();
        res.status(200).json(customers);
    } catch(err){
        res.status(404).json({
            status: "no customer data found",
            message: err
        })
    }
}

exports.GetOne = async (req, res) =>{
    try{
        const customer = await customerData.findById(req.params.id);
        res.status(200).json(customer)
    }catch(err){
        res.status(404).json({
            status: "customer not found",
            message: err
        })
    }
}

exports.Validate = async (req, res)=>{
    try{
        const customer = await customerData.findById(req.params.id);
        if(customer.meter_status === "paid"){
            await customer.updateOne({$set:Activation_status = "activate"});
        } else{
            await customer.updateOne({$set:Activation_status = "deactivate"});
        }
    }catch(err){
        res.status(404).json(err)
    }
}
//OR
exports.activate_deactivate = async (req, res) => {
    try{
        const customer = await customerData.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({
            status: `customer ${customer.Activation_status}d`,
            customer: customer
        })
    }catch(err){
        res.status(404).json(err)
    }
}
