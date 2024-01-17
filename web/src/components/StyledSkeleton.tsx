import React from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import { responsiveSize } from "styles/responsiveSize";

export const StyledSkeleton = styled(Skeleton)`
  z-index: 0;
`;

const SkeletonTransactionCardContainer = styled.div`
  width: 100%;
`;

const StyledSkeletonTransactionCard = styled(Skeleton)`
  height: ${responsiveSize(270, 296)};
`;

const StyledSkeletonTransactionListItem = styled(Skeleton)`
  height: 62px;
`;

const StyledSkeletonEvidenceCard = styled(Skeleton)`
  height: 146px;
  width: 76vw;
`;

const StyledSkeletonButton = styled(Skeleton)`
  width: 168px;
  height: 45px;
`;

export const SkeletonTransactionCard = () => (
  <SkeletonTransactionCardContainer>
    <StyledSkeletonTransactionCard />
  </SkeletonTransactionCardContainer>
);

export const SkeletonTransactionListItem = () => <StyledSkeletonTransactionListItem />;

export const SkeletonEvidenceCard = () => <StyledSkeletonEvidenceCard />;

export const SkeletonButton = () => <StyledSkeletonButton />;
