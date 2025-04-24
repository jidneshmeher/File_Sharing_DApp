import { useRef, useState } from "react";
import { useContract } from "../context/ContractContext";
import Modal from "../components/Modal";

export default function Storage() {
  const [data, setData] = useState([]);
  const { contract, account } = useContract();
  const ref = useRef();
  const [showModal, setShowModal] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download file");
    }
  };

  const getdata = async () => {
    let fileArray = [];
    const Otheraddress = ref.current.value;

    try {
      if (Otheraddress) {
        fileArray = await contract.display(Otheraddress);
      } else {
        if(contract){
          fileArray = await contract.display(account);
        }
      }
    } catch (e) {
      console.error(e);
      alert("You don't have access");
      return;
    }

    const isEmpty = fileArray.length === 0;

    if (isEmpty) {
      alert("No files to display");
      return;
    }

    const elements = fileArray.map((file, i) => {
      const { url, fileType } = file;
      const typeCategory = fileType.split("/")[0];

      return (
        <div key={i} className="relative group w-full h-[400px]">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-black w-full rounded-xl shadow-md overflow-hidden h-full"
          >
            {typeCategory === "image" ? (
              <div className="relative w-full h-full overflow-hidden">
                <img src={url} alt={`Uploaded File ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ) : typeCategory === "video" ? (
              <video controls className="w-full h-full object-contain">
                <source src={url} type={fileType} />
                Your browser does not support the video tag.
              </video>
            ) : typeCategory === "audio" ? (
              <div className="p-4 bg-gray-100 flex flex-col items-center justify-center h-full">
                <p className="text-gray-700 font-semibold mb-2">Audio File</p>
                <audio controls>
                  <source src={url} type={fileType} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : fileType === "application/pdf" ? (
              <iframe src={url} type="application/pdf" className="w-full h-full" title={`PDF File ${i + 1}`} />
            ) : fileType.startsWith("text/") ? (
              <iframe src={url} type={fileType} className="w-full h-full bg-white" title={`Text File ${i + 1}`} />
            ) : (
              <div className="bg-gray-50 p-6 flex flex-col items-center justify-center border border-gray-300 h-full">
                <p className="text-gray-800 font-semibold text-lg mb-2">
                  File Type: <span className="text-blue-600">{fileType}</span>
                </p>
                <p className="text-gray-600 mb-4">Preview not supported. You can still open or download the file:</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="bg-[#4F46E5] hover:bg-[#4338ca] text-white px-6 py-2 rounded-full font-semibold transition duration-200">
                  Open File
                </a>
              </div>
            )}
          </a>

          {/* Download Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              downloadFile(url, `file-${i + 1}`);
            }}
            className="absolute bottom-4 left-4 bg-[#4F46E5] hover:bg-[#4338ca] text-white px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Download
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              setSelectedFileIndex(i);
              setShowModal(true);
            }}
            className="absolute bottom-4 right-4 bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Share
          </button>
        </div>
      );
    });

    setData(elements);
  };

  return (
    <div className="max-w-[1800px] mx-auto px-4 md:px-8 flex flex-col items-center mt-10 justify-center pt-20 gap-10">
      <h1 className="text-4xl font-inter text-[#111827] font-bold mb-4">
        Your Stored Files
      </h1>

      {data.length > 0 ? (
        <>
          {showModal && (
            <Modal
              onClose={() => setShowModal(false)}
              fileIndex={selectedFileIndex}
            />
          )}

          <div className="w-full flex flex-col gap-6">
            <div className="relative w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {data}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter Your Address"
            className="bg-[#F8FAFC] w-[500px] text-[#6B7280] text-[20px] font-bold font-inter px-4 py-2 rounded-3xl border-2 border-[#4F46E5] outline-none focus:ring-2 focus:ring-[#4F46E5] mt-32"
            ref={ref}
          />
          <button
            className="bg-[#4F46E5] hover:bg-[#4338ca] transition-colors duration-200 font-inter font-bold text-white px-10 py-4 rounded-full cursor-pointer mt-4"
            onClick={getdata}
          >
            GET DATA
          </button>
        </>
      )}
    </div>
  );
}
