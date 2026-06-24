export type Category = "AI/ML" | "Biomed" | "Frontend" | "Embedded" | "Research";

export interface Project {
  id: string;
  title: string;
  titleZh: string;
  subtitle: string;
  category: Category;
  tags: string[];
  description: string;
  highlight?: string;
  webPath: string;
}

export const PROJECTS: Project[] = [
  {
    id: "gene-ai",
    title: "Gene AI Platform",
    titleZh: "基因 AI 平台",
    subtitle: "RAG · Knowledge Retrieval · FastAPI",
    category: "AI/ML",
    tags: ["RAG", "FastAPI", "LLM", "Bioinformatics"],
    description:
      "A genomic knowledge retrieval platform using RAG (Retrieval-Augmented Generation). Indexes gene sequences and literature to enable natural-language queries over biological databases.",
    highlight: "LLM + Genomics",
    webPath: "/gene-ai",
  },
  {
    id: "ngs",
    title: "NGS Pipeline",
    titleZh: "NGS 定序",
    subtitle: "Next-Gen Sequencing · Quality Control",
    category: "Biomed",
    tags: ["NGS", "Bioinformatics", "QC", "Pipeline"],
    description:
      "End-to-end next-generation sequencing analysis pipeline covering FASTQ quality control, alignment, variant calling, and downstream visualization.",
    highlight: "Genomics Pipeline",
    webPath: "/ngs",
  },
  {
    id: "protein-mpnn",
    title: "ProteinMPNN",
    titleZh: "蛋白質設計 AI",
    subtitle: "Protein Design · Structure Prediction",
    category: "AI/ML",
    tags: ["ProteinMPNN", "AlphaFold2", "ESM-2", "PyTorch"],
    description:
      "Interactive workspace for de-novo protein sequence design using ProteinMPNN. Integrates AlphaFold2 structure prediction and ESM-2 scoring in one interface.",
    highlight: "De-novo Design",
    webPath: "/protein-mpnn",
  },
  {
    id: "firmware",
    title: "Firmware Engineering",
    titleZh: "韌體工程",
    subtitle: "Nuvoton Cortex-M0 · MCU Development",
    category: "Embedded",
    tags: ["Cortex-M0", "Keil", "EBI", "RGB565", "J-Link"],
    description:
      "Full-cycle firmware development for Nuvoton Nano130KE3BN (Cortex-M0). Covers EBI parallel bus, RGB565 TFT display, I2C/SPI/UART peripherals, and J-Link debugging.",
    highlight: "MCU Firmware",
    webPath: "/firmware",
  },
  {
    id: "stem-cell",
    title: "Stem Cell Research",
    titleZh: "幹細胞研究",
    subtitle: "Neural Regeneration · TBI · 2018 Award",
    category: "Biomed",
    tags: ["MSC", "NSC", "Cell Sheet", "TBI", "HUVEC"],
    description:
      "Genetically-modified mesenchymal stem cell study on neural vascular regeneration after traumatic brain injury. Won the 2018 National Innovation Award and Future Tech Breakthrough Award.",
    highlight: "2018 Award Winner",
    webPath: "/stem-cell",
  },
  {
    id: "interactive-showcase",
    title: "Interactive Showcase",
    titleZh: "前端互動技術",
    subtitle: "Three.js · WebGL · GSAP · A-Frame VR",
    category: "Frontend",
    tags: ["Three.js", "WebGL", "GSAP", "A-Frame VR", "WebAssembly"],
    description:
      "A panoramic showcase of advanced frontend technologies: 3D scenes with Three.js, GPU particle systems, WebAssembly performance demos, A-Frame VR, and Speech API interactions.",
    highlight: "8 Tech Demos",
    webPath: "/interactive-showcase",
  },
  {
    id: "report",
    title: "Protein AI Report",
    titleZh: "蛋白質 AI 報告",
    subtitle: "Research Report · AI Drug Discovery",
    category: "Research",
    tags: ["Protein Design", "AI", "Drug Discovery", "Report"],
    description:
      "Technical research report on applying AI for protein-ligand binding prediction and de-novo drug candidate design, covering ProteinMPNN, RoseTTAFold, and ESMFold methods.",
    highlight: "Technical Report",
    webPath: "/report",
  },
  {
    id: "thesis",
    title: "Trading Strategy Research",
    titleZh: "交易策略研究",
    subtitle: "Genetic Algorithm · Price Distribution",
    category: "Research",
    tags: ["Genetic Algorithm", "Trading", "Optimization", "Python"],
    description:
      "Master's thesis: optimizing profit-based trading strategies using genetic algorithms on historical price distribution data. Developed custom fitness functions and crossover operators.",
    highlight: "Master's Thesis",
    webPath: "/thesis",
  },
  {
    id: "interview-prep",
    title: "Interview Prep",
    titleZh: "面試準備手冊",
    subtitle: "Macromolecular AI · RL · Math",
    category: "AI/ML",
    tags: ["AlphaFold2", "RL", "PyTorch", "Math", "Interview"],
    description:
      "A comprehensive 6-chapter interview preparation handbook for macromolecular AI researcher roles: advantage analysis, mini projects, math reasoning, RL fundamentals, mock Q&A, and a sprint plan.",
    highlight: "6-Week Sprint",
    webPath: "/interview-prep",
  },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  "AI/ML": "#39d0f0",
  Biomed: "#4ade80",
  Frontend: "#a78bfa",
  Embedded: "#f59e0b",
  Research: "#f472b6",
};
