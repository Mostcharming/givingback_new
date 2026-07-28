type ProjectImageLike =
  | string
  | {
      image?: string | null;
      url?: string | null;
      src?: string | null;
    };

type AreaLike =
  | string
  | number
  | {
      id?: string | number | null;
      area_id?: string | number | null;
      name?: string | null;
      label?: string | null;
      value?: string | number | null;
      area?: AreaLike | null;
    };

export interface ProjectImageSource {
  id?: string | number | null;
  title?: string | null;
  category?: AreaLike | AreaLike[] | null;
  categories?: AreaLike | AreaLike[] | null;
  area?: AreaLike | AreaLike[] | null;
  areas?: AreaLike | AreaLike[] | null;
  projectAreas?: AreaLike | AreaLike[] | null;
  project_areas?: AreaLike | AreaLike[] | null;
  area_ids?: AreaLike | AreaLike[] | null;
  projectImages?: ProjectImageLike[] | null;
  project_images?: ProjectImageLike[] | null;
  images?: ProjectImageLike[] | null;
  image?: string | null;
  projectImage?: string | null;
  coverImage?: string | null;
  thumbnail?: string | null;
}

const asset = (id: number, slug: string, variant: 1 | 2) =>
  `/images/project-areas/${id}-${slug}-${variant}.webp`;

/**
 * These keys mirror the current `areas` table. Keeping the database ID in each
 * filename makes it easy to audit or replace an area's artwork later.
 */
export const AREA_PROJECT_IMAGES = {
  education: [asset(1, "education", 1), asset(1, "education", 2)],
  health: [asset(2, "health", 1), asset(2, "health", 2)],
  "water and sanitation": [
    asset(3, "water-and-sanitation", 1),
    asset(3, "water-and-sanitation", 2),
  ],
  disabilities: [
    asset(4, "disabilities", 1),
    asset(4, "disabilities", 2),
  ],
  "poverty reduction": [
    asset(6, "poverty-reduction", 1),
    asset(6, "poverty-reduction", 2),
  ],
  "human rights": [
    asset(7, "human-rights", 1),
    asset(7, "human-rights", 2),
  ],
  "gender equality": [
    asset(8, "gender-equality", 1),
    asset(8, "gender-equality", 2),
  ],
  "environmental sustainability": [
    asset(9, "environmental-sustainability", 1),
    asset(9, "environmental-sustainability", 2),
  ],
  agriculture: [asset(10, "agriculture", 1), asset(10, "agriculture", 2)],
  "capacity building": [
    asset(11, "capacity-building", 1),
    asset(11, "capacity-building", 2),
  ],
  "democracy and good governance": [
    asset(12, "democracy-and-good-governance", 1),
    asset(12, "democracy-and-good-governance", 2),
  ],
  "access to information": [
    asset(13, "access-to-information", 1),
    asset(13, "access-to-information", 2),
  ],
  "consumer rights": [
    asset(14, "consumer-rights", 1),
    asset(14, "consumer-rights", 2),
  ],
  "financial literacy and education": [
    asset(15, "financial-literacy-and-education", 1),
    asset(15, "financial-literacy-and-education", 2),
  ],
  "orphans and vulnerable children": [
    asset(16, "orphans-and-vulnerable-children", 1),
    asset(16, "orphans-and-vulnerable-children", 2),
  ],
  poverty: [asset(17, "poverty", 1), asset(17, "poverty", 2)],
  "good health and wellbeing": [
    asset(18, "good-health-and-wellbeing", 1),
    asset(18, "good-health-and-wellbeing", 2),
  ],
  "quality education": [
    asset(19, "quality-education", 1),
    asset(19, "quality-education", 2),
  ],
  "clean water and sanitation": [
    asset(20, "clean-water-and-sanitation", 1),
    asset(20, "clean-water-and-sanitation", 2),
  ],
  "affordable and clean energy": [
    asset(21, "affordable-and-clean-energy", 1),
    asset(21, "affordable-and-clean-energy", 2),
  ],
  "decent work and economic growth": [
    asset(22, "decent-work-and-economic-growth", 1),
    asset(22, "decent-work-and-economic-growth", 2),
  ],
  "industry innovation and infrastructure": [
    asset(23, "industry-innovation-and-infrastructure", 1),
    asset(23, "industry-innovation-and-infrastructure", 2),
  ],
  "reduced inequalities": [
    asset(24, "reduced-inequalities", 1),
    asset(24, "reduced-inequalities", 2),
  ],
  "sustainable cities and communities": [
    asset(25, "sustainable-cities-and-communities", 1),
    asset(25, "sustainable-cities-and-communities", 2),
  ],
  "responsible consumption and production": [
    asset(26, "responsible-consumption-and-production", 1),
    asset(26, "responsible-consumption-and-production", 2),
  ],
  "climate action": [
    asset(27, "climate-action", 1),
    asset(27, "climate-action", 2),
  ],
  "peace justice and strong institutions": [
    asset(30, "peace-justice-and-strong-institutions", 1),
    asset(30, "peace-justice-and-strong-institutions", 2),
  ],
  "partnerships for the goals": [
    asset(31, "partnerships-for-the-goals", 1),
    asset(31, "partnerships-for-the-goals", 2),
  ],
  others: [asset(32, "others", 1), asset(32, "others", 2)],
} as const;

type AreaKey = keyof typeof AREA_PROJECT_IMAGES;

const AREA_NAME_BY_ID: Record<string, AreaKey> = {
  "1": "education",
  "2": "health",
  "3": "water and sanitation",
  "4": "disabilities",
  "6": "poverty reduction",
  "7": "human rights",
  "8": "gender equality",
  "9": "environmental sustainability",
  "10": "agriculture",
  "11": "capacity building",
  "12": "democracy and good governance",
  "13": "access to information",
  "14": "consumer rights",
  "15": "financial literacy and education",
  "16": "orphans and vulnerable children",
  "17": "poverty",
  "18": "good health and wellbeing",
  "19": "quality education",
  "20": "clean water and sanitation",
  "21": "affordable and clean energy",
  "22": "decent work and economic growth",
  "23": "industry innovation and infrastructure",
  "24": "reduced inequalities",
  "25": "sustainable cities and communities",
  "26": "responsible consumption and production",
  "27": "climate action",
  "30": "peace justice and strong institutions",
  "31": "partnerships for the goals",
  "32": "others",
};

const normalizeAreaName = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const addAreaValue = (value: AreaLike | AreaLike[] | null | undefined, output: string[]) => {
  if (value == null) return;

  if (Array.isArray(value)) {
    value.forEach((item) => addAreaValue(item, output));
    return;
  }

  if (typeof value === "number") {
    const name = AREA_NAME_BY_ID[String(value)];
    if (name) output.push(name);
    return;
  }

  if (typeof value === "string") {
    value
      .split(/[,;|]/)
      .map(normalizeAreaName)
      .filter(Boolean)
      .forEach((name) => {
        const idName = AREA_NAME_BY_ID[name];
        output.push(idName ?? name);
      });
    return;
  }

  addAreaValue(value.area, output);

  const id = value.id ?? value.area_id;
  if (id != null && AREA_NAME_BY_ID[String(id)]) {
    output.push(AREA_NAME_BY_ID[String(id)]);
  }

  const displayValue = value.name ?? value.label ?? value.value;
  if (displayValue != null && displayValue !== id) {
    addAreaValue(displayValue, output);
  }
};

export const getProjectAreaNames = (
  project: ProjectImageSource | null | undefined,
): AreaKey[] => {
  if (!project) return [];

  const names: string[] = [];
  [
    project.category,
    project.categories,
    project.area,
    project.areas,
    project.projectAreas,
    project.project_areas,
    project.area_ids,
  ].forEach((value) => addAreaValue(value, names));

  return Array.from(
    new Set(
      names.filter(
        (name): name is AreaKey =>
          Object.prototype.hasOwnProperty.call(AREA_PROJECT_IMAGES, name),
      ),
    ),
  );
};

const readImageValue = (value: ProjectImageLike | null | undefined) => {
  if (!value) return null;
  if (typeof value === "string") return value.trim() || null;
  return value.image?.trim() || value.url?.trim() || value.src?.trim() || null;
};

export const getUploadedProjectImage = (
  project: ProjectImageSource | null | undefined,
): string | null => {
  if (!project) return null;

  for (const collection of [
    project.projectImages,
    project.project_images,
    project.images,
  ]) {
    if (!Array.isArray(collection)) continue;
    for (const item of collection) {
      const image = readImageValue(item);
      if (image) return image;
    }
  }

  return (
    project.projectImage?.trim() ||
    project.coverImage?.trim() ||
    project.thumbnail?.trim() ||
    project.image?.trim() ||
    null
  );
};

const stableHash = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const getProjectFallbackImage = (
  project: ProjectImageSource | null | undefined,
): string => {
  const areas = getProjectAreaNames(project);
  const matchedAreas = areas.length > 0 ? areas : (["others"] as AreaKey[]);
  const candidates = matchedAreas.flatMap((area) => [
    ...AREA_PROJECT_IMAGES[area],
  ]);
  const seed = String(project?.id ?? project?.title ?? matchedAreas.join("|"));

  return candidates[stableHash(seed) % candidates.length];
};

/**
 * Project image priority: uploaded media first, then a deterministic image from
 * any matching area. The deterministic hash prevents cards from changing image
 * between renders while distributing projects across both area variants.
 */
export const getProjectImage = (
  project: ProjectImageSource | null | undefined,
): string => getUploadedProjectImage(project) ?? getProjectFallbackImage(project);
