const {v2: cloudinary} = require('cloudinary');
  
cloudinary.config({ 
    cloud_name: 'freestyle07', 
    api_key: "286239639171635", 
    api_secret: "4P3a70oZ_TsyPL84AObN9QjC77Y"
  })

const removeFromCloudinary = async (publicId) => {
    try {
        if(!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = removeFromCloudinary;