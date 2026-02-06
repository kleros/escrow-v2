import React from "react";

const Description: React.FC = () => {
  return (
    <p className="m-0 text-klerosUIComponentsSecondaryText">
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
    </p>
  );
};
export default Description;
