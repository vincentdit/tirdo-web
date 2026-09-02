import {
  FlaskConical, Cog, Cpu, LineChart, Zap, BookOpen, Rocket, Briefcase,
  MonitorSmartphone, ClipboardCheck, Users, TestTube, GraduationCap,
  Building2, Leaf, Wrench, type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  FlaskConical, Cog, Cpu, LineChart, Zap, BookOpen, Rocket, Briefcase,
  MonitorSmartphone, ClipboardCheck, Users, TestTube, GraduationCap,
  Building2, Leaf, Wrench,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = map[name] ?? Building2;
  return <Cmp className={className} />;
}
