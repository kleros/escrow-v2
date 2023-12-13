import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.secondaryPurple};
`;

const StyledHeader = styled.h1`
  margin: 0;
`;

const Header: React.FC = () => {
  return (
    <Container>
      <StyledLabel>General Escrow #1</StyledLabel>
      <StyledHeader>Escrow with John.</StyledHeader>
    </Container>
  );
};
export default Header;
