import "./App.css";
import { useState, useEffect } from "react";
import VoceLLM from "./VoceLLM";
import FormNewVoce from "./FormNewVoce";

function App() {
  const [elencoLLM, setElencoLLM] = useState(null);

  useEffect(() => {
    fetchVoci();
  }, []);

  const fetchVoci = () => {
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

    fetch("http://localhost:8000/llms" + q_str)
      .then((response) => response.json())
      .then((data) => {
        setElencoLLM(data.llms);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleClickFilter = (e) => {
    fetchVoci();
  };

  const handleAddVoce = async (newVoce) => {
    var json = JSON.stringify(newVoce);
    fetch("http://localhost:8000/llm/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === "Elemento duplicato - inserimento non effettuato") {
          alert(data);
        } else {
          fetchVoci();
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <div className="App">
      <div className="leftElenco">
        <h2>Elenco LLMs</h2>
        {elencoLLM == null || elencoLLM.length === 0 ? (
          <div
            style={{
              backgroundColor: "rgba(238, 245, 39, 0.5)",
              padding: "1rem",
              margin: "1rem",
            }}
          >
            Nessun LLMs
          </div>
        ) : (
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
        )}
        <div className="divFiltri">
          <h4>Filtri:</h4>
          <div className="input-group">
            <span>company: </span>
            <input id="txtCompany" name="fCompany"></input>
          </div>
          <div className="input-group">
            <span>category: </span>
            <input id="txtCategory" name="fCategory"></input>
          </div>
          <br />
          <button id="btnFiltra" type="button" onClick={handleClickFilter}>
            Filtra
          </button>
        </div>
      </div>
      <div className="rightInput">
        <FormNewVoce addVoce={handleAddVoce}></FormNewVoce>
      </div>
    </div>
  );
}

export default App;
