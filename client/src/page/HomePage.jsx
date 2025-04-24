import Navbar from "../components/Navbar";
import Image1 from "../assets/image1.jpg"
import { Link } from "react-router";

export default function Homepage() {

    return(
        <>
          <section className="w-full bg-white py-16">
            <div className="max-w-[1800px]  mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
              {/* Left Content */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-[85px] leading-[1.15] font-inter font-bold text-[#4F46E5] mb-4">
                  Secure & Decentralized File Sharing
                </h1>
                <p className="text-2xl font-bold font-inter text-[#4B5563] mb-8">
                  Store and share your files securely on the blockchain. No censorship, no central control.
                </p>
                <Link to="/upload" className="bg-[#4F46E5] hover:bg-[#4338ca] text-white font-inter font-bold py-4 px-10 rounded-4xl transition">
                  GET STARTED
                </Link>
              </div>
              {/* Right Image */}
              <div className="flex-1 py-15">
                <img
                  src={Image1} // replace with actual image path
                  alt="Hero"
                  className="w-full max-w-4xl mx-auto md:mx-0"
                />
              </div>
            </div>
          </section>
        </>
    )
}