console.error = () => {};
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./assets/plugins/nucleo/css/nucleo.css";
import "./assets/scss/argon-dashboard-react.scss";
import "./assets/scss/home/App.scss";
import AutoLogout from "./services/autologout";
import QueryProvider from "./services/queryProvider";
import { persistor, store } from "./store/configureStore";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <QueryProvider>
          <AutoLogout />
          <App />
        </QueryProvider>
      </Router>
    </PersistGate>
  </Provider>
);
