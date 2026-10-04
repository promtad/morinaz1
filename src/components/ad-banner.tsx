import { Megaphone } from "lucide-react";
import { getT } from "@/lib/i18n-server";
import { getSlots } from "@/lib/queries";

/**
 * Banner renderer for the managed ad placements (header / middle / sidebar / footer).
 * Fully controlled from the admin panel → مساحات الإعلانات.
 */
export default async function AdBanner({
  position,
}: {
  position: "header" | "middle" | "sidebar" | "footer";
}) {
  const { t } = await getT();
  const slots = await getSlots(position);
  if (!slots.length) return null;

  if (position === "sidebar") {
    return (
      <div className="flex flex-col gap-5">
        {slots.map((slot) => (
          <SlotCard key={slot.id} slot={slot} tall label={t("ads.label")} />
        ))}
      </div>
    );
  }

  const gridClass =
    position === "middle" && slots.length > 1 ? "grid gap-5 sm:grid-cols-2" : "flex flex-col gap-5";

  return (
    <div className="shell">
      <div className={gridClass}>
        {slots.map((slot) => (
          <SlotCard key={slot.id} slot={slot} label={t("ads.label")} />
        ))}
      </div>
    </div>
  );
}

function SlotCard({
  slot,
  tall = false,
  label,
}: {
  slot: {
    id: number;
    name: string;
    imageUrl: string;
    linkUrl: string;
    htmlCode: string;
  };
  tall?: boolean;
  label: string;
}) {
  return (
    <div className="group min-w-0">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-mist">
        <Megaphone size={11} />
        <span>{label}</span>
        <span className="font-display tracking-[0.25em]">ADS</span>
      </div>
      {slot.htmlCode.trim() ? (
        <div
          className="overflow-hidden rounded-2xl"
          dangerouslySetInnerHTML={{ __html: slot.htmlCode }}
        />
      ) : (
        <a
          href={slot.linkUrl || "#"}
          target={slot.linkUrl ? "_blank" : undefined}
          rel="sponsored nofollow noopener"
          className="block overflow-hidden rounded-2xl border border-rosewash shadow-card"
          title={slot.name}
        >
          {slot.imageUrl ? (
            <img
              src={slot.imageUrl}
              alt={slot.name}
              loading="lazy"
              className={`w-full object-cover transition duration-700 group-hover:scale-[1.03] ${
                tall ? "aspect-[3/4]" : "h-28 sm:h-32 md:h-40"
              }`}
            />
          ) : (
            <div className="flex h-28 items-center justify-center bg-gradient-to-l from-brand to-brand-deep px-6 text-center font-extrabold text-white">
              {slot.name}
            </div>
          )}
        </a>
      )}
    </div>
  );
}
