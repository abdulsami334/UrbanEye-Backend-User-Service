const User =require('../models/User')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? req.file.filename : null;

    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
      profileImage,
    });

    // ✅ Send full user object
    res.status(200).json({
      message: "User Created",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



exports.Login= async(req, res)=>{
    const {email, password}= req.body;
    const user=await User.findOne({email});
    if(!user) return res.status(400).json({error:"Invalid Email"});

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({error: "Invalid Password"})
    } 

    const token=jwt.sign({
        uid:user._id,email:user.email,role: user.role
    },
process.env.JWT_SECRET,
{
    expiresIn:'2h'
}
);
res.json({ token,user });
}