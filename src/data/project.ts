import type { Project } from "../types/project";

export const projects: Project[] = [
  {
      id: 1,
      title: "E-Commerce Store",
      description: "Created a responsive e-commerce store with product listings, detailed pages, and a seamless shopping cart. Integrated secure authentication and efficient data management for a modern online shopping experience.",
      image: "/src/assets/quality-landing.jpg",
      tags: ["React", "TailwindCSS", "Node.js"],
      demoUrl: "https://qualitywines-store.vercel.app/",
      githubUrl: "https://github.com/Grupo-ITSE-2023-para-Quality/Store-quality-wines",
      featured: true
    },
    {
      id: 2,
      title: "Admin Dashboard",
      description: "Developed a robust dashboard to manage products, orders, and user data. Enabled real-time updates, role-based access, and streamlined operations for efficient management.",
      image: "src/assets/quality-dashboard.jpg",
      tags: ["CRUD", "Clerk"],
      demoUrl: "https://qualitywines-admin.vercel.app/",
      githubUrl: "https://github.com/Grupo-ITSE-2023-para-Quality/Dashboard-Quality-Wines",
      featured: false
    }
];

