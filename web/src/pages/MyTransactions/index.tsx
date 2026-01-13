import React from "react";

import { Route, Routes } from "react-router-dom";

import { TransactionDetailsProvider } from "context/TransactionDetailsContext";

import TransactionsFetcher from "./TransactionsFetcher";
import TransactionDetails from "./TransactionDetails";
import clsx from "clsx";

const Dashboard: React.FC = () => (
  <div
    className={clsx(
      "w-full max-w-landscape mx-auto bg-klerosUIComponentsLightBackground",
      "pt-8 pb-10 px-4 lg:pt-12 lg:pb-[60px] lg:px-fluid-0-132"
    )}
  >
    <Routes>
      <Route path="/display/:page/:order/:filter" element={<TransactionsFetcher />} />
      <Route
        path="/:id/*"
        element={
          <TransactionDetailsProvider>
            <TransactionDetails />
          </TransactionDetailsProvider>
        }
      />
    </Routes>
  </div>
);

export default Dashboard;
