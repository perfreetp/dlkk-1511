
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import BasicInfoPage from "@/pages/BasicInfoPage";
import IndicatorsPage from "@/pages/IndicatorsPage";
import MaterialsPage from "@/pages/MaterialsPage";
import RectificationPage from "@/pages/RectificationPage";
import ProgressPage from "@/pages/ProgressPage";
import ReceiptPage from "@/pages/ReceiptPage";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/basic-info" replace />} />
          <Route path="/basic-info" element={<BasicInfoPage />} />
          <Route path="/indicators" element={<IndicatorsPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/rectification" element={<RectificationPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/receipt" element={<ReceiptPage />} />
          <Route path="*" element={<Navigate to="/basic-info" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
