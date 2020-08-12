import React, { useState, useCallback } from "react";
import DatePicker from "react-datepicker";

const Date = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const ExampleCustomInput = useCallback(
    ({ value, onClick }) => (
      <button className="custom-date" onClick={onClick}>
        {value}
      </button>
    ),
    []
  );
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      customInput={<ExampleCustomInput />}
    />
  );
};

export default Date;
