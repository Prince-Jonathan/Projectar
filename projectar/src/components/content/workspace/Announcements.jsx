import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import { isMobile } from "../../Responsive";
import Table from "../../table/Table";
import Slate from "../slate/Slate";

import "./Workspace.css";

const Button = styled.button`
  border: none;
  color: white;
  font-size: 15px;
  text-align: center;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: 5px;
  border-radius: 12px;
  background-color: #10292e;

  &::active {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
  }
`;

const Announcements = (props) => {
  const history = useHistory();
  // const [announcement, setAnnouncement] = useState(null);
  // useEffect(() => {
  //   const fetchAnnouncements = async () => {
  //     props
  //       .onFetchData(
  //         `/api/announcements/${
  //           JSON.parse(localStorage.getItem("netsuite")).id
  //         }`
  //       )
  //       .then(({ data }) => data.success && setAnnouncement(data.data));
  //   };
  //   fetchAnnouncements();
  // }, []);
  let data = props.announcement;
  const columns = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Sender",
        accessor: "sender",
      },
      {
        Header: "Date Sent",
        accessor: "date",
      },
    ],
    []
  );

  data &&
    data.sort((a, b) => {
      let dateA = new Date(a.date),
        dateB = new Date(b.date);
      return dateB - dateA;
    });
  const fixWidth = isMobile ? null : { width: "800px" };
  return (
    <div>
      <div>
        {data ? (
          <>
            {/* <div className="slate" style={fixWidth}> */}
            <strong>Announcements</strong>
            <Button
              onClick={() => history.push("/", { sendAnnouncement: true })}
            >
              <i
                style={{ color: "#ffee00" }}
                className="fa fa-plus"
                aria-hidden="true"
              />{" "}
              Add
            </Button>
            <div
              className="slate"
              style={{
                // ...fixWidth,
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
              <Table data={data} columns={columns} />
            </div>
          </>
        ) : (
          <div className="slate" style={fixWidth}>
            <div className="header">
              <strong>Announcements</strong>
              <Button
                onClick={() => history.push("/", { sendAnnouncement: true })}
              >
                <i
                  style={{ color: "#ffee00" }}
                  className="fa fa-plus"
                  aria-hidden="true"
                />{" "}
                Add
              </Button>
            </div>
            <div style={{ marginTop: "5%", color: "#b2beb5" }}>
              <i className="fa fa-bullhorn fa-3x" aria-hidden="true" />
              <div>
                Project status of project, make announcement to appreciate
                teams, share important information or wish on birthdays
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
