import React from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";

const StyledSkeletonEvidenceCard = styled(Skeleton)`
  height: 146px;
  width: 76vw;
`;

export const SkeletonEvidenceCard = () => <StyledSkeletonEvidenceCard />;
