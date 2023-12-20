import React from "react";
import styled from "styled-components";
import { Route, Routes, useParams, Navigate } from "react-router-dom";
import Tabs from "./Tabs";
import Overview from "./Overview";
import Settlement from "./Settlement";
import Dispute from "./Dispute";
import { responsiveSize } from "styles/responsiveSize";

const Container = styled.div``;

const Header = styled.h1`
  margin-bottom: ${responsiveSize(16, 48)};
`;

const TransactionDetails: React.FC = () => {
  const { id } = useParams();

  return (
    <Container>
      <Header>Transaction #{id}</Header>
      <Tabs />
      <Routes>
        <Route path="/" element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="settlement" element={<Settlement />} />
        <Route path="dispute" element={<Dispute />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </Container>
  );
};

export default TransactionDetails;
