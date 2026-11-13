import type { ArtVariant } from "@/components/Photo";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  scope: string[];
  art: ArtVariant;
  /** Ruta de la foto en /public. Vacío = se muestra el dibujo provisorio. */
  image?: string;
  /** Aparece en la portada (el brief pide cinco tarjetas). */
  featured: boolean;
};

/** Catálogo propuesto en el brief. El cliente debe confirmar qué prestaciones realiza. */
export const services: Service[] = [
  {
    slug: "naves-industriales",
    title: "Naves y galpones industriales",
    shortTitle: "Naves industriales",
    summary: "Montaje de estructuras, cerramientos y cubiertas para naves nuevas, ampliaciones y restauraciones.",
    description:
      "Ejecutamos naves y galpones industriales según el alcance contratado: desde el montaje de la estructura hasta los cerramientos y la cubierta. También ampliamos y restauramos naves existentes sin detener la operación cuando el proyecto lo permite.",
    scope: [
      "Diseño y ejecución según alcance contratado",
      "Montaje de estructuras",
      "Cerramientos laterales y frontales",
      "Cubiertas",
      "Ampliaciones de naves existentes",
      "Restauraciones",
    ],
    art: "nave",
    featured: true,
  },
  {
    slug: "estructuras-metalicas",
    title: "Construcciones y estructuras metálicas",
    shortTitle: "Estructuras metálicas",
    summary: "Fabricación y montaje de pórticos, cabriadas, vigas, columnas y entrepisos.",
    description:
      "Fabricamos y montamos estructuras metálicas para la industria y la construcción. Cada pieza sale del taller lista para el montaje en obra, con el equipo y la logística necesarios para estructuras de gran porte.",
    scope: [
      "Pórticos",
      "Cabriadas",
      "Vigas y columnas",
      "Entrepisos",
      "Fabricación en taller",
      "Montaje en obra",
    ],
    art: "estructura",
    featured: true,
  },
  {
    slug: "obras-civiles",
    title: "Obras civiles e infraestructura",
    shortTitle: "Obras civiles",
    summary: "Fundaciones, hormigón, mampostería y obras complementarias de infraestructura.",
    description:
      "Resolvemos la obra civil que acompaña a cada proyecto industrial: fundaciones, estructuras de hormigón, mampostería y obras complementarias, coordinadas con el montaje metálico para cumplir los plazos.",
    scope: [
      "Fundaciones",
      "Hormigón armado",
      "Mampostería",
      "Obras complementarias",
      "Infraestructura",
    ],
    art: "civil",
    featured: true,
  },
  {
    slug: "movimientos-de-suelo",
    title: "Movimientos de suelo",
    shortTitle: "Movimientos de suelo",
    summary: "Limpieza de terrenos, excavaciones, nivelación, rellenos y compactación.",
    description:
      "Preparamos el terreno para que la obra arranque sobre una base firme: limpieza, excavaciones, nivelación, rellenos y compactación, con equipos acordes a la superficie y al tipo de suelo.",
    scope: [
      "Limpieza de terrenos",
      "Excavaciones",
      "Nivelación",
      "Rellenos",
      "Compactación",
      "Preparación de superficies",
    ],
    art: "suelo",
    featured: true,
  },
  {
    slug: "techos-y-cubiertas",
    title: "Techos y cubiertas industriales",
    shortTitle: "Techos y cubiertas",
    summary: "Cubiertas nuevas, reemplazo y restauración, aislaciones, canaletas y zinguería.",
    description:
      "Colocamos, reemplazamos y restauramos cubiertas industriales. Incluimos aislaciones, canaletas, zinguería y cerramientos, y ofrecemos mantenimiento para extender la vida útil del techo.",
    scope: [
      "Cubiertas nuevas",
      "Reemplazo y restauración",
      "Aislaciones",
      "Canaletas y zinguería",
      "Cerramientos",
      "Mantenimiento",
    ],
    art: "techo",
    featured: true,
  },
  {
    slug: "demoliciones-y-adecuaciones",
    title: "Demoliciones y adecuaciones",
    shortTitle: "Demoliciones",
    summary: "Demoliciones controladas, retiro de materiales y preparación de obra.",
    description:
      "Realizamos demoliciones controladas, retiro de materiales y adecuación del predio para dejarlo listo para la nueva obra, respetando los permisos y protocolos de cada proyecto.",
    scope: ["Demoliciones controladas", "Retiro de materiales", "Preparación de obra"],
    art: "demolicion",
    featured: false,
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
