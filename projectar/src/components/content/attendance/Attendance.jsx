import React from "react";
import Attendance from "react-attendance";

const Attend = (props) => {
  return (
    <div>
      <Attendance
        hostId={1}
        staffId={2}
        year={2011}
        semester={2}
        educationClass="science"
        room={2}
        month="May"
        token={15}
        // onStatusChanged={}
      />
    </div>
  );
};

export default Attend;
