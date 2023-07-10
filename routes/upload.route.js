const express = require('express');
const router = express.Router();
const multer = require('multer');
const imgur = require('imgur');
const fs = require('fs');

const clientId = '67d26cd8e568fc7';

// Handle file upload
const upload = multer({
   dest: 'uploads/' ,
   limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB in bytes
  },
  }).single('image');

router.post('/', upload, (req, res) => {
  // Process the uploaded file
  const imageFile = req.file;

  // Upload the file to Imgur
  imgur.setClientId(clientId);
  imgur.uploadFile(imageFile.path)
    .then((json) => {
      
        console.log(json.link)
        const imageLink = json.link;
        deleteUploadedFile(imageFile.path);
        // Send the image link in the response
        res.json({ link: imageLink });
        // console.error('Error uploading image to Imgur:', json.error.message);
        // res.status(500).json({ error: 'Failed to upload image' });
      
    })
    .catch((error) => {
      console.error('Error uploading image to Imgur:', error);
      deleteUploadedFile(imageFile.path);
      res.status(500).json({ error: 'Failed to upload image' });
    });
});

// Function to delete the uploaded file from the server
function deleteUploadedFile(filePath) {
  fs.unlink(filePath, (error) => {
    if (error) {
      console.error('Error deleting file:', error);
    }
  });
}

module.exports = router;
