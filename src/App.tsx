import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import LoadingScreen from "./components/LoadingScreen";

import AppRoutes from "./routes/AppRoutes";



const App = () => {

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    }, 1200);


    return () => {

      clearTimeout(timer);

    };

  }, []);


  if (loading) {

    return <LoadingScreen />;

  }


  return (

    <>

      <Navbar />


      <main>

        <AppRoutes />

      </main>


      <Footer />


      <ScrollToTop />

    </>

  );

};


export default App;