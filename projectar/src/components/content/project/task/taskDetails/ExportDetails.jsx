import React, { useState, useEffect } from "react";
import styled from "styled-components";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { isMobile } from "../../../../Responsive";

const Img = styled.img`
  cursor: pointer;
  margin: 0 5px 0 5px;
  opacity: 0.95;
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 2.2px 10px rgba(0, 0, 0, 0.12);
    opacity: 1;
    transform: scale(1.08);
  }
  &:focus {
    outline: none;
    box-shadow: 0 2.2px 80px rgba(0, 0, 0, 0.12);
    opacity: 0.85;
  }
`;

const Export = (props) => {
  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const doc = new jsPDF(orientation, unit, size);

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
            content: props.projectName,
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
            content: props.taskInfo,
            styles: {
              font: "helvetica",
              fontStyle: "bold",
              fontSize: 10,
              fillColor: null,
              cellPadding: { top: -5, right: 0, bottom: 0, left: 0 },
              halign: "center",
              valign: "center",
            },
          },
        ],
      ],
    });

    //the filtered tasks table
    doc.autoTable({
      body: props.taskDetails,
      columns: [
        { header: "LAST UPDATE", dataKey: "date_updated" },
        { header: "STATUS", dataKey: "entry_type" },
        { header: "TARGET", dataKey: "target" },
        { header: "ACHIEVED", dataKey: "achieved" },
        { header: "DATE", dataKey: "target_date" },
      ],
      didParseCell: function(data) {
        if (data.section === "body") {
          if (
            data.column.dataKey === "target" ||
            data.column.dataKey === "achieved"
          ) {
            data.cell.text = data.row.raw[data.column.dataKey] || "-";
          } else if (data.column.dataKey === "date_updated") {
            data.cell.text = new Date(
              data.row.raw.date_updated
            ).toLocaleDateString();
          } else if (data.column.dataKey === "entry_type") {
            const status = [null, "New", "Executed", "Rescheduled"];
            data.cell.text = status[data.row.raw[data.column.dataKey]];
          }
        }
      },
    });

    doc.save(`${props.taskInfo}.pdf`);
  };

  return (
    <div>
      <Img
        onClick={() => exportPDF()}
        src={props.pdfLogo}
        alt="pdf Logo"
        width="30"
        height="37"
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export default Export;
