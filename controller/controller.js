//const userModel = require('../model/model');
const user = require('../model/model');
const emailHelper = require('../helper/comfunction');
const generateOTP = require('./optfile');
const Party = require('../model/votemodel');


//post method
exports.adduser = async (req,res)=>{
    try{        
        //main problem
        console.log(req.body)
        //result jb tk nhi milta iss line pr hold rhega
        //1
        const userData = await user.findOne({
            $and: [
                { email: req.body.email },
                { name: req.body.name }
            ]
            // $or: [
            //     { phoneNumber: req.body.phoneNumber },
            //     { name: req.body.name }
            // ]
        });
        console.log('data from DB:', userData);
        //2
        //const userData = await User.findById(req.body.id);
        //3
        //const userData = await user.findOne({email: req.body.email});
        if (!userData) {
            if (req.body.password == req.body.confirmPassword) {
                let result = await new user(req.body).save();
                try{
                    let mail = await emailHelper.sendEmail(to =req.body.email, subject= "Registration successful", text ="You have successfully registered");
                    console.log("successful", result);
                    res.send({ statusCode: 200, responseMessage: "successfully added data", responseResult: result });
                } 
                catch (error){
                    console.log("something went wrong", error.message);
                }
            } else {
                console.log("mismatch password");
                return res.status(400).send('Password mismatch');  
            }
        }
        else{
            console.log("user already exist")
            return res.status(400).send('User already exists');
        }
    
    } catch(error){
        console.error("Error occurred:", error.message);
        return res.status(500).send('Internal Server Error');
    }
}
//get method
exports.getUser = async (req,res)=>{
    try{
        let dataid=await user.findById({_id:req.body._id});
        res.send({statusCode:200,responseMessage:"sucessfully added data",responseResult:dataid});
    } catch(error){
        console.error("Error occurred:", error.message);
        return res.status(500).send('Internal Server Error');
    }
}

//post method
exports.login = async (req, res) => {
    try {
        const findUser = await user.findOne({ email: req.body.email });
        if (findUser) {
            if (findUser.password===req.body.password) {
                res.send({ statusCode: 200, responseMessage: "Login successful", user: findUser });
            } else {
                res.status(400).send('Invalid credentials');
            }
        }
        else{
            console.log("User not found");
            return res.status(400).send('User not found');
        }    
    } catch (error) {
      console.error("Error occurred:", error.message);
      res.status(500).send('Internal Server Error');
    }
};

//put method
exports.update= async(req,res)=>{
    try{
        const updUser= await user.findOneAndUpdate({email:req.body.email}, {age:req.body.age}, {new:true});
        //const updUser= await user.findOneAndUpdate({email:req.body.email},{$inc: {age:1}}, {returnDocument:"after"})
        //$inc- for incrementing value each time age is updated
        //new:true- get updated data in one go
        if(updUser){
            res.send({statusCode:200,responseMessage:"sucessfully updated data",responseResult:updUser});
        }
        else{
            res.status(400).send('User not found');
        }
    }
    catch(error){
        console.log("Error occurred:", error.message);
        res.status(500).send('Internal Server Error');
    }
}
//delete method
exports.delete= async(req,res)=>{
    try{
        const deluser= await user.findOneAndDelete({email:req.body.email})
        if(deluser){
            res.send({statusCode:200,responseMessage:"sucessfully deleted data",responseResult:deluser});
        }
        else{
            res.status(400).send('User not found');
        }
    }
    catch(error){
        console.log("Error occurred:", error.message);
        res.status(500).send('Internal Server Error');
    }
}

//---------------------
//test situation of & and or

//db.employees.find({ $or: [{"job_role": "Senior Cashier"}, {"job_role": "Store Manager"}]}).pretty() 
//pretty()- return with format that is easier to read

//db.employees.find({ $and: [{"job_role": "Store Associate"}, {"emp_age": {$gte: 20, $lte: 30}}]}).pretty()
//returns all the employees who are Store Associate and age between 20 and 30
//gte- greater than or equal to and lte- less than or equal to
//-------------------

exports.addparty = async (req, res) => {
    try {
        const { partyName } = req.body;

        const addparty= await Party.findOne({partyName:partyName})
        
        if (!addparty) {
            const party = new Party({ partyName, voteCount});
            await party.save();
            console.log("New party created.", party);
            res.status(200).send(`Party added successfully.`);
        } else {    
            
            res.status(400).send('Party already exists.');
        }

    } 
    catch (error) {
        console.error('error 3', error.message);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }

}

exports.getparty = async (req, res) => {
    try{
        let partyN=await Party.find();
        res.send({statusCode:200,responseMessage:"successfully got data",responseResult:partyN});
    } catch(error){
        console.error("Error occurred:", error.message);
        return res.status(500).send('Internal Server Error');
    }
}

exports.vote = async (req, res) => {
    try {
        const { userId, partyName } = req.body;
        const party = await Party.findOne({ partyName: partyName });
        if (!party) {
            console.error("party errors:", error.message);
            return res.status(400).send('Invalid party name');
        }
        //console.log("Party found:", party);

        const check = await user.findOne({
            $and: [
                { _id: userId },
                { age: { $gte: 18 } },
                { isvoted: false }
            ]
        });
        if (!check) {
            console.log("User does not exist or  already voted");
            return res.status(400).send('User does not exist or  already voted');
        }        
        // Increment vote count
        // const par= party.voteCount++;
        
        try{
            const parUp = await Party.findOneAndUpdate({partyName:req.body.partyName}, {
            $inc: { voteCount: 1 }, // Increment the votecount by par
            //$push: { users: userId }  // Push the userId into the users array
            }, {new:true});     

            if (parUp) {
                const userUp = await user.findOneAndUpdate(
                { _id: userId },
                { isvoted: true },
                { new: true }
                );

                if (userUp) {
                    return res.status(200).send('Vote registered successfully');
                } 
                else {
                    return res.status(500).send('Failed to update user voting status');
                }
            } 
            else {
                return res.status(500).send('Failed to update party vote count');
            }

        } 
        catch (error) {
          return res.status(500).send('An error occurred');
        }

        // await user.findOneAndUpdate({ _id: userId},{isvoted: true},{new:true});
        // return res.status(200).send('Vote registered successfully');   
    } 
    catch (error) {
        console.error("Error occurred:", error.message);
        res.status(500).send('Internal Server Error');
    }
};
