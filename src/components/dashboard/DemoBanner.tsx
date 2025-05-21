import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

const DemoBanner = () => {
  const newDemoUrl = "https://hospiagentscribe.minusonetoten.com";

  const openNewDemo = () => {
    window.open(newDemoUrl, '_blank');
  };

  return (
    <div className="bg-gradient-to-r bg-blue-600 bg-blue-500 text-white p-4 relative overflow-hidden shadow-md rounded-2xl">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-full opacity-10">
        <svg viewBox="0 0 100 100" className="h-full">
          <path d="M95,50 C95,74.8528137 74.8528137,95 50,95 C25.1471863,95 5,74.8528137 5,50 C5,25.1471863 25.1471863,5 50,5 C74.8528137,5 95,25.1471863 95,50 Z" fill="white" />
        </svg>
      </div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 opacity-10">
        <svg viewBox="0 0 100 100" className="h-full">
          <circle cx="50" cy="50" r="40" fill="white" />
        </svg>
      </div>
      
      <div className="container-custom flex flex-col md:flex-row justify-between items-center relative z-10">
        <div className="flex items-center mb-4 md:mb-0">
          {/* Image of doctor with transcript or microphone */}
          <div className="mr-4 hidden sm:block">
            <div className="bg-white p-2 rounded-lg shadow-lg">
              <img 
                src="https://img.freepik.com/free-vector/doctor-using-tablet-telemedicine-illustration_88138-415.jpg" 
                alt="Doctor with AI Scribe" 
                className="h-16 w-16 object-cover rounded" 
              />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="inline-block bg-hospi-50 text-hospi-600 px-2 py-0.5 rounded text-xs font-semibold mb-1">NEW</div>
            <h3 className="font-bold text-lg">AI Scribe Agent Demo</h3>
            <p className="text-white/90 text-sm sm:text-base max-w-md">
              See how our AI transcribes doctor-patient conversations into structured clinical notes in real-time
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Button 
            className="bg-white text-blue-600 hover:bg-hospi-50 font-medium shadow-sm transition-all hover:shadow-md hover:scale-105 px-6"
            onClick={openNewDemo}
          >
            Try Interactive Demo <ExternalLink className="ml-1" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;