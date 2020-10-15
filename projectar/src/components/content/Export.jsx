import React, { useState, useEffect } from "react";
import styled from "styled-components";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DatePicker from "react-datepicker";

import { isMobile } from "../Responsive";
import Button from "./uiElements/Button";

const Export = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [tasks, setTasks] = useState(null);
  const [attendance, setAttendance] = useState(null);

  const fetchVerbose = (projectID) => {
    props.onFetchData(`/api/project/verbose/${projectID}`).then(({ data }) => {
      setTasks(data.tasks_list);
    });
  };
  const fetchAttendance = (projectID) => {
    props.onFetchData(`/api/attendance/${projectID}/all`).then(({ data }) => {
      setAttendance(data);
    });
  };

  useEffect(() => {
    fetchVerbose(props.projectID);
    fetchAttendance(props.projectID);
  }, []);

  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const doc = new jsPDF(orientation, unit, size);

    const title = props.title;

    const filteredTasks = tasks.length
      ? tasks.filter(
          (task) =>
            +new Date(task.details[0].date_updated).setHours(0, 0, 0, 0) >=
              +new Date(startDate).setHours(0, 0, 0, 0) &&
            +new Date(task.details[0].date_updated).setHours(0, 0, 0, 0) <=
              +new Date(endDate).setHours(0, 0, 0, 0)
        )
      : tasks;

    const filteredAttendance = attendance.filter((register) => {
      return (
        +new Date(register.date).setHours(0, 0, 0, 0) >=
          +new Date(startDate).setHours(0, 0, 0, 0) &&
        +new Date(register.date).setHours(0, 0, 0, 0) <=
          +new Date(endDate).setHours(0, 0, 0, 0) &&
        register.is_present === true
      );
    });

    doc.autoTable({
      columnStyles: {
        0: {
          font: "helvetica",
          fontStyle: "bold",
          fontSize: 14,
          fillColor: null,
          cellPadding: { top: -5, right: 0, bottom: 0, left: 0 },
          halign: "center",
          valign: "center",
        },
      },
      body: [{ company: "THE AUTOMATION GHANA GROUP" }],
      columns: [{ dataKey: "company" }],
      didDrawCell: (data) => {
        var imageData = new Image();
        imageData.src = props.logo;
        doc.addImage(
          imageData,
          "png",
          data.cursor.x / 2 + data.cell.contentWidth / 2,
          data.cursor.y - 10,
          40,
          40
        );
      },
    });

    doc.autoTable({
      body: [
        [
          {
            content: title,
            styles: {
              font: "helvetica",
              fontStyle: "bold",
              fontSize: 12,
              fillColor: null,
              cellPadding: { top: -5, right: 0, bottom: 0, left: 0 },
              halign: "center",
              valign: "center",
            },
          },
        ],
      ],
    });
    doc.autoTable({
      body: [
        [
          {
            content: "Tasks List [Target vs. Achieved]",
            styles: {
              font: "helvetica",
              fontStyle: "bolditalic",
              fillColor: null,
              cellPadding: { top: 0, right: 0, bottom: -5, left: 0 },
              halign: "center",
              valign: "center",
            },
          },
        ],
      ],
    });

    //the filtered tasks table
    doc.autoTable({
      body: filteredTasks,
      columns: [
        { header: "DATE", dataKey: "date_updated" },
        { header: "TITLE", dataKey: "title" },
        { header: "DESCRIPTION", dataKey: "description" },
        { header: "STATUS", dataKey: "entry_type" },
        { header: "PERSONNEL", dataKey: "personnel" },
        { header: "TARGET", dataKey: "target" },
        { header: "ACHIEVED", dataKey: "achieved" },
      ],
      didParseCell: function(data) {
        if (data.section === "body") {
          if (
            data.column.dataKey === "target" ||
            data.column.dataKey === "achieved"
          ) {
            data.cell.text =
              data.row.raw.details[0][data.column.dataKey] || "-";
          } else if (data.column.dataKey === "date_updated") {
            data.cell.text = new Date(
              data.row.raw.details[0].date_updated
            ).toLocaleDateString();
          } else if (data.column.dataKey === "entry_type") {
            const status = [null, "New", "Executed", "Rescheduled"];
            data.cell.text =
              status[data.row.raw.details[0][data.column.dataKey]];
          }
        }
      },
    });

    doc.autoTable({
      body: [
        [
          {
            content: "Attendance Register",
            styles: {
              font: "helvetica",
              fontStyle: "bolditalic",
              fillColor: null,
              cellPadding: { top: 0, right: 0, bottom: -5, left: 0 },
              halign: "center",
              valign: "center",
            },
          },
        ],
      ],
    });

    doc.autoTable({
      body: filteredAttendance,
      columns: [
        { header: "DATE", dataKey: "date" },
        { header: "TIME IN", dataKey: "time_in" },
        { header: "TIME OUT", dataKey: "time_out" },
        { header: "T & T", dataKey: "t_and_t" },
        { header: "PERSONNEL", dataKey: "personnel_name" },
        { header: "LUNCH", dataKey: "lunch" },
      ],
      didParseCell: function(data) {
        if (data.section === "body") {
          if (data.column.dataKey === "t_and_t") {
            data.cell.text = data.cell.text || "-";
          } else if (data.column.dataKey === "date") {
            data.cell.text = new Date(data.row.raw.date).toLocaleDateString();
          } else if (data.column.dataKey === "lunch") {
            data.cell.text = data.cell.text ? "Yes" : "No";
          }
        }
      },
    });

    doc.save(`${props.title}.pdf`);
  };

  const CustomInput = ({ value, onClick }) => (
    <input
      style={{
        cursor: "pointer",
        color: "black",
        backgroundColor: "white",
        width: 90,
        border: "0.25px solid black",
        borderRadius: 12,
        margin: 4,
        paddingLeft: 3,
      }}
      required
      onClick={onClick}
      defaultValue={value}
    />
  );

  return (
    <div>
      <Button disabled={tasks && attendance ? false : true}>
        {tasks && attendance ? (
          <div>
            <img
              onClick={() => exportPDF()}
              src={props.pdfLogo}
              alt="pdf Logo"
              width="30"
              height="37"
              style={{ cursor: "pointer" }}
            />
            <img
              onClick={() => console.log("exportPDF()")}
              src={props.spreadSheet}
              alt="spreadSheet Logo"
              width="50"
              height="50"
              style={{ cursor: "pointer" }}
            />
          </div>
        ) : (
          "Loading..."
        )}
      </Button>
      <label>
        From
        <DatePicker
          selected={startDate}
          disabled={tasks && attendance ? false : true}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          withPortal={isMobile}
          customInput={<CustomInput />}
        />
      </label>
      <label>
        To
        <DatePicker
          selected={endDate}
          disabled={tasks && attendance ? false : true}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          withPortal={isMobile}
          customInput={<CustomInput />}
        />
      </label>
    </div>
  );
};

export default Export;
