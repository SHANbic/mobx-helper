import React from "react";
import ReactDOM from "react-dom";
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";
import Counter from "./models/counter";

const appState = new Counter();

const App = observer(({ store }) => (
  <div>
    <DevTools />
    <div className="count">{store.count}</div>
    <button onClick={() => store.remove()}> - </button>
    <button onClick={() => store.add()}> + </button>
    <div>Ton chiffre au carré est égal à {store.square}</div>

    <style>
      {`
      * {
        margin-bottom: 10px;
      }

      .count{
        width: 50px;
        text-align: center;
        border: 1px solid;
        border-radius: 5px / 10px
      }

      button{
        margin-right: 8px;
      }
    `}
    </style>
  </div>
));

ReactDOM.render(<App store={appState} />, document.querySelector("#root"));
