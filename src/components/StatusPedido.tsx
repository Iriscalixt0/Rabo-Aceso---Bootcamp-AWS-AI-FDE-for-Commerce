import { ETAPAS_PEDIDO, STATUS_PEDIDO, type StatusPedido } from "@/lib/auth";

export function EtiquetaStatus({ status }: { status: StatusPedido }) {
  const cor =
    status === "Entregue"
      ? "bg-primary/10 text-primary"
      : status === "Em andamento"
        ? "bg-mustard/50 text-foreground"
        : "bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${cor}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </span>
  );
}

export function TrilhaStatus({
  status,
  compacto = false,
}: {
  status: StatusPedido;
  compacto?: boolean;
}) {
  const atual = STATUS_PEDIDO.indexOf(status);

  return (
    <ol className="space-y-0">
      {ETAPAS_PEDIDO.map((etapa, i) => {
        const concluido = i < atual;
        const ativo = i === atual;
        const ultimo = i === ETAPAS_PEDIDO.length - 1;
        return (
          <li key={etapa.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                  concluido
                    ? "border-primary bg-primary text-primary-foreground"
                    : ativo
                      ? "border-primary bg-background text-primary"
                      : "border-border bg-background text-muted-foreground"
                }`}
              >
                {concluido ? "✓" : i + 1}
              </span>
              {!ultimo && (
                <span
                  className={`w-px flex-1 ${compacto ? "min-h-5" : "min-h-8"} ${
                    concluido ? "bg-primary" : "bg-border"
                  }`}
                  aria-hidden
                />
              )}
            </div>
            <div className={ultimo ? "pb-0" : compacto ? "pb-4" : "pb-6"}>
              <p
                className={`text-sm font-semibold ${
                  concluido || ativo ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {etapa.status}
              </p>
              {!compacto && <p className="text-sm text-muted-foreground">{etapa.descricao}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
