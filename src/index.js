import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, BrowserRouter } from "react-router-dom";
import App from "App";
import "index.css";
import "assets/css/material-dashboard-pro-react.css";
import AuthProvider from "context/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
import Loader from "components/loader/Loader";

// Material Dashboard 3 PRO React Context Provider
import { MaterialUIControllerProvider } from "context";
import StoreProvider from "context/StoreContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: false,
      refetchOnWindowFocus: false, // Pəncərə fokuslananda yenidən fetch etməsin
      retry: 1, // Sorğu uğursuz olarsa, yalnız bir dəfə təkrar etsin
      staleTime: 1000 * 60 * 5, // Məlumat 5 dəqiqə təzə qalsın
    },
  },
});

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <MaterialUIControllerProvider>
        <AuthProvider>
          <StoreProvider>
            <Suspense fallback={<Loader />}>
              <App />
            </Suspense>
          </StoreProvider>
        </AuthProvider>
      </MaterialUIControllerProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
