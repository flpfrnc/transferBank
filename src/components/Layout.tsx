import { MdOutlineLogout } from "react-icons/md";
import { BiTransferAlt } from "react-icons/bi";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface HeaderProps {
  children: ReactNode;
}

export default function Layout({ children }: HeaderProps) {
  const auth = useAuth();

  function logout() {
    auth.logout();
  }

  return (
    <div>
      <div className="bg-[#254A75] h-[5rem] text-white flex items-center px-4 justify-between w-full">
        <span className="flex gap-2 justify-center items-center text-lg">
          TransferBank <BiTransferAlt size={25} />
        </span>
        <button data-testid="logout" onClick={logout} title="Sair">
          <MdOutlineLogout size={25} />
        </button>
      </div>
      {children}
    </div>
  );
}
