import type React from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "./store/store";
import OrderManagement from "./Pages/OrderManagement";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

import { selectCompany, selectIsRegistered } from "./store/companySilice";
import Registerpage from "./Pages/Register/page";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Toaster />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

const AppContent: React.FC = () => {
  const isRegistered = useSelector(selectIsRegistered);
  const company = useSelector(selectCompany);

  return (
    <div className="container mx-auto py-10 px-4 relative">
      {isRegistered && (
        <div className="flex justify-between items-center mb-8 sticky">
          <h1 className="text-2xl font-bold text-slate-600 dark:text-primary">{`Hello ${company?.companyName} 👋`}</h1>

          <ModeToggle />
        </div>
      )}
      {isRegistered ? <OrderManagement /> : <Registerpage />}
    </div>
  );
};

export default App;
