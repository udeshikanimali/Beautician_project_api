const {User}=require("../models/PatientModel");

exports.registerUser=(req,res)=>{
    const user=new User(req.body);

    user.save((err,doc)=>{
        if(err){
            return res.status(422).json({
                success:false,
                message:"Registration failed, check the validation error!",
                data:err
            });
        }else{
            return res.status(200).json({
                success:true,
                message:"Successfully Registered!"
            }); 
        }
    });
}

exports.loginUser=(req,res)=>{
    User.findOne({email:req.body.email}, (err, user)=>{
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User email not found!"
            });
        }
        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch){
                return res.status(400).json({
                    success:false,
                    message:"Password is incorrect!"
                });
            }
            user.generateToken((err,token)=>{
                if(err){
                    return res.status(400).json({
                        succes:false,
                        message:"Unable to generate jwt key!",
                        data:err
                    });
                }
                return res.status(200).json({
                    success:true,
                    message:"Successfully Logged In!",
                    data:{
                        "token":token
                    }
                });
            });
            
        });
    });
}