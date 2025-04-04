import React from "react";
import styled from "styled-components";
import { StyledP as P } from "components/StyledTags";

const StyledP = styled(P)`
  color: ${({ theme }) => theme.secondaryText};
  margin: 0;
`;

const Description: React.FC = () => {
  return (
    <StyledP>
      In order to raise a dispute, both parties involved need to deposit the arbitration fees. The fees are used to pay
      the jurors for their work.
      <br />
      <br />
      After both sides deposit the fees the dispute starts. A random pool of jurors is selected to evaluate the case,
      the evidence, and vote. The side that receives the majority of votes wins the dispute and receives the arbitration
      fee back.
      <br />
      <br />
      After the juror's decision, both sides can still appeal the case if not satisfied with the result. It leads to
      another round with different jurors.
    </StyledP>
  );
};
export default Description;
