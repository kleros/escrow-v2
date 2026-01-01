import React from "react";
import Header from "pages/NewTransaction/Header";
import { Datepicker } from "@kleros/ui-components-library";
import { DateValue, getLocalTimeZone, now, parseAbsoluteToLocal, parseZonedDateTime } from "@internationalized/date";
import NavigationButtons from "../../NavigationButtons";
import { useNewTransactionContext } from "context/NewTransactionContext";

const Deadline: React.FC = () => {
  const { deadline, setDeadline } = useNewTransactionContext();

  const handleDateChange = (value: DateValue | null) => {
    if (!value) {
      setDeadline("");
      return;
    }

    const formattedDeadline = parseZonedDateTime(value.toString()).toDate().toISOString();
    setDeadline(formattedDeadline);
  };

  return (
    <div className="flex flex-col items-center">
      <Header text="Delivery Deadline" />
      <Datepicker
        time
        defaultValue={deadline ? parseAbsoluteToLocal(deadline) : undefined}
        minValue={now(getLocalTimeZone())}
        onChange={handleDateChange}
      />
      <NavigationButtons prevRoute="/new-transaction/payment" nextRoute="/new-transaction/notifications" />
    </div>
  );
};

export default Deadline;
