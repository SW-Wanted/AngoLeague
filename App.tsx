
import React, { useState, useEffect } from 'react';
import { Modality, Position, MatchType, User, Team, Match, RecruitmentPost } from './types';
import { Icons, PROVINCES } from './constants';
import { getSmartMatchmakingAdvice, generateLocalFeedPost } from './services/geminiService';

// --- Components ---

const Button: React.FC<{ 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline'; 
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ onClick, variant = 'primary', className = '', children, disabled }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 disabled:opacity-50",
    secondary: "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20",
    outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}>
    {children}
  </div>
);

// --- Layout Wrapper ---
const Layout: React.FC<{ 
  children: React.ReactNode; 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  user?: User;
}> = ({ children, activeTab, setActiveTab, user }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0 md:pl-64">
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 hidden md:flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-emerald-600 p-2 rounded-lg text-white">
            <Icons.SoccerBall />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-emerald-900">AngoLeague</span>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <NavItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Icons.Layout />} label="Dashboard" />
          <NavItem active={activeTab === 'matches'} onClick={() => setActiveTab('matches')} icon={<Icons.Calendar />} label="Jogos" />
          <NavItem active={activeTab === 'teams'} onClick={() => setActiveTab('teams')} icon={<Icons.Users />} label="Equipas" />
          <NavItem active={activeTab === 'recruitment'} onClick={() => setActiveTab('recruitment')} icon={<Icons.Search />} label="Recrutamento" />
          <NavItem active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<Icons.Users />} label="Perfil" />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <img src={user?.avatar || `https://picsum.photos/seed/${user?.id}/100`} className="w-10 h-10 rounded-full border border-gray-200" alt="Avatar" />
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm truncate">{user?.name}</span>
              <span className="text-xs text-gray-500 truncate">{user?.province}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-1.5 rounded-md text-white">
            <Icons.SoccerBall />
          </div>
          <span className="text-lg font-bold text-emerald-900">AngoLeague</span>
        </div>
        <button className="text-gray-500"><Icons.Bell /></button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-3 md:hidden z-20">
        <MobileNavItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Icons.Layout />} />
        <MobileNavItem active={activeTab === 'matches'} onClick={() => setActiveTab('matches')} icon={<Icons.Calendar />} />
        <div className="relative -top-6">
          <button onClick={() => setActiveTab('create-match')} className="bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-500/40">
            <Icons.Plus />
          </button>
        </div>
        <MobileNavItem active={activeTab === 'recruitment'} onClick={() => setActiveTab('recruitment')} icon={<Icons.Search />} />
        <MobileNavItem active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<Icons.Users />} />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}
  >
    <span className={active ? 'text-emerald-600' : 'text-gray-400'}>{icon}</span>
    {label}
  </button>
);

const MobileNavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button onClick={onClick} className={`p-2 ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
    {icon}
  </button>
);

// --- Pages ---

const Landing: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
       <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
       <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-400 rounded-full blur-[100px]"></div>
    </div>
    
    <div className="z-10 animate-fade-in">
      <div className="bg-emerald-500/10 p-4 rounded-3xl inline-block mb-6 backdrop-blur-sm border border-emerald-500/20">
        <div className="text-emerald-400"><Icons.SoccerBall /></div>
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
        Ango<span className="text-emerald-400">League</span>
      </h1>
      <p className="text-emerald-100 text-lg md:text-xl max-w-xl mb-10 leading-relaxed opacity-90">
        A plataforma oficial do futebol de rua em Angola. Organize a sua equipa, marque jogos e mostre o seu talento para o mundo.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onStart} className="text-lg py-6 px-8 rounded-2xl">
          Começar Agora
        </Button>
        <Button variant="outline" className="text-lg py-6 px-8 rounded-2xl border-emerald-400 text-emerald-400 hover:bg-emerald-900/50">
          Explorar Torneios
        </Button>
      </div>
    </div>
  </div>
);

const Onboarding: React.FC<{ onComplete: (data: Partial<User>) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    modality: Modality.FUTSAL,
    position: Position.MID,
    province: 'Luanda',
    municipality: ''
  });

  const next = () => setStep(s => s + 1);
  const finish = () => onComplete(formData);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-emerald-500' : 'bg-gray-100'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-extrabold mb-2">Quem é você?</h2>
            <p className="text-gray-500 mb-8">Dê o seu primeiro passo na liga.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Seu nome de craque..."
                />
              </div>
              <Button onClick={next} className="w-full py-4 rounded-xl" disabled={!formData.name}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-3xl font-extrabold mb-2">Qual é o seu estilo?</h2>
            <p className="text-gray-500 mb-8">Defina a sua modalidade e posição.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modalidade Preferida</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={formData.modality}
                  onChange={e => setFormData({...formData, modality: e.target.value as Modality})}
                >
                  {Object.values(Modality).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sua Posição</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={formData.position}
                  onChange={e => setFormData({...formData, position: e.target.value as Position})}
                >
                  {Object.values(Position).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <Button onClick={next} className="w-full py-4 rounded-xl">
                Próximo
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-3xl font-extrabold mb-2">Onde jogas?</h2>
            <p className="text-gray-500 mb-8">Precisamos saber a sua localidade.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Província</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={formData.province}
                  onChange={e => setFormData({...formData, province: e.target.value})}
                >
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Município/Bairro</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Ex: Maianga, Cazenga..."
                  value={formData.municipality}
                  onChange={e => setFormData({...formData, municipality: e.target.value})}
                />
              </div>
              <Button onClick={finish} className="w-full py-4 rounded-xl">
                Finalizar Registo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App Flow ---

export default function App() {
  const [view, setView] = useState<'landing' | 'onboarding' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [localNews, setLocalNews] = useState<string>('');

  const [matches, setMatches] = useState<Match[]>([
    { id: 'm1', type: MatchType.OFFICIAL, teamA: 'Leões do Cazenga', teamB: 'Sambizanga FC', date: 'Hoje às 16:00', location: 'Campo do Cazenga', status: 'SCHEDULED' },
    { id: 'm2', type: MatchType.FRIENDLY, teamA: 'Provisória A', teamB: 'Provisória B', date: 'Amanhã às 18:00', location: 'Futsal Kilamba', status: 'SCHEDULED' },
  ]);

  const [recruitment, setRecruitment] = useState<RecruitmentPost[]>([
    { id: 'r1', teamId: 't1', teamName: 'Leões do Cazenga', positionNeeded: Position.GK, description: 'Precisamos de um guarda-redes com garra para o torneio de domingo.', date: 'Há 2h' },
  ]);

  useEffect(() => {
    if (view === 'dashboard' && user) {
      // Simulation of AI fetching
      getSmartMatchmakingAdvice(user, []).then(setAiAdvice);
      generateLocalFeedPost(user.province || 'Luanda').then(setLocalNews);
    }
  }, [view, user]);

  if (view === 'landing') return <Landing onStart={() => setView('onboarding')} />;
  
  if (view === 'onboarding') return <Onboarding onComplete={(data) => {
    setUser({ id: 'u' + Date.now(), ...data } as User);
    setView('dashboard');
  }} />;

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user!}>
      {activeTab === 'home' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Boa tarde, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-gray-500 flex items-center gap-1">
              <Icons.MapPin /> {user?.province}, {user?.municipality || 'Angola'}
            </p>
          </header>

          <section className="grid md:grid-cols-2 gap-4">
            <Card className="bg-emerald-900 text-white border-none p-6">
              <div className="flex items-center gap-2 mb-4 text-emerald-400">
                <Icons.Trophy />
                <span className="font-bold text-sm tracking-wider uppercase">Destaque Local</span>
              </div>
              <p className="text-xl font-medium leading-tight mb-4 italic">
                "{localNews || 'A carregar novidades do seu bairro...'}"
              </p>
              <div className="text-xs opacity-60">— Gerado por AngoAI</div>
            </Card>

            <Card className="bg-amber-50 border-amber-100 p-6">
              <div className="flex items-center gap-2 mb-4 text-amber-600">
                <Icons.Search />
                <span className="font-bold text-sm tracking-wider uppercase">Sugestão de Carreira</span>
              </div>
              <div className="text-sm text-gray-700 space-y-2 whitespace-pre-wrap">
                {aiAdvice || 'Analisando o teu perfil para as melhores oportunidades...'}
              </div>
            </Card>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Próximos Jogos</h2>
              <button onClick={() => setActiveTab('matches')} className="text-emerald-600 text-sm font-semibold">Ver todos</button>
            </div>
            <div className="space-y-3">
              {matches.map(m => (
                <Card key={m.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${m.type === MatchType.OFFICIAL ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
                      <Icons.SoccerBall />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{m.teamA}</span>
                        <span className="text-xs text-gray-400">VS</span>
                        <span className="font-bold">{m.teamB}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1"><Icons.Calendar /> {m.date}</span>
                        <span className="flex items-center gap-1"><Icons.MapPin /> {m.location}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="text-xs py-2">Detalhes</Button>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Calendário de Jogos</h1>
            <Button onClick={() => setActiveTab('create-match')}><Icons.Plus /> Criar Jogo</Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['Todos', 'Oficiais', 'Amistosos', 'Meus Jogos'].map(f => (
              <button key={f} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border ${f === 'Todos' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {matches.map(m => (
               <Card key={m.id} className="p-0 overflow-hidden">
                 <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${m.type === MatchType.OFFICIAL ? 'text-emerald-600' : 'text-amber-600'}`}>{m.type}</span>
                   <span className="text-[10px] text-gray-400 font-bold">{m.date}</span>
                 </div>
                 <div className="p-6 flex items-center justify-between">
                   <div className="flex flex-col items-center flex-1 text-center">
                     <div className="w-12 h-12 bg-gray-100 rounded-full mb-2"></div>
                     <span className="font-bold text-sm">{m.teamA}</span>
                   </div>
                   <div className="px-4 font-black text-2xl text-gray-300 italic">VS</div>
                   <div className="flex flex-col items-center flex-1 text-center">
                     <div className="w-12 h-12 bg-gray-100 rounded-full mb-2"></div>
                     <span className="font-bold text-sm">{m.teamB}</span>
                   </div>
                 </div>
                 <div className="p-4 bg-emerald-50/30 flex justify-center border-t">
                    <span className="text-xs text-emerald-700 flex items-center gap-1"><Icons.MapPin /> {m.location}</span>
                 </div>
               </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recruitment' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h1 className="text-2xl font-bold">Procura-se Atletas</h1>
             <Button variant="secondary"><Icons.Plus /> Publicar Vaga</Button>
          </div>
          <p className="text-gray-500 text-sm">Mostre o seu valor e seja recrutado pelas melhores equipas do bairro.</p>
          
          <div className="grid gap-4">
            {recruitment.map(r => (
              <Card key={r.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Icons.Users /></div>
                    <div>
                      <h3 className="font-bold text-emerald-900">{r.teamName}</h3>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                  </div>
                  <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">Vaga: {r.positionNeeded}</span>
                </div>
                <p className="text-gray-700 mb-6 text-sm leading-relaxed">{r.description}</p>
                <div className="flex gap-2">
                  <Button className="flex-1">Candidatar-me</Button>
                  <Button variant="outline" className="px-3"><Icons.Users /></Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-6">
           <Card className="p-0 overflow-hidden">
             <div className="h-32 bg-emerald-600 relative">
               <div className="absolute -bottom-10 left-6">
                 <img src={user?.avatar || `https://picsum.photos/seed/${user?.id}/200`} className="w-24 h-24 rounded-2xl border-4 border-white shadow-md object-cover" alt="Profile" />
               </div>
             </div>
             <div className="pt-12 pb-6 px-6">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h1 className="text-2xl font-bold">{user?.name}</h1>
                   <p className="text-gray-500">{user?.position} • {user?.modality}</p>
                 </div>
                 <Button variant="outline" className="text-xs">Editar Perfil</Button>
               </div>
               
               <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-6">
                  <div className="text-center">
                    <div className="text-xl font-black text-emerald-600">0</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Jogos</div>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <div className="text-xl font-black text-emerald-600">0</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Golos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-emerald-600">--</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Ranking</div>
                  </div>
               </div>
               
               <div className="mt-6 space-y-4">
                 <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest">Informações</h3>
                 <div className="flex items-center gap-3 text-sm">
                   <Icons.MapPin /> <span>{user?.province}, {user?.municipality || 'Não definido'}</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                   <Icons.Users /> <span>Sem equipa (Agente livre)</span>
                 </div>
               </div>
             </div>
           </Card>
           <Button variant="outline" className="w-full py-4 text-red-500 border-red-100 hover:bg-red-50" onClick={() => setView('landing')}>Sair da Conta</Button>
        </div>
      )}

      {activeTab === 'create-match' && (
        <div className="space-y-6">
          <header className="flex items-center gap-4 mb-8">
            <button onClick={() => setActiveTab('matches')} className="p-2 hover:bg-gray-100 rounded-full"><Icons.Layout /></button>
            <h1 className="text-2xl font-bold">Novo Jogo</h1>
          </header>
          <Card className="space-y-6 p-6">
            <div className="grid gap-4">
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Jogo</label>
                 <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 border-2 border-emerald-600 bg-emerald-50 rounded-xl text-center">
                      <div className="font-bold text-emerald-700">Amistoso</div>
                      <div className="text-[10px] text-emerald-600 uppercase">Sem ranking</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-xl text-center opacity-50 grayscale cursor-not-allowed">
                      <div className="font-bold text-gray-700">Oficial</div>
                      <div className="text-[10px] text-gray-400 uppercase">Requer Equipa</div>
                    </button>
                 </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Local do Jogo</label>
                  <input type="text" placeholder="Ex: Campo do 1º de Maio" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Data</label>
                   <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Horário</label>
                   <input type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200" />
                 </div>
               </div>
            </div>
            <Button className="w-full py-4" onClick={() => setActiveTab('matches')}>Publicar Desafio</Button>
          </Card>
        </div>
      )}
    </Layout>
  );
}
