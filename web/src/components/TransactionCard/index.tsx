import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { formatEther } from "viem";
import { Card } from "@kleros/ui-components-library";
import { useIsList } from "context/IsListProvider";
import TransactionInfo from "../TransactionInfo";
import StatusBanner from "./StatusBanner";
import { responsiveSize } from "styles/responsiveSize";
import { mapStatusToEnum } from "utils/mapStatusToEnum";
import { isUndefined } from "utils/index";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import useFetchIpfsJson from "hooks/useFetchIpfsJson";
import { TransactionDetailsFragment } from "src/graphql/graphql";
import { StyledSkeleton, StyledSkeletonTitle } from "../StyledSkeleton";

const StyledCard = styled(Card)`
  width: 100%;
  height: 260px;
`;

const StyledListItem = styled(Card)`
display: flex;
flex-grow: 1;
width: 100%;
height: 82px;
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
  align-items: center;
  width: 100%;
`;

const ListTitle = styled.div`
`;

const StyledTitle = styled.h3`
  margin: 0;
`;

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
  seller,
  buyer,
  amount,
  asset,
}) => {
  const transactionInfo = useFetchIpfsJson(transactionUri);
  const { isList } = useIsList();
  const nativeTokenSymbol = useNativeTokenSymbol();
  const title = transactionInfo?.title;
  const navigate = useNavigate();

  const currentStatusEnum = mapStatusToEnum(status);

  return (
    <>
      {!isList || overrideIsList ? (
        <StyledCard hover onClick={() => navigate(`/myTransactions/${id.toString()}`)}>
          <StatusBanner id={parseInt(id)} status={currentStatusEnum} />
          <CardContainer>
            {!isUndefined(title) ? <StyledTitle>{title}</StyledTitle> : <StyledSkeleton />}
            <TransactionInfo
              amount={formatEther(amount)}
              token={asset === "native" ? nativeTokenSymbol : ""}
              buyerAddress={buyer}
              sellerAddress={seller}
              deadlineDate={new Date(deadline * 1000).toLocaleString()}
              isPreview={false}
            />
          </CardContainer>
        </StyledCard>
      ) : (
        <StyledListItem hover onClick={() => navigate(`/myTransactions/${id.toString()}`)}>
          <StatusBanner isCard={false} id={parseInt(id)} status={currentStatusEnum} />
          <ListContainer>
            {!isUndefined(title) ? (
              <ListTitle>
                <TruncatedTitle text={title} maxLength={50} />
              </ListTitle>
            ) : (
              <StyledSkeletonTitle />
            )}
            <TransactionInfo
              amount={formatEther(amount)}
              token={asset === "native" ? nativeTokenSymbol : ""}
              buyerAddress={buyer}
              sellerAddress={seller}
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