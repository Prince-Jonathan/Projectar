import React, { useState, useEffect } from "react";
import styled from "styled-components";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DatePicker from "react-datepicker";

import { isMobile } from "../Responsive";

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
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [personnel, setPersonnel] = useState([]);

  const fetchVerbose = (projectID) => {
    props.onFetchData(`/api/project/verbose/${projectID}`).then(({ data }) => {
      // tasks = data.tasks_list;
      // personnel = data.personnel_list;
      setTasks(data.tasks_list);
      setPersonnel(data.personnel_list);
    });
  };

  useEffect(() => {
    fetchVerbose(props.projectID);
  }, []);

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
      task.target ? parseInt(task.target) : "-",
      task.achieved ? parseInt(task.achieved) : "-",
    ]);

    let content = {
      startY: 78,
      head: headers,
      body: data,
    };

    var splitTitle = doc.splitTextToSize(title, 550);
    // doc.text(15, 20, splitTitle);
    var imageData = new Image();
    imageData.src = props.logo;
    doc.addImage(imageData, "png", 140, 0, 50, 50);
    var logoLabel = "THE AUTOMATION GHANA GROUP";
    doc.text(logoLabel, 190, 30);
    doc.text(splitTitle, marginLeft, 56);
    doc.autoTable(content);
    doc.save(`${props.title}.pdf`);
  };

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

  return (
    <div>
      <Button onClick={() => exportPDF()} disabled={!tasks.length}>
        {!tasks.length ? "Loading..." : props.caption}
      </Button>
      <DatePicker
        selected={startDate.date}
        startDate={startDate.date}
        endDate={endDate.date}
        onChange={(dates) => {
          const [start, end] = dates;
          setStartDate({ date: start });
          setEndDate({ date: end });
        }}
        customInput={<CustomInput />}
        selectsRange
        // inline
        withPortal={isMobile}
      />
      {/* <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
      />
      <DatePicker
        selected={endDate}
        onChange={date => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
      /> */}
    </div>
  );
};

export default Export;
