import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import UploadPage from './features/datasets/UploadPage';
import DatasetOverview from './features/datasets/DatasetOverview';
import { ReviewPage } from './features/review/ReviewPage';
import { SchemaPage } from './features/schema/SchemaPage';

import { OverviewDashboard } from './features/dashboard/OverviewDashboard';
import { ProductDetailPage } from './features/products/ProductDetailPage';

import { JobsDashboard } from './features/jobs/JobsDashboard';
import { EvidenceRegistry } from './features/evidence/EvidenceRegistry';
import { AnalyticsDashboard } from './features/analytics/AnalyticsDashboard';

import { LandingPage } from './features/landing/LandingPage';
import { DemoAccessPage } from './features/landing/DemoAccessPage';
import { SettingsPage } from './features/settings/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Experience */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<DemoAccessPage />} />

        {/* Authenticated Application Experience */}
        <Route path="/app/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<OverviewDashboard />} />
              <Route path="datasets" element={<DatasetOverview />} />
              <Route path="upload" element={<UploadPage />} />
              
              <Route path="jobs" element={<JobsDashboard />} />
              <Route path="products" element={<ProductDetailPage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="evidence" element={<EvidenceRegistry />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="schemas" element={<SchemaPage />} />
              <Route path="settings" element={<SettingsPage />} />
              
              {/* Deep links */}
              <Route path="dataset/:id/review" element={<ReviewPage />} />
              
              {/* Fallback inside App */}
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
          </Layout>
        } />
        
        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
