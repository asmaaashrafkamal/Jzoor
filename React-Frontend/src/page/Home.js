import React from 'react'
import HeroSection from '../components/HeroSection'
import ProductSection from '../components/ProductSection'
import GiftSection from "../components/GiftSection"
import SellerSection from '../components/SellerSection'
import Contact from '../components/Contact'
import ToolsSection from '../components/ToolsSection'
import VoicesSection from '../components/VoicesSection'
import OliveJournal from '../components/journalData'
import AboutSection from '../components/AboutSection'
const Home = () => {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ProductSection />
      
  <section className="mogilat relative lg:h-[250px]">
    <img src="imges/viktor-mogilat-AKxREMWLZE0-unsplash (1).webp" alt="" className="h-full w-full object-cover" />
    
    <div className="absolute inset-0 flex items-center justify-center z-30">
      <p className="text-center text-white font-bold text-[20px] md:text-[25px] lg:text-[35px] px-4 md:w-[530px]">
        "The Wind Cannot Uproot Your Roots"
      </p>
    </div>
  </section>
<GiftSection />
  {/* <!-- الفاصل  --> */}
     <section className=" relative lg:h-[220px] bg-[#A8C686]/50">
      
      <div className="  flex items-center justify-evenly z-30">
        <img src="imges/83e9dbc5-fe07-486a-91c3-8a0f8c0ff05e-removebg-preview (1).webp" alt="" className="w-[200px] lg:w-[300px]" />

        <p className="w-[370px] text-center font-bold text-[20px] md:text-[25px] lg:text-[35px] px-4 ">
          "Every folds holds a story"
        </p>
      </div>
    </section>
    {/* <!-- end  --> */}
    <ToolsSection />
    <SellerSection />
    <VoicesSection />
    <OliveJournal />
    <Contact />
    </div>
  )
}

export default Home
