import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { hoverShortTransitionTiming } from "styles/commonStyles";

import { useOpenContext } from "../MobileHeader";

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  ${landscapeStyle(
    () => css`
      flex-direction: row;
    `
  )};
`;

const Title = styled.h1`
  display: block;
  margin-bottom: 8px;

  ${landscapeStyle(
    () => css`
      display: none;
    `
  )};
`;

const PoliciesButton = styled.button<{ isActive: boolean; isMobileNavbar?: boolean }>`
  ${hoverShortTransitionTiming}
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: ${({ isActive, theme }) => (isActive ? theme.primaryText : `${theme.primaryText}BA`)};
  font-weight: ${({ isActive, isMobileNavbar }) => (isMobileNavbar && isActive ? "600" : "normal")};
  padding: 8px 8px 8px 0;
  border-radius: 7px;

  &:hover {
    color: ${({ theme, isMobileNavbar }) => (isMobileNavbar ? theme.primaryText : theme.white)} !important;
  }

  ${landscapeStyle(
    () => css`
      padding: 16px 8px;
    `
  )}

  @media (min-width: 900px) {
    color: ${({ isActive, theme }) => (isActive ? theme.white : `${theme.white}BA`)};
  }
`;

const ChevronIcon = styled.span<{ isOpen: boolean }>`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  transition: transform 0.2s ease;
  margin-top: -4px;
`;

const DropdownContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${({ theme }) => theme.whiteBackground};
  border: 1px solid ${({ theme }) => theme.stroke};
  border-radius: 3px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  width: 247px;
  z-index: 1000;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transform: translateY(${({ isOpen }) => (isOpen ? "0" : "-10px")});
  transition: all 0.2s ease;

  ${landscapeStyle(
    () => css`
      top: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%) translateY(0);
    `
  )};
`;

const DropdownItem = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
  color: ${({ theme }) => theme.primaryText};
  background: transparent;
  border-left: 3px solid transparent;
  height: 45px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.mediumBlue};
    border-left-color: ${({ theme }) => theme.primaryBlue};
  }

  &:first-child {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

  &:last-child {
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`;

const ItemIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primaryBlue};
`;

const CheckIcon = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-radius: 50%;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 5px;
    width: 5px;
    height: 8px;
    border: solid currentColor;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const DocumentIcon = styled.div`
  width: 18px;
  height: 22px;
  border: 2px solid currentColor;
  border-radius: 2px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    height: 2px;
    background: currentColor;
    border-radius: 1px;
  }

  &::before {
    content: "";
    position: absolute;
    top: 8px;
    left: 3px;
    right: 3px;
    height: 1px;
    background: currentColor;
    border-radius: 0.5px;
  }
`;

interface IPolicies {
  isMobileNavbar?: boolean;
}

const Policies: React.FC<IPolicies> = ({ isMobileNavbar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toggleIsOpen } = useOpenContext();

  const policies = [
    {
      id: "general-policy",
      name: "General Policy",
      url: "https://cdn.kleros.link/ipfs/QmU2GuwcSs8tFp8gWf5hcXVbcJKRqwoecNnERz9XjKr18d",
      icon: CheckIcon,
    },
    {
      id: "good-practices",
      name: "Good Practices",
      url: "https://cdn.kleros.link/ipfs/QmcCyR68RmwWfdVKinY8Fmiy73a6xEzGqYDcvAh9EFUnLF",
      icon: DocumentIcon,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = () => {
    setIsOpen(false);
    if (isMobileNavbar) {
      toggleIsOpen();
    }
  };

  return (
    <Container ref={dropdownRef}>
      <Title>Policies</Title>
      <PoliciesButton
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        isActive={isOpen}
        isMobileNavbar={isMobileNavbar}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        Policies
        <ChevronIcon isOpen={isOpen} />
      </PoliciesButton>
      
      <DropdownContainer isOpen={isOpen}>
        {policies.map((policy) => {
          const IconComponent = policy.icon;
          return (
            <DropdownItem
              key={policy.id}
              href={policy.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleItemClick}
            >
              <ItemIcon>
                <IconComponent />
              </ItemIcon>
              {policy.name}
            </DropdownItem>
          );
        })}
      </DropdownContainer>
    </Container>
  );
};

export default Policies;
