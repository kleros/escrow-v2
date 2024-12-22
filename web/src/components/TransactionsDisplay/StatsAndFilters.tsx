import React from "react";
import styled from "styled-components";

import { responsiveSize } from "styles/responsiveSize";

import Filters from "./Filters";
import Stats, { IStats } from "./Stats";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: ${responsiveSize(4, 8)};
  margin-bottom: ${responsiveSize(16, 32)};
  justify-content: space-between;
`;

const StatsAndFilters: React.FC<IStats> = ({ totalTransactions, resolvedTransactions }) => (
  <Container>
    <Stats {...{ totalTransactions, resolvedTransactions }} />
    <Filters />
  </Container>
);

export default StatsAndFilters;
