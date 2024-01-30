import React, { useEffect } from "react";
import styled from "styled-components";
import { Route, Routes, useParams, Navigate } from "react-router-dom";
import Tabs from "./Tabs";
import Overview from "./Overview";
import Settlement from "./Settlement";
import { responsiveSize } from "styles/responsiveSize";
import { useTransactionDetailsQuery } from "hooks/queries/useTransactionsQuery";
import { useTransactionDetailsContext } from "context/TransactionDetailsContext";

const Container = styled.div``;

const Header = styled.h1`
  margin-bottom: ${responsiveSize(16, 48)};
`;

const TransactionDetails: React.FC = () => {
  const { id } = useParams();
  const { data: transactionDetails } = useTransactionDetailsQuery(id);
  const { hasToPayFees, payments, setTransactionDetails } = useTransactionDetailsContext();

  useEffect(() => {
    if (transactionDetails) {
      setTransactionDetails(transactionDetails.escrow);
    } else setTransactionDetails({});
  }, [transactionDetails, setTransactionDetails]);

  return (
    <Container>
      <Header>Transaction #{id}</Header>
      <Tabs hasToPayFees={hasToPayFees} payments={payments} />
      <Routes>
        <Route path="/" element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="settlement" element={<Settlement />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </Container>
  );
};

export default TransactionDetails;
