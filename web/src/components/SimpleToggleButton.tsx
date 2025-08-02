import React from "react";
import styled from "styled-components";
import Arrow from "svgs/icons/arrow-down.svg";

const Label = styled.span<{ disabled?: boolean; }>`
  font-weight: 600;
  height: 18px;
  font-size: 12px;
  transition: color 0.2s ease;
  color: ${({ theme, disabled }) =>
    disabled ? theme.secondaryText : theme.primaryBlue};
`;

const StyledArrow = styled(Arrow) <{ isOpen: boolean; disabled?: boolean; }>`
  margin-left: 8px;
  width: 8px;
  height: 8px;
  transition: transform 0.25s ease, fill 0.25s ease;
  transform: rotate(${({ isOpen }) => (isOpen ? 180 : 0)}deg);
  fill: ${({ theme, disabled }) =>
    disabled ? theme.secondaryText : theme.primaryBlue};
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  margin: 10px 0;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline: none;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryBlue};
  }

  &:hover:not(:disabled) ${Label} {
    color: ${({ theme }) => theme.secondaryBlue};
  }

  &:hover:not(:disabled) ${StyledArrow} {
    fill: ${({ theme }) => theme.secondaryBlue};
  }
`;

interface SimpleToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  label: string;
}

const SimpleToggleButton: React.FC<SimpleToggleButtonProps> = ({
  isOpen,
  label,
  disabled,
  ...props
}) => (
  <StyledButton disabled={disabled} {...props}>
    <Label disabled={disabled}>{label}</Label>
    <StyledArrow isOpen={isOpen} disabled={disabled} />
  </StyledButton>
);

export default SimpleToggleButton;
