import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import VoceLLM from "./VoceLLM";
import FormNewVoce from "./FormNewVoce";

function App() {
  const [elencoLLM, setElencoLLM] = useState(null);

  const reloadData = useEffect(() => {
    fetch("http://localhost:8000/llms")
      .then((response) => response.json())
      .then((data) => {
        setElencoLLM(data.llms);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    var queries = [];
    if (document.getElementById("txtCategory").value !== "") {
      queries.push(
        document.getElementById("txtCategory").name +
          "=" +
          document.getElementById("txtCategory").value
      );
    }
    if (document.getElementById("txtCompany").value !== "") {
      queries.push(
        document.getElementById("txtCompany").name +
          "=" +
          document.getElementById("txtCompany").value
      );
    }

    var q_str = "";
    if (queries !== "") q_str = "?" + queries.join("&");

    console.log(q_str);

    fetch("http://localhost:8000/llms" + q_str)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setElencoLLM(data.llms);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  if (elencoLLM == null) {
    return (
      <div className="App">
        <h2>Elenco LLMs</h2>
        <div>Nessun LLMs</div>
      </div>
    );
  }
  return (
    <div className="App">
      <div className="leftElenco">
        <h2>Elenco LLMs</h2>
        <table className="tableLLM">
          <thead>
            <tr>
              <th>ID</th>
              <th>company</th>
              <th>category</th>
              <th>release_date</th>
              <th>model_name</th>
              <th>num_million_parameters</th>
            </tr>
          </thead>
          <tbody>
            {elencoLLM.map((element) => {
              return <VoceLLM key={element.id} el={element}></VoceLLM>;
            })}
          </tbody>
        </table>

        <form onSubmit={handleSubmit}>
          Filtri:
          <br />
          company:<input id="txtCompany" name="fCompany"></input>
          category:<input id="txtCategory" name="fCategory"></input>
          <br />
          <button id="btnFiltra" type="submit">
            Filtra
          </button>
        </form>
      </div>
      <div className="rightInput">
        <FormNewVoce reloadData={reloadData}></FormNewVoce>
      </div>
    </div>
  );
}

export default App;
