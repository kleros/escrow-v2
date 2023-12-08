import React from "react";
import styled, { css } from "styled-components";
import { landscapeStyle } from "styles/landscapeStyle";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { formatEther } from "viem";
import { isUndefined } from "utils/index";
import { calcMinMax } from "utils/calcMinMax";
import PolicyIcon from "svgs/icons/policy.svg";
import { Card } from "@kleros/ui-components-library";
import Header from "./Header";
import NavigationButtons from "../NavigationButtons";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const StyledCard = styled(Card)`
  height: auto;
  min-height: 100px;
  width: 84vw;
  display: flex;
  flex-direction: column;
  gap: calc(16px + (32 - 16) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  padding: calc(16px + (32 - 16) * (min(max(100vw, 375px), 1250px) - 375px) / 875);

  > h1 {
    margin: 0;
  }

  > hr {
    width: 100%;
  }

  ${landscapeStyle(
    () => css`
      width: ${calcMinMax(342, 1178)};
    `
  )}
`;

const QuestionAndDescription = styled.div`
  display: flex;
  flex-direction: column;
  > * {
    margin: 0px;
  }
`;

const VotingOptions = styled(QuestionAndDescription)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Answers = styled.div`
  display: flex;
  flex-direction: column;

  span {
    margin: 0px;
    display: flex;
    gap: 8px;
  }
`;

const ShadeArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: calc(16px + (20 - 16) * (min(max(100vw, 375px), 1250px) - 375px) / 875)
    calc(16px + (32 - 16) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
  margin-top: 16px;
  background-color: ${({ theme }) => theme.mediumBlue};
  > p {
    margin-top: 0;
    margin-bottom: 16px;
    ${landscapeStyle(
      () => css`
        margin-bottom: 0;
      `
    )};
  }

  ${landscapeStyle(
    () => css`
      flex-direction: row;
      justify-content: space-between;
    `
  )};
`;

const StyledA = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  > svg {
    width: 16px;
    fill: ${({ theme }) => theme.primaryBlue};
  }
`;

const LinkContainer = styled.div`
  display: flex;
  gap: calc(8px + (24 - 8) * (min(max(100vw, 375px), 1250px) - 375px) / 875);
`;

const Divider = styled.hr`
  display: flex;
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.stroke};
  margin: 0;
`;

const StyledP = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.primaryBlue};
`;

const Preview: React.FC = () => {
  return (
    <Container>
      <Header />
      <StyledCard>
        <h1>Escrow with John.</h1>
        <QuestionAndDescription>
          <ReactMarkdown>Test</ReactMarkdown>
          <ReactMarkdown>Filler Text</ReactMarkdown>
        </QuestionAndDescription>
        Building
        <VotingOptions>
          <h3>Voting Options</h3>
          <Answers>
            <small>Option {1 + 1}:</small>
            <label>hi</label>
          </Answers>
        </VotingOptions>
        <Divider />
        <>
          {/* <Verdict arbitrable={arbitrable} /> */}
          <Divider />
        </>
        {/* <TransactionInfo
          isPreview={true}
          overrideIsList={true}
          courtId={court?.id}
          court={courtName}
          round={localRounds?.length}
          {...{ rewards, category }}
        /> */}
      </StyledCard>
      <NavigationButtons prevRoute="/newTransaction/notifications" nextRoute="/newTransaction/deliverable" />
    </Container>
  );
};

export default Preview;
