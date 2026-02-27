import React from "react";
import type { Project } from "../types/project";

interface ProjectCardProps {
  project: Project;
  eager?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  eager = false,
}) => {
  const badgePalette = [
    "bg-cyan-500/15 text-cyan-100 border-cyan-300/50",
    "bg-fuchsia-500/15 text-fuchsia-100 border-fuchsia-300/50",
    "bg-amber-500/15 text-amber-100 border-amber-300/50",
  ];

  return (
    <article
      className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
      aria-labelledby={`project-${project.id}-title`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          loading={eager ? "eager" : "lazy"}
          width={400}
          height={192}
        />
        {project.featured && (
          <span
            className="absolute top-4 right-4 bg-cyan-700 text-white px-3 py-1 rounded-full text-sm"
            aria-label="Featured project"
          >
            Featured
          </span>
        )}
      </div>

      <div className="p-6">
        <h3
          id={`project-${project.id}-title`}
          className="text-xl font-semibold text-white mb-2"
        >
          {project.title}
        </h3>
        <p className="text-white/70 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <span
              key={tag}
              data-tag={tag.toLowerCase()}
              className={`px-3 py-1 border rounded-full text-sm ${
                badgePalette[index % badgePalette.length]
              }`}
              aria-label={`Technology: ${tag}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-cyan-800 via-indigo-800 to-fuchsia-800 text-white rounded-xl border border-white/20"
              aria-label={`View live demo of ${project.title}`}
            >
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-4 py-2 border border-white/35 text-white/90 rounded-xl hover:bg-white/10 transition-colors"
              aria-label={`View source code of ${project.title}`}
            >
              View Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
