import type React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store/store";
import OrderManagement from "./Pages/OrderManagement";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

import {
  clearCompany,
  selectCompany,
  selectIsRegistered,
} from "./store/companySilice";
import Registerpage from "./Pages/Register/page";
import { LogOut } from "lucide-react";
import { Button } from "./components/ui/button";
import AlertDialog from "./components/AlertDialog";
import { useState } from "react";
import { clearOrders } from "./store/orderSlice";
import { useToast } from "./components/ui/use-toast";

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
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isRegistered = useSelector(selectIsRegistered);
  const company = useSelector(selectCompany);
  const handleLogout = () => {
    dispatch(clearCompany());
    dispatch(clearOrders());
    setIsDialogOpen(false);
    toast({
      title: "Logout Successful",
      description: " Register your company",
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 relative">
      {isRegistered && (
        <div className="flex justify-between items-center mb-8 sticky">
          <h1 className="text-2xl font-bold text-slate-600 dark:text-primary">{`Hello ${company?.companyName} 👋`}</h1>
          <div className="flex justify-center items-center gap-2 ">
            <div>
              <ModeToggle />
            </div>
            <div>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setIsDialogOpen(true)}
              >
                <LogOut />
              </Button>
            </div>
          </div>
        </div>
      )}
      {isRegistered ? <OrderManagement /> : <Registerpage />}
      <AlertDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        description="Are you sure you want to log out? All your order data will be cleared."
        confirmText="Logout"
        cancelText="Cancel"
      />
    </div>
  );
};

export default App;
