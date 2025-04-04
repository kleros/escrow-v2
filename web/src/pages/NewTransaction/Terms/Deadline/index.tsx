import React from "react";
import styled from "styled-components";
import Header from "pages/NewTransaction/Header";
import { Datepicker } from "@kleros/ui-components-library";
import NavigationButtons from "../../NavigationButtons";
import { useNewTransactionContext } from "context/NewTransactionContext";
import { DateValue, getLocalTimeZone, now } from "@internationalized/date";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledDatepicker = styled(Datepicker)``;

const Deadline: React.FC = () => {
  const { setDeadline } = useNewTransactionContext();

  const handleDateSelect = (date: DateValue | null) => {
    if (!date) return;
    setDeadline(date.toDate(getLocalTimeZone()).toString());
  };

  return (
    <Container>
      <Header text="Delivery Deadline" />
      <StyledDatepicker time onChange={handleDateSelect} minValue={now(getLocalTimeZone())} />
      <NavigationButtons prevRoute="/new-transaction/payment" nextRoute="/new-transaction/notifications" />
    </Container>
  );
};

export default Deadline;
