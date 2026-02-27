import type { Project } from "../types/project";
import qualityLanding from "../assets/quality-landing.jpg";
import qualityDashboard from "../assets/quality-dashboard.jpg";
import totem from "../assets/totem.png";
import minibus from "../assets/minibus.png";

export const projects: Project[] = [
  {
    id: 1,
    title: "Campaigns Totem Oasis",
    description:
      "Self-service kiosk system that handles customer check-in, campaign enrollment, and automated QR voucher generation for in-store raffles and rewards.",
    image: totem,
    tags: ["Kiosk", "React", "Tailwind", "Node.js"],
    demoUrl: "",
    githubUrl: "",
    featured: true,
  },
  {
    id: 2,
    title: "Minibus Oasis",
    description:
      "A minibus operations platform with live trip tracking, passenger event logging, geolocation, and role-based dashboards for drivers and admins.",
    image: minibus,
    tags: ["GPS", "React", "Tailwind", "Node.js"],
    demoUrl: "",
    githubUrl: "",
    featured: true,
  },
  {
    id: 3,
    title: "Quality Wines Store",
    description:
      "Responsive e-commerce platform delivering a modern, seamless shopping experience. Includes product listings, detailed pages, an intuitive cart, secure authentication, and optimized data management for performance and security.",
    image: qualityLanding,
    tags: ["eCommerce", "React", "Tailwind", "Node.js"],
    demoUrl: "https://qualitywines-store.vercel.app/",
    githubUrl:
      "https://github.com/Grupo-ITSE-2023-para-Quality/Store-quality-wines",
    featured: false,
  },
  {
    id: 4,
    title: "Store Dashboard",
    description:
      "A comprehensive platform for managing products, orders, and user data. It includes real-time updates, role-based access, and optimized workflows to streamline operations and enhance efficiency.",
    image: qualityDashboard,
    tags: ["CRUD", "React", "Tailwind", "Node.js"],
    demoUrl: "https://qualitywines-admin.vercel.app/",
    githubUrl:
      "https://github.com/Grupo-ITSE-2023-para-Quality/Dashboard-Quality-Wines",
    featured: false,
  },
];
