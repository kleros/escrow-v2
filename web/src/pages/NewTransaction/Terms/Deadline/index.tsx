import React from "react";
import styled from "styled-components";
import Header from "components/Header";
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
    console.log("Selected Date:", date);
    setDeadline(date);
  };

  return (
    <Container>
      <Header text="Delivery Deadline" />
      <StyledDatepicker time onSelect={handleDateSelect} />
      <NavigationButtons prevRoute="/newTransaction/payment" nextRoute="/newTransaction/notifications" />
    </Container>
  );
};

export default Deadline;
