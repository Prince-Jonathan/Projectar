import React, { useState, useMemo, forwardRef, useRef } from "react";
import styled from "styled-components";
import Table from "../../table/Table";
import DatePicker from "react-datepicker";

import Slate from "../slate/Slate";
import { isMobile } from "../../Responsive";

const Button = styled.button`
  border: none;
  color: white;
  font-size: 12px;
  text-align: center;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: 0 5px 0 5px;
  border-radius: 12px;
  background-color: #10292e;

  &::active {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
  }
`;

const Attendance = (props) => {
  const [startTimes, setStartTimes] = useState([]);
  const [endTimes, setEndTimes] = useState([]);

  const handleSetStartTimes = React.useCallback(
    (data) => {
      let prev = [...startTimes];
      let personnel = prev.filter(
        (personnel) => personnel.personnelID === data[0].personnelID
      );
      if (personnel.length !== 0) {
        const index = prev.indexOf(personnel[0]);
        prev[index] = { ...data[0] };
        return setStartTimes(prev);
      }
      const update = prev.concat(data);
      setStartTimes(update);
    },
    [startTimes]
  );
  const handleSetEndTimes = React.useCallback(
    (data) => {
      let prev = [...endTimes];
      let personnel = prev.filter(
        (personnel) => personnel.personnelID === data[0].personnelID
      );
      if (personnel.length !== 0) {
        const index = prev.indexOf(personnel[0]);
        prev[index] = { ...data[0] };
        return setEndTimes(prev);
      }
      const update = prev.concat(data);
      setEndTimes(update);
    },
    [endTimes]
  );
  const CustomInput = ({ value, onClick }) => (
    <Button
      type="button"
      style={{ cursor: "pointer" }}
      required
      className="date"
      onClick={onClick}
      value={value}
    >
      {value}
    </Button>
  );

  const data = useMemo(() => props.personnel, [props.personnel]);
  const columns = useMemo(
    () => [
      {
        id: "selection",
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      {
        id: "time",
        Header: "Time",
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }) => {
          //holding state for each selector and forwarding the state to parent. This is because the selector unmounts
          //it is not possible to update state from parent
          const [startTime, setStartTime] = useState(() => {
            try {
              return startTimes.filter(
                (startTime) => startTime.personnelID === row.original.id
              )[0].date;
            } catch (err) {}
          });
          const [endTime, setEndTime] = useState(() => {
            try {
              return endTimes.filter(
                (endTime) => endTime.personnelID === row.original.id
              )[0].date;
            } catch (err) {}
          });

          return (
            <div style={{ display: "flex" }}>
              <DatePicker
                selected={startTime}
                onChange={(date) => {
                  setStartTime(date);
                  handleSetStartTimes([
                    {
                      personnelID: row.original.id,
                      date: date,
                    },
                  ]);
                }}
                customInput={<CustomInput />}
                withPortal={isMobile}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={5}
                timeCaption="Time In"
                dateFormat="h:mm aa"
              />
              <DatePicker
                selected={endTime}
                onChange={(date) => {
                  setEndTime(date);
                  handleSetEndTimes([
                    {
                      personnelID: row.original.id,
                      date: date,
                    },
                  ]);
                }}
                customInput={<CustomInput />}
                withPortal={isMobile}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={5}
                timeCaption="Time Out"
                dateFormat="h:mm aa"
              />
            </div>
          );
        },
      },
      { Header: "First Name", accessor: "first_name" },
      { Header: "Last Name", accessor: "last_name" },
      {
        id: "T & T",
        Header: "T & T",
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }) => {
          const [startDate, setStartDate] = useState(new Date());
          return <input type="text" />;
        },
      },
    ],
    [startTimes, endTimes]
  );
  const IndeterminateCheckbox = forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = useRef();
      const resolvedRef = ref || defaultRef;

      React.useEffect(
        () => {
          resolvedRef.current.indeterminate = indeterminate;
        },
        [resolvedRef, indeterminate]
      );

      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      );
    }
  );
  let rows;
  const extractData = (data) => {
    rows = data.map((row) => row.original.id);
  };
  const handleSubmit = () => {
    const body = {
      date: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
      personnel: rows,
    };
    props
      .postData(`/api/attendance/${props.projectID}`, body)
      .then((data) => console.log(data));
    console.log(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      )
    );
  };

  return (
    <React.Fragment>
      <Slate>
        <Table
          data={data}
          columns={columns}
          selectedRows={(data) => extractData(data)}
        />
      </Slate>
      <button onClick={handleSubmit}>click</button>
    </React.Fragment>
  );
};

export default Attendance;
