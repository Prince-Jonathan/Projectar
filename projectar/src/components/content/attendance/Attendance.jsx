import React, { useState, useMemo, forwardRef, useRef } from "react";
import { useHistory, useRouteMatch, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import Table from "../../table/Table";
import DatePicker from "react-datepicker";

import Slate from "../slate/Slate";
import { isMobile } from "../../Responsive";
import SliderFilter from "../../table/filters/SliderFilter";
import ColumnFilter from "../../table//filters/ColumnFilter";
import Caption from "../../content/Caption";
import Register from "./Register";
import Button from "../uiElements/Button";

// const Button = styled.button`
//   border: none;
//   color: white;
//   font-size: 12px;
//   text-align: center;
//   cursor: pointer;
//   margin: 0 5px 0 5px;
//   border-radius: 12px;
//   background-color: #10292e;

//   &:focus {
//     box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
//     outline: none;
//   }
// `;

const Attendance = (props) => {
  const history = useHistory();
  const { url, path } = useRouteMatch();

  // const [date, setDate] = useState(new Date());
  // const [isPresents, setIsPresents] = useState([]);
  // const [signIns, setSignIns] = useState([]);
  // const [signOuts, setSignOuts] = useState([]);
  // const [tandts, setTandts] = useState([]);
  // const [attendance, setAttendance] = useState([]);

  // const handleIsPresent = React.useCallback(
  //   (data) => {
  //     let prev = [...isPresents];
  //     let personnel = prev.filter((personnel) => personnel.id === data[0].id);
  //     if (personnel.length !== 0) {
  //       const index = prev.indexOf(personnel[0]);
  //       prev[index] = { ...data[0] };
  //       return setIsPresents(prev);
  //     }
  //     const update = prev.concat(data);
  //     setIsPresents(update);
  //   },
  //   [isPresents]
  // );

  // const handleSetSignIn = React.useCallback(
  //   (data) => {
  //     let prev = [...signIns];
  //     let personnel = prev.filter((personnel) => personnel.id === data[0].id);
  //     if (personnel.length !== 0) {
  //       const index = prev.indexOf(personnel[0]);
  //       prev[index] = { ...data[0] };
  //       return setSignIns(prev);
  //     }
  //     const update = prev.concat(data);
  //     setSignIns(update);
  //   },
  //   [signIns]
  // );
  // const handleSetSignOut = React.useCallback(
  //   (data) => {
  //     let prev = [...signOuts];
  //     let personnel = prev.filter((personnel) => personnel.id === data[0].id);
  //     if (personnel.length !== 0) {
  //       const index = prev.indexOf(personnel[0]);
  //       prev[index] = { ...data[0] };
  //       return setSignOuts(prev);
  //     }
  //     const update = prev.concat(data);
  //     setSignOuts(update);
  //   },
  //   [signOuts]
  // );
  // const handleSetTandts = React.useCallback(
  //   (data) => {
  //     let prev = [...tandts];
  //     let personnel = prev.filter((personnel) => personnel.id === data[0].id);
  //     if (personnel.length !== 0) {
  //       const index = prev.indexOf(personnel[0]);
  //       prev[index] = { ...data[0] };
  //       return setTandts(prev);
  //     }
  //     const update = prev.concat(data);
  //     setTandts(update);
  //   },
  //   [tandts]
  // );
  const MainDate = ({ value, onClick }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      {!isMobile && (
        <i
          style={{ position: "relative", top: -5, margin: 5 }}
          className="fa fa-calendar"
          aria-hidden="true"
        />
      )}
      <label>
        {isMobile && (
          <i
            style={{ position: "relative", margin: 5 }}
            className="fa fa-calendar"
            aria-hidden="true"
          />
        )}
        <span style={{ color: "white" }}>Register</span> Date
        <input
          style={{
            cursor: "pointer",
            color: "black",
            backgroundColor: "white",
            width: 110,
            border: "0.25px solid black",
            borderRadius: 12,
            margin: 4,
            paddingLeft: 5,
          }}
          required
          onClick={onClick}
          value={value}
        />
        <Button
          onClick={() => {
            history.push(`${url}/edit`);
          }}
          bright
        >
          Edit Register
        </Button>
      </label>
    </div>
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

  const data = useMemo(() => props.attendance, [props.attendance]);
  const columns = useMemo(
    () => {
      let _temp = [
        {
          Header: "Time In",
          accessor: "time_in",
          Filter: isMobile ? () => null : ColumnFilter,
        },
        {
          Header: "Time Out",
          accessor: "time_out",
          Filter: isMobile ? () => null : ColumnFilter,
        },
        {
          Header: "Personnel",
          accessor: "personnel_name",
          Filter: isMobile ? () => null : ColumnFilter,
        },

        {
          Header: "T & T (GH\u20B5)",
          accessor: "t_and_t",
          Filter: isMobile ? () => null : SliderFilter,
        },
        {
          id: "lunch",
          Header: "Lunch",
          Cell: ({ row }) => (
            <div>
              <input
                type="checkbox"
                checked={row.original.lunch}
                onClick={() => false}
              />
            </div>
          ),
        },
      ];
      return isMobile ? _temp.slice(2) : _temp;
    },
    [isMobile]
  );
  // const IndeterminateCheckbox = forwardRef(
  //   ({ indeterminate, ...rest }, ref) => {
  //     const defaultRef = useRef();
  //     const resolvedRef = ref || defaultRef;

  //     React.useEffect(
  //       () => {
  //         resolvedRef.current.indeterminate = indeterminate;
  //       },
  //       [resolvedRef, indeterminate]
  //     );

  //     return (
  //       <>
  //         <input type="checkbox" ref={resolvedRef} {...rest} />
  //       </>
  //     );
  //   }
  // );
  // let lunchList;
  // const extractLunchData = (data) => {
  //   lunchList = data.map((row) => row.original.id);
  // };
  // const handleSubmit = () => {
  //   let personnelID;
  //   let body = data.map((personnel) => {
  //     personnelID = personnel.id;
  //     let isPresent;
  //     if (isPresents.length) {
  //       isPresent = isPresents.filter(
  //         (isPresent) => isPresent.id === personnel.id
  //       );
  //     }
  //     try {
  //       if (isPresent[0].isPresent) {
  //         const signIn = signIns.filter((signIn) => signIn.id === personnel.id);
  //         const signOut = signOuts.filter(
  //           (signOut) => signOut.id === personnel.id
  //         );
  //         const tandt = tandts.filter((tandt) => tandt.id === personnel.id);
  //         const lunch = lunchList
  //           ? lunchList.find((personnelID) => personnelID === personnel.id)
  //             ? true
  //             : false
  //           : false;
  //         return {
  //           signIn: null,
  //           signOut: null,
  //           tandt: null,
  //           ...signIn[0],
  //           ...signOut[0],
  //           ...tandt[0],
  //           ...isPresent[0],
  //           lunch: lunch,
  //           id: personnelID,
  //         };
  //       }
  //     } catch (err) {}
  //     return {
  //       signIn: null,
  //       signOut: null,
  //       tandt: null,
  //       isPresent: false,
  //       lunch: false,
  //       id: personnelID,
  //     };
  //   });
  //   const register = { date: new Date(date).toLocaleDateString(), body: body };
  //   props.onAlert("info", "Saving...", {
  //     timeout: 3000,
  //     position: "bottom center",
  //   });
  //   props
  //     .postData(`/api/attendance/${props.projectID}`, register)
  //     .then(({ data }) =>
  //       data.success
  //         ? props.onAlert("success", "Register Saved", {
  //             timeout: 5000,
  //             position: "bottom center",
  //           })
  //         : props.onAlert("error", "Failed to Save Register", {
  //             timeout: 3000,
  //             position: "bottom center",
  //           })
  //     );
  // };

  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <Caption flabel="Attendance" slabel="List" />
          <Caption
            flabel={
              props.project
                ? props.project[0]
                  ? props.project[0].name
                  : null
                : null
            }
            style={{ fontSize: 15, color: "white" }}
          />
          <DatePicker
            selected={props.date}
            onChange={(date) => {
              props.onHandleSetAttendanceDate(date);
            }}
            customInput={<MainDate />}
            withPortal={true}
          />
          <Slate>
            <Table data={data} columns={columns} />
          </Slate>
        </Route>
        <Route path={`${path}/edit`}>
          <Register
            personnel={props.personnel}
            postData={props.postData}
            projectID={props.projectID}
            project={props.project}
            onAlert={props.onAlert}
            attendance={props.attendance}
            date={props.date}
            onHandleSetAttendanceDate={props.onHandleSetAttendanceDate}
            onHandleToggleFetchAttendance={props.onHandleToggleFetchAttendance}
          />
        </Route>
      </Switch>
    </div>
  );
};

export default Attendance;
