import React from "react";
import { Navigate, Route } from "react-router-dom";
import { SentryRoutes } from "./utils/sentry";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import "@kleros/ui-components-library/dist/ui-components-library.css";
import Web3Provider from "context/Web3Provider";
import IsListProvider from "context/IsListProvider";
import QueryClientProvider from "context/QueryClientProvider";
import StyledComponentsProvider from "context/StyledComponentsProvider";
import GraphqlBatcherProvider from "context/GraphqlBatcher";
import Layout from "layout/index";
import NewTransaction from "./pages/NewTransaction";
import MyTransactions from "./pages/MyTransactions";
import { NewTransactionProvider } from "./context/NewTransactionContext";
import AttachmentDisplay from "./pages/AttachmentDisplay";
import AtlasProvider from "./context/AtlasProvider";
import Settings from "./pages/Settings";
import { StyledH1 } from "./components/StyledTags";

const App: React.FC = () => {
  return (
    <StyledComponentsProvider>
      <Web3Provider>
        <QueryClientProvider>
          <AtlasProvider>
            <GraphqlBatcherProvider>
              <IsListProvider>
                <NewTransactionProvider>
                  <SentryRoutes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Navigate to="new-transaction" replace />} />
                      <Route path="new-transaction/*" element={<NewTransaction />} />
                      <Route path="transactions/*" element={<MyTransactions />} />
                      <Route path="attachment/*" element={<AttachmentDisplay />} />
                      <Route path="settings/*" element={<Settings />} />
                      <Route path="*" element={<StyledH1>404 not found</StyledH1>} />
                    </Route>
                  </SentryRoutes>
                </NewTransactionProvider>
              </IsListProvider>
            </GraphqlBatcherProvider>
          </AtlasProvider>
        </QueryClientProvider>
      </Web3Provider>
    </StyledComponentsProvider>
  );
};

export default App;
