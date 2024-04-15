import React from "react";
import styled from "styled-components";
import Header from "pages/NewTransaction/Header";
import EmailField from "./EmailField";
import NavigationButtons from "../../NavigationButtons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Notifications: React.FC = () => {
  return (
    <Container>
      <Header text="Subscribe for Email Notifications" />
      <EmailField />
      <NavigationButtons prevRoute="/new-transaction/deadline" nextRoute="/new-transaction/preview" />
    </Container>
  );
};
export default Notifications;
