import React from "react";
import styled from "styled-components";
import { StyledH1 } from "components/StyledTags";

const Container = styled(StyledH1)`
  margin-bottom: 26px;
`;

const ToDivider: React.FC = () => {
  return <Container>to</Container>;
};
export default ToDivider;
