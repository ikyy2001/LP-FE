import AppRoutes from "./routes";
import ScrollToTop from "./components/ScrollToTop";
import AuthProvider from "./admin/auth/AuthProvider";

export default function App() {
  return(
    <AuthProvider>
      <ScrollToTop />
      <AppRoutes />
    </AuthProvider>
  )
}
