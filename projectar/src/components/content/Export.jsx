import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DatePicker from "react-datepicker";

import { isMobile } from "../Responsive";
import Button from "./uiElements/Button";


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

    const filteredTasks = tasks.length
      ? tasks.filter(
          (task) =>
            +new Date(task.date).setHours(0, 0, 0, 0) >=
              +new Date(startDate).setHours(0, 0, 0, 0) &&
            +new Date(task.date).setHours(0, 0, 0, 0) <=
              +new Date(endDate).setHours(0, 0, 0, 0)
        )
      : tasks;
    const data = filteredTasks.map((task) => [
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

    var splitTitle = doc.splitTextToSize(title, 650);
    // doc.text(15, 20, splitTitle);
    var imageData = new Image();
    imageData.src = props.logo;
    doc.addImage(imageData, "png", 140, 0, 50, 50);
    var logoLabel = "THE AUTOMATION GHANA GROUP";
    doc.text(logoLabel, 190, 30);
    doc.setFontSize(12);
    doc.text(splitTitle, marginLeft, 56);
    doc.autoTable(content);
    doc.save(`${props.title}.pdf`);
  };

  const CustomInput = ({ value, onClick }) => (
    <Button
      type="button"
      style={{ cursor: "pointer", color: "black", backgroundColor: "white" }}
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
        selected={startDate}
        disabled={!tasks.length}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        withPortal={isMobile}
        customInput={<CustomInput />}
      />
      <DatePicker
        selected={endDate}
        disabled={!tasks.length}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        withPortal={isMobile}
      />
    </div>
  );
};

export default Export;
