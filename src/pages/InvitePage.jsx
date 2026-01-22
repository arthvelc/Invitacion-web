import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import RetroWindow from "../components/RetroWindow.jsx";
import Tabs from "../components/Tabs.jsx";

const TABS = ["FOTOS", "LUGAR", "CONFIRMAR"];

export default function InvitePage() {
  const { code } = useParams();

  // MVP: mock (luego lo conectas a API)
  const invite = useMemo(
    () => ({
      code,
      name: "Elizabeth Kanazhimi°",
      attending: null, // null | true | false
    }),
    [code]
  );

  const [tab, setTab] = useState("FOTOS");
  const [nameInput, setNameInput] = useState("");

  function confirm(attending) {
    // aquí luego pegas tu fetch al backend
    alert(attending ? "Confirmado ✅" : "No asistiré ❌");
  }

  return (
    <div className="page">
      <RetroWindow
        titleLeft={invite.name}
        titleRight={`${invite.name} 30's`}
      >
        <Tabs value={tab} onChange={setTab} items={TABS} />

        {/* HEADER + FOTO + TITULO */}
        <div className="panel panel--top">
          <div className="leftPhoto">
            <img
              className="coverImg"
              src={`${import.meta.env.BASE_URL}images/cover.webp`}
              alt="Foto cover"
            />
          </div>

          <div className="rightHead">
            <div className="headline">
              ✨TENER 30, SER COQUETA Y PRÓSPERA✨
            </div>

            <div className="saysBox">
              <div className="saysName">{invite.name} ✨ dice:</div>
              <div className="saysMsg">¡Estás invitadx a celebrar miiz 30s!</div>
            </div>
          </div>
        </div>

        {/* BODY (varía por tab) */}
        {tab === "FOTOS" && (
          <>
            <div className="textBlock">
              <p>
                Esta fiesta es para celebrar el inicio de una nueva etapa en mi
                vida y deseo que estés conmigo. Te invito a recordar, agradecer
                el camino recorrido y celebrar que crecer también puede ser
                emocionante.
              </p>
              <p>
                Una noche para volver a los 2000’s, los brillos, al desorden
                bonito y a esa época en la que todo se sentía más ligero.
              </p>
            </div>

            <InfoBlock />

            <LocationBlock />

            <ConfirmBlock
              nameInput={nameInput}
              setNameInput={setNameInput}
              onConfirmYes={() => confirm(true)}
            />

            <CollageContinuation />
          </>
        )}

        {tab === "LUGAR" && (
          <>
            <LocationBlock />
            <div className="spacer" />
            <CollageContinuation />
          </>
        )}

        {tab === "CONFIRMAR" && (
          <>
            <ConfirmBlock
              nameInput={nameInput}
              setNameInput={setNameInput}
              onConfirmYes={() => confirm(true)}
            />
            <div className="spacer" />
            <CollageContinuation />
          </>
        )}
      </RetroWindow>
    </div>
  );
}

function InfoBlock() {
  return (
    <div className="infoWrap">
      <div className="infoTitle">Info... ✨°</div>

      <div className="infoGrid">
        <div className="infoRow">
          <div className="infoIcon">📅</div>
          <div>
            <div className="infoLabel">Cuando:</div>
            <div className="infoValue">Este 7 de Febrero</div>
          </div>
        </div>

        <div className="infoRow">
          <div className="infoIcon">⏰</div>
          <div>
            <div className="infoLabel">Hora:</div>
            <div className="infoValue">4:30 PM</div>
          </div>
        </div>

        <div className="infoRow">
          <div className="infoIcon">🩵</div>
          <div>
            <div className="infoLabel">Dress code:</div>
            <div className="infoValue">2000’s. Sin pena, con orgullo.</div>
          </div>
        </div>

        <div className="infoRow">
          <div className="infoIcon">📍</div>
          <div>
            <div className="infoLabel">Lugar:</div>
            <div className="infoValue">
              Jose María Roa Bárcenas 131, Obrera, Cuauhtémoc, CDMX
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LocationBlock() {
  return (
    <div className="locWrap">
      <div className="locTitle">Lug4r ✨°</div>

      <a
        className="mapsLink"
        href="https://maps.google.com/?q=Jose%20Maria%20Roa%20Barcenas%20131%20Obrera%20CDMX"
        target="_blank"
        rel="noreferrer"
      >
        📍 Google Maps
      </a>

      <div className="mapFrame">
        <iframe
          title="map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Jose%20Maria%20Roa%20Barcenas%20131%20Obrera%20CDMX&output=embed"
        />
      </div>

      <div className="smallNote">
        Metro más cercano: Chabacano línea azul
      </div>
    </div>
  );
}

function ConfirmBlock({ nameInput, setNameInput, onConfirmYes }) {
  return (
    <div className="confirmWrap">
      <div className="confirmText">
        Dime si vienes a revivir los 2000’s conmigo ✨
        <br />
        Deja tu nombre y sabré que me acompañacompañás.
      </div>

      <div className="confirmGrid">
        <div className="duckBox">
          <img
            className="duckImg"
            src={`${import.meta.env.BASE_URL}images/patito.webp`}
            alt="Patito"
          />
        </div>

        <div className="confirmCard">
          <div className="confirmHeader">
            <span className="confirmTitle">Confirmo</span>
            <span className="confirmWave">〰〰〰</span>
          </div>

          <label className="field">
            <span>Tu Nombre:</span>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Escribe tu nombre"
            />
          </label>

          <button className="confirmBtn" onClick={onConfirmYes} type="button">
            Confirmar ✅
          </button>

          <div className="qrArea">
            <div className="qrLabel">Tu QR de entrada:</div>
            <img className="qrImg" src="/qr.png" alt="QR" />
            <div className="qrHint">(por ahora todos traen el mismo 😄)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CollageContinuation() {
  return (
    <div className="collageWrap">
      <div className="collageHeader">✨TENER 30, SER COQUETA Y PRÓSPERA✨</div>

      {/* Parte 2: el collage-top.jpg será el FONDO repetible; el contenido va encima */}
      <div
        className="collageSection collageSection--bg"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/collageImages/collage-top.jpg)`,
        }}
      >
        <div className="collageOverlay">
          {/* 1) Imagen a 100% ancho */}
          <img
            className="collageBlock collageBlock--full"
            src={`${import.meta.env.BASE_URL}images/collageImages/collage-1.png`}
            alt=""
          />

          {/* 2) Dos imágenes 50 / 50 */}
          <div className="collageBlock collageBlock--two">
            <img className="collageTile" src="" alt="" />
            <img
              className="collageTile"
              src={`${import.meta.env.BASE_URL}images/collageImages/collage-2.png`}
              alt=""
            />
          </div>

          <p className="collageText">LIMPIA TU CASA, COMIENZA OTRA VEZ…</p>

          {/* 3) (Ejemplo) Otra imagen a 100% ancho */}
          <img
            className="collageBlock collageBlock--full"
            src={`${import.meta.env.BASE_URL}images/collageImages/collage-3.png`}
            alt=""
          />

          <p className="collageText">
            UN POCO DE AUTOCOMPASIÓN ESTÁ BIEN, PERO ES HORA DE SEGUIR ADELANTE.
          </p>

          {/* 4) (Ejemplo) Dos imágenes 50 / 50 */}
          <div className="collageBlock collageBlock--two">
            <img className="collageTile" src="" alt="" />
            <img className="collageTile" src="" alt="" />
          </div>

          <p className="collageText">SENTIRÁS DOLOR…</p>

          {/* 5) (Ejemplo) Dos imágenes 50 / 50 */}
          <div className="collageBlock collageBlock--two">
            <img className="collageTile" src="" alt="" />
            <img className="collageTile" src="" alt="" />
          </div>

          <p className="collageText">…PERO ASÍ ES LA VIDA</p>
        </div>
      </div>

      {/* <div className="collageSection twoBoxes">
        <div className="emptyBox" />
        <div className="emptyBox" />
      </div> */}

      {/* <div className="collageSection">
        <img className="collageImg" src={`${import.meta.env.BASE_URL}collage-mid-1.webp`} alt="Collage mid 1" />
      </div>

      <div className="collageSection">
        <img className="collageImg" src={`${import.meta.env.BASE_URL}collage-mid-2.webp`} alt="Collage mid 2" />
      </div>

      <div className="collageSection twoBoxes">
        <div className="emptyBox" />
        <div className="emptyBox" />
      </div>

      <div className="collageSection">
        <img
          className="collageImg"
          src={`${import.meta.env.BASE_URL}collage-bottom.webp`}
          alt="Collage bottom"
        />
      </div> */}
    </div>
  );
}