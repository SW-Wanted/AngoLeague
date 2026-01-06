import React from "react";
import { Button } from "../../components/ui/Button";
import { Icons } from "../../components/ui/icons";
import { LoginForm } from "../../components/auth/LoginForm";
import { SignupForm } from "../../components/auth/SignupForm";

export const Landing: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-400 rounded-full blur-[100px]"></div>
    </div>

    <div className="z-10 animate-fade-in">
      <div className="bg-emerald-500/10 p-4 rounded-3xl inline-block mb-6 backdrop-blur-sm border border-emerald-500/20">
        <div className="text-emerald-400">
          <Icons.SoccerBall />
        </div>
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
        Ango<span className="text-emerald-400">League</span>
      </h1>
      <p className="text-emerald-100 text-lg md:text-xl max-w-xl mb-10 leading-relaxed opacity-90">
        A plataforma oficial do futebol de rua em Angola. Organize a sua equipa,
        marque jogos e mostre o seu talento para o mundo.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onStart} className="text-lg py-6 px-8 rounded-2xl">
          Começar Agora
        </Button>
        <Button
          variant="outline"
          className="text-lg py-6 px-8 rounded-2xl border-emerald-400 text-emerald-400 hover:bg-emerald-900/50"
        >
          Explorar Torneios
        </Button>
      </div>

      {/* Auth Forms */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <div>
          <h2 className="text-white text-xl font-bold mb-3">Entrar</h2>
          <LoginForm onSuccess={onStart} />
        </div>
        <div>
          <h2 className="text-white text-xl font-bold mb-3">Criar conta</h2>
          <SignupForm onSuccess={onStart} />
        </div>
      </div>
    </div>
  </div>
);
