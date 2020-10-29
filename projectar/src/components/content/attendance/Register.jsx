import React, { useState, useEffect, useMemo, forwardRef, useRef } from "react";
import { useHistory, useLocation, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import Table from "../../table/Table";
import DatePicker from "react-datepicker";

import Slate from "../slate/Slate";
import { isMobile } from "../../Responsive";
import Caption from "../../content/Caption";
import Submit from "../uiElements/Button";

const Button = styled.button`
  border: none;
  color: white;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  margin: 0 5px 0 5px;
  border-radius: 12px;
  background-color: #10292e;

  &:focus {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
    outline: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? "row" : "column")};
  justify-content: space-around;
  flex-wrap: wrap;
`;

const Register = (props) => {
  const history = useHistory();
  const { url, path } = useLocation();

  // const [date, setDate] = useState(new Date());
  const [isPresents, setIsPresents] = useState([]);
  const [signIns, setSignIns] = useState([]);
  const [signOuts, setSignOuts] = useState([]);
  const [lunchs, setLunchs] = useState([]);
  const [tandts, setTandts] = useState([]);
  useEffect(
    () => {
      let isPresents = props.attendance.map((data) => {
        return {
          id: data.personnel_id,
          isPresent: data.is_present,
        };
      });
      handleIsPresent(isPresents);

      let signIns = props.attendance.map((data) => {
        return {
          id: data.personnel_id,
          signIn: new Date("01/01/1991 " + data.time_in).toLocaleTimeString(
            "en-US",
            {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        };
      });
      handleSetSignIn(signIns);

      let signOuts = props.attendance.map((data) => {
        return {
          id: data.personnel_id,
          signOut: new Date("01/01/1991 " + data.time_out).toLocaleTimeString(
            "en-US",
            {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
        };
      });
      handleSetSignOut(signOuts);
      let tandts = props.attendance.map((data) => {
        return { id: data.personnel_id, tandt: data.t_and_t };
      });

      let lunchs = props.attendance.map((data) => {
        return {
          id: data.personnel_id,
          lunch: data.lunch,
        };
      });
      handleHadLunch(lunchs);

      handleSetTandts(tandts);
    },
    [props.attendance]
  );

  const handleIsPresent = React.useCallback(
    (data) => {
      let prev = [...isPresents];
      let personnel = prev.filter((personnel) => personnel.id === data[0].id);
      if (personnel.length !== 0) {
        const index = prev.indexOf(personnel[0]);
        prev[index] = { ...data[0] };
        return setIsPresents(prev);
      }
      const update = prev.concat(data);
      setIsPresents(update);
    },
    [isPresents]
  );

  const handleSetSignIn = React.useCallback(
    (data) => {
      let prev = [...signIns];
      let personnel = prev.filter((personnel) => personnel.id === data[0].id);
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
      let personnel = prev.filter((personnel) => personnel.id === data[0].id);
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
  const handleHadLunch = React.useCallback(
    (data) => {
      let prev = [...lunchs];
      let personnel = prev.filter((personnel) => personnel.id === data[0].id);
      if (personnel.length !== 0) {
        const index = prev.indexOf(personnel[0]);
        prev[index] = { ...data[0] };
        return setLunchs(prev);
      }
      const update = prev.concat(data);
      setLunchs(update);
    },
    [lunchs]
  );

  const handleSetTandts = React.useCallback(
    (data) => {
      let prev = [...tandts];
      let personnel = prev.filter((personnel) => personnel.id === data[0].id);
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
        <Submit bright onClick={handleSubmit}>
          Submit
        </Submit>
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

  // const data = useMemo(
  //   () =>
  //     props.personnel.map((personnel) => {
  //       const { first_name: firstName, last_name: lastName, id } = personnel;
  //       return { name: `${firstName} ${lastName}`, id: id };
  //     }),
  //   [props.personnel]
  // );
  const data = props.personnel;

  const columns = useMemo(
    () => {
      let forDesktop = [
        {
          id: "isPresent",
          Cell: ({ row }) => {
            const [isPresent] = useState(() => {
              try {
                return isPresents.filter(
                  (isPresent) => isPresent.id === row.original.id
                )[0].isPresent;
              } catch (err) {}
            });

            const isPersonnelPresent = isPresent ? isPresent : false;
            return (
              <input
                type="checkbox"
                name="isPresent"
                style={{ cursor: "pointer" }}
                defaultChecked={isPersonnelPresent}
                onChange={() => {
                  handleIsPresent([
                    {
                      id: row.original.id,
                      isPresent: !isPersonnelPresent,
                    },
                  ]);
                }}
              />
            );
          },
        },
        {
          Header: "Time In",
          Cell: ({ row }) => {
            //holding state for each selector and forwarding the state to parent. This is because the selector unmounts
            //it is not possible to update state from parent
            const [signIn, setSignIn] = useState(() => {
              try {
                return signIns.filter(
                  (signIn) => signIn.id === row.original.id
                )[0].signIn;
              } catch (err) {}
            });

            const [isPresent] = useState(() => {
              try {
                return isPresents.filter(
                  (isPresent) => isPresent.id === row.original.id
                )[0].isPresent;
              } catch (err) {}
            });

            const isPersonnelPresent = isPresent ? isPresent : false;

            return (
              <input
                type="time"
                disabled={!isPersonnelPresent}
                value={signIn}
                onChange={(e) => {
                  setSignIn(e.target.value);
                }}
                onBlur={() =>
                  handleSetSignIn([{ id: row.original.id, signIn: signIn }])
                }
              />
            );
          },
        },
        {
          Header: "Time Out",
          Cell: ({ row }) => {
            //holding state for each selector and forwarding the state to parent. This is because the selector unmounts
            //it is not possible to update state from parent

            const [signOut, setSignOut] = useState(() => {
              try {
                return signOuts.filter(
                  (signOut) => signOut.id === row.original.id
                )[0].signOut;
              } catch (err) {}
            });
            const [isPresent] = useState(() => {
              try {
                return isPresents.filter(
                  (isPresent) => isPresent.id === row.original.id
                )[0].isPresent;
              } catch (err) {}
            });

            const isPersonnelPresent = isPresent ? isPresent : false;

            return (
              <input
                type="time"
                disabled={!isPersonnelPresent}
                value={signOut}
                onChange={(e) => {
                  setSignOut(e.target.value);
                }}
                onBlur={() =>
                  handleSetSignOut([
                    {
                      id: row.original.id,
                      signOut: signOut,
                    },
                  ])
                }
              />
            );
          },
        },
        { Header: "Name", accessor: "name" },
        {
          id: "lunch",
          Header: "Lunch",
          Cell: ({ row }) => {
            const [lunch] = useState(() => {
              try {
                return lunchs.filter((lunch) => lunch.id === row.original.id)[0]
                  .lunch;
              } catch (err) {}
            });

            const hadLunch = lunch ? lunch : false;

            return (
              <input
                type="checkbox"
                name="hadLunch"
                style={{ cursor: "pointer" }}
                defaultChecked={hadLunch}
                onChange={() => {
                  handleHadLunch([
                    {
                      id: row.original.id,
                      lunch: !hadLunch,
                    },
                  ]);
                }}
              />
            );
          },
        },
        {
          id: "T & T",
          Header: "T & T (GHS)",

          Cell: ({ row }) => {
            const [tandt, setTandt] = useState(() => {
              try {
                return tandts.filter((tandt) => tandt.id === row.original.id)[0]
                  .tandt;
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
                  handleSetTandts([{ id: row.original.id, tandt: tandt }])
                }
              />
            );
          },
        },
      ];
      let forMobile = [
        {
          Header: "Time",
          id: "isPresent&Time",
          Cell: ({ row }) => {
            // isPresent
            const [isPresent] = useState(() => {
              try {
                return isPresents.filter(
                  (isPresent) => isPresent.id === row.original.id
                )[0].isPresent;
              } catch (err) {}
            });
            // end of isPresent

            //timeIn
            const [signIn, setSignIn] = useState(() => {
              try {
                return signIns.filter(
                  (signIn) => signIn.id === row.original.id
                )[0].signIn;
              } catch (err) {}
            });
            // end of timeIn

            // timeOut
            const [signOut, setSignOut] = useState(() => {
              try {
                return signOuts.filter(
                  (signOut) => signOut.id === row.original.id
                )[0].signOut;
              } catch (err) {}
            });
            // end of timeOut

            const isPersonnelPresent = isPresent ? isPresent : false;

            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  name="isPresent"
                  style={{ cursor: "pointer" }}
                  defaultChecked={isPersonnelPresent}
                  onChange={() => {
                    handleIsPresent([
                      {
                        id: row.original.id,
                        isPresent: !isPersonnelPresent,
                      },
                    ]);
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "flex-end",
                  }}
                >
                  <div>
                    <label>In</label>
                    <input
                      type="time"
                      disabled={!isPersonnelPresent}
                      value={signIn}
                      style={{ maxWidth: 95 }}
                      onChange={(e) => {
                        setSignIn(e.target.value);
                      }}
                      onBlur={() =>
                        handleSetSignIn([
                          {
                            id: row.original.id,
                            signIn: signIn,
                          },
                        ])
                      }
                    />
                  </div>
                  <div>
                    <label>Out</label>
                    <input
                      type="time"
                      disabled={!isPersonnelPresent}
                      value={signOut}
                      style={{ maxWidth: 95 }}
                      onChange={(e) => {
                        setSignOut(e.target.value);
                      }}
                      onBlur={() =>
                        handleSetSignOut([
                          {
                            id: row.original.id,
                            signOut: signOut,
                          },
                        ])
                      }
                    />
                  </div>
                </div>
              </div>
            );
          },
        },
        {
          Header: "Name",
          accessor: "name",
          Filter: () => null,
        },

        // {
        //   id: "lunch",
        //   // The header can use the table's getToggleAllRowsSelectedProps method
        //   // to render a checkbox
        //   Header: ({ getToggleAllRowsSelectedProps }) => (
        //     <div>
        //       <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        //       <span> Lunch</span>
        //     </div>
        //   ),
        //   // The cell can use the individual row's getToggleRowSelectedProps method
        //   // to the render a checkbox
        //   Cell: ({ row }) => (
        //     <div>
        //       <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        //     </div>
        //   ),
        // },
        {
          id: "Lunch/T & T",
          Header: () => (
            <div>
              Lunch/
              <br />T & T (GHS)
            </div>
          ),

          Cell: ({ row }) => {
            // lunch info
            const [lunch] = useState(() => {
              try {
                return lunchs.filter((lunch) => lunch.id === row.original.id)[0]
                  .lunch;
              } catch (err) {}
            });
            const hadLunch = lunch ? lunch : false;
            // end of lunch info

            // tandt
            const [tandt, setTandt] = useState(() => {
              try {
                return tandts.filter((tandt) => tandt.id === row.original.id)[0]
                  .tandt;
              } catch (err) {}
            });
            // end of tandt

            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  name="hadLunch"
                  style={{ cursor: "pointer", margin: 10 }}
                  defaultChecked={hadLunch}
                  onChange={() => {
                    handleHadLunch([
                      {
                        id: row.original.id,
                        lunch: !hadLunch,
                      },
                    ]);
                  }}
                />
                <input
                  type="number"
                  value={tandt}
                  style={{ width: 60 }}
                  onChange={(e) => {
                    setTandt(e.target.value);
                  }}
                  onBlur={() =>
                    handleSetTandts([
                      {
                        id: row.original.id,
                        tandt: tandt,
                      },
                    ])
                  }
                />
              </div>
            );
          },
        },
      ];

      return isMobile ? forMobile : forDesktop;
    },
    [signIns, signOuts, tandts, isPresents, isMobile]
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
  // let lunchList;
  // const extractLunchData = (data) => {
  //   lunchList = data.map((row) => row.original.id);
  // };
  const handleSubmit = () => {
    let body = data.map((personnel) => {
      let isPresent;
      if (isPresents.length) {
        isPresent = isPresents.filter(
          (isPresent) => isPresent.id === personnel.id
        );
      }
      try {
        if (isPresent[0].isPresent) {
          const signIn = signIns.filter((signIn) => signIn.id === personnel.id);
          const signOut = signOuts.filter(
            (signOut) => signOut.id === personnel.id
          );
          const tandt = tandts.filter((tandt) => tandt.id === personnel.id);
          // const lunch = lunchList
          //   ? lunchList.find((personnelID) => personnelID === personnel.id)
          //     ? true
          //     : false
          //   : false;
          let lunch;
          if (lunchs.length) {
            lunch = lunchs.filter((lunch) => lunch.id === personnel.id);
          }
          //with the inconsistencies with the input time type, signIns and outs will require refactoring as follows:
          return {
            signIn: null,
            signOut: null,
            // ...signIn[0],
            // ...signOut[0],
            signIn: `${new Date(
              `01-01-1970 ${signIn[0].signIn}`
            ).getHours()}:${new Date(
              `01-01-1970 ${signIn[0].signIn}`
            ).getMinutes()}`,
            signOut: `${new Date(
              `01-01-1970 ${signOut[0].signOut}`
            ).getHours()}:${new Date(
              `01-01-1970 ${signOut[0].signOut}`
            ).getMinutes()}`,
            ...(tandt[0] ? tandt[0] : { tandt: null }),
            ...isPresent[0],
            ...(lunch[0] ? lunch[0] : { lunch: false }),
            id: personnel.id,
            name: personnel.name,
          };
        }
      } catch (err) {}
      return {
        signIn: null,
        signOut: null,
        tandt: null,
        isPresent: false,
        lunch: false,
        id: personnel.id,
        name: personnel.name,
      };
    });
    const register = {
      date: `${new Date(props.date).getMonth() + 1}/${new Date(
        props.date
      ).getDate()}/${new Date(props.date).getFullYear()}`,
      body: body,
    };
    props.onAlert("info", "Saving...", {
      timeout: 3000,
      position: "bottom center",
    });
    props
      .postData(`/api/attendance/${props.projectID}`, register)
      .then(({ data }) =>
        data.success
          ? props.onAlert("success", "Register Saved", {
              timeout: 5000,
              position: "bottom center",
            })
          : props.onAlert("error", "Failed to Save Register", {
              timeout: 3000,
              position: "bottom center",
            })
      )
      .then(() => props.onHandleToggleFetchAttendance())
      .then(() => history.goBack());
  };

  return (
    <div>
      <Caption flabel="Time" slabel="Sheet" />
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
          // setDate(date);
          props.onHandleSetAttendanceDate(date);
        }}
        customInput={<MainDate />}
        withPortal={true}
      />
      {/* <Slate> */}
      <Wrapper isMobile>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: 5,
            margin: "15px 0px",
            color: "#10292e",
            borderRadius: 5,
            backgroundColor: "#adb7a9c2",
            minWidth: "min-content",
          }}
        >
          <Table
            data={data}
            columns={columns}
            // selectedRows={(data) => extractLunchData(data)}
          />
        </div>
      </Wrapper>
      {/* </Slate> */}
    </div>
  );
};

export default Register;
