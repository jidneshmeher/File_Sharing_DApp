// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("UploadModule", (m) => {  // 1️⃣ Change module name
  const upload = m.contract("Upload", []);  // 2️⃣ Change contract name to "Upload"

  return { upload };  // 3️⃣ Return the correct contract reference
});
