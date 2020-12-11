import React, { useState, useEffect, useCallback } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import styled from "styled-components";
import {
  Route,
  useRouteMatch,
  useParams,
  Switch,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import { trackPromise } from "react-promise-tracker";

import Table from "../../../../table/Table";
import Slate from "../../../slate/Slate";
import { isMobile } from "../../../../Responsive";
import SliderFilter from "../../../../table/filters/SliderFilter";
import filterGreaterThan from "../../../../table/filters/filterGreaterThan";
import ColumnFilter from "../../../../table/filters/ColumnFilter";
import Description from "../Description";
import Caption from "../../../Caption";
import Task from "../Task";
import EditTask from "../EditTask";
import AllTasks from "../../AllTasks";
import Attendance from "../../../attendance/Attendance";
import Bay from "../../../../bay/Bay";
import Button from "../../../uiElements/Button";
import TaskDetailsStatus from "../TaskDetailsStatus";
import ExportDetails from "./ExportDetails";

import logo from "../../../../../logos/tagg.png";
import pdfLogo from "../../../../../logos/pdfLogo.svg.png";

const Styles = styled.div`
  .project {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .left {
    display: flex;
    flex-flow: column wrap;
    align-items: flex-start;
    justify-content: space-evenly;
    height: 100%;
    border-right: solid #ffee00;
    margin-right: 5px;
  }
  .left > button {
    margin: 5px 5px 5px 0;
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? "row" : "column")};
  justify-content: space-around;
  flex-wrap: wrap;
`;

const TaskDetails = (props) => {
  const { path, url } = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const [selectedTaskID, setSelectedTaskID] = useState(undefined);
  const { id } = useParams();
  const [taskDetails, setTaskDetails] = useState([]);

  let data = React.useMemo(
    () => (location.state ? location.state.taskDetails : []),
    [location.state]
  );

  data =
    data &&
    data.sort((a, b) => {
      let dateA = new Date(a.target_date);
      let dateB = new Date(b.target_date);
      return dateB - dateA;
    });

  useEffect(
    () => {
      let taskDs;
      props
        .onFetchData(`/api/task/enrolments/verbose/${id}`)
        .then(({ data: res }) => {
          taskDs = data.map((detail) => {
            return {
              ...detail,
              personnel: res.find((d) => d.detail_id === detail.id).personnel,
            };
          });
          setTaskDetails(taskDs);
        });
    },
    [data]
  );
  const deleteTask = useCallback((taskID) => {
    props.onAlert("info", "Deleting...", {
      timeout: 3000,
      position: "bottom center",
    });
    props
      .onFetchData(`/api/task/delete/${taskID}`)
      .then(() => props.toggler())
      .then(() =>
        props.onAlert("success", "Task Deleted", {
          timeout: 5000,
          position: "bottom center",
        })
      );
  }, []);

  const columns = React.useMemo(
    () => {
      let forDesktop = [
        {
          // Make an expander cell
          Header: () => null, // No header
          id: "expander", // It needs an ID
          Cell: ({ row }) => (
            // Use Cell to render an expander for each row.
            // We can use the getToggleRowExpandedProps prop-getter
            // to build the expander.
            <span {...row.getToggleRowExpandedProps()}>
              {row.isExpanded ? (
                <i class="fa fa-compress" aria-hidden="true" />
              ) : (
                <i class="fa fa-expand" aria-hidden="true" />
              )}
            </span>
          ),
        },
        {
          Header: "Date Updated",
          accessor: "date_updated",
          Filter: isMobile ? () => null : ColumnFilter,
        },
        {
          Header: "Status",
          id: "status",
          Cell: ({ row }) => {
            const status = [null, "New", "Executed", "Rescheduled"];
            return (
              <span>
                {status[row.original.entry_type]}
                {parseInt(row.original.achieved) >=
                  parseInt(row.original.target) && (
                  <i
                    className="fa fa-star fa-xs"
                    style={
                      parseInt(row.original.achieved) ===
                      parseInt(row.original.target)
                        ? {
                            position: "relative",
                            left: -3,
                            top: -8,
                            textShadow: "0 0 10px #FFEE00",
                            color: "#FFEE00",
                          }
                        : parseInt(row.original.achieved) >
                          parseInt(row.original.target)
                        ? {
                            position: "relative",
                            left: -3,
                            top: -8,
                            textShadow: "0 0 10px cyan",
                            color: "cyan",
                          }
                        : {}
                    }
                    aria-hidden="true"
                  />
                )}
              </span>
            );
          },
        },
        {
          Header: "Target",
          id: "target",
          Cell: ({ row }) => <span>{row.original.target}</span>,
        },
        { Header: "Achieved", accessor: "achieved", Filter: () => null },
        { Header: "Personnel", accessor: "personnel" },
        {
          Header: "Scheduled Date",
          accessor: "target_date",
          Filter: isMobile ? () => null : ColumnFilter,
        },
      ];
      return isMobile ? forDesktop.slice(0, 4) : forDesktop;
    },
    [isMobile]
  );

  // const outstandingTasks =
  //   data && data.filter((task) => parseInt(task.achieved) !== 100);
  // const completedTasks =
  //   data && data.filter((task) => parseInt(task.achieved) === 100);

  // const handleOClick = ({ row }) => {
  //   setSelectedTaskID(row.original.id);
  //   history.push(`${url}/outstanding-tasks/${row.original.id}/execute`, {
  //     taskID: row.original.id,
  //     projectID: id,
  //     entry_type: 2,
  //     taskStatus: "outstanding",
  //   });
  // };
  const renderRowSubComponent = React.useCallback(({ row }) => {
    return (
      <>
        {row.original.comment ? (
          <div style={{ color: "10292e", fontWeight: 700 }}>
            Comment:{" "}
            <div
              style={{
                color: "white",
                fontWeight: 300,
                // padding: 10,
                marginTop: 5,
                maxWidth: "90vw",
              }}
            >
              <CKEditor
                editor={ClassicEditor}
                name="comment"
                data={row.original.comment}
                type="inline"
                onInit={(editor) => {
                  editor.isReadOnly = true;
                }}
                config={{
                  // removePlugins: "toolbar",
                  ckfinder: {
                    uploadUrl: "https://projectar.automationghana.com/upload",
                  },
                }}
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              color: "white",
            }}
          >
            No Comments
          </div>
        )}
      </>
    );
    // <div>Comment:{row.original.comment}</div>
  }, []);
  return (
    <div>
      <Styles>
        <Switch>
          <Route exact path={path}>
            <Caption flabel="Task" slabel="Details" />
            <Caption
              flabel={location.state && location.state.projectName}
              style={{ fontSize: 15, color: "white" }}
            />
            <Caption
              flabel={location.state && location.state.taskInfo}
              style={{ fontSize: 15, color: "#ffee00" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginTop: 5,
              }}
            >
              <Button
                onClick={() => {
                  // location.state &&
                  // location.state.projectID === "all"
                  //     ? history.push(
                  //           `${url.replace(
                  //               "/details",
                  //               "/execute"
                  //           )}`,
                  //           {
                  //               ...location.state,
                  //               entry_type: 2,
                  //               taskStatus: "all",
                  //           }
                  //       )
                  // :
                  history.push(`${url.replace("/details", "/execute")}`, {
                    ...location.state,
                    entry_type: 2,
                  });
                }}
                bright
              >
                Execute Task
              </Button>
              <ExportDetails
                taskDetails={taskDetails}
                caption="Report"
                projectName={location.state ? location.state.projectName : null}
                taskInfo={location.state ? location.state.taskInfo : null}
                logo={logo}
                pdfLogo={pdfLogo}
                onFetchData={props.onFetchData}
              />
            </div>
            <Wrapper isMobile>
              <Slate>
                <Table
                  columns={columns}
                  data={taskDetails}
                  renderRowSubComponent={renderRowSubComponent}
                  getHeaderProps={(cellInfo) => {
                    return (
                      (cellInfo.id === "target" ||
                        cellInfo.id === "achieved") && {
                        style: { width: "20px" },
                      }
                    );
                  }}
                  getCellProps={(cellInfo) => {
                    return (
                      cellInfo.column.id === "achieved" && {
                        style: {
                          backgroundColor: `hsl(${120 *
                            ((100 - cellInfo.value) / 100) *
                            -1 +
                            120}, 100%, 30%,0.62)`,
                        },
                      }
                    );
                  }}
                />
              </Slate>
            </Wrapper>
          </Route>
        </Switch>
      </Styles>
    </div>
  );
};

export default TaskDetails;
