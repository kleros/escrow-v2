import React from "react";
import styled from "styled-components";
import ProposeSettlementButton from "./ProposeSettlementButton";
import RaiseDisputeButton from "./RaiseDisputeButton";
import ReleasePaymentButton from "./ReleasePaymentButton";
import { useAccount } from "wagmi";
import { TransactionDetailsFragment } from "src/graphql/graphql";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px 24px;
  justify-content: center;
`;

interface IButtons {
  transactionData: TransactionDetailsFragment;
}

const Buttons: React.FC<IButtons> = ({ transactionData }) => {
  const { address } = useAccount();
  const nativeTokenSymbol = useNativeTokenSymbol();
  const isBuyer = address?.toLowerCase() === transactionData?.buyer?.toLowerCase();

  return (
    <Container>
      {isBuyer ? (
        <ReleasePaymentButton
          transactionId={transactionData?.id}
          amount={transactionData?.amount}
          asset={transactionData?.asset === "native" ? nativeTokenSymbol : ""}
          seller={transactionData?.seller}
        />
      ) : null}
      {/* <ProposeSettlementButton /> */}
      <RaiseDisputeButton transactionData={transactionData} />
    </Container>
  );
};
export default Buttons;
