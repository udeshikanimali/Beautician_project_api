module.exports=function(app){
    //const {Auth}=require()

    const AuthController=require("../controllers/AuthController");

    app.post("/register",AuthController.registerUser);
    app.post("/login",AuthController.loginUser);
}