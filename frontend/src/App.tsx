import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AddEvent from './pages/EventForm';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import EditEvent from './pages/EditEvent';
import Tickets from "./pages/Tickets";
import SuccessPage from './pages/SuccessPage';
import AddContent from './pages/AddContent';
import EditContent from './pages/EditContent';
import ContentDetails from './pages/ContentDetails';
import QrScannerPage from './pages/QrScanner';
import ContentList from './pages/ContentList';
import QRCodeGenerator from './pages/Qrcode';
import GalleryForm from './pages/GalleryForm';
import About from './pages/Aboutus';
import OurTeam from './pages/OurTeam';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsandCondition';
import ContactUs from './pages/Contactus';
import ScrollToTop from './components/ScrollToTop';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = localStorage.getItem('accessToken'); // Simple check
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};


function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <ScrollToTop/>
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
                        <Route path="/add-event" element={<AddEvent />} />

                    <Route path="/events" element={<EventList />} />
    <Route path="/add-content" element={<AddContent />} />


        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/qrscan" element={<QrScannerPage />} />
        <Route path="/contentlist" element={<ContentList />} />
        <Route path="/add-gallery" element={<GalleryForm />} />
<Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/contact" element={<ContactUs />} />

                    




            <Route path="/success" element={<SuccessPage />} />

            <Route path="/events/edit/:id" element={<EditEvent />} />
                <Route path="/my-tickets" element={<Tickets />} />
        <Route path="/content/:id" element={<ContentDetails />} />
        <Route path="/edit-content/:id" element={<EditContent />} />
        <Route path="/qr-generator" element={<QRCodeGenerator />} />



   <Route
                path="/profile"
                element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />

    <Route path="*" element={<h1>404 - Not Found</h1>} />
                </Routes>
                </main>
                <Footer />
                </div>
        </Router>
    );
}

export default App;