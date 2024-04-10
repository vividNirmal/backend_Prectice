const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDWQYEnlfit78tJCO7PCoNYzZdKaJBCJs8",
  authDomain: "demoprojectnode-1699nj.firebaseapp.com",
  projectId: "demoprojectnode-1699nj",
  storageBucket: "demoprojectnode-1699nj.appspot.com",
  messagingSenderId: "989153652533",
  appId: "1:989153652533:web:dfbc55dbf4c2967dd6267c",
  measurementId: "G-LL8ZB7PFXQ",
});

module.exports = { storage: getStorage(firebaseApp) };