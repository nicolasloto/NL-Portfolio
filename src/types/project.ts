export interface Project {
  id: number;
  title: string;
  description: string;
  image: string | ImageMetadata;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}
