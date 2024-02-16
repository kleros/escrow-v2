import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { Link } from "react-router-dom";

type FieldContainerProps = {
  width?: string;
  isList?: boolean;
  isPreview?: boolean;
};

const FieldContainer = styled.div<FieldContainerProps>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  word-break: break-word;
  width: 100%;

  svg {
    fill: ${({ theme }) => theme.secondaryPurple};
    margin-right: 8px;
    width: 14px;
  }

  ${({ isList }) =>
    isList &&
    css`
      ${landscapeStyle(
        () => css`
          width: auto;
        `
      )}
    `};
  ${({ isPreview }) =>
    isPreview &&
    css`
      width: auto;
      gap: 8px;
      svg {
        margin-right: 0;
      }
    `};
`;

const StyledValue = styled.label<{ isPreview?: boolean }>`
  flex-grow: 1;
  text-align: end;
  color: ${({ theme }) => theme.primaryText};
  ${({ isPreview }) =>
    isPreview &&
    css`
      font-weight: 600;
      text-align: start;
    `}
`;

const StyledLink = styled(Link)`
  flex-grow: 1;
  text-align: end;
  color: ${({ theme }) => theme.primaryBlue};
  &:hover {
    cursor: pointer;
  }
`;

const NameLabel = styled.label<{ isList?: boolean; name: string; isPreview?: boolean }>`
  ${({ isList, name }) =>
    isList &&
    css`
      display: ${name === "Buyer" || name === "Seller" ? "flex" : "none"};
      margin-right: ${name === "Buyer" || name === "Seller" ? "8px" : "0"};
    `}
  ${({ isPreview }) =>
    isPreview &&
    css`
      display: flex;
      margin-right: 0;
    `}
`;

interface IField {
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  name: string;
  value: string;
  link?: string;
  width?: string;
  displayAsList?: boolean;
  isPreview?: boolean;
}

const Field: React.FC<IField> = ({ icon: Icon, name, value, link, width, displayAsList, isPreview }) => {
  return (
    <FieldContainer isList={displayAsList} isPreview={isPreview} width={width}>
      <>
        <Icon />
        <NameLabel isList={displayAsList} {...{ name, isPreview }}>
          {name}:
        </NameLabel>
      </>
      {link ? <StyledLink to={link}>{value}</StyledLink> : <StyledValue isPreview={isPreview}>{value}</StyledValue>}
    </FieldContainer>
  );
};

export default Field;
