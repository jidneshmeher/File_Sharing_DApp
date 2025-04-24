import { useState } from "react";
import { pinata } from "../utils/config.js";
import { useContract } from "../context/ContractContext.jsx"; // Import context hook
import Image2 from "../assets/image2.gif"

export default function FileUpload() {

  const { contract, account } = useContract(); 

  const [file, setFile] = useState(null);
  const [url, setUrl] = useState();

  const retrieveFile = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("No file selected!");
      return;
    }

    try {
      const upload = await pinata.upload.public.file(file);
      console.log(upload.mime_type)
      const gatewayUrl = await pinata.gateways.public.convert(upload.cid);

      setUrl(gatewayUrl);

      if (!contract) {
        alert("Contract not initialized!");
        return;
      }

      console.log("Calling contract.add()...");

      console.log(account , gatewayUrl)

      const tx = await contract.add(gatewayUrl, upload.mime_type);


      console.log("Transaction Sent:", tx);
      await tx.wait();

      console.log("Transaction Mined:", tx.hash);
      alert("Successfully File Uploaded"); 

      setFile(null);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to upload image or execute contract call");
    }
  };

  return (
    <>
      <div className="max-w-[1800px]  mx-auto px-4 md:px-8 flex flex-col items-center mt-10 justify-center pt-20 gap-10">
        <h1 className="text-4xl font-inter text-[#111827] font-bold mb-4">
         Upload Your File Securely
        </h1>
        <img alt="File upload icon" className="mx-auto mb-4" width="300" height="300" src={Image2} />
        {/* <div class="flex justify-center items-center mb-4">
          <label class="bg-gray-300 text-gray-700 px-4 py-2 rounded-l-lg cursor-pointer">
           Choose File
           <input class="hidden" type="file"/>
          </label>
          <span class="bg-white text-gray-700 px-4 py-2 rounded-r-lg border border-gray-300">
            No File choosen
          </span>
        </div>
        <button class="bg-[#4F46E5] font-inter font-bold text-white px-10 py-4 rounded-full">
          UPLOAD
        </button> */}
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="flex justify-center items-center mb-4">
            <label className="bg-gray-300 text-gray-700 px-4 py-2 rounded-l-lg cursor-pointer">
             Choose File
             <input className="hidden" type="file" onChange={retrieveFile}/>
            </label>
            <span className="bg-white text-gray-700 px-4 py-2 rounded-r-lg border border-gray-300">
              {file ? file.name : "No File chosen"}
            </span>
          </div>
          <button type="submit" className="bg-[#4F46E5] hover:bg-[#4338ca] transition-colors duration-200 font-inter font-bold text-white px-10 py-4 rounded-full cursor-pointer">
            UPLOAD
          </button>
        </form>
      </div>
    </>
  );
}
