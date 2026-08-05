"use client";

interface Option {
  id: number;
  name: string;
}

export default function MultiSelect({
  options,
  selected,
  onChange,
  min = 0,
  max = Infinity,
}: {
  options: Option[];
  selected: number[];
  onChange: (ids: number[]) => void;
  min?: number;
  max?: number;
}) {
  function toggle(id: number) {
    const isSelected = selected.includes(id);
    if (isSelected) {
      if (selected.length <= min) return;
      onChange(selected.filter((s) => s !== id));
    } else {
      if (selected.length >= max) return;
      onChange([...selected, id]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={`px-4 py-2 rounded-full border font-display font-bold text-[12px] uppercase transition-colors cursor-pointer ${
              active
                ? "bg-[#2c4a34] border-[#2c4a34] text-white"
                : "bg-white border-[#dbe0d9] text-[#423926] hover:border-[#b7a78c]"
            }`}
          >
            {opt.name}
          </button>
        );
      })}
    </div>
  );
}
