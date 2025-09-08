import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Slide, ToastContainer } from 'react-toastify';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import '../src/assets/style/css/feather.css';
import '../src/assets/style/icon/boxicons/boxicons/css/boxicons.min.css';
import '../src/assets/style/icon/fontawesome/css/all.min.css';
import '../src/assets/style/icon/fontawesome/css/fontawesome.min.css';
import '../src/assets/style/icon/ionic/ionicons.css';
import '../src/assets/style/icon/tabler-icons/webfont/tabler-icons.css';
import '../src/assets/style/icon/typicons/typicons.css';
import '../src/assets/style/icon/weather/weathericons.css';
import '../src/index.scss';
import { AppProvider } from './core/providers/AppProvider.js';
import { base_path } from './environment';
import ALLRoutes from './features/router/router.js';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter basename={base_path}>
        <ALLRoutes />
      </BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </AppProvider>
  </React.StrictMode>,
);
