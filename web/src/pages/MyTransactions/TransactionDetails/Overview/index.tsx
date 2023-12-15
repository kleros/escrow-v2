import React from "react";
import PreviewContent from "~src/components/PreviewCard";
import styled from "styled-components";
import WasItFulfilled from "./WasItFulfilled";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Overview: React.FC = () => {
  return (
    <Container>
      <PreviewContent />
      <WasItFulfilled />
    </Container>
  );
};
export default Overview;
