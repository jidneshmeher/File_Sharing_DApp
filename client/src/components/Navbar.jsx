import {NavLink} from "react-router-dom"
import { useContract } from "../context/ContractContext";

export default function Navbar(){

    const { account, connectWallet } = useContract();

    const navLinkClass = ({ isActive }) =>
    `text-white text-[17px] font-inter font-bold ${
      isActive ? "underline decoration-3 underline-offset-8" : ""
    }`

    return(
        <nav className="bg-[#4F46E5] w-full h-[70px] flex justify-between">
            <div className="w-full max-w-4xl flex items-center justify-between px-10">
                <NavLink className={navLinkClass} to="/">HOME</NavLink>
                <NavLink className={navLinkClass} to="/upload">UPLOAD</NavLink>
                <NavLink className={navLinkClass} to="/storage">STORAGE</NavLink>
            </div>
            <div className="flex items-center px-10">
                <button 
                    className="bg-white font-inter font-bold text-[17px] text-[#4F46E5] px-7 py-3 rounded-3xl"
                    onClick={connectWallet}
                >
                    {account ? `${account.slice(0, 10)}...${account.slice(-4)}` : "CONNECT"}
                </button>
            </div>
            
        </nav>
    )
}