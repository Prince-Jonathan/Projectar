import React, { useState, useEffect } from "react";
import styled from "styled-components";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Button = styled.button`
  background: #faec25b9;
  border: none;
  border-bottom: 4px solid #10292e;
  color: #10292e;
  /* font-family: 'Open Sans', sans-serif; */
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
  font-size: 15px;
  text-align: center;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin: 0 5px 0 5px;
  border-radius: 12px;
  background-color: #ffee00;

  &::active {
    box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.2);
  }
`;
const Export = (props) => {
  let tasks;
  let personnel;

  const fetchVerbose = (projectID) => {
    props.onFetchData(`/api/project/verbose/${projectID}`).then(({ data }) => {
      tasks = data.tasks_list;
      personnel = data.personnel_list;
      console.log("this is verbose personnel:", personnel);
    });
  };

  //   useEffect(() => {
  fetchVerbose(props.projectID);
  //   }, []);

  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    for (let i = 0; i < tasks.length; i++) {
      tasks[i].personnel = personnel[i];
    }

    const title = props.title;
    const headers = [
      [
        "DATE",
        "TITLE",
        "DESCRIPTION",
        "PERSONNEL",
        "TARGET (%)",
        "ACHIEVED (%)",
      ],
    ];

    const data = tasks.map((task) => [
      task.date,
      task.title,
      task.description,
      task.personnel,
      parseInt(task.target),
      parseInt(task.achieved),
    ]);

    let content = {
      startY: 60,
      head: headers,
      body: data,
    };

    var splitTitle = doc.splitTextToSize(title, 580);
    // doc.text(15, 20, splitTitle);
    doc.text(splitTitle, marginLeft, 40);
    doc.autoTable(content);
    doc.save(`${props.title}.pdf`);
  };

  return (
    <div>
      <Button onClick={() => exportPDF()}>{props.caption}</Button>
    </div>
  );
};

export default Export;
