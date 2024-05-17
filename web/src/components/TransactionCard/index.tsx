import React from "react";
import styled from "styled-components";
import { responsiveSize } from "styles/responsiveSize";
import { Card } from "@kleros/ui-components-library";
import { formatEther } from "viem";
import { useIsList } from "context/IsListProvider";
import { mapStatusToEnum } from "utils/mapStatusToEnum";
import { isUndefined } from "utils/index";
import { StyledSkeleton, StyledSkeletonTitle } from "../StyledSkeleton";
import TransactionInfo from "../TransactionInfo";
import StatusBanner from "./StatusBanner";
import { useNavigateAndScrollTop } from "hooks/useNavigateAndScrollTop";
import { useNativeTokenSymbol } from "hooks/useNativeTokenSymbol";
import { useERC20TokenSymbol } from "hooks/useERC20TokenSymbol";
import useFetchIpfsJson from "hooks/useFetchIpfsJson";
import { TransactionDetailsFragment } from "src/graphql/graphql";

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

const ListTitle = styled.div``;

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
  token,
}) => {
  const transactionInfo = useFetchIpfsJson(transactionUri);
  const { isList } = useIsList();
  const nativeTokenSymbol = useNativeTokenSymbol();
  const { erc20TokenSymbol } = useERC20TokenSymbol(token);
  const title = transactionInfo?.title;
  const navigateAndScrollTop = useNavigateAndScrollTop();

  const currentStatusEnum = mapStatusToEnum(status);

  return (
    <>
      {!isList || overrideIsList ? (
        <StyledCard hover onClick={() => navigateAndScrollTop(`/my-transactions/${id.toString()}`)}>
          <StatusBanner id={parseInt(id)} status={currentStatusEnum} />
          <CardContainer>
            {!isUndefined(title) ? <StyledTitle>{title}</StyledTitle> : <StyledSkeleton />}
            <TransactionInfo
              amount={formatEther(amount)}
              assetSymbol={!token ? nativeTokenSymbol : erc20TokenSymbol}
              buyerAddress={buyer}
              sellerAddress={seller}
              deadlineDate={new Date(deadline * 1000).toLocaleString()}
              isPreview={false}
            />
          </CardContainer>
        </StyledCard>
      ) : (
        <StyledListItem hover onClick={() => navigateAndScrollTop(`/my-transactions/${id.toString()}`)}>
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
              assetSymbol={!token ? nativeTokenSymbol : erc20TokenSymbol}
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
