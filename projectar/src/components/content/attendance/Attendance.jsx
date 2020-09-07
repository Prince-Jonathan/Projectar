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
  const [date, setDate] = useState(new Date());
  const [signIns, setSignIns] = useState([]);
  const [signOuts, setSignOuts] = useState([]);
  const [tandts, setTandts] = useState([]);

  const handleSetSignIn = React.useCallback(
    (data) => {
      let prev = [...signIns];
      let personnel = prev.filter(
        (personnel) => personnel.id === data[0].id
      );
      if (personnel.length !== 0) {
        const index = prev.indexOf(personnel[0]);
        prev[index] = { ...data[0] };
        return setSignIns(prev);
      }
      const update = prev.concat(data);
      setSignIns(update);
    },
    [signIns]
  );
  const handleSetSignOut = React.useCallback(
    (data) => {
      let prev = [...signOuts];
      let personnel = prev.filter(
        (personnel) => personnel.id === data[0].id
      );
      if (personnel.length !== 0) {
        const index = prev.indexOf(personnel[0]);
        prev[index] = { ...data[0] };
        return setSignOuts(prev);
      }
      const update = prev.concat(data);
      setSignOuts(update);
    },
    [signOuts]
  );
  const handleSetTandts = React.useCallback(
    (data) => {
      let prev = [...tandts];
      let personnel = prev.filter(
        (personnel) => personnel.id === data[0].id
      );
      if (personnel.length !== 0) {
        const index = prev.indexOf(personnel[0]);
        prev[index] = { ...data[0] };
        return setTandts(prev);
      }
      const update = prev.concat(data);
      setTandts(update);
    },
    [tandts]
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

  const data = useMemo(
    () =>
      props.personnel.map((personnel) => {
        const { first_name: firstName, last_name: lastName, id } = personnel;
        return { name: `${firstName} ${lastName}`, id: id };
      }),
    [props.personnel]
  );
  const columns = useMemo(
    () => [
      {
        id: "time",
        Header: "Time",
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }) => {
          //holding state for each selector and forwarding the state to parent. This is because the selector unmounts
          //it is not possible to update state from parent
          const [signIn] = useState(() => {
            try {
              return signIns.filter(
                (signIn) => signIn.id === row.original.id
              )[0].signIn;
            } catch (err) {}
          });
          const [signOut] = useState(() => {
            try {
              return signOuts.filter(
                (signOut) => signOut.id === row.original.id
              )[0].signOut;
            } catch (err) {}
          });
          const timeIn = signIn ? signIn : "06:00:00";
          const timeOut = signOut ? signOut : "06:00:00";
          return (
            <div style={{ display: "flex" }}>
              <DatePicker
                //setting dummy date "01/01/01 "value for the sake of  datePicker Library
                selected={new Date("01/01/01 " + timeIn)}
                onChange={(date) => {
                  handleSetSignIn([
                    {
                      id: row.original.id,
                      signIn: new Date(date).toLocaleTimeString(),
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
                selected={new Date("01/01/01 " + timeOut)}
                onChange={(date) => {
                  handleSetSignOut([
                    {
                      id: row.original.id,
                      signOut: new Date(date).toLocaleTimeString(),
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
      { Header: "Name", accessor: "name" },
      {
        id: "lunch",
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            <span> Lunch</span>
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
        id: "T & T",
        Header: "T & T (GH\u20B5)",

        Cell: ({ row }) => {
          const [tandt, setTandt] = useState(() => {
            try {
              return tandts.filter(
                (tandt) => tandt.id === row.original.id
              )[0].tandt;
            } catch (err) {}
          });
          return (
            <input
              type="number"
              value={tandt}
              style={{ width: 60 }}
              onChange={(e) => {
                setTandt(e.target.value);
              }}
              onBlur={() =>
                handleSetTandts([
                  { id: row.original.id, tandt: tandt },
                ])
              }
            />
          );
        },
      },
    ],
    [signIns, signOuts, tandts]
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
  let lunchList;
  const extractLunchData = (data) => {
    lunchList = data.map((row) => row.original.id);
  };
  const handleSubmit = () => {
    let personnelID;
    let body = data.map((personnel) => {
      personnelID = personnel.id;
      const signIn = signIns.filter(
        (signIn) => signIn.id === personnel.id
      );
      const signOut = signOuts.filter(
        (signOut) => signOut.id === personnel.id
      );
      const tandt = tandts.filter(
        (tandt) => tandt.id === personnel.id
      );
      const lunch = lunchList
        ? lunchList.find((personnelID) => personnelID === personnel.id)
          ? true
          : false
        : false;
      return {
        signIn: null,
        signOut: null,
        tandt: null,
        ...signIn[0],
        ...signOut[0],
        ...tandt[0],
        lunch: lunch,
        id: personnelID,
      };
    });
    const register = { date: new Date(date).toLocaleDateString(), body: body };
    console.log(register);
    props
      .postData(`/api/attendance/${props.projectID}`, body)
      .then((data) => console.log(data));
  };

  return (
    <div>
      <DatePicker
        selected={date}
        onChange={(date) => {
          setDate(date);
        }}
        customInput={<CustomInput />}
        withPortal={true}
      />
      <Slate>
        <Table
          data={data}
          columns={columns}
          selectedRows={(data) => extractLunchData(data)}
        />
      </Slate>
      <button onClick={handleSubmit}>click</button>
    </div>
  );
};

export default Attendance;
