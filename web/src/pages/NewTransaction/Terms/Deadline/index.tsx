import React from "react";
import styled from "styled-components";
import Header from "pages/NewTransaction/Header";
import { Datepicker } from "@kleros/ui-components-library";
import NavigationButtons from "../../NavigationButtons";
import { useNewTransactionContext } from "context/NewTransactionContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledDatepicker = styled(Datepicker)``;

const Deadline: React.FC = () => {
  const { setDeadline } = useNewTransactionContext();

  const handleDateSelect = (date: Date) => {
    setDeadline(date);
  };

  return (
    <Container>
      <Header text="Delivery Deadline" />
      <StyledDatepicker time onSelect={handleDateSelect} />
      <NavigationButtons prevRoute="/new-transaction/payment" nextRoute="/new-transaction/notifications" />
    </Container>
  );
};

export default Deadline;
