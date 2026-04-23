import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#overview", label: "Overview" },
      { href: "/#features", label: "Features" },
      { href: "/#audiences", label: "Who it's for" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/contact", label: "Contact" },
      { href: "https://github.com/HarshYadav152/SaveBook", label: "GitHub", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/licence", label: "MIT License" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-[var(--border)] bg-[color:var(--surface-footer)] text-slate-200">
      <div className="site-container px-4 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white">
              SaveBook
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              A personal notebook app with a calmer interface, stronger storytelling, and a theme system that now carries across the whole site.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-white">{column.title}</h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-400">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="hover:text-white">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} SaveBook. Built for long-form thinking.</p>
          <p>Light and dark modes now travel with the whole experience.</p>
        </div>
      </div>
    </footer>
  );
}
