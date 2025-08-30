import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Gallery from "../components/Gallery";
import NewsletterSubscribeForm from "../components/NewsletterSuscribeform";

export default function Home() {

  

  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] sm:h-[60vh]">
        {/* Hero Image Carousel */}
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          showArrows={false}
          interval={5000}
          className="h-full"
        >
          <div>
            <img
              src="/images/hero1.jpg"
              alt="Hero 1"
              className="object-cover h-[50vh] sm:h-[60vh] w-full"
            />
          </div>
          <div>
            <img
              src="/images/hero1.jpg"
              alt="Hero 2"
              className="object-cover h-[50vh] sm:h-[60vh] w-full"
            />
          </div>
        </Carousel>

        {/* Search Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        </div>
      </div>

      {/* Main Content Area */}
      <div>
                <section>

          <Gallery />
                  </section>

      </div>
      <div>
        <NewsletterSubscribeForm/>
      </div>
    </div>
  );
}