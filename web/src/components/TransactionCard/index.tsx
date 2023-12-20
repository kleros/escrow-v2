import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
// import { formatEther } from "viem";
// import { StyledSkeleton } from "components/StyledSkeleton";
import { Card } from "@kleros/ui-components-library";
import { Statuses } from "consts/statuses";
import { useIsList } from "context/IsListProvider";
// import { TransactionDetailsFragment } from "queries/useTransactionsQuery";
// import { useCourtPolicy } from "queries/useCourtPolicy";
// import { useTransactionTemplate } from "queries/useTransactionTemplate";
// import { useVotingHistory } from "queries/useVotingHistory";
import TransactionInfo from "../TransactionInfo";
import StatusBanner from "./StatusBanner";
// import { isUndefined } from "utils/index";
import { responsiveSize } from "styles/responsiveSize";
import { shortenAddress } from "utils/shortenAddress";

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

interface ITransactionCard {
  id: number;
  status: string;
  overrideIsList?: boolean;
}

const TransactionCard: React.FC<ITransactionCard> = ({ id, status, overrideIsList }) => {
  const { isList } = useIsList();
  const currentStatusIndex = Statuses[status];
  const title = "Escrow with John";
  const navigate = useNavigate();

  // const date =
  //   currentStatusIndex === 4
  //     ? lastStatusChange
  //     : getStatusEndTimestamp(lastStatusChange, currentStatusIndex, court.timesPerStatus);
  // const { data: transactionTemplate } = useTransactionTemplate(id, arbitrated.id as `0x${string}`);
  // const { data: courtPolicy } = useCourtPolicy(court.id);
  // const courtName = courtPolicy?.name;
  // const category = transactionTemplate ? transactionTemplate.category : undefined;
  // const { data: votingHistory } = useVotingHistory(id);

  return (
    <>
      {!isList || overrideIsList ? (
        <StyledCard hover onClick={() => navigate(`/myTransactions/${id.toString()}`)}>
          <StatusBanner id={parseInt(id)} status={currentStatusIndex} />
          <CardContainer>
            <StyledTitle>{title}</StyledTitle>
            <TransactionInfo
              amount="610"
              token="ETH"
              receiver={shortenAddress("0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e")}
              deadline={new Date()}
              isPreview={false}
            />
          </CardContainer>
        </StyledCard>
      ) : (
        <StyledListItem hover onClick={() => navigate(`/myTransactions/${id.toString()}`)}>
          <StatusBanner isCard={false} id={parseInt(id)} status={currentStatusIndex} />
          <ListContainer>
            <ListTitle>
              <TruncatedTitle text={"Escrow with John"} maxLength={50} />
            </ListTitle>
            <TransactionInfo
              amount="610"
              token="ETH"
              receiver={shortenAddress("0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e")}
              deadline={new Date()}
              isPreview={false}
            />
          </ListContainer>
        </StyledListItem>
      )}
    </>
  );
};

export default TransactionCard;
