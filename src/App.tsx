import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Company from "./pages/companies";

function App() {
    const queryClient = new QueryClient();
    const token = localStorage.getItem("token");

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {token ? (
                        <>
                            <Route path="/" element={<Navigate to="/company" replace />} />
                            <Route path="/company" element={<Company />} />
                        </>
                    ) : (
                        <>
                            <Route path="/" element={<Navigate to="/sign-in" replace />} />
                            <Route path="/company" element={<Navigate to="/sign-in" replace />} />
                            <Route path="/sign-in" element={<SignIn />} />
                            <Route path="/sign-up" element={<SignUp />} />
                        </>
                    )}
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
