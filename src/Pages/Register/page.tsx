import { getGreeting } from "@/Utils/greetings";
import RegisterForm from "./register-form";

export default function Registerpage() {
  return (
    <main className="flex  flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-slate-600 dark:text-primary">
          {`Welcome ${getGreeting()}👋`}
        </h1>
        <RegisterForm />
      </div>
    </main>
  );
}
