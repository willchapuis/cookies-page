function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-full bg-domass-primary px-6 py-3 font-semibold text-white shadow-sm hover:opacity-90 transition">
      {children}
    </button>
  );
}

function SecondaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="rounded-full border-2 border-domass-primary bg-transparent px-6 py-3 font-semibold text-domass-primary hover:bg-domass-primary hover:text-white transition">
      {children}
    </button>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      {/* Header simples (depois vira componente) */}
      <header className="mb-10 flex items-center justify-between">
        <div className="text-xl font-semibold">Domass Cookies</div>
        <nav className="hidden gap-6 md:flex">
          <a className="hover:underline" href="#galeria">Galeria</a>
          <a className="hover:underline" href="#como-funciona">Como funciona</a>
          <a className="hover:underline" href="#sobre">Sobre</a>
          <a className="hover:underline" href="#encomenda">Encomenda</a>
        </nav>
        <div className="hidden md:block">
          <PrimaryButton>Fazer encomenda</PrimaryButton>
        </div>
      </header>

      {/* HERO */}
      <section className="grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl leading-tight md:text-5xl">
            Biscoitos artesanais personalizados para momentos especiais
          </h1>
          <p className="mt-4 text-base md:text-lg">
            Feitos à mão, com carinho em cada detalhe — do tema ao acabamento.
          </p>

          <div className="mt-6 flex gap-3">
            <PrimaryButton>Fazer encomenda</PrimaryButton>
            <SecondaryButton>Ver galeria</SecondaryButton>
          </div>
        </div>

        {/* Placeholder da imagem do hero */}
        <div className="rounded-3xl bg-domass-cookie p-6 shadow-sm">
          <div className="aspect-[4/3] w-full rounded-2xl bg-domass-bg/60 grid place-items-center">
            <span className="text-sm">Foto destaque (hero)</span>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="mt-14 rounded-3xl bg-domass-cookie p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Inspirações</h2>
        <p className="mt-1">Alguns temas que já criamos (e podemos criar o seu também).</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-domass-bg/60 p-4 shadow-sm"
            >
              <div className="aspect-square rounded-xl bg-domass-bg/60 grid place-items-center">
                <span className="text-sm">Foto {i + 1}</span>
              </div>
              <div className="mt-3 font-medium">Tema exemplo</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="mt-14">
        <h2 className="text-2xl font-semibold">Como funciona</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: "Conte sua ideia", desc: "Tema, quantidade, tamanhos e detalhes do seu pedido." },
            { title: "Produção artesanal", desc: "Cuidamos de cada etapa para ficar do jeitinho que você imaginou." },
            { title: "Entrega do seu momento", desc: "Tudo pronto para tornar a ocasião ainda mais especial." },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl bg-domass-bg/60 p-6 shadow-sm">
              <div className="text-lg font-semibold">{item.title}</div>
              <p className="mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="mt-14 rounded-3xl bg-domass-cookie p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Sobre a Domass Cookies</h2>
        <p className="mt-3">
          A Domass Cookies nasceu do amor pelos detalhes e pela alegria de fazer parte de momentos especiais.
          Aqui, cada biscoito é feito à mão — com cuidado, carinho e personalização.
        </p>
      </section>

      {/* CTA FINAL */}
      <section className="mt-14 rounded-3xl bg-domass-primary p-8 text-white shadow-sm">
        <h2 className="text-3xl font-semibold">Vamos criar algo especial juntos?</h2>
        <p className="mt-2 opacity-95">
          Envie sua ideia e retornamos com o orçamento e o prazo.
        </p>
        <div className="mt-6">
          <button className="rounded-full bg-domass-bg px-6 py-3 font-semibold text-domass-primary hover:opacity-90 transition">
            Fazer encomenda
          </button>
        </div>
      </section>

      {/* Âncora do formulário (vamos construir em seguida) */}
      <section id="encomenda" className="mt-14 pb-10">
        <h2 className="text-2xl font-semibold">Encomenda</h2>
        <p className="mt-2">Formulário entra aqui no próximo passo.</p>
      </section>
    </main>
  );
}
