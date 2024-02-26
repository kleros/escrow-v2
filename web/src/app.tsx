import React from "react";
import { Navigate, Route } from "react-router-dom";
import { SentryRoutes } from "./utils/sentry";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import Web3Provider from "context/Web3Provider";
import IsListProvider from "context/IsListProvider";
import QueryClientProvider from "context/QueryClientProvider";
import StyledComponentsProvider from "context/StyledComponentsProvider";
import RefetchOnBlock from "context/RefetchOnBlock";
import GraphqlBatcherProvider from "context/GraphqlBatcher";
import Layout from "layout/index";
import NewTransaction from "./pages/NewTransaction";
import MyTransactions from "./pages/MyTransactions";
import { NewTransactionProvider } from "./context/NewTransactionContext";

const App: React.FC = () => {
  return (
    <StyledComponentsProvider>
      <QueryClientProvider>
        <RefetchOnBlock />
        <GraphqlBatcherProvider>
          <Web3Provider>
            <IsListProvider>
              <NewTransactionProvider>
                <SentryRoutes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="newTransaction" replace />} />
                    <Route path="newTransaction/*" element={<NewTransaction />} />
                    <Route path="myTransactions/*" element={<MyTransactions />} />
                    <Route path="*" element={<h1>404 not found</h1>} />
                  </Route>
                </SentryRoutes>
              </NewTransactionProvider>
            </IsListProvider>
          </Web3Provider>
        </GraphqlBatcherProvider>
      </QueryClientProvider>
    </StyledComponentsProvider>
  );
};

export default App;
