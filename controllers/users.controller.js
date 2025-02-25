const UserModel = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_SECRET_KEY } = require("../utility/config");
const sendMail = require("../utility/mail");
const generateOTP = require("../utility/otpgenerate");

// Create Signup Function

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists", statusCode:409 });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newSignup = await UserModel.create({
      name,
      email,
      password: passwordHash
    });

    const userpassword = newSignup.toObject()

    delete userpassword.password;

    res.status(201).json({ message: "User signup successfully", user: userpassword, statusCode:201 });
  }catch (error) {
    res.status(404).json({message: "An error occurred while Signup", statusCode: 404});
  }
};

//  Create Login Function

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email: email });

    if (!existingUser) {
      return res.status(409).json({ message: "Email not found!", statusCode:409 });
    }

    const checkPassword = bcrypt.compareSync(password, existingUser.password);
    if (!checkPassword) {
      return res.status(409).json({ message: "Password is wrong!", statusCode:409 });
    }

    const token = jwt.sign({ _id: existingUser._id, email: existingUser.email }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    const userpassword = existingUser.toObject()

    delete userpassword.password;

    res.status(200).json({ message: "User login successfully", token, user: userpassword, statusCode:200 });
  } catch (error) {
    res.status(404).json({message: "An error occurred while login", statusCode:404});
  }
};

// create forget password function

exports.forgetpassword = async (req, res) => {
  const { email } = req.body;
  try {
    const userEmail = await UserModel.findOne({ email: email });
    if (!userEmail) {   
      return res.status(404).json({ message: 'userEmail not found', statusCode:404 });
    }

    const OTP = generateOTP()
    const subject = "Password Reset OTP"
    const message = `Your OTP for password reset: ${OTP}. Use it within 10 minutes to reset your password securely.`
   await sendMail(email, subject, message)

   userEmail.otp = OTP;
   userEmail.save();

   return res.status(200).json({ message: 'OTP send in your email!', statusCode:200 });
   
  } catch (error) {

    console.error('Error:', error);
    return res.status(500).json({ message: 'An error occurred while sending OTP in your email.', statusCode:500 });
  }
};


// Function to verify OTP

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const userEmail = await UserModel.findOne({ email: email });

    if (!userEmail) {
      return res.status(404).json({ message: 'UserEmail not found', statusCode: 404 });
    }

    if (userEmail.otp === otp) {
      userEmail.otp = null; 
      await userEmail.save(); 

      return res.status(200).json({ message: 'OTP verified successfully', statusCode: 200 });
    } else {
      return res.status(401).json({ message: 'Invalid OTP', statusCode: 401 });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'An error occurred while verifying OTP', statusCode: 500 });
  }
};


// Create User Profile Function

exports.userProfile = async (req,res) => {
    try {
        const userId = req.user._id
        const existingUser = await UserModel.findOne({ _id: userId });

        if (!existingUser) {
          return res.status(409).json({ message: "Email not found!", statusCode:409 });
        }
        res.status(200).json({ message: "User profile access successfully", userId: existingUser, statusCode:200 });
    } catch (error) {
        res.status(404).json({message: "An error occurred while acessing User profile", statusCode:404});
      }
}
