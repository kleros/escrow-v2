import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { Link, LinkProps, useLocation } from "react-router-dom";
import { useOpenContext } from "../MobileHeader";

const Container = styled.div`
  display: flex;
  gap: 0px;
  flex-direction: column;

  ${landscapeStyle(
    () => css`
      flex-direction: row;
      gap: calc(4px + (16 - 4) * ((100vw - 375px) / (1250 - 375)));
    `
  )};
`;

const LinkContainer = styled.div`
  display: flex;
  min-height: 32px;
  align-items: center;
`;

const Title = styled.h1`
  display: block;

  ${landscapeStyle(
    () => css`
      display: none;
    `
  )};
`;

interface StyledLinkProps extends LinkProps {
  isActive: boolean;
}

const StyledLink = styled(({ isActive, ...props }: StyledLinkProps) => <Link {...props} />)`
  color: ${({ theme }) => theme.primaryText};
  text-decoration: none;
  font-size: 16px;

  font-weight: ${({ isActive }: StyledLinkProps) => (isActive ? "600" : "normal")};

  ${landscapeStyle(
    () => css`
      color: ${({ theme }) => theme.white};
    `
  )};
`;

const links = [
  { to: "/new-transaction", text: "New Transaction" },
  { to: "/transactions/display/1/desc/all", text: "My Transactions" },
];

const Explore: React.FC = () => {
  const location = useLocation();
  const { toggleIsOpen } = useOpenContext();

  return (
    <Container>
      <Title>Explore</Title>
      {links.map(({ to, text }) => (
        <LinkContainer key={text}>
          <StyledLink to={to} onClick={toggleIsOpen} isActive={location.pathname.startsWith(to)}>
            {text}
          </StyledLink>
        </LinkContainer>
      ))}
    </Container>
  );
};

export default Explore;
