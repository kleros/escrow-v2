import styled from "styled-components";

export const StyledH1 = styled.h1`
  margin: 0 0 16px 0;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: ${({ theme }) => theme.primaryText};
`;

export const StyledH2 = styled.h2`
  margin: 0 0 16px 0;
  font-weight: 400;
  font-size: 24px;
  line-height: 32px;
  color: ${({ theme }) => theme.primaryText};
`;

export const StyledH3 = styled.h3`
  margin: 0 0 16px 0;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.primaryText};
`;

export const StyledP = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.primaryText};
`;

export const StyledSmall = styled.small`
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.primaryText};
`;

export const StyledLabel = styled.label`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.secondaryText};
`;

export const StyledA = styled.a`
  font-weight: 400;
  font-size: 14px;
  text-decoration: none;
  color: ${({ theme }) => theme.primaryBlue};
`;

export const StyledHr = styled.hr`
  opacity: 1;
  border: 1px solid ${({ theme }) => theme.stroke};
`;
