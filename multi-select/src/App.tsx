import { RefObject, useEffect, useRef, useState } from "react";
import "./App.css";

const STATES_ENDPOINT =
  "https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_hash.json";

function App() {
  const refPanel = useRef(null);

  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    async function fetchStates() {
      const response = await fetch(STATES_ENDPOINT);
      const data = await response.json();

      const states = Object.values(data);
      const initialState = states.reduce((acc: any, state: any) => {
        acc[state] = false;
        return acc;
      }, {});

      setSelected(initialState as any);
    }

    fetchStates();
  }, []);

  useEffect(() => {
    const onClick = (e: any) => {
      const withinPanel = (refPanel.current as any).contains(e.target);
      if (!withinPanel) {
        setShow(false);
      } else {
        setShow(true);
      }
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.id;
    const checked = e.target.checked;

    setSelected((prevState) => {
      return {
        ...prevState,
        [name]: checked,
      };
    });
  };

  const handleOnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setShow((prevState) => !prevState);
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;
  const states = Object.keys(selected);

  return (
    <div className="App">
      <div className="wrapper">
        <button onClick={handleOnClick} className="multi-select-button">
          {selectedCount} selected
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            style={{
              width: "1rem",
              height: "1rem",
              rotate: show ? `180deg` : `0deg`,
            }}
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
            />
          </svg>
        </button>

        <ul ref={refPanel} className={show ? "panel" : "panel hide"}>
          {states.map((state) => (
            <li key={state}>
              <input type="checkbox" onChange={handleOnChange} id={state} />
              <label htmlFor={state}>{state}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
