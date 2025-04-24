import { useEffect, useState } from "react";
import { useContract } from "../context/ContractContext";

const Modal = ({ onClose }) => {
  const { contract, account } = useContract();
  const [userFiles, setUserFiles] = useState([]);
  const [accessList, setAccessList] = useState([]);

  const sharing = async () => {
    const address = document.querySelector(".address").value;
    const fileUrl = document.querySelector("#fileSelect").value;

    if (!address || !fileUrl || fileUrl === "Select a file") {
      alert("Please enter address and select a file to share.");
      return;
    }

    try {
      await contract.allow(fileUrl, address);
      alert("Access granted successfully.");
      onClose && onClose();
    } catch (error) {
      console.error("Sharing failed:", error);
      alert("Error sharing file.");
    }
  };

  const revokeAccess = async () => {
    const address = document.querySelector("#selectNumber").value;
    const fileUrl = document.querySelector("#fileSelect").value;

    if (!address || address === "People With Access" || !fileUrl || fileUrl === "Select a file") {
      alert("Please select both file and user to revoke access.");
      return;
    }

    try {
      await contract.disallowFileAccess(fileUrl, address);
      alert("Access revoked successfully.");
      onClose && onClose();
    } catch (error) {
      console.error("Revoking access failed:", error);
      alert("Something went wrong while revoking access.");
    }
  };

  useEffect(() => {
    const fetchFilesAndAccessList = async () => {
      if (!contract || !account) return;

      const files = await contract.display(account);
      setUserFiles(files);

      const addressList = await contract.shareAccess();
      setAccessList(addressList);
    };

    fetchFilesAndAccessList();
  }, [contract, account]);

  return (
    <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#4F46E5] font-inter">Share File With</h2>

        <input
          type="text"
          className="address w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
          placeholder="Enter Address"
        />

        <select
          id="fileSelect"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
        >
          <option>Select a file</option>
          {userFiles.map((file, index) => (
            <option key={index} value={file.url}>
              {file.fileType.toUpperCase()} - {file.url.slice(0, 25)}...
            </option>
          ))}
        </select>

        <select
          id="selectNumber"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
        >
          <option className="text-gray-500">People With Access</option>
          {accessList.map((entry, index) => (
            <option key={index} value={entry.user}>
              {entry.user}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-4 flex-wrap">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-full transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={sharing}
            className="bg-[#4F46E5] hover:bg-[#4338ca] text-white font-bold py-2 px-6 rounded-full transition duration-200"
          >
            Share
          </button>
          <button
            onClick={revokeAccess}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-200"
          >
            Revoke
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
