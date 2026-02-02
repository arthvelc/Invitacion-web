import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import RetroWindow from "../components/RetroWindow.jsx";
import Tabs from "../components/Tabs.jsx";

import confetti from "canvas-confetti";


const TABS = ["FOTOS", "LUGAR", "CONFIRMAR"];
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
const NAME_MAX = 40;
const NAME_MIN = 3;
const LOADER_MS = 5000; // mínimo visible (ms)
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s']+$/;

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
  const [isPosting, setIsPosting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [lastAttending, setLastAttending] = useState(null); // null | true | false
  const [hideNameField, setHideNameField] = useState(false);

  const explodingRef = useRef(false);
  const confirmBtnRef = useRef(null);

  const confettiDefaults = {
    particleCount: 220,
    spread: 80,
    angle: 50,
  };

  const fire = (particleRatio, opts) => {
    confetti(
      Object.assign({}, confettiDefaults, opts, {
        particleCount: Math.floor(confettiDefaults.particleCount * particleRatio),
      })
    );
  };

  const triggerConfetti = () => {
    if (explodingRef.current) return;
    explodingRef.current = true;

    // Button rubber-band (no animate.css dependency)
    if (confirmBtnRef.current) {
      confirmBtnRef.current.classList.remove("rubberBand");
      // Force reflow so it can restart
      void confirmBtnRef.current.offsetWidth;
      confirmBtnRef.current.classList.add("rubberBand");
    }

    window.setTimeout(() => {
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.15 });
      fire(0.1, { spread: 120, startVelocity: 45 });

      window.setTimeout(() => {
        if (confirmBtnRef.current) confirmBtnRef.current.classList.remove("rubberBand");
        explodingRef.current = false;
      }, 420);
    }, 120);
  };

  const trimmedName = nameInput.trim();
  const nameTooLong = trimmedName.length > NAME_MAX;
  const nameHasInvalidChars = trimmedName.length > 0 && !NAME_REGEX.test(trimmedName);
  const nameIsValid = trimmedName.length >= NAME_MIN && !nameTooLong && !nameHasInvalidChars;

  async function confirm(attending) {
    // Messenger-like buzz on the whole page (InvitePage)
    const page = document.querySelector(".page");
    if (page) {
      page.classList.remove("page-buzz");
      // Force reflow so the animation can restart
      void page.offsetWidth;
      page.classList.add("page-buzz");
    }

    // Optional real vibration on supported devices
    if (window.navigator.vibrate) {
      window.navigator.vibrate(attending ? [20, 30, 20] : [15, 20, 15, 20, 15]);
    }

    // Validation: if invalid, just show the red state (no messages)
    if (!nameIsValid || isPosting) return;

    let didSucceed = false;
    let pendingAttending = null;

    let startedAt = 0;
    try {
      startedAt = Date.now();
      setShowLoader(true);
      setIsPosting(true);
      const res = await fetch(`${API_BASE}/api/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          attending,
        }),
      });

      // If server errors, silently ignore (no UI messages requested)
      if (!res.ok) return;

      didSucceed = true;
      pendingAttending = attending;

      // Confetti only for YES
      if (attending === true) triggerConfetti();

      // Clear after success
      setNameInput("");
    } catch (e) {
      // Silent fail (no UI messages requested)
    } finally {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, LOADER_MS - elapsed);
      window.setTimeout(() => {
        // 1) First hide the loader
        setShowLoader(false);

        // 2) Then reveal QR/message right after the loader is gone
        window.setTimeout(() => {
          if (didSucceed) {
            setLastAttending(pendingAttending);
            setShowQr(pendingAttending === true);
            setHideNameField(true);
          }
        }, 60);
      }, remaining);
      setIsPosting(false);
    }
  }

  return (
    <div className="page">
      <RetroWindow
        titleLeft={invite.name}
        titleRight={`${invite.name} 30's`}
      >
        <Tabs value={tab} onChange={setTab} items={TABS} />
        {__inviteInlineStyles}

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
              onConfirmNo={() => confirm(false)}
              nameIsValid={nameIsValid}
              isPosting={isPosting}
              showLoader={showLoader}
              confirmBtnRef={confirmBtnRef}
              showQr={showQr}
              lastAttending={lastAttending}
              hideNameField={hideNameField}
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
              onConfirmNo={() => confirm(false)}
              nameIsValid={nameIsValid}
              isPosting={isPosting}
              showLoader={showLoader}
              confirmBtnRef={confirmBtnRef}
              showQr={showQr}
              lastAttending={lastAttending}
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

function ConfirmBlock({ nameInput, setNameInput, nameIsValid, isPosting, showLoader, onConfirmYes, onConfirmNo, confirmBtnRef, showQr, lastAttending, hideNameField }) {
  return (
    <div className="confirmWrap">
      <div className="confirmText">
        Dime si vienes a revivir los 2000’s conmigo ✨
        <br />
        Deja tu nombre y sabré que me acompañas.
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

          {!hideNameField && (
          <label className={`field ${!nameIsValid && nameInput.trim().length > 0 ? "is-invalid" : ""}`}>
            <span>Tu Nombre:</span>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Escribe tu nombre"
              maxLength={NAME_MAX}
              autoComplete="name"
              inputMode="text"
              autoCapitalize="words"
            />
          </label>
        )}

          {showLoader ? (
            <div className="dino-loader" aria-label="Enviando confirmación">
              <div className="dino-runner" />
              <div className="dino-obstacle" />
              <div className="dino-ground" />
            </div>
          ) : (
            <>
              <button
                ref={confirmBtnRef}
                className="confirmBtn"
                onClick={onConfirmYes}
                type="button"
                disabled={!nameIsValid || isPosting}
              >
                {isPosting ? "Enviando..." : "Confirmar ✅"}
              </button>
              <button
                className="confirmBtn confirmBtn--no"
                onClick={onConfirmNo}
                type="button"
                disabled={!nameIsValid || isPosting}
              >
                {isPosting ? "Enviando..." : "No asistiré ❌"}
              </button>
            </>
          )}


          {showQr ? (
            <div className="qrArea">
              <div className="qrLabel">Tu QR de entrada:</div>
              <img
                className="qrImg"
                src={`${import.meta.env.BASE_URL}images/miFieta.png`}
                alt="QR"
              />
              <div className="qrHint"></div>
            </div>
          ) : lastAttending === false ? (
            <div className="qrArea">
              <div className="qrHint">ah, orale va, ahí se ve (no es cierto gracias por avisar)</div>
            </div>
          ) : null}
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

      <p className="collageText">LIMPIA TU CASA, COMIENZA OTRA VEZ…</p>

      {/* 2) Dos imágenes 50 / 50 */}
      <div className="collageBlock collageBlock--two">
        
        <img
          className="collageTile"
          src={`${import.meta.env.BASE_URL}images/collageImages/collage-4.png`}
          alt=""
        />
        <img
          className="collageTile"
          src={`${import.meta.env.BASE_URL}images/collageImages/collage-5.png`}
          alt=""
        />
      </div>

          <p className="collageText">
            UN POCO DE AUTOCOMPASIÓN ESTÁ BIEN, PERO ES HORA DE SEGUIR ADELANTE.
          </p>

          {/* 3) (Ejemplo) Otra imagen a 100% ancho */}
          <img
            className="collageBlock collageBlock--full"
            src={`${import.meta.env.BASE_URL}images/collageImages/collage-3.png`}
            alt=""
          />

         <p className="collageText">SENTIRÁS DOLOR…</p>   

      {/* 4) (Ejemplo) Dos imágenes 50 / 50 */}
      <div className="collageBlock collageBlock--two">
        <img
          className="collageTile"
          src={`${import.meta.env.BASE_URL}images/collageImages/collage-6.png`}
          alt=""
        />
        <img
          className="collageTile"
          src={`${import.meta.env.BASE_URL}images/collageImages/collage-4.png`}
          alt=""
        />
      </div>
      <p className="collageText">…PERO ASÍ ES LA VIDA</p>

        

      {/* 5) (Ejemplo) Dos imágenes 50 / 50 */}
      <div className="collageBlock collageBlock--two">
        <div className="collageTile " aria-hidden="true" />
        <div className="collageTile " aria-hidden="true" />
      </div>

          
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
// Safety styles for missing CSS
const __inviteInlineStyles = (
  <style>{`
    .confirmBtn--no { margin-top: 8px; opacity: 0.95; }
    .collageTile--empty { display: block; width: 100%; min-height: 120px; }
    .field.is-invalid span { color: #ff3b30; }
    .field.is-invalid input {
      border-color: #ff3b30;
      box-shadow: 0 0 0 3px rgba(255,59,48,.18);
    }
    .confirmBtn:disabled{
      opacity: .55;
      cursor: not-allowed;
      filter: none;
    }

    .rubberBand{
      animation: rubberBand 0.55s both;
    }

    @keyframes rubberBand {
      0%   { transform: scale3d(1, 1, 1); }
      30%  { transform: scale3d(1.18, 0.92, 1); }
      40%  { transform: scale3d(0.92, 1.12, 1); }
      50%  { transform: scale3d(1.12, 0.96, 1); }
      65%  { transform: scale3d(0.98, 1.06, 1); }
      75%  { transform: scale3d(1.04, 0.98, 1); }
      100% { transform: scale3d(1, 1, 1); }
    }

    /* Messenger-like buzz */
    .page.page-buzz {
      animation: pageBuzz 0.42s cubic-bezier(.2,.9,.2,1);
    }

    @keyframes pageBuzz {
      0%   { transform: translateX(0) rotate(0deg); }
      10%  { transform: translateX(-6px) rotate(-0.4deg); }
      20%  { transform: translateX(6px)  rotate(0.4deg); }
      30%  { transform: translateX(-5px) rotate(-0.35deg); }
      40%  { transform: translateX(5px)  rotate(0.35deg); }
      50%  { transform: translateX(-3px) rotate(-0.2deg); }
      60%  { transform: translateX(3px)  rotate(0.2deg); }
      70%  { transform: translateX(-2px) rotate(-0.12deg); }
      80%  { transform: translateX(2px)  rotate(0.12deg); }
      90%  { transform: translateX(-1px) rotate(-0.06deg); }
      100% { transform: translateX(0) rotate(0deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .page.page-buzz { animation: none; }
    }

    /* Dino loader (Uiverse.io - adapted) */
    .dino-loader {
      width: 100%;
      max-width: 420px;
      height: 120px;
      position: relative;
      overflow: hidden;
      margin: 6px auto 0;
      border-bottom: 1px solid rgba(7,52,74,.18);
      display: flex;
      justify-content: center;
      border-radius: 10px;
      background: rgba(234,248,255,.75);
    }

    .dino-runner {
      width: 44px;
      height: 47px;
      position: absolute;
      bottom: 12px;
      left: 50%;
      margin-left: -22px;
      z-index: 2;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQgAAAAvAgMAAABiRrxWAAAADFBMVEX///9TU1P39/f///+TS9URAAAAAXRSTlMAQObYZgAAAPpJREFUeF7d0jFKRkEMhdGLMM307itNLALyVmHvJuzTDMjdn72E95PGFEZSmeoU4YMMgxhskvQec8YSVFX1NhGcS5ywtbmC8khcZeKq+ZWJ4F8Sr2+ZCErjkJFEfcjAc/6/BMlfcz6xHdhRthYzIZhIHMcTVY1scUUiAphK8CMSPUbieTBhvD9Lj0vyV4wklEGzHpciKGOJoBp7XDcFs4kWxxM7Ey3iZ8JbzASAvMS7XLOJHTTvEkEZSeQl7DMuwVyCasqK5+XzQRYLUJlMbPXjFcn3m8eKBSjWZMJwvGIOvViAzCbUj1VEDoqFOEQGE3SyInJQLOQMJL4B7enP1UbLXJQAAAAASUVORK5CYII=");
      background-repeat: no-repeat;
      background-size: auto 100%;
      animation:
        dinoRun 0.25s infinite steps(2),
        dinoJump 1.5s infinite linear;
    }

    .dino-obstacle {
      width: 17px;
      height: 35px;
      position: absolute;
      bottom: 12px;
      right: -50px;
      z-index: 1;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAAAjCAMAAABRlI+PAAAADFBMVEX////////39/dTU1PhglcSAAAAAXRSTlMAQObYZgAAAPNJREFUeF7tlkEKwzAMBLXr//+5iQhU7gRRQkyhZI+DhwH74jhmO+oIJBVwURljuAXagG5QqkSgBLqg3JnxJ1Cb8SmQ3o6gpO85owGlOB4m2BNKJ11BSd01owGlOHkcIAuHkz6UNpPKgozPM54dADHjJuNhZiJxdQCQgZJeBczgCAAy3yhPJvcnmdC9mZwBIsQMFV5AkzHBNknFgcKM+oyDIFcfCAoy03m+jSMIcmoVZkKqSjr1fghyahRmoKRUHYLiSI1SMlCq5CDgX6BXmKkfn+oQ0KEyyrzoy8GbXJ9xrM/YjhUZgl9nnsyTCe9rgSRdV15CwRcIEu8GGQAAAABJRU5ErkJggg==");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      animation: moveObstacle 1.5s infinite linear;
    }

    .dino-ground {
      width: 100%;
      height: 12px;
      position: absolute;
      bottom: 5px;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAAAMAgMAAAAPCKxBAAAABlBMVEX///9TU1NYzE1OAAAAAXRSTlMAQObYZgAAALJJREFUeF7t1EEKAyEMhtEvMNm7sPfJEVyY+1+ltLgYAsrQCtWhbxEhQvgxIJtSZypxa/WGshgzKdbq/UihMFMlt3o/CspEYoihIMaAb6mCvM6C+BTAeyo+wN4yykV/6pVfkdLpVyI1hh7GJ6QunUoLEQlQglNP2nkQkeF8+ei9cLxMue1qxVRfk1Ej0s6AEGWfVOk0QUtnK5Xo0Lac6wpdtnQqB6VxomPaz+dgF1PaqqmeWJlz1jYUaSIAAAAASUVORK5CYII=");
      background-repeat: repeat-x;
      animation: moveGround 4s linear infinite;
      opacity: .9;
    }

    @keyframes dinoRun {
      from { background-position: -44px 0; }
      to   { background-position: -132px 0; }
    }

    @keyframes dinoJump {
      0%, 35% { transform: translateY(0); }
      50%     { transform: translateY(-60px); }
      65%, 100% { transform: translateY(0); }
    }

    @keyframes moveObstacle {
      0% { right: -50px; }
      100% { right: 100%; }
    }

    @keyframes moveGround {
      from { background-position: 0 0; }
      to   { background-position: -1200px 0; }
    }
  `}</style>
);