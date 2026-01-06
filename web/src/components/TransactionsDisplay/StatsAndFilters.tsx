import React from "react";

import Filters from "./Filters";
import Stats, { IStats } from "./Stats";

const StatsAndFilters: React.FC<IStats> = ({ totalTransactions, resolvedTransactions }) => (
  <div className="flex flex-wrap justify-between items-center gap-2 mt-fluid-4-8 mb-fluid-16-32">
    <Stats {...{ totalTransactions, resolvedTransactions }} />
    <Filters />
  </div>
);

export default StatsAndFilters;
