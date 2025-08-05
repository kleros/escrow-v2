import React from "react";
import styled from "styled-components";
import { hoverShortTransitionTiming } from "styles/commonStyles";
import Arrow from "svgs/icons/arrow-down.svg";

const Label = styled.label`
  ${hoverShortTransitionTiming}
  font-size: 12px;
  cursor: pointer;
  transition: color 0.2s ease;
  color: ${({ theme }) => theme.primaryBlue};
`;

const StyledArrow = styled(Arrow) <{ isOpen: boolean }>`
  ${hoverShortTransitionTiming}
  margin-left: 6px;
  width: 9px;
  height: 9px;
  transition: transform 0.25s ease, fill 0.25s ease;
  transform: rotate(${({ isOpen }) => (isOpen ? 180 : 0)}deg);
  fill: ${({ theme }) => theme.primaryBlue};
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryBlue};
  }

  :hover {
    label {
      color: ${({ theme }) => theme.secondaryBlue};
    }
    svg {
      fill: ${({ theme }) => theme.secondaryBlue};
    }
  }
`;

interface ISimpleToggleButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  label: string;
}

const SimpleToggleButton: React.FC<ISimpleToggleButton> = ({
  isOpen,
  label,
  onClick
}) => (
  <StyledButton {...{ onClick }}>
    <Label>{label}</Label>
    <StyledArrow {...{ isOpen }} />
  </StyledButton>
);

export default SimpleToggleButton;
