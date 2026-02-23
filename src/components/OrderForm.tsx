"use client";

import { useMemo, useState } from "react";
import { PRAZO_MINIMO_DIAS_UTEIS } from "@/lib/config";
import { addBusinessDays, formatDateInput, formatDateBR, formatDateBRFromInput } from "@/lib/businessDays";
import { formatPhoneBR, isValidPhoneBR, onlyDigits } from "@/lib/phone";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; pedidoId: string }
  | { kind: "error"; message: string };

export default function OrderForm() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prefiroWhatsapp, setPrefiroWhatsapp] = useState(false);

  const [opcaoData, setOpcaoData] = useState<"padrao" | "escolher">("padrao");
  const minDate = useMemo(() => addBusinessDays(new Date(), PRAZO_MINIMO_DIAS_UTEIS), []);
  const minDateStr = useMemo(() => formatDateInput(minDate), [minDate]);
  const minDateDisplay = useMemo(() => formatDateBR(minDate), [minDate]);

  const [dataEscolhida, setDataEscolhida] = useState(minDateStr);
  const chosenDateDisplay = useMemo(() => formatDateBRFromInput(dataEscolhida), [dataEscolhida]);

  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const whatsappLink = useMemo(() => {
    // Coloque o DDI/DD aqui quando quiser. Ex: 55 + DDD + numero
    // Por enquanto deixo vazio (ou você pode setar um número padrão).
    const numero = ""; // ex: "5511999999999"
    const dateForMessage = opcaoData === "padrao" ? minDateDisplay : chosenDateDisplay;
    const msg =
      `Olá! Gostaria de fazer uma encomenda na Domass Cookies.%0A` +
      `Nome: ${encodeURIComponent(nome || "")}%0A` +
      `Telefone: ${encodeURIComponent(telefone || "")}%0A` +
      `Pedido: ${encodeURIComponent(descricao || "")}%0A` +
      `Data: ${encodeURIComponent(dateForMessage)}`;

    if (!numero) return `https://wa.me/?text=${msg}`;
    return `https://wa.me/${numero}?text=${msg}`;
  }, [nome, telefone, descricao, opcaoData, minDateStr, dataEscolhida]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidPhoneBR(telefone)) {
        setStatus({ kind: "error", message: "Informe um número com DDD (ex: 11912345678)." });
        return;
    }
    setStatus({ kind: "loading" });

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          telefone,
          descricao,
          opcaoData,
          dataEscolhida: opcaoData === "escolher" ? dataEscolhida : undefined,
          prefiroWhatsapp,
        }),
      });

      type ApiError = { error: string };
      type ApiSuccess = { pedidoId: string };
      type ApiResponse = ApiError | ApiSuccess;

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        const message = "error" in data ? data.error : "Erro ao enviar o pedido.";
        setStatus({ kind: "error", message });

        return;
      }

      if("pedidoId" in data) {
        setStatus({ kind: "success", pedidoId: data.pedidoId });
      } else {
        setStatus({ kind: "error", message: "Resposta inesperada do servidor." });
      }

      // opcional: limpar campos
      setNome(""); setTelefone(""); setDescricao(""); setPrefiroWhatsapp(false);
      setOpcaoData("padrao"); setDataEscolhida(minDateStr);

    } catch {
      setStatus({ kind: "error", message: "Falha de rede ao enviar o pedido." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 rounded-3xl bg-domass-bg/60 p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Nome</span>
          <input
            className="rounded-2xl bg-domass-bg px-4 py-3 outline-none ring-1 ring-domass-cocoa/15 focus:ring-domass-primary/40"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
            required
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Telefone para contato</span>
          <input
            className="rounded-2xl bg-domass-bg px-4 py-3 outline-none ring-1 ring-domass-cocoa/15 focus:ring-domass-primary/40"
            value={telefone}
            onChange={(e) => setTelefone(formatPhoneBR(e.target.value))}
            placeholder="(DDD) 99999-9999"
            inputMode="tel"
            autoComplete="tel"
            required
          />
        </label>
      </div>

      <label className="mt-4 grid gap-1">
        <span className="text-sm font-medium">Descrição do pedido</span>
        <textarea
          className="min-h-[120px] rounded-2xl bg-domass-bg px-4 py-3 outline-none ring-1 ring-domass-cocoa/15 focus:ring-domass-primary/40"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Tema, quantidade, tamanhos, nome para personalizar, cores, referências..."
          required
        />
      </label>

      <div className="mt-4 rounded-2xl bg-domass-cookie/30 p-4">
        <div className="text-sm font-medium">Data</div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="flex items-start gap-3 rounded-2xl bg-domass-bg/60 p-3">
            <input
              type="radio"
              name="opcaoData"
              checked={opcaoData === "padrao"}
              onChange={() => setOpcaoData("padrao")}
              className="mt-1"
            />
            <div>
              <div className="font-medium">Prazo padrão</div>
              <div className="text-sm opacity-80">
                {PRAZO_MINIMO_DIAS_UTEIS} dias úteis (entrega a partir de <strong>{minDateDisplay}</strong>)
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-2xl bg-domass-bg/60 p-3">
            <input
              type="radio"
              name="opcaoData"
              checked={opcaoData === "escolher"}
              onChange={() => setOpcaoData("escolher")}
              className="mt-1"
            />
            <div className="w-full">
              <div className="font-medium">Escolher uma data</div>
              <div className="mt-2">
                <input
                  type="date"
                  min={minDateStr}
                  value={dataEscolhida}
                  onChange={(e) => setDataEscolhida(e.target.value)}
                  disabled={opcaoData !== "escolher"}
                  className="w-full rounded-2xl bg-domass-bg px-4 py-3 outline-none ring-1 ring-domass-cocoa/15 disabled:opacity-60"
                />
                <div className="mt-1 text-xs opacity-75">
                  * Não é possível escolher antes de {minDateDisplay}
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <label className="mt-4 flex items-center gap-3">
        <input
          type="checkbox"
          checked={prefiroWhatsapp}
          onChange={(e) => setPrefiroWhatsapp(e.target.checked)}
        />
        <span className="text-sm">Prefiro conversar por WhatsApp</span>
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status.kind === "loading"}
          className="rounded-full bg-domass-primary px-6 py-3 font-semibold text-white shadow-sm hover:opacity-90 transition disabled:opacity-60"
        >
          {status.kind === "loading" ? "Enviando..." : "Enviar pedido"}
        </button>

        {prefiroWhatsapp && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border-2 border-domass-primary px-6 py-3 font-semibold text-domass-primary hover:bg-domass-primary hover:text-white transition"
          >
            Abrir WhatsApp
          </a>
        )}
      </div>

      {status.kind === "error" && (
        <div className="mt-4 rounded-2xl bg-domass-primary/10 p-4 text-sm">
          <strong>Erro:</strong> {status.message}
        </div>
      )}

      {status.kind === "success" && (
        <div className="mt-4 rounded-2xl bg-domass-cookie/40 p-4 text-sm">
          <strong>Pedido enviado!</strong> ID: {status.pedidoId}
        </div>
      )}
    </form>
  );
}