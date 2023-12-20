import React from "react";
import styled from "styled-components";
import PreviewCard from "components/PreviewCard";
import WasItFulfilled from "./WasItFulfilled";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Overview: React.FC = () => {
  return (
    <Container>
      <PreviewCard />
      <WasItFulfilled />
    </Container>
  );
};
export default Overview;
