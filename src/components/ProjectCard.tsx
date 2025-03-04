import React from "react";
import type { Project } from "../types/project";

interface ProjectCardProps {
  project: Project;
  eager?: boolean; // Propiedad para carga eager o lazy de la imagen
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  eager = false,
}) => {
  return (
    <article
      className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      aria-labelledby={`project-${project.id}-title`}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
          loading={eager ? "eager" : "lazy"} // Carga eager o lazy
          width={400} // Ancho fijo para optimización
          height={192} // Alto fijo para optimización
        />
        {project.featured && (
          <span
            className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm"
            aria-label="Featured project"
          >
            Featured
          </span>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        <h3
          id={`project-${project.id}-title`}
          className="text-xl font-semibold text-orange-900 mb-2"
        >
          {project.title}
        </h3>
        <p className="text-orange-600 mb-4">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              data-tag={tag.toLowerCase()}
              className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm"
              aria-label={`Technology: ${tag}`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
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
              className="flex-1 text-center px-4 py-2 border border-orange-600 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors"
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
