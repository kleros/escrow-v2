import React from "react";
import styled from "styled-components";
import Filters from "./Filters";
import Stats, { IStats } from "./Stats";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 11px;
  margin-bottom: 48px;
  justify-content: space-between;
`;

const StatsAndFilters: React.FC<IStats> = ({ totalTransactions, resolvedTransactions }) => (
  <Container>
    <Stats {...{ totalTransactions, resolvedTransactions }} />
    <Filters />
  </Container>
);

export default StatsAndFilters;
