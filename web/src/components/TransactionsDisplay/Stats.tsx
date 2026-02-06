import React from "react";

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="inline-flex gap-2 items-center">
    <label className="text-klerosUIComponentsPrimaryText">{label}</label>
    <small className="text-klerosUIComponentsPrimaryText text-sm font-semibold">{value}</small>
  </div>
);

const Separator: React.FC = () => <label className="mx-2 text-klerosUIComponentsPrimaryText">|</label>;

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
