import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Info, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function CriarLiga() {
  const navigate = useNavigate();
  const [valorEntrada, setValorEntrada] = useState(20);
  const [formato, setFormato] = useState<'A' | 'B'>('A');

  const taxaPlataforma = 0.10;
  const valorLiquido = valorEntrada * (1 - taxaPlataforma);

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Criar Liga | Bolão Brasil</title>
      </Helmet>

      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-xl font-black text-gray-800">Criar Nova Liga</h2>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-6">
        {/* Valor da Entrada */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Valor da Entrada (R$)</label>
          <input 
            type="number" 
            value={valorEntrada}
            onChange={(e) => setValorEntrada(Number(e.target.value))}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-4 text-2xl font-black text-brazil-green outline-none focus:border-brazil-green transition-all text-center"
          />
          <div className="flex items-start gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium leading-relaxed">
              O prêmio total terá desconto de 10% retido pela plataforma para custos de operação, segurança via Efí Bank e infraestrutura.
            </p>
          </div>
        </div>

        {/* Formatos de Premiação */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Formato de Premiação</label>
          
          {/* Opção A */}
          <button 
            onClick={() => setFormato('A')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${formato === 'A' ? 'border-brazil-green bg-brazil-green/5' : 'border-gray-100 bg-white'}`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-black text-sm text-gray-800 flex items-center gap-2">
                <Trophy size={16} className={formato === 'A' ? 'text-brazil-green' : 'text-gray-400'} />
                Opção A: Vencedor Único
              </span>
              {formato === 'A' && <CheckCircle2 size={18} className="text-brazil-green" />}
            </div>
            <p className="text-xs text-gray-500 mt-1">100% do prêmio líquido acumulado para o 1º lugar. Formato de alto risco e muita emoção!</p>
            <div className="mt-3 bg-white p-2 rounded-lg border border-gray-100 inline-block">
              <p className="font-bold text-brazil-green text-[11px] uppercase">Prêmio Base: R$ {valorLiquido.toFixed(2)} por jogador</p>
            </div>
          </button>

          {/* Opção B */}
          <button 
            onClick={() => setFormato('B')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${formato === 'B' ? 'border-brazil-green bg-brazil-green/5' : 'border-gray-100 bg-white'}`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-black text-sm text-gray-800 flex items-center gap-2">
                <Users size={16} className={formato === 'B' ? 'text-brazil-green' : 'text-gray-400'} />
                Opção B: Top 3 (Justo)
              </span>
              {formato === 'B' && <CheckCircle2 size={18} className="text-brazil-green" />}
            </div>
            <p className="text-xs text-gray-500 mt-1">O prêmio líquido é dividido entre os três melhores colocados no ranking final da liga.</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-bold uppercase text-gray-600 bg-white p-2 rounded-lg border border-gray-100 text-center">
              <div>
                <p className="text-gray-400 mb-0.5">1º (70%)</p>
                <p className="text-brazil-green">R$ {(valorLiquido * 0.7).toFixed(2)}</p>
              </div>
              <div className="border-l border-gray-100">
                <p className="text-gray-400 mb-0.5">2º (20%)</p>
                <p className="text-brazil-blue">R$ {(valorLiquido * 0.2).toFixed(2)}</p>
              </div>
              <div className="border-l border-gray-100">
                <p className="text-gray-400 mb-0.5">3º (10%)</p>
                <p className="text-brazil-yellow">R$ {(valorLiquido * 0.1).toFixed(2)}</p>
              </div>
            </div>
          </button>
        </div>

        <button className="w-full bg-brazil-green hover:bg-[#009045] text-white font-black py-4 rounded-xl shadow-[0_4px_14px_0_rgba(0,168,89,0.39)] uppercase tracking-wider text-xs transition-all mt-4">
          Criar Liga e Gerar Link
        </button>
      </div>
    </div>
  );
}