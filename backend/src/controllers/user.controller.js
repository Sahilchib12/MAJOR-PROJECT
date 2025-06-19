import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";
import axios from "axios";
import fs from "fs";
import { uploadFile } from "../utils/supabase.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    if (!accessToken && !refreshToken) {
      console.log("Not generated");
      return;
    }
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(400, "Something Went Wrong");
  }
};

const signUp = asyncHandler(async (req, res) => {
  const { name, password, email, role } = req.body;

  if ([name, password, email, role].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required !!");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, "Email already exists");
  }

  const emailVerificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role,
    isEmailVerified: false,
    emailVerificationToken,
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const createdUser = await User.findById(user._id).select(
    "-refreshToken -password"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong at User Creation !!");
  }

  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/users/verifyEmail/${emailVerificationToken}`;

  const htmlMessage = `
	  <!DOCTYPE html>
	  <html>
	  <head>
		<meta charset="UTF-8">
		<title>Email Verification</title>
		<style>
		  body {
			font-family: Arial, sans-serif;
			line-height: 1.6;
			color: #333;
		  }
		  .container {
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
			border: 1px solid #ddd;
			border-radius: 5px;
			background-color: #f9f9f9;
		  }
		  .header {
			text-align: center;
			padding-bottom: 20px;
		  }
		  .content {
			padding: 20px;
			background-color: #fff;
			border-radius: 5px;
		  }
		  .footer {
			text-align: center;
			padding-top: 20px;
			font-size: 0.9em;
			color: #777;
		  }
		</style>
	  </head>
	  <body>
		<div class="container">
		  <div class="header">
			<h2>Email Verification</h2>
		  </div>
		  <div class="content">
			<p>Dear ${user.name},</p>
			<p>Please verify your email by clicking on the following link:</p>
			<p><a href="${verificationUrl}">${verificationUrl}</a></p>
			<p>If you did not create an account, no further action is required.</p>
			<p>Thank you for your attention.</p>
		  </div>
		  <div class="footer">
			<p>&copy; 2025 TalentHive. All rights reserved.</p>
		  </div>
		</div>
	  </body>
	  </html>
	`;

  await sendEmail({
    email: user.email,
    subject: "Email Verification",
    message: `Please verify your email by clicking on the following link: \n\n ${verificationUrl}`,
    html: htmlMessage,
  });

  const options = {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, { sameSite: "Strict" })
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: createdUser,
          accessToken,
          refreshToken,
        },
        "User Registered Successfully. Please verify your email."
      )
    );
});

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Invalid Credentials!");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(400, "Email not verified. Please verify your email.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Incorrect Password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, { sameSite: "Strict" })
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Sign-In Successfully"
      )
    );
});

const signOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged Out"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ emailVerificationToken: token });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Email verified successfully"));
});

const sendPasswordResetEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User with this email does not exist");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const htmlMessage = `
	  <!DOCTYPE html>
	  <html>
	  <head>
		<meta charset="UTF-8">
		<title>Password Reset</title>
		<style>
		  body {
			font-family: Arial, sans-serif;
			line-height: 1.6;
			color: #333;
		  }
		  .container {
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
			border: 1px solid #ddd;
			border-radius: 5px;
			background-color: #f9f9f9;
		  }
		  .header {
			text-align: center;
			padding-bottom: 20px;
		  }
		  .content {
			padding: 20px;
			background-color: #fff;
			border-radius: 5px;
		  }
		  .footer {
			text-align: center;
			padding-top: 20px;
			font-size: 0.9em;
			color: #777;
		  }
		</style>
	  </head>
	  <body>
		<div class="container">
		  <div class="header">
			<h2>Password Reset</h2>
		  </div>
		  <div class="content">
			<p>Dear ${user.name},</p>
			<p>You requested a password reset. Please click on the following link to reset your password:</p>
			<p><a href="${resetUrl}">${resetUrl}</a></p>
			<p>If you did not request a password reset, please ignore this email.</p>
			<p>Thank you for your attention.</p>
		  </div>
		  <div class="footer">
			<p>&copy; 2025 TalentHive. All rights reserved.</p>
		  </div>
		</div>
	  </body>
	  </html>
	`;

  await sendEmail({
    email: user.email,
    subject: "Password Reset",
    message: `You requested a password reset. Please click on the following link to reset your password: \n\n ${resetUrl}`,
    html: htmlMessage,
  });

  return res.status(200).json(new ApiResponse(200, "Email sent successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully"));
});

const setProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (user.role === "jobseeker") {
    try {
      const { phone, location } = req.body;
      if ([phone, location].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required !!");
      }

      // console.log(req.body);
      // console.log(req.file);
      // console.log(req.files);

      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });
      const fileUrl = await uploadFile(req.file);
      // console.log(fileUrl);
      const { data, error } = await axios.post(
        `${process.env.AISERVICE_URL}/api/v1/parse`,
        { fileUrl },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(data);
      if (error) {
        throw new Error(error);
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          resume: fileUrl,
          skills: data.skills,
          experience: data.experience,
          phone,
          location,
        },
        { new: true }
      );

      res
        .status(200)
        .json(new ApiResponse(200, user, "Profile Saved Successfully")); // ✅ Returns the file URL
    } catch (error) {
      res.status(500).json({ message: "Upload failed", error: error.message });
    }
  } else if (user.role === "employer") {
    try {
      const {
        companyName,
        companySize,
        industry,
        description,
        phone,
        location,
      } = req.body;
      // console.log(req.body);
      if (
        [companyName, phone, location, companySize, industry, description].some(
          (field) => field?.trim() === ""
        )
      ) {
        throw new ApiError(400, "All fields are required !!");
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          companyName,
          companySize,
          industry,
          description,
          location,
          phone,
        },
        { new: true }
      );
      // console.log(updatedUser);
      return res
        .status(200)
        .json(
          new ApiResponse(200, updatedUser, "Profile Updated Successfully")
        );
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while updating profile",
        error
      );
    }
  }
});

const isEmailVerified = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  return res.status(200).json(
    new ApiResponse(200, {
      isEmailVerified: user.isEmailVerified,
    })
  );
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, "Email already verified");
  }

  const emailVerificationToken = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = emailVerificationToken;
  await user.save();

  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/users/verifyEmail/${emailVerificationToken}`;

  const htmlMessage = `
	  <!DOCTYPE html>
	  <html>
	  <head>
		<meta charset="UTF-8">
		<title>Email Verification</title>
		<style>
		  body {
			font-family: Arial, sans-serif;
			line-height: 1.6;
			color: #333;
		  }
		  .container {
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
			border: 1px solid #ddd;
			border-radius: 5px;
			background-color: #f9f9f9;
		  }
		  .header {
			text-align: center;
			padding-bottom: 20px;
		  }
		  .content {
			padding: 20px;
			background-color: #fff;
			border-radius: 5px;
		  }
		  .footer {
			text-align: center;
			padding-top: 20px;
			font-size: 0.9em;
			color: #777;
		  }
		</style>
	  </head>
	  <body>
		<div class="container">
		  <div class="header">
			<h2>Email Verification</h2>
		  </div>
		  <div class="content">
			<p>Dear ${user.name},</p>
			<p>Please verify your email by clicking on the following link:</p>
			<p><a href="${verificationUrl}">${verificationUrl}</a></p>
			<p>If you did not create an account, no further action is required.</p>
			<p>Thank you for your attention.</p>
		  </div>
		  <div class="footer">
			<p>&copy; 2025 TalentHive. All rights reserved.</p>
		  </div>
		</div>
	  </body>
	  </html>
	`;

  await sendEmail({
    email: user.email,
    subject: "Email Verification",
    message: `Please verify your email by clicking on the following link: \n\n ${verificationUrl}`,
    html: htmlMessage,
  });

  return res.status(200).json(new ApiResponse(200, "Email sent successfully"));
});

export {
  signUp,
  signIn,
  signOut,
  verifyEmail,
  sendPasswordResetEmail,
  resetPassword,
  setProfile,
  isEmailVerified,
  resendVerificationEmail,
};
