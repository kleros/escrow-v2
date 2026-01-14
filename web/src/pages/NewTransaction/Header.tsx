import React from "react";

interface IHeader {
  text: string;
}

const Header: React.FC<IHeader> = ({ text }) => {
  return <h1 className="mb-5 w-[84vw] text-center text-(length:--spacing-fluid-20-24) lg:w-auto lg:mb-7">{text}</h1>;
};
export default Header;
