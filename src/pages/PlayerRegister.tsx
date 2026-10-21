import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PlayerForm from '@/components/PlayerForm';

import { useLocation } from "react-router-dom";


const PlayerRegister = () => {

  const location = useLocation();

const player = location.state?.player;

console.log(player);



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="gradient-hero text-primary-foreground py-6 sm:py-10">
        <div className="container mx-auto px-4">
          <Link
            to="/players"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Players
          </Link>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl">
            Register New Player
          </h1>
          <p className="text-primary-foreground/80 mt-1 sm:mt-2 text-sm sm:text-base">
            Add a new player to the auction pool
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto px-4 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-xl shadow-card p-4 sm:p-6 md:p-8 border border-border">
            <PlayerForm editPlayer={player}/>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlayerRegister;
