import React from "react";
import styled from "styled-components";

const FieldWrapper = styled.div`
  display: inline-flex;
  gap: 8px;
`;

const SeparatorLabel = styled.label`
  margin: 0 8px;
  color: ${({ theme }) => theme.primaryText};
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.primaryText};
`;

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <FieldWrapper>
    <StyledLabel>{label}</StyledLabel>
    <small>{value}</small>
  </FieldWrapper>
);

const Separator: React.FC = () => <SeparatorLabel>|</SeparatorLabel>;

export interface IStats {
  totalTransactions: number;
  resolvedTransactions: number;
}

const Stats: React.FC<IStats> = ({ totalTransactions, resolvedTransactions }) => {
  const inProgressDisputes = (totalTransactions - resolvedTransactions).toString();

  const fields = [
    { label: "Total", value: totalTransactions.toString() },
    { label: "In Progress", value: inProgressDisputes },
    { label: "Concluded", value: resolvedTransactions.toString() },
  ];

  return (
    <div>
      {fields.map(({ label, value }, i) => (
        <React.Fragment key={i}>
          <Field {...{ label, value }} />
          {i + 1 < fields.length ? <Separator /> : null}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stats;
