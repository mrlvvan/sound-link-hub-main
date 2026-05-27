import { supabase } from "@/lib/supabase";

export type LicenseName = "mp3" | "wav" | "exclusive";

export type LicenseTierDef = {
  name: LicenseName;
  label: string;
  sublabel: string;
  description: string;
  badgeClass: string;
};

export const LICENSE_TIERS: LicenseTierDef[] = [
  {
    name: "mp3",
    label: "MP3",
    sublabel: "Базовая",
    description: "MP3 файл · До 10 000 стримов · Некоммерческое",
    badgeClass: "border-slate-400/40 bg-slate-500/10 text-slate-500",
  },
  {
    name: "wav",
    label: "WAV",
    sublabel: "Стандартная",
    description: "WAV + стемы · До 50 000 стримов · Коммерческое",
    badgeClass: "border-primary/40 bg-primary/10 text-primary",
  },
  {
    name: "exclusive",
    label: "Exclusive",
    sublabel: "Эксклюзив",
    description: "Все файлы · Без ограничений · Только вам",
    badgeClass: "border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
];

export type LicenseRecord = {
  id: string;
  beat_id: string;
  name: LicenseName;
  label: string;
  price: number;
  description: string | null;
  created_at: string;
};

export const getBeatLicenses = async (beatId: string): Promise<LicenseRecord[]> => {
  const { data, error } = await supabase
    .from("beat_licenses")
    .select("*")
    .eq("beat_id", beatId)
    .order("price", { ascending: true });
  if (error) throw error;
  return (data as LicenseRecord[]) ?? [];
};

export const upsertBeatLicenses = async (
  beatId: string,
  inputs: Partial<Record<LicenseName, number>>
): Promise<void> => {
  const records = LICENSE_TIERS
    .filter(({ name }) => {
      const p = inputs[name];
      return p != null && p > 0;
    })
    .map(({ name, sublabel, description }) => ({
      beat_id: beatId,
      name,
      label: sublabel,
      price: inputs[name]!,
      description,
    }));

  if (records.length === 0) return;

  await supabase.from("beat_licenses").delete().eq("beat_id", beatId);
  const { error } = await supabase.from("beat_licenses").insert(records);
  if (error) throw error;
};

export const getLicenseById = async (licenseId: string): Promise<LicenseRecord | null> => {
  const { data, error } = await supabase
    .from("beat_licenses")
    .select("*")
    .eq("id", licenseId)
    .maybeSingle();
  if (error) throw error;
  return data as LicenseRecord | null;
};

export const getMinLicensePrice = (licenses: LicenseRecord[]): number | null => {
  if (licenses.length === 0) return null;
  return Math.min(...licenses.map((l) => l.price));
};
