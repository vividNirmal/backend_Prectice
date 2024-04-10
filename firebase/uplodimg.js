
const { storage } = require("./firebase");
const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");

// const { getDownloadURL, getStorage } = require("firebase/storage");

const metadata = {
  contentType: "image/jpeg",
};

function geturlofImge(file) {
  const storageRef = ref(storage, "images/"  + Date.now()+file.originalname);
  const uploadTask = uploadBytesResumable(storageRef, file.buffer,metadata);
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
}

module.exports = { geturlofImge };
