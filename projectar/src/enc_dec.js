import CryptoJS from "crypto-js";

const enc_dec = (task, message) => {
  const taskType = {
    encrypt: () =>
      CryptoJS.AES.encrypt(message, "Secret Passphrase").toString(),
    // encrypt: () => console.log(task),
    decrypt: () =>
      CryptoJS.AES.decrypt(message, "Secret Passphrase").toString(
        CryptoJS.enc.Utf8
      ),
    // decrypt: () => console.log(task),
  };
  taskType[task]();
};

export default enc_dec;
