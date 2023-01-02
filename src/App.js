import { React, useState } from "react";
import axios from "axios";
var datosEstado = require("./assets/caca.json");

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [value, setValue] = useState("");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=2be84ea4002e761fa49644950129ac75&lang=es`;

  const buscarLocacion = (event) => {
    setValue(event.target.value);
    if (event.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
      });
    }
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=metric&appid=2be84ea4002e761fa49644950129ac75&lang=es`;
    axios.get(url).then((response) => {
      setData(response.data);
    });
  };

  //para llenar de ceros a la izquierda
  function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }

  //convertir UNIX TIMESTAMP a hora hombre
  const convertirHora = (datos) => {
    var fecha = new Date(datos * 1000);
    return pad(fecha.getHours(), 2) + ":" + pad(fecha.getMinutes(), 2);
  };

  return (
    <div className="app">
      <div className="fondo">
        {data.weather ? (
          <img
            src={`https://source.unsplash.com/640x426/?${data.weather[0].description}`}
            className="imagenfondo"
          />
        ) : null}
      </div>
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={buscarLocacion}
          placeholder="Buscar locación"
          type="text"
        />
        <div className="dropdown">
          {datosEstado
            .filter((item) => {
              const searchTerm = value.toLowerCase();
              const fullName = item.toLowerCase();

              return (
                searchTerm &&
                fullName.startsWith(searchTerm) &&
                fullName !== searchTerm
              );
            })
            .slice(0, 10)
            .map((item) => (
              <div
                onClick={() => onSearch(item)}
                className="dropdown-row"
                key={item}
              >
                {item}
              </div>
            ))}
        </div>
      </div>

      {data.name != undefined && (
        <div className="container">
          <div className="top">
            <div className="location">
              <p>
                {data.name} ({data.sys ? data.sys.country : null})
              </p>
            </div>
            <div className="temp">
              {data.main ? <p>{data.main.temp.toFixed(1)} °C</p> : null}
            </div>
            <div className="description">
              {data.weather ? (
                <img
                  src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  className="imagen"
                />
              ) : null}
              {data.weather ? (
                <p className="des">{data.weather[0].description}</p>
              ) : null}
            </div>
          </div>

          {data.name != undefined && (
            <div className="bottom">
              <div className="feels">
                {data.main ? (
                  <p className="bold">{data.main.feels_like.toFixed(1)} °C</p>
                ) : null}
                <p>Sensación real</p>
              </div>
              <div className="separator"></div>
              <div className="humidity">
                {data.main ? (
                  <p className="bold">{data.main.humidity}%</p>
                ) : null}
                <p>Humedad</p>
              </div>
              <div className="separator"></div>
              <div className="wind">
                {data.main ? (
                  <p className="bold">{data.wind.speed.toFixed(1)} Km/h</p>
                ) : null}
                <p>Velocidad de viento</p>
              </div>
            </div>
          )}

          {data.name != undefined && (
            <div className="bottom">
              <div className="feels">
                {data.main ? (
                  <p className="bold">{data.main.temp_max.toFixed(1)} °C</p>
                ) : null}
                <p>Temp. Máxima</p>
              </div>
              <div className="separator"></div>
              <div className="humidity">
                {data.main ? (
                  <p className="bold">{data.main.temp_min.toFixed(1)} °C</p>
                ) : null}
                <p>Temp. Mínima</p>
              </div>
              <div className="separator"></div>
              <div className="wind">
                {data.sys ? (
                  <p className="bold">{convertirHora(data.sys.sunrise)}</p>
                ) : null}
                <p>Amanecer</p>
              </div>
              <div className="separator"></div>
              <div className="wind">
                {data.sys ? (
                  <p className="bold">{convertirHora(data.sys.sunset)}</p>
                ) : null}
                <p>Anochecer</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
