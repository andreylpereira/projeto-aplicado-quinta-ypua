import React from "react";

//O componente deste modal é utilizado para visualizar a imagem dos cards de acomodações nas paginas real-time e accommodation, ele é acionado ao clicar em cima da imagem do card.
const PhotoModal = ({ isVisible, onClose, photo }) => {
  return (
    isVisible && (
      <div
        className={`modal fade ${isVisible ? "show" : ""}`}
        tabIndex="-1"
        aria-labelledby="photoModalLabel"
        aria-hidden={!isVisible}
        style={{ display: isVisible ? "block" : "none" }}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: "600px", maxHeight: "400px", width: "100%" }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="photoModalLabel">
                FOTO
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Fechar"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body p-0">
              <div className="row">
                <div className="mb-3 col-12">
                  <img
                    src={photo}
                    alt="Imagem"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default PhotoModal;
