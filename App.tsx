import React, { useState, useEffect } from "react";
import {
  Modality,
  Position,
  MatchType,
  User,
  Team,
  Match,
  RecruitmentPost,
} from "./types";
import { Icons } from "./components/ui/icons";
import {
  getSmartMatchmakingAdvice,
  generateLocalFeedPost,
} from "./services/ai/gemini";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { Layout } from "./components/layout/Layout";
import { Landing } from "./app/landing/Landing";
import { Onboarding } from "./app/onboarding/Onboarding";
import { useAuth } from "./hooks/useAuth";
import { AuthGate } from "./components/AuthGate";
import {
  getMatches,
  getRecruitmentPosts,
  createUserProfile,
  getUserProfile,
} from "./lib/db";

// --- Components moved to components/ui and components/layout
// --- Pages moved to app/landing and app/onboarding

// --- Main App Flow ---

export default function App() {
  const [view, setView] = useState<"landing" | "onboarding" | "dashboard">(
    "landing"
  );
  const [activeTab, setActiveTab] = useState("home");
  const { user: authUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [localNews, setLocalNews] = useState<string>("");

  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState<string | null>(null);

  const [recruitment, setRecruitment] = useState<RecruitmentPost[]>([]);
  const [recruitmentLoading, setRecruitmentLoading] = useState(false);
  const [recruitmentError, setRecruitmentError] = useState<string | null>(null);

  useEffect(() => {
    if (view === "dashboard" && profile) {
      getSmartMatchmakingAdvice(profile, []).then(setAiAdvice);
      generateLocalFeedPost(profile.province || "Luanda").then(setLocalNews);
    }
  }, [view, profile]);

  useEffect(() => {
    if (view === "dashboard" && authUser && !profile) {
      setProfileLoading(true);
      setProfileError(null);
      getUserProfile(authUser.uid)
        .then((p) => setProfile(p))
        .catch((e) => {
          const msg = e instanceof Error ? e.message : "Erro a carregar perfil";
          setProfileError(msg);
        })
        .finally(() => setProfileLoading(false));
    }
  }, [view, authUser, profile]);

  useEffect(() => {
    if (view === "dashboard") {
      setMatchesLoading(true);
      setRecruitmentLoading(true);
      setMatchesError(null);
      setRecruitmentError(null);
      Promise.all([getMatches(), getRecruitmentPosts()])
        .then(([m, r]) => {
          setMatches(m);
          setRecruitment(r);
        })
        .catch((e) => {
          const msg = e instanceof Error ? e.message : "Falha ao carregar";
          setMatchesError(msg);
          setRecruitmentError(msg);
        })
        .finally(() => {
          setMatchesLoading(false);
          setRecruitmentLoading(false);
        });
    }
  }, [view]);

  if (view === "landing")
    return <Landing onStart={() => setView("onboarding")} />;

  if (view === "onboarding")
    return (
      <Onboarding
        onComplete={(data) => {
          createUserProfile(data).then((uid) => {
            setProfile({ id: uid, ...data } as User);
            setView("dashboard");
          });
        }}
      />
    );

  return (
    <AuthGate>
      {/* Ensure profile is loaded before rendering the main layout */}
      {!profile && (
        <div className="max-w-4xl mx-auto p-4 md:p-8">Carregando perfil...</div>
      )}
      {profile && (
        <Layout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={profile}
        >
          {activeTab === "home" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                  Boa tarde, {profile?.name?.split(" ")[0]}!
                </h1>
                <p className="text-gray-500 flex items-center gap-1">
                  <Icons.MapPin /> {profile?.province},{" "}
                  {profile?.municipality || "Angola"}
                </p>
              </header>

              <section className="grid md:grid-cols-2 gap-4">
                <Card className="bg-emerald-900 text-white border-none p-6">
                  <div className="flex items-center gap-2 mb-4 text-emerald-400">
                    <Icons.Trophy />
                    <span className="font-bold text-sm tracking-wider uppercase">
                      Destaque Local
                    </span>
                  </div>
                  <p className="text-xl font-medium leading-tight mb-4 italic">
                    "{localNews || "A carregar novidades do seu bairro..."}"
                  </p>
                  <div className="text-xs opacity-60">— Gerado por AngoAI</div>
                </Card>

                <Card className="bg-amber-50 border-amber-100 p-6">
                  <div className="flex items-center gap-2 mb-4 text-amber-600">
                    <Icons.Search />
                    <span className="font-bold text-sm tracking-wider uppercase">
                      Sugestão de Carreira
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 space-y-2 whitespace-pre-wrap">
                    {aiAdvice ||
                      "Analisando o teu perfil para as melhores oportunidades..."}
                  </div>
                </Card>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Próximos Jogos</h2>
                  <button
                    onClick={() => setActiveTab("matches")}
                    className="text-emerald-600 text-sm font-semibold"
                  >
                    Ver todos
                  </button>
                </div>
                <div className="space-y-3">
                  {matches.map((m) => (
                    <Card
                      key={m.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:border-emerald-200 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-full ${
                            m.type === MatchType.OFFICIAL
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <Icons.SoccerBall />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{m.teamA}</span>
                            <span className="text-xs text-gray-400">VS</span>
                            <span className="font-bold">{m.teamB}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Icons.Calendar /> {m.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icons.MapPin /> {m.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="text-xs py-2">
                        Detalhes
                      </Button>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "matches" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Calendário de Jogos</h1>
                <Button onClick={() => setActiveTab("create-match")}>
                  <Icons.Plus /> Criar Jogo
                </Button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {["Todos", "Oficiais", "Amistosos", "Meus Jogos"].map((f) => (
                  <button
                    key={f}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border ${
                      f === "Todos"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                {matches.map((m) => (
                  <Card key={m.id} className="p-0 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest ${
                          m.type === MatchType.OFFICIAL
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {m.type}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {m.date}
                      </span>
                    </div>
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex flex-col items-center flex-1 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full mb-2"></div>
                        <span className="font-bold text-sm">{m.teamA}</span>
                      </div>
                      <div className="px-4 font-black text-2xl text-gray-300 italic">
                        VS
                      </div>
                      <div className="flex flex-col items-center flex-1 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full mb-2"></div>
                        <span className="font-bold text-sm">{m.teamB}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50/30 flex justify-center border-t">
                      <span className="text-xs text-emerald-700 flex items-center gap-1">
                        <Icons.MapPin /> {m.location}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "recruitment" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Procura-se Atletas</h1>
                <Button variant="secondary">
                  <Icons.Plus /> Publicar Vaga
                </Button>
              </div>
              <p className="text-gray-500 text-sm">
                Mostre o seu valor e seja recrutado pelas melhores equipas do
                bairro.
              </p>

              <div className="grid gap-4">
                {recruitment.map((r) => (
                  <Card key={r.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                          <Icons.Users />
                        </div>
                        <div>
                          <h3 className="font-bold text-emerald-900">
                            {r.teamName}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {r.date}
                          </span>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                        Vaga: {r.positionNeeded}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                      {r.description}
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex-1">Candidatar-me</Button>
                      <Button variant="outline" className="px-3">
                        <Icons.Users />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card className="p-0 overflow-hidden">
                <div className="h-32 bg-emerald-600 relative">
                  <div className="absolute -bottom-10 left-6">
                    <img
                      src={
                        profile?.avatar ||
                        `https://picsum.photos/seed/${profile?.id}/200`
                      }
                      className="w-24 h-24 rounded-2xl border-4 border-white shadow-md object-cover"
                      alt="Profile"
                    />
                  </div>
                </div>
                <div className="pt-12 pb-6 px-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-2xl font-bold">{profile?.name}</h1>
                      <p className="text-gray-500">
                        {profile?.position} • {profile?.modality}
                      </p>
                    </div>
                    <Button variant="outline" className="text-xs">
                      Editar Perfil
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-6">
                    <div className="text-center">
                      <div className="text-xl font-black text-emerald-600">
                        0
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">
                        Jogos
                      </div>
                    </div>
                    <div className="text-center border-x border-gray-100">
                      <div className="text-xl font-black text-emerald-600">
                        0
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">
                        Golos
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-black text-emerald-600">
                        --
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">
                        Ranking
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest">
                      Informações
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <Icons.MapPin />{" "}
                      <span>
                        {profile?.province},{" "}
                        {profile?.municipality || "Não definido"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Icons.Users /> <span>Sem equipa (Agente livre)</span>
                    </div>
                  </div>
                </div>
              </Card>
              <Button
                variant="outline"
                className="w-full py-4 text-red-500 border-red-100 hover:bg-red-50"
                onClick={() => setView("landing")}
              >
                Sair da Conta
              </Button>
            </div>
          )}

          {activeTab === "create-match" && (
            <div className="space-y-6">
              <header className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setActiveTab("matches")}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Icons.Layout />
                </button>
                <h1 className="text-2xl font-bold">Novo Jogo</h1>
              </header>
              <Card className="space-y-6 p-6">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tipo de Jogo
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="p-4 border-2 border-emerald-600 bg-emerald-50 rounded-xl text-center">
                        <div className="font-bold text-emerald-700">
                          Amistoso
                        </div>
                        <div className="text-[10px] text-emerald-600 uppercase">
                          Sem ranking
                        </div>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-xl text-center opacity-50 grayscale cursor-not-allowed">
                        <div className="font-bold text-gray-700">Oficial</div>
                        <div className="text-[10px] text-gray-400 uppercase">
                          Requer Equipa
                        </div>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Local do Jogo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Campo do 1º de Maio"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Data
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Horário
                      </label>
                      <input
                        type="time"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full py-4"
                  onClick={() => setActiveTab("matches")}
                >
                  Publicar Desafio
                </Button>
              </Card>
            </div>
          )}
        </Layout>
      )}
    </AuthGate>
  );
}
