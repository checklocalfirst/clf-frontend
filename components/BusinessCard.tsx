import Image from "next/image";
import Link from "next/link";

interface BusinessCardProps {
  category: string;
  name: string;
  neighborhood: string;
  description?: string;
  imageUrl?: string;
  href?: string;
}

export default function BusinessCard({
  category,
  name,
  neighborhood,
  description,
  imageUrl,
  href = "#",
}: BusinessCardProps) {
  return (
    <Link href={href} className="group block">
      {/* ── Mobile layout (< md): photo-first, compact ── */}
      <div className="md:hidden flex flex-col gap-3">
        {/* Photo */}
        <div className="relative h-[224px] w-full rounded-[2px] overflow-hidden bg-[#b7a78c]">
          {imageUrl && <Image src={imageUrl} alt={name} fill sizes="100vw" className="object-cover" />}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-[6px]">
          <p className="font-display font-bold text-[8px] text-[#b7a78c] tracking-[1.8px] uppercase">
            {category}
          </p>
          <p className="font-display font-bold text-[13px] text-[#253022] leading-[19px]">
            {name}
          </p>
          <p className="font-body text-[10px] text-[#596155]">{neighborhood}</p>
        </div>

        {/* View button */}
        <div className="border border-[#253022] flex items-center justify-center py-[11px] rounded-[2px]">
          <span className="font-display font-bold text-[9px] text-[#253022] tracking-[1.6px] uppercase">
            View shop
          </span>
        </div>
      </div>

      {/* ── Desktop layout (md+): text-first, bordered card ── */}
      <div className="hidden md:flex flex-col gap-3 bg-white border border-[#dbe0d9] rounded-[16px] shadow-[0px_8px_24px_0px_rgba(37,48,34,0.04)] p-6 w-[360px] min-h-[344px] overflow-hidden">
        {/* Category + Name */}
        <p className="font-display font-bold text-[20px] text-[#6b7d67] uppercase whitespace-nowrap">
          {category}
        </p>
        <p className="font-display font-bold text-[20px] text-[#151814] uppercase">
          {name}
        </p>

        {/* Photo */}
        <div className="relative h-[120px] w-full rounded-[8px] overflow-hidden bg-[#b7a78c] flex-shrink-0">
          {imageUrl && <Image src={imageUrl} alt={name} fill sizes="360px" className="object-cover" />}
        </div>

        {/* Description or neighborhood */}
        {(description || neighborhood) && (
          <p className="font-body text-[20px] text-[#596155] leading-[1.5]">
            {description ?? neighborhood}
          </p>
        )}
      </div>
    </Link>
  );
}
