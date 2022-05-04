var cloudinary = require("cloudinary").v2;
require("dotenv/config");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: process.env.secure,
  folder: "ArtWear",
});
module.exports = cloudinary;
