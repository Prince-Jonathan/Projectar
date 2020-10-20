import React, { useState, useEffect } from "react";
import {
    Switch,
    Route,
    Link,
    useLocation,
    useHistory,
    useRouteMatch,
} from "react-router-dom";
import styled from "styled-components";
import Select from "react-select";

import { Row, Column } from "../../Grid";
import Element from "./Element";
import Announcements from "./Announcements";
import Can from "../../Can";
import Bay from "../../bay/Bay";

import "./Workspace.css";

// const Button = styled.button`
//   background: #faec25b9;
//   border: none;
//   border-bottom: 4px solid #10292e;
//   color: #10292e;
//   /* font-family: 'Open Sans', sans-serif; */
//   text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
//   font-size: 15px;
//   text-align: center;
//   box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
//   cursor: pointer;
//   margin: 0 5px 0 5px;
//   border-radius: 12px;
//   background-color: #ffee00;

//   &::active {
//     box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
//   }
// `;

const Style = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
`;
// tempStyle=

const Workspace = (props) => {
    const history = useHistory();
    const location = useLocation();
    const { path } = useRouteMatch();
    // const options = useMemo(
    //   () =>
    //     projectPersonnel
    //       ? projectPersonnel.map((personnel) => {
    //           return { label: personnel.name, value: personnel.id };
    //         })
    //       : null,
    //   [props.projects]
    // );
    // const handleSelection = (selectedOption) => {
    //   const personnel = selectedOption.map((option) => {
    //     return { name: option.label, id: option.value };
    //   });
    //   setState({ ...state, personnel });
    // };
    return (
        <div>
            <Row>
                <Column>
                    <Style>
                        <Element
                            onClick={() => history.push("/")}
                            flabel="Add"
                            slabel="Task"
                            icon="fa fa-tasks fa-lg"
                        />
                        {/* view single personnel tasks */}
                        <Can
                            role={JSON.parse(
                                localStorage.getItem("netsuite")
                            ).role.toLowerCase()}
                            perform="tasks:list"
                            yes={() => (
                                <>
                                    <Element
                                        onClick={() =>
                                            history.push("/project/all/tasks", {
                                                taskType: "personnel",
                                            })
                                        }
                                        flabel="View"
                                        slabel="Tasks"
                                        icon="fa fa-tasks fa-lg"
                                    />
                                </>
                            )}
                        />
                        {/* view all tasks (administrative privilege) */}
                        <Can
                            role={JSON.parse(
                                localStorage.getItem("netsuite")
                            ).role.toLowerCase()}
                            perform="tasks:lists"
                            yes={() => (
                                <>
                                    <Element
                                        onClick={() =>
                                            history.push("/project/all/tasks", {
                                                taskType: "projects",
                                            })
                                        }
                                        flabel="View"
                                        slabel="Tasks"
                                        icon="fa fa-file-text-o  fa-lg"
                                    />
                                </>
                            )}
                        />

                        <Element
                            onClick={() => history.push("/personnel")}
                            flabel="View"
                            slabel="Personnel"
                            icon="fa fa-users fa-lg"
                        />
                        <Element
                            onClick={() => history.push("/reports")}
                            flabel="Recent"
                            slabel="Reports"
                            icon="fa fa-folder-open-o fa-lg"
                        />
                    </Style>
                    <Announcements />
                    {location.state && location.state.sendAnnouncement ? (
                        <Bay>
                            <div style={{ color: "white" }}>
                                <form className="form-container column">
                                    <Select
                                        isMulti
                                        placeholder="Assign to:"
                                        // onChange={handleSelection}
                                        // options={options}
                                        // defaultValue={selectedOption.value}
                                        isClearable
                                        styles={{
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 200,
                                            }),
                                        }}
                                        menuPortalTarget={document.body}
                                        isSearchable
                                        name="color"
                                        // menuPosition={
                                        //     selectedOption.isFixed
                                        //         ? "fixed"
                                        //         : "absolute"
                                        // }
                                        // menuPlacement={
                                        //     selectedOption.portalPlacement
                                        // }
                                    />
                                </form>
                            </div>
                        </Bay>
                    ) : null}
                </Column>
            </Row>
        </div>
    );
};

export default Workspace;
