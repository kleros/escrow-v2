import React from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import { responsiveSize } from "styles/responsiveSize";

const SkeletonTransactionCardContainer = styled.div`
  width: 100%;
`;

const StyledSkeletonTransactionCard = styled(Skeleton)`
  height: ${responsiveSize(270, 296)};
`;

const StyledSkeletonTransactionListItem = styled(Skeleton)`
  height: 80px;
`;

const StyledSkeletonEvidenceCard = styled(Skeleton)`
  height: 146px;
  width: 76vw;
`;

export const StyledSkeletonTitle = styled(Skeleton)`
  margin-left: 92px;
  width: 200px;
`;

export const SkeletonTransactionCard = () => (
  <SkeletonTransactionCardContainer>
    <StyledSkeletonTransactionCard />
  </SkeletonTransactionCardContainer>
);

export const SkeletonTransactionListItem = () => <StyledSkeletonTransactionListItem />;

export const SkeletonEvidenceCard = () => <StyledSkeletonEvidenceCard />;
