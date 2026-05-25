import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <div className="dark min-h-screen bg-[#0a0118]">
      <RouterProvider router={router} />
    </div>
  );
}
