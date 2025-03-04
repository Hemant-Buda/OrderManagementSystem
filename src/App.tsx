import type React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import OrderManagement from "./Pages/OrderManagement";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { getGreeting } from "./Utils/greetings";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
      <Provider store={store}>
        <div className=" container mx-auto py-10 px-4 relative">
          <div className="flex justify-between items-center  mb-8 sticky ">
            <h1 className="text-2xl font-bold text-slate-600 dark:text-primary">{`Hello ${getGreeting()} 👋`}</h1>
            <ModeToggle />
          </div>
          <OrderManagement />
        </div>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
