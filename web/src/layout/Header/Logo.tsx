import React from "react";
import { Link } from "react-router-dom";
import EscrowLogo from "svgs/header/escrow.svg";

const Logo: React.FC = () => (
  <div className="flex flex-row items-center gap-4">
    {" "}
    <Link to={"/"}>
      <EscrowLogo className="transition duration-100 max-h-12 w-auto hover:[&_path]:fill-white/75" />
    </Link>
  </div>
);

export default Logo;
