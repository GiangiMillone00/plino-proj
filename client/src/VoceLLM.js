import "./VoceLLM.css";

function VoceLLM({ el }) {
  return (
    <tr>
      <td>{el.id}</td>
      <td>{el.company}</td>
      <td>{el.category}</td>
      <td>{el.release_date}</td>
      <td>{el.model_name}</td>
      <td>{el.num_million_parameters}</td>
    </tr>
  );
}

export default VoceLLM;
