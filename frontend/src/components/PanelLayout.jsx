import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, FileText, Activity, Settings as SettingsIcon,
  Sun, Moon, LogOut, Radio,
} from "lucide-react";
import Dashboard from "../pages/Dashboard";
import Faturas from "../pages/Faturas";
import Atividade from "../pages/Atividade";
import Configuracoes from "../pages/Configuracoes";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, testid: "nav-tab-dashboard" },
  { id: "faturas", label: "Faturas Geradas", icon: FileText, testid: "nav-tab-faturas" },
  { id: "atividade", label: "Atividade em Tempo Real", icon: Activity, testid: "nav-tab-atividade" },
  { id: "configuracoes", label: "Configurações", icon: SettingsIcon, testid: "nav-tab-configuracoes" },
];

const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem("brk_theme") || "dark");
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("brk_theme", theme);
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
};

export default function PanelLayout() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [theme, toggleTheme] = useTheme();

  const render = useCallback(() => {
    switch (tab) {
      case "faturas": return <Faturas />;
      case "atividade": return <Atividade />;
      case "configuracoes": return <Configuracoes />;
      default: return <Dashboard goToTab={setTab} />;
    }
  }, [tab]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary grid place-items-center font-display font-extrabold text-primary-foreground">B</div>
            <div className="leading-none">
              <p className="font-display font-extrabold text-base">BRK</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">Painel Admin</p>
            </div>
            <span className="ml-3 hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-[11px] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              AO VIVO
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              data-testid="theme-toggle-button"
              onClick={toggleTheme}
              className="h-10 w-10 grid place-items-center rounded-xl border border-border bg-background hover:bg-accent transition-colors"
              title="Alternar tema"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-2 pr-1">
              <div className="h-9 w-9 rounded-full bg-primary/15 text-primary grid place-items-center font-semibold text-sm">
                {(user?.username || "A")[0].toUpperCase()}
              </div>
              <div className="leading-none">
                <p className="text-sm font-semibold">{user?.username}</p>
                <p className="text-[11px] text-muted-foreground">Administrador</p>
              </div>
            </div>
            <button
              data-testid="logout-button"
              onClick={logout}
              className="h-10 px-3 inline-flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors text-sm font-medium"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto -mb-px">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  data-testid={t.testid}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={16} /> {t.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6">{render()}</main>
    </div>
  );
}
