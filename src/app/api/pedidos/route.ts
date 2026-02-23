import { NextResponse } from "next/server";
import { PRAZO_MINIMO_DIAS_UTEIS } from "@/lib/config";
import { addBusinessDays } from "@/lib/businessDays";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

type PedidoPayload = {
  nome: string;
  telefone: string;
  descricao: string;
  opcaoData: "padrao" | "escolher";
  dataEscolhida?: string; // yyyy-mm-dd
  prefiroWhatsapp?: boolean;
};

function isValidISODateOnly(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(req: Request) {
  let body: PedidoPayload;

  try {
    body = (await req.json()) as PedidoPayload;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const nome = (body.nome || "").trim();
  const telefone = (body.telefone || "").trim();
  const descricao = (body.descricao || "").trim();
  const opcaoData = body.opcaoData;

  if (!nome) return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
  if (!telefone) return NextResponse.json({ error: "Telefone é obrigatório." }, { status: 400 });
  if (!descricao) return NextResponse.json({ error: "Descrição é obrigatória." }, { status: 400 });
  if (opcaoData !== "padrao" && opcaoData !== "escolher") {
    return NextResponse.json({ error: "Opção de data inválida." }, { status: 400 });
  }

  // Data mínima permitida (dias úteis)
  const hoje = new Date();
  const minDate = addBusinessDays(hoje, PRAZO_MINIMO_DIAS_UTEIS);

  let dataFinal: Date;

  if (opcaoData === "padrao") {
    dataFinal = minDate;
  } else {
    const dStr = (body.dataEscolhida || "").trim();
    if (!dStr || !isValidISODateOnly(dStr)) {
      return NextResponse.json({ error: "Selecione uma data válida." }, { status: 400 });
    }

    // Converte yyyy-mm-dd para Date em horário local (meia-noite)
    const [y, m, d] = dStr.split("-").map(Number);
    const chosen = new Date(y, m - 1, d);
    chosen.setHours(0, 0, 0, 0);

    if (chosen < minDate) {
      return NextResponse.json(
        { error: `A data escolhida precisa ser a partir do prazo mínimo (${PRAZO_MINIMO_DIAS_UTEIS} dias úteis).` },
        { status: 400 }
      );
    }

    dataFinal = chosen;
  }

  const pedido = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    nome,
    telefone,
    descricao,
    prefiroWhatsapp: !!body.prefiroWhatsapp,
    prazoMinimoDiasUteis: PRAZO_MINIMO_DIAS_UTEIS,
    dataEntrega: dataFinal.toISOString(),
  };

  // Salvar em data/pedidos.json
  const filePath = path.join(process.cwd(), "data", "pedidos.json");

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) throw new Error("Arquivo pedidos.json não é um array.");
    arr.push(pedido);
    await fs.writeFile(filePath, JSON.stringify(arr, null, 2), "utf8");
  } catch (e) {
    return NextResponse.json(
      { error: "Falha ao salvar o pedido localmente. Verifique se data/pedidos.json existe e contém um array JSON." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, pedidoId: pedido.id });
}