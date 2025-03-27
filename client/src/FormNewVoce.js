import { useState } from "react";
import "./FormNewVoce.css";

function FormNewVoce({ addVoce }) {
  const [NewVoce, setNewVoce] = useState({
    id: "0",
    company: "",
    category: "",
    release_date: "",
    model_name: "",
    num_million_parameters: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVoce({
      ...NewVoce,
      [name]: value,
    });
  };

  const handleSubmitNewVoce = (e) => {
    e.preventDefault();
    if (
      NewVoce.company !== "" &&
      NewVoce.category !== "" &&
      NewVoce.release_date !== "" &&
      NewVoce.model_name !== "" &&
      NewVoce.num_million_parameters !== ""
    ) {
      addVoce(NewVoce);
      setNewVoce({
        id: "0",
        company: "",
        category: "",
        release_date: "",
        model_name: "",
        num_million_parameters: "",
      });
    } else {
      alert("Compilare tutti i campi");
    }
  };

  return (
    <form onSubmit={handleSubmitNewVoce} className="formInput">
      <h3>Nuova voce</h3>
      company:{" "}
      <input
        type="text"
        id="txtCompanyNew"
        onChange={handleInputChange}
        name="company"
        value={NewVoce.company}
      ></input>
      category:{" "}
      <input
        type="text"
        id="txtCategoryNew"
        onChange={handleInputChange}
        name="category"
        value={NewVoce.category}
      ></input>
      release_date:{" "}
      <input
        type="text"
        id="txtReleaseDateNew"
        onChange={handleInputChange}
        name="release_date"
        value={NewVoce.release_date}
      ></input>
      model_name:{" "}
      <input
        type="text"
        id="txtModelNameNew"
        onChange={handleInputChange}
        name="model_name"
        value={NewVoce.model_name}
      ></input>
      num_million_parameters:
      <input
        type="text"
        id="txtNumMillParNew"
        onChange={handleInputChange}
        name="num_million_parameters"
        value={NewVoce.num_million_parameters}
      ></input>
      <button type="submit" id="btnNewVoce">
        Aggiungi Voce
      </button>
    </form>
  );
}

export default FormNewVoce;
