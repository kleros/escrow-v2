import React from "react";
import styled from "styled-components";
import HeroImage from "./HeroImage";

const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.lightBackground};
  padding: calc(24px + (132 - 24) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  padding-top: calc(32px + (72 - 32) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  padding-bottom: calc(76px + (96 - 76) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  max-width: 1780px;
  margin: 0 auto;
`;

const Home: React.FC = () => {
  return (
    <>
      <HeroImage />
      <Container>
      hi
        <br />
        <br />
        <br />
        hi
        <br />
        hihi
        <br />
        <br />
        <br />
        hi
        <br />
        hihi
        <br />
        <br />
        <br />
        hi
        <br />
        hi
      </Container>
    </>
  );
};

export default Home;
