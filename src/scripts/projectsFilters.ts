type ProjectDataItem = {
  element: Element;
  title: string;
  description: string;
  tags: string[];
};

export function initProjectsFilters(): void {
  const searchInput = document.getElementById("search");
  const projectsGrid = document.getElementById("projectsGrid");
  const resetButton = document.getElementById("resetFilters");
  const tagCheckboxes = document.querySelectorAll(".tag-checkbox");

  if (!(searchInput instanceof HTMLInputElement)) return;
  if (!(projectsGrid instanceof HTMLElement)) return;
  if (!(resetButton instanceof HTMLButtonElement)) return;

  const parsedCheckboxes = Array.from(tagCheckboxes).filter(
    (checkbox): checkbox is HTMLInputElement =>
      checkbox instanceof HTMLInputElement
  );

  const projectsData: ProjectDataItem[] = Array.from(projectsGrid.children).map(
    (child) => ({
      element: child,
      title: child.querySelector("h3")?.textContent?.toLowerCase() || "",
      description: child.querySelector("p")?.textContent?.toLowerCase() || "",
      tags: Array.from(child.querySelectorAll("[data-tag]")).map(
        (tag) => tag.getAttribute("data-tag")?.toLowerCase() || ""
      ),
    })
  );

  const filterProjects = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedTags = parsedCheckboxes
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value.toLowerCase());

    projectsData.forEach((project) => {
      const matchesSearch =
        project.title.includes(searchTerm) ||
        project.description.includes(searchTerm);
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => project.tags.includes(tag));

      const wrapper = project.element.closest(".project-wrapper");
      if (wrapper) {
        wrapper.classList.toggle("hidden", !(matchesSearch && matchesTags));
      }
    });
  };

  const updateTagLabel = (checkbox: HTMLInputElement) => {
    const label = checkbox.nextElementSibling;
    if (!(label instanceof HTMLElement)) return;
    label.classList.toggle("tag-label-active", checkbox.checked);
  };

  const resetFilters = () => {
    searchInput.value = "";
    parsedCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
      updateTagLabel(checkbox);
    });
    filterProjects();
  };

  searchInput.addEventListener("input", filterProjects);
  resetButton.addEventListener("click", resetFilters);
  parsedCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateTagLabel(checkbox);
      filterProjects();
    });
  });
}
