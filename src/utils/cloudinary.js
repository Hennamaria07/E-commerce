const {v2: cloudinary} = require('cloudinary');
const fs = require("fs")

cloudinary.config({ 
    cloud_name: 'freestyle07', 
    api_key: "286239639171635", 
    api_secret: "4P3a70oZ_TsyPL84AObN9QjC77Y"
  })
  console.log("cloudinary--->", process.env.CLOUDINARY_API_KEY)
const uploadCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) {
            return console.log('Cannot get the local file path')
        }
        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: 'auto', public_id: Date.now()} );
        fs.unlinkSync(localFilePath)
        // console.log(response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log(error.message);
        return null
    }
}

module.exports = uploadCloudinary;