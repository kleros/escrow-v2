import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { formatEther } from "viem";
import { Card } from "@kleros/ui-components-library";
import { Statuses } from "consts/statuses";
import { useIsList } from "context/IsListProvider";
import TransactionInfo from "../TransactionInfo";
import StatusBanner from "./StatusBanner";
import { responsiveSize } from "styles/responsiveSize";
import { shortenAddress } from "utils/shortenAddress";
import { TransactionDetailsFragment } from "src/graphql/graphql";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import useFetchIpfsJson from "hooks/useFetchIpfsJson";
import { StyledSkeleton } from "../StyledSkeleton";

const StyledCard = styled(Card)`
  width: 100%;
  height: 260px;
`;

const StyledListItem = styled(Card)`
  display: flex;
  flex-grow: 1;
  width: 100%;
  height: 64px;
`;

const CardContainer = styled.div`
  height: calc(100% - 45px);
  padding: ${responsiveSize(20, 24)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const ListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-right: 8px;
`;

const ListTitle = styled.div`
  display: flex;
  height: 100%;
  justify-content: start;
  align-items: center;
  width: calc(30vw + (40 - 30) * (min(max(100vw, 300px), 1250px)- 300px) / 950);
`;

const StyledTitle = styled.h3`
  margin: 0;
`;

export const getStatusEndTimestamp = (
  lastStatusChange: string,
  currentStatusIndex: number,
  timesPerStatus: string[]
) => {
  const durationCurrentStatus = parseInt(timesPerStatus[currentStatusIndex]);
  return parseInt(lastStatusChange) + durationCurrentStatus;
};

const TruncatedTitle = ({ text, maxLength }) => {
  const truncatedText = text.length <= maxLength ? text : text.slice(0, maxLength) + "…";
  return <StyledTitle>{truncatedText}</StyledTitle>;
};

interface ITransactionCard extends TransactionDetailsFragment {
  overrideIsList?: boolean;
}

const TransactionCard: React.FC<ITransactionCard> = ({
  id,
  status,
  overrideIsList,
  transactionUri,
  deadline,
  buyer,
  amount,
  asset,
}) => {
  const transactionInfo = useFetchIpfsJson(transactionUri);
  const { isList } = useIsList();
  const nativeTokenSymbol = useNativeTokenSymbol();
  const currentStatusIndex = Statuses[status];
  const title = transactionInfo?.title ?? <StyledSkeleton />;
  const navigate = useNavigate();

  return (
    <>
      {!isList || overrideIsList ? (
        <StyledCard hover onClick={() => navigate(`/myTransactions/${id.toString()}`)}>
          <StatusBanner id={parseInt(id)} status={currentStatusIndex} />
          <CardContainer>
            <StyledTitle>{title}</StyledTitle>
            <TransactionInfo
              amount={formatEther(amount)}
              token={asset === "native" ? nativeTokenSymbol : ""}
              receiverAddress={shortenAddress(buyer)}
              deadlineDate={new Date(deadline * 1000).toLocaleString()}
              isPreview={false}
            />
          </CardContainer>
        </StyledCard>
      ) : (
        <StyledListItem hover onClick={() => navigate(`/myTransactions/${id.toString()}`)}>
          <StatusBanner isCard={false} id={parseInt(id)} status={currentStatusIndex} />
          <ListContainer>
            <ListTitle>
              <TruncatedTitle text={title} maxLength={50} />
            </ListTitle>
            <TransactionInfo
              amount={amount}
              token={asset === "native" ? nativeTokenSymbol : ""}
              receiverAddress={shortenAddress(buyer)}
              deadlineDate={new Date(deadline * 1000).toLocaleString()}
              isPreview={false}
            />
          </ListContainer>
        </StyledListItem>
      )}
    </>
  );
};

export default TransactionCard;
