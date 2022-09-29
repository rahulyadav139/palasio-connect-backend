const { uploader } = require('cloudinary');
const dataUri = require('./dataUri');

const cloudinaryUploader = async (req, res, next) => {
  if (!req.file)
    return res.status(500).send({ message: 'File is not available!' });

  try {
    const file = dataUri(req).content;

    const { url, public_id } = await uploader.upload(file);

    req.imageInfo = { imageUrl: url, publicId: public_id };

    next();
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

module.exports = cloudinaryUploader;
