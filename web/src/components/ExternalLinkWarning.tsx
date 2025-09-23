import React, { useRef } from "react";
import styled from "styled-components";
import { useClickAway } from "react-use";
import { Button } from "@kleros/ui-components-library";
import { Overlay } from "components/Overlay";
import { StyledModal } from "pages/MyTransactions/Modal/StyledModal";

const WarningModal = styled(StyledModal)`
  width: 400px;
  max-width: 90vw;
`;

const Title = styled.h3`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.primaryText};
  font-size: 20px;
  font-weight: 600;
`;

const Message = styled.p`
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.secondaryText};
  font-size: 16px;
  line-height: 1.5;
`;

const UrlContainer = styled.div`
  background-color: ${({ theme }) => theme.lightBackground};
  border: 1px solid ${({ theme }) => theme.stroke};
  border-radius: 4px;
  padding: 8px 12px;
  margin: 16px 0 24px 0;
  word-break: break-all;
  font-family: monospace;
  font-size: 14px;
  color: ${({ theme }) => theme.primaryText};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  width: 100%;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.primaryText};
  border: 1px solid ${({ theme }) => theme.stroke};

  &:hover {
    background-color: ${({ theme }) => theme.lightGrey};
  }
`;

const ConfirmButton = styled(Button)`
  background-color: ${({ theme }) => theme.primaryBlue};
  color: ${({ theme }) => theme.whiteBackground};

  &:hover {
    background-color: ${({ theme }) => theme.secondaryBlue};
  }
`;

interface IExternalLinkWarning {
  isOpen: boolean;
  url: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExternalLinkWarning: React.FC<IExternalLinkWarning> = ({ isOpen, url, onConfirm, onCancel }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickAway(modalRef, onCancel);

  if (!isOpen) return null;

  return (
    <>
      <Overlay />
      <WarningModal ref={modalRef}>
        <Title>External Link Warning</Title>
        <Message>
          You are about to navigate to an external website. Please verify the URL before proceeding to ensure your safety.
        </Message>
        <UrlContainer>{url}</UrlContainer>
        <ButtonContainer>
          <CancelButton text="Cancel" onClick={onCancel} />
          <ConfirmButton text="Continue" onClick={onConfirm} />
        </ButtonContainer>
      </WarningModal>
    </>
  );
};

export default ExternalLinkWarning;