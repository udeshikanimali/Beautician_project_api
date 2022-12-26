var mongoose=require("mongoose");
var bcrypt=require('bcrypt');
require("dotenv").config();
const jwt=require('jsonwebtoken');
const UseRole = require("../enums/UseRole");

const SALT =10;

var Schema=mongoose.Schema;

var UserSchema = new Schema({
    name:{
        type:String,
        required:[true,'Name field is required!'],
        maxlength:100
    },
    address:{
        type:String,
        required:[true,'Address field is required!'],
        maxlength:150
    },
    nic:{
        type:String,
        required:[true,'NIC field is required!'],
        maxlength:20
    },
    // dob:{
    //     type:Date
    // },
    phone_number:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:[true,'Email field is required'],
        unique:true
    },
    password:{
        type:String,
        minlength:5,
        required:[true,'Password field is required!']
    },
    create_date:{
        type:Date, 
        default:Date.now
    }
});

//Saving user data
UserSchema.pre('save',function(next){
    var user=this;
    if(user.isModified('password')){
        //checking if password field is available and modified
        bcrypt.genSalt(SALT,function(err,salt){
            if(err) return next(err)

            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) return next(err)
                user.password=hash;
                next();
            });
        });
    }else{
        next();
    }
});

//For comparing the users entered password with database duing login
UserSchema.methods.comparePassword=function(candidatePassword,callBack){
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err) return callBack(err);
        callBack(null,isMatch);
    });
};

//For generating token when loggedin
UserSchema.methods.generateToken=function(callBack){
    var user=this;
    var token=jwt.sign(user._id.toHexString(),process.env.SECRETE);

    callBack(null,token);
};

//Validating token for auth routes middleware
UserSchema.statics.findByToken=function(token,callBack){
    jwt.verify(token,provcess.env.SECRETE,function(err,decode){
        //This decode must give user_id if token is valid.ie decode=user_id
        User.findById(decode,function(err,user){
            if(err){
                resizeBy.json({status:false,date:"Invalid User ID"});
            }
            callBack(null,user);
        });
    });
};   

const User=mongoose.model('User',UserSchema);
module.exports={User}