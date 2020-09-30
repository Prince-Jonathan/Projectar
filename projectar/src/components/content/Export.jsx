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

  const title = props.title;

  var faker = require("faker");
  function bodyRows(rowCount) {
    rowCount = rowCount || 10;
    var body = [];
    for (var j = 1; j <= rowCount; j++) {
      body.push({
        id: j,
        name: faker.name.findName(),
        email: faker.internet.email(),
        city: faker.address.city(),
        expenses: faker.finance.amount(),
      });
    }
    return body;
  }

  const [minHeight, setMinHeight] = useState(500);

  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const doc = new jsPDF(orientation, unit, size);

    const filteredTasks = tasks.length
      ? tasks.filter(
          (task) =>
            +new Date(task.date_created).setHours(0, 0, 0, 0) >=
              +new Date(startDate).setHours(0, 0, 0, 0) &&
            +new Date(task.date_created).setHours(0, 0, 0, 0) <=
              +new Date(endDate).setHours(0, 0, 0, 0)
        )
      : tasks;
    const topTasks = filteredTasks.map((task) => [
      task.title,
      task.description,
      "",
    ]);

    const filteredAttendance = attendance.filter((register) => {
      return (
        +new Date(register.date).setHours(0, 0, 0, 0) >=
          +new Date(startDate).setHours(0, 0, 0, 0) &&
        +new Date(register.date).setHours(0, 0, 0, 0) <=
          +new Date(endDate).setHours(0, 0, 0, 0) &&
        register.is_present === true
      );
    });

    // doc.autoTable({
    //   columnStyles: {
    //     0: {
    //       font: "helvetica",
    //       fontStyle: "bold",
    //       fontSize: 14,
    //       fillColor: null,
    //       cellPadding: { top: -5, right: 0, bottom: 0, left: 0 },
    //       halign: "center",
    //       valign: "center",
    //     },
    //   },
    //   body: [{ company: "THE AUTOMATION GHANA GROUP" }],
    //   columns: [{ dataKey: "company" }],
    //   didDrawCell: (data) => {
    //     var imageData = new Image();
    //     imageData.src = props.logo;
    //     doc.addImage(
    //       imageData,
    //       "png",
    //       data.cursor.x / 2 + data.cell.contentWidth / 2,
    //       data.cursor.y - 10,
    //       40,
    //       40
    //     );
    //   },
    // });

    // doc.autoTable({
    //   body: [
    //     [
    //       {
    //         content: title,
    //         styles: {
    //           font: "helvetica",
    //           fontStyle: "bold",
    //           fontSize: 12,
    //           fillColor: null,
    //           cellPadding: { top: -5, right: 0, bottom: 0, left: 0 },
    //           halign: "center",
    //           valign: "center",
    //         },
    //       },
    //     ],
    //   ],
    // });
    // doc.autoTable({
    //   body: [
    //     [
    //       {
    //         content: "Tasks List [Target vs. Achieved]",
    //         styles: {
    //           font: "helvetica",
    //           fontStyle: "bolditalic",
    //           fillColor: null,
    //           cellPadding: { top: 0, right: 0, bottom: -5, left: 0 },
    //           halign: "center",
    //           valign: "center",
    //         },
    //       },
    //     ],
    //   ],
    // });

    // //the filtered tasks table
    // doc.autoTable({
    //   body: filteredTasks,
    //   columns: [
    //     { header: "DATE", dataKey: "date_created" },
    //     { header: "TITLE", dataKey: "title" },
    //     { header: "DESCRIPTION", dataKey: "description" },
    //     { header: "PERSONNEL", dataKey: "personnel" },
    //     { header: "TARGET", dataKey: "target" },
    //     { header: "ACHIEVED", dataKey: "achieved" },
    //   ],
    //   didParseCell: function(data) {
    //     if (data.section === "body") {
    //       if (
    //         data.column.dataKey === "target" ||
    //         data.column.dataKey === "achieved"
    //       ) {
    //         data.cell.text =
    //           data.row.raw.details[0][data.column.dataKey] || "-";
    //       } else if (data.column.dataKey === "date_created") {
    //         data.cell.text = new Date(
    //           data.row.raw.date_created
    //         ).toLocaleDateString();
    //       }
    //     }
    //   },
    // });

    // doc.autoTable({
    //   body: [
    //     [
    //       {
    //         content: "Attendance Register",
    //         styles: {
    //           font: "helvetica",
    //           fontStyle: "bolditalic",
    //           fillColor: null,
    //           cellPadding: { top: 0, right: 0, bottom: -5, left: 0 },
    //           halign: "center",
    //           valign: "center",
    //         },
    //       },
    //     ],
    //   ],
    // });

    // doc.autoTable({
    //   body: filteredAttendance,
    //   columns: [
    //     { header: "DATE", dataKey: "date" },
    //     { header: "TIME IN", dataKey: "time_in" },
    //     { header: "TIME OUT", dataKey: "time_out" },
    //     { header: "T & T", dataKey: "t_and_t" },
    //     { header: "PERSONNEL", dataKey: "personnel_name" },
    //     { header: "LUNCH", dataKey: "lunch" },
    //   ],
    //   didParseCell: function(data) {
    //     if (data.section === "body") {
    //       if (data.column.dataKey === "t_and_t") {
    //         data.cell.text = data.cell.text || "-";
    //       } else if (data.column.dataKey === "date") {
    //         data.cell.text = new Date(data.row.raw.date).toLocaleDateString();
    //       } else if (data.column.dataKey === "lunch") {
    //         data.cell.text = data.cell.text ? "Yes" : "No";
    //       }
    //     }
    //   },
    // });

    // doc.save(`${props.title}.pdf`);

    doc.text("Nested tables", 14, 16);
    var nestedTableHeight = 500;
    var nestedTableCell = {
      content: "",
      // Dynamic height of nested tables are not supported right now
      // so we need to define height of the parent cell
      styles: { minCellHeight: 100 },
    };
    doc.autoTable({
      theme: "grid",
      head: [["Title", "Description", "Details"]],
      body: topTasks,
      startY: 20,
      columnStyles: {
        0: {
          cellWidth: "wrap",
          halign: "center",
          fillColor: [0, 255, 0],
          minCellHeight: minHeight + 5,
        },
        1: { cellWidth: "wrap" },
      },
      didParseCell: function(data) {
        // console.log("subject data", data);
        if (data.row.section === "body") {
          data.cell.styles.minCellHeight = minHeight + 5;
        }
        if (data.row.section === "body" && data.column.index !== 2) {
          data.cell.styles.cellWidth = "wrap";
          console.log(data.column.index, "in here");
        }
      },
      didDrawCell: function(data) {
        // data.cell.styles.minCellHeight = 500;

        // console.log(
        //   "section:",
        //   data.section,
        //   "column",
        //   data.column.index,
        //   "mincellheight",
        //   data.cell.styles.minCellHeight,
        //   data
        //   );
        // data.cell.styles.minCellHeight = 500;
        if (data.column.index === 2 && data.row.section === "body") {
          // data.cell.colSpan = 10;
          doc.autoTable({
            startY: data.cell.y,
            margin: { left: data.cell.x + 2 },
            tableWidth: data.cell.width - 4,
            styles: {
              maxCellHeight: 4,
            },
            columns: [
              { dataKey: "id", header: "ID" },
              { dataKey: "name", header: "Name" },
              { dataKey: "expenses", header: "Sum" },
            ],
            body: bodyRows(3),
            didDrawPage: function(subRowData) {
              console.log(
                "From inside",
                // "column index",
                // subRowData.column.index,
                subRowData,
                "parent data",
                data
              );
              setMinHeight(subRowData.cursor.y - subRowData.settings.startY);
              // data.cursor = {
              //   // ...data.cell.cursor,
              //   x: 552,
              //   y: 520,
              // };
            },
          });
        }
      },
    });
    doc.save("test.pdf");
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
      value={value}
    />
  );

  return (
    <div>
      <Button
        onClick={() => exportPDF()}
        disabled={tasks && attendance ? false : true}
      >
        {tasks && attendance ? props.caption : "Loading..."}
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
