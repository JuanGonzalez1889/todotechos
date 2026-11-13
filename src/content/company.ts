import type { ArtVariant } from "@/components/Photo";

/** Recursos operativos. Textos provisorios: no atribuir capacidades no comprobadas. */
export const infrastructure: {
  title: string;
  text: string;
  art: ArtVariant;
  image?: string;
}[] = [
  {
    title: "Taller metalúrgico",
    text: "Fabricación de pórticos, cabriadas, vigas y columnas antes de llevarlos a obra.",
    art: "taller",
  },
  {
    title: "Maquinaria y equipos",
    text: "Equipos para movimiento de suelo, izaje y montaje de estructuras de gran porte.",
    art: "equipo",
  },
  {
    title: "Logística",
    text: "Traslado de estructuras, materiales y equipos hasta el lugar de la obra.",
    art: "suelo",
  },
  {
    title: "Equipo humano",
    text: "Personal propio de taller y de obra, con conducción técnica en cada proyecto.",
    art: "estructura",
  },
];

/** Hitos de la historia. PROVISORIOS: el relato debe redactarlo y aprobarlo la empresa. */
export const milestones = [
  {
    title: "Los comienzos",
    text: "La empresa nace dedicada a los techos y las cubiertas, el oficio que le da nombre.",
  },
  {
    title: "Taller metalúrgico",
    text: "Suma fabricación propia de estructuras metálicas para naves y galpones.",
  },
  {
    title: "Obra integral",
    text: "Incorpora obra civil y movimientos de suelo para resolver proyectos completos.",
  },
  {
    title: "Hoy",
    text: "Más de 60 años después, ejecuta obras industriales y civiles de gran escala.",
  },
];

export const values = [
  {
    title: "Seguridad",
    text: "Cada obra se planifica y se ejecuta cuidando a las personas que trabajan en ella.",
  },
  {
    title: "Calidad",
    text: "Controlamos la fabricación en taller y el montaje en obra, etapa por etapa.",
  },
  {
    title: "Cumplimiento",
    text: "Acordamos alcance y plazos antes de empezar, y trabajamos para respetarlos.",
  },
];

export const clients: { name: string; logo: string; project?: string }[] = [
  { name: "Alumbrera", logo: "/images/alumbrera.png" },
  { name: "Arcor", logo: "/images/arcor.svg" },
  { name: "BASF", logo: "/images/basf.png" },
  { name: "Coca-Cola", logo: "/images/coca.png" },
  { name: "Ledesma", logo: "/images/ledesma.jpeg" },
  { name: "SINER", logo: "/images/siner.jpeg" },
  { name: "YPF", logo: "/images/ypf.webp" },
  { name: "sevillanita", logo: "/images/sevillanita.png" },
   { name: "navatec", logo: "/images/navatec.png" },
  
];
