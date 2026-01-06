import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { Modality, Position, User } from "../../types";
import { getProvinces } from "../../lib/db";

export const Onboarding: React.FC<{
  onComplete: (data: Partial<User>) => void;
}> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    modality: Modality.FUTSAL,
    position: Position.MID,
    province: "",
    municipality: "",
  });
  const [provinces, setProvinces] = useState<string[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);

  useEffect(() => {
    let mounted = true;
    getProvinces()
      .then((list) => {
        if (!mounted) return;
        setProvinces(list);
        setFormData((prev) => ({ ...prev, province: list[0] ?? "" }));
      })
      .finally(() => setLoadingProvinces(false));
    return () => {
      mounted = false;
    };
  }, []);

  const next = () => setStep((s) => s + 1);
  const finish = () => onComplete(formData);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i <= step ? "bg-emerald-500" : "bg-gray-100"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-extrabold mb-2">Quem é você?</h2>
            <p className="text-gray-500 mb-8">
              Dê o seu primeiro passo na liga.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Seu nome de craque..."
                />
              </div>
              <Button
                onClick={next}
                className="w-full py-4 rounded-xl"
                disabled={!formData.name}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-3xl font-extrabold mb-2">
              Qual é o seu estilo?
            </h2>
            <p className="text-gray-500 mb-8">
              Defina a sua modalidade e posição.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modalidade Preferida
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={formData.modality}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      modality: e.target.value as Modality,
                    })
                  }
                >
                  {Object.values(Modality).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sua Posição
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      position: e.target.value as Position,
                    })
                  }
                >
                  {Object.values(Position).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
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
            <p className="text-gray-500 mb-8">
              Precisamos saber a sua localidade.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Província
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={formData.province}
                  onChange={(e) =>
                    setFormData({ ...formData, province: e.target.value })
                  }
                >
                  {loadingProvinces && <option>Carregando...</option>}
                  {!loadingProvinces &&
                    provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Município/Bairro
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Ex: Maianga, Cazenga..."
                  value={formData.municipality}
                  onChange={(e) =>
                    setFormData({ ...formData, municipality: e.target.value })
                  }
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
