import React from "react";

//Componente de breadcrumb dinamico, onde se ajusta de acordo com a page que vai estar utilizando conforme o que foi inserido na prop
const Bread = ({ current }) => {
  return (
    <div class="alert alert-light p-0 shadow border-0 mb-4" role="alert">
      {current === "TEMPO REAL" ? (
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb m-0">
            <li class="breadcrumb-item active" aria-current="page">
              <b>TEMPO REAL</b>
            </li>
          </ol>
        </nav>
      ) : (
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb m-0">
            <li class="breadcrumb-item">
              MENU
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              <b>{current}</b>
            </li>
          </ol>
        </nav>
      )}
    </div>
  );
};

export default Bread;
