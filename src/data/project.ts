import type { Project } from "../types/project";
import qualityLanding from "../assets/quality-landing.jpg";
import qualityDashboard from "../assets/quality-dashboard.jpg";

export const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Store",
    description:
      "A responsive e-commerce platform designed to provide a seamless and modern shopping experience. It features product listings, detailed pages, and an intuitive shopping cart. Secure authentication and efficient data management were implemented to ensure optimal performance and security.",
    image: qualityLanding,
    tags: ["React", "TailwindCSS", "Node.js"],
    demoUrl: "https://qualitywines-store.vercel.app/",
    githubUrl:
      "https://github.com/Grupo-ITSE-2023-para-Quality/Store-quality-wines",
    featured: true,
  },
  {
    id: 2,
    title: "Admin Dashboard",
    description:
      "A comprehensive platform for managing products, orders, and user data. It includes real-time updates, role-based access, and optimized workflows to streamline operations and enhance efficiency.",
    image: qualityDashboard,
    tags: ["CRUD", "Clerk"],
    demoUrl: "https://qualitywines-admin.vercel.app/",
    githubUrl:
      "https://github.com/Grupo-ITSE-2023-para-Quality/Dashboard-Quality-Wines",
    featured: false,
  },
];
