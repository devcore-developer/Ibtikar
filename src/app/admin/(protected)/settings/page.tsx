import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const settingsRaw = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsRaw.forEach(s => settings[s.id] = s.value);
  
  return <SettingsClient settings={settings} />;
}