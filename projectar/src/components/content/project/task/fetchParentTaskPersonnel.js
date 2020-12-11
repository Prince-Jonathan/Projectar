import { trackPromise } from "react-promise-tracker";

const fetchParentTaskPersonnel = async (
  data,
  onFetchData,
  setTasksPersonnel,
  assignedPersonnel
) => {
  // fetch personnel initially assigned to task
  try {
    data.forEach((task) =>
      trackPromise(
        onFetchData(`/api/parent_task/enrolments/${task.id}`)
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
              console.log(
                "task id",
                task.id,
                "the parent task personnel",
                assignedPersonnel
              );
              setTasksPersonnel(assignedPersonnel);
            } catch (err) {}
          })
      )
    );
  } catch (err) {}
};
export default fetchParentTaskPersonnel;
