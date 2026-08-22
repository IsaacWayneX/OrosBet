interface TabsProps {
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="inline-flex rounded-xl bg-white/6 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`rounded-lg px-3 py-2 text-sm transition ${value === tab.value ? "bg-white text-slate-950" : "text-slate-300"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
