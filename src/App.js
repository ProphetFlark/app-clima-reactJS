import { React, useState } from "react";
import axios from "axios";

var datosEstado = require("./assets/caca.json");

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [value, setValue] = useState("");

  const [datosEstado1, setDatosEstado1] = useState(datosEstado);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=2be84ea4002e761fa49644950129ac75&lang=es`;

  const buscarLocacion = (event) => {
    setValue(event.target.value);
    if (event.key === "Enter") {
      axios.get(url).then((response) => {
        setData(response.data);
      });
    }
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

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    const newOptions = datosEstado1.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(newOptions.slice(0, 10));
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
          list="paises"
          onInput={handleInputChange}
        />
        <datalist id="paises">
          {filteredOptions.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </datalist>
      </div>

      {data.name ? (
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

          <div className="bottom">
            <div className="feels">
              {data.main ? (
                <p className="bold">{data.main.feels_like.toFixed(1)} °C</p>
              ) : null}
              <p>Sensación real</p>
            </div>
            <div className="separator"></div>
            <div className="humidity">
              {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
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
        </div>
      ) : (
        <div className="inicio">
          <div className="bienvenida">
            <div className="titulobien">
              <h2>¡Bienvenido!</h2>
              <br />
              <hr />
              <br />
              <h3>Haz una búsqueda de algún país o región.</h3>
            </div>
            <div className="footerbien">
              <h4>
                *si alguna búsqueda no aparece, es debido a los datos de
                openWeather que no están disponibles.
              </h4>
            </div>
          </div>
          <img
            src={`https://images.unsplash.com/photo-1516774935807-3f60068700d3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=426&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2xpbWF8fHx8fHwxNjczMTI0Mjg2&ixlib=rb-4.0.3&q=80&w=640`}
            className="imageninicio"
          />
        </div>
      )}
    </div>
  );
}

export default App;
