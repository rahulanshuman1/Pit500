import useContent from './useContent.js';
import Splash from './components/Splash.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Categories from './components/Categories.jsx';
import About from './components/About.jsx';
import Showroom from './components/Showroom.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { content } = useContent();

  return (
    <div className="min-h-screen bg-asphalt">
      <Splash />
      <Navbar whatsappNumber={content.whatsappNumber} />
      <main>
        <Hero imageUrl={content.heroImageUrl} headline={content.heroHeadline} subheadline={content.heroSubheadline} />
        <Marquee categories={content.categories} />
        <Categories categories={content.categories} whatsappNumber={content.whatsappNumber} />
        <About imageUrl={content.aboutImageUrl} />
        <Showroom
          address={content.storeAddress}
          timings={content.storeTimings}
          whatsappNumber={content.whatsappNumber}
        />
      </main>
      <Footer address={content.storeAddress} whatsappNumber={content.whatsappNumber} />
    </div>
  );
}
