import { createRoot } from "react-dom/client";
import { base_path } from "./environment";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../src/assets/style/css/feather.css";
import "../src/index.scss";
import "../src/assets/style/icon/boxicons/boxicons/css/boxicons.min.css";
import "../src/assets/style/icon/weather/weathericons.css";
import "../src/assets/style/icon/typicons/typicons.css";
import "../src/assets/style/icon/fontawesome/css/fontawesome.min.css";
import "../src/assets/style/icon/fontawesome/css/all.min.css";
import "../src/assets/style/icon/ionic/ionicons.css";
import "../src/assets/style/icon/tabler-icons/webfont/tabler-icons.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter } from "react-router";
import React from "react";
import ALLRoutes from "./features/router/router.js";
import { AppProvider } from "./core/providers/AppProvider.js";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter basename={base_path}>
        <ALLRoutes />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);
