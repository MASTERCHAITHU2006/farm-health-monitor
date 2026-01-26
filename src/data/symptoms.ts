export interface Symptom {
  id: string;
  label: string;
  description?: string;
  category: string;
}

export const symptoms: Symptom[] = [
  // Leaf symptoms
  { id: "yellowing", label: "Yellowing Leaves", description: "Leaves turning yellow or pale green", category: "Leaves" },
  { id: "brown_spots", label: "Brown Spots", description: "Dark brown or tan spots on leaves", category: "Leaves" },
  { id: "wilting", label: "Wilting", description: "Leaves drooping or losing firmness", category: "Leaves" },
  { id: "curling", label: "Leaf Curling", description: "Leaves curling inward or outward", category: "Leaves" },
  { id: "holes", label: "Holes in Leaves", description: "Small to large holes in leaf tissue", category: "Leaves" },
  { id: "white_powder", label: "White Powdery Coating", description: "White dusty substance on leaves", category: "Leaves" },
  { id: "black_spots", label: "Black Spots", description: "Dark black lesions on leaves", category: "Leaves" },
  { id: "leaf_drop", label: "Premature Leaf Drop", description: "Leaves falling before their time", category: "Leaves" },
  
  // Stem symptoms
  { id: "stem_rot", label: "Stem Rot", description: "Soft, decaying stem tissue", category: "Stem" },
  { id: "stem_canker", label: "Stem Cankers", description: "Sunken, dead areas on stem", category: "Stem" },
  { id: "stem_discolor", label: "Stem Discoloration", description: "Unusual coloring of stem", category: "Stem" },
  { id: "stem_lesions", label: "Stem Lesions", description: "Wounds or damaged areas on stem", category: "Stem" },
  
  // Fruit symptoms
  { id: "fruit_rot", label: "Fruit Rot", description: "Decaying or rotting fruit", category: "Fruit" },
  { id: "fruit_spots", label: "Fruit Spots", description: "Spots or blemishes on fruit", category: "Fruit" },
  { id: "fruit_deform", label: "Fruit Deformation", description: "Misshapen or abnormal fruit", category: "Fruit" },
  { id: "fruit_drop", label: "Premature Fruit Drop", description: "Fruit falling before ripe", category: "Fruit" },
  
  // Root symptoms
  { id: "root_rot", label: "Root Rot", description: "Decaying or mushy roots", category: "Root" },
  { id: "root_galls", label: "Root Galls", description: "Swollen areas on roots", category: "Root" },
  { id: "stunted_growth", label: "Stunted Growth", description: "Plant not growing properly", category: "Root" },
  
  // General symptoms
  { id: "death", label: "Plant Death", description: "Complete or partial plant death", category: "General" },
  { id: "poor_yield", label: "Poor Yield", description: "Lower than expected harvest", category: "General" },
  { id: "insects", label: "Visible Insects", description: "Bugs or pests visible on plant", category: "General" },
];

export const symptomCategories = [...new Set(symptoms.map((s) => s.category))];
