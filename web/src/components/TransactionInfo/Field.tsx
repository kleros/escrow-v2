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
    `}
`;

const StyledLink = styled(Link)<{ isPreview?: boolean }>`
  flex-grow: 1;
  text-align: end;
  color: ${({ theme }) => theme.primaryBlue};
  &:hover {
    cursor: pointer;
  }
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
      {!displayAsList || isPreview ? (
        <>
          <Icon />
          <label>{name}:</label>
        </>
      ) : null}
      {link ? (
        <StyledLink isPreview={isPreview} to={link}>
          {value}
        </StyledLink>
      ) : (
        <StyledValue isPreview={isPreview}>{value}</StyledValue>
      )}
    </FieldContainer>
  );
};

export default Field;
