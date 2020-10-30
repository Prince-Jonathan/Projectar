import { trackPromise } from "react-promise-tracker";

const fetchTasksPersonnel = async (
  data,
  onFetchData,
  setTasksPersonnel,
  assignedPersonnel
) => {
  try {
    data.forEach((task) =>
      trackPromise(
        onFetchData(`/api/task/enrolments/${task.id}`)
          .then((data) => {
            return data;
          })
          .then(({ data }) => {
            try {
              let personnel = data.map((personnel) => {
                return {
                  label: personnel.name,
                  value: personnel.id,
                  id: task.id,
                };
              });
              assignedPersonnel = assignedPersonnel.concat(personnel);
              setTasksPersonnel(assignedPersonnel);
            } catch (err) {}
          })
      )
    );
  } catch (err) {}
};

export default fetchTasksPersonnel;
