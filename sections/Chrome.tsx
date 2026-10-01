// Windows-98 style title bar used by the Retro Desktop template on cards and photos
export function WinBar({ title, icon = "📄" }: { title: string; icon?: string }) {
  return (
    <div className="flex items-center justify-between gap-2 px-1.5 py-1 text-[13px] font-bold text-white" style={{ background: "linear-gradient(90deg,#000080,#1084d0)", textTransform: "none" }}>
      <span className="flex min-w-0 items-center gap-1.5 truncate">
        <span aria-hidden>{icon}</span>
        <span className="truncate">{title}</span>
      </span>
      <span className="flex shrink-0 gap-0.5" aria-hidden>
        {["_", "□", "×"].map((c) => (
          <span key={c} className="grid h-4 w-4 place-items-center bg-[#c0c0c0] text-[11px] leading-none text-black" style={{ borderStyle: "solid", borderWidth: 1, borderColor: "#fff #808080 #808080 #fff" }}>
            {c}
          </span>
        ))}
      </span>
    </div>
  );
}
