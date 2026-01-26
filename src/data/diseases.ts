export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  crops: string[];
  prevention: string[];
  treatment: string[];
  severity: "low" | "medium" | "high";
}

export const diseases: Disease[] = [
  {
    id: "late_blight",
    name: "Late Blight",
    description: "A devastating disease caused by the oomycete pathogen Phytophthora infestans. It spreads rapidly in cool, moist conditions and can destroy entire crops within days.",
    symptoms: ["brown_spots", "wilting", "black_spots", "fruit_rot"],
    crops: ["tomato", "potato"],
    prevention: [
      "Use certified disease-free seeds",
      "Apply copper-based fungicides preventively",
      "Ensure good air circulation between plants",
      "Remove and destroy infected plant debris",
      "Avoid overhead irrigation"
    ],
    treatment: [
      "Apply fungicides containing mancozeb or chlorothalonil",
      "Remove and destroy infected plants immediately",
      "Increase spacing between plants",
      "Apply systemic fungicides in severe cases"
    ],
    severity: "high"
  },
  {
    id: "powdery_mildew",
    name: "Powdery Mildew",
    description: "A fungal disease that appears as white, powdery spots on leaves and stems. Common in warm, dry conditions with high humidity.",
    symptoms: ["white_powder", "yellowing", "curling", "stunted_growth"],
    crops: ["cucumber", "grape", "pepper", "tomato", "apple"],
    prevention: [
      "Plant resistant varieties",
      "Ensure adequate plant spacing",
      "Apply sulfur-based fungicides preventively",
      "Avoid excessive nitrogen fertilization"
    ],
    treatment: [
      "Apply potassium bicarbonate solution",
      "Use neem oil or horticultural oils",
      "Apply fungicides containing myclobutanil",
      "Remove heavily infected leaves"
    ],
    severity: "medium"
  },
  {
    id: "bacterial_wilt",
    name: "Bacterial Wilt",
    description: "A bacterial disease that blocks water-conducting tissues, causing rapid wilting. Often fatal to infected plants.",
    symptoms: ["wilting", "yellowing", "stem_discolor", "death"],
    crops: ["tomato", "potato", "pepper", "eggplant", "banana"],
    prevention: [
      "Use disease-free transplants",
      "Control cucumber beetles (disease vectors)",
      "Rotate crops with non-host plants",
      "Remove infected plants immediately"
    ],
    treatment: [
      "No effective chemical treatment available",
      "Remove and destroy infected plants",
      "Solarize soil before replanting",
      "Use resistant varieties"
    ],
    severity: "high"
  },
  {
    id: "leaf_spot",
    name: "Leaf Spot Disease",
    description: "Various fungal or bacterial infections causing circular spots on leaves. Can reduce photosynthesis and weaken plants.",
    symptoms: ["brown_spots", "black_spots", "yellowing", "leaf_drop"],
    crops: ["tomato", "pepper", "beans", "cabbage", "strawberry"],
    prevention: [
      "Avoid overhead watering",
      "Improve air circulation",
      "Remove plant debris",
      "Apply preventive fungicides"
    ],
    treatment: [
      "Apply copper-based fungicides",
      "Remove infected leaves",
      "Reduce humidity around plants",
      "Apply appropriate bactericides for bacterial spots"
    ],
    severity: "medium"
  },
  {
    id: "root_rot_disease",
    name: "Root Rot",
    description: "Fungal disease affecting root systems, often caused by overwatering or poor drainage. Leads to plant decline and death.",
    symptoms: ["root_rot", "wilting", "yellowing", "stunted_growth", "death"],
    crops: ["tomato", "pepper", "beans", "soybean", "cotton"],
    prevention: [
      "Ensure proper drainage",
      "Avoid overwatering",
      "Use raised beds in wet areas",
      "Apply beneficial fungi (Trichoderma)"
    ],
    treatment: [
      "Improve drainage immediately",
      "Apply fungicides containing metalaxyl",
      "Remove severely infected plants",
      "Allow soil to dry between waterings"
    ],
    severity: "high"
  },
  {
    id: "mosaic_virus",
    name: "Mosaic Virus",
    description: "Viral disease causing mottled, discolored patterns on leaves. Spread by aphids and contaminated tools.",
    symptoms: ["yellowing", "curling", "stunted_growth", "fruit_deform", "poor_yield"],
    crops: ["tomato", "cucumber", "pepper", "beans", "potato"],
    prevention: [
      "Control aphid populations",
      "Use certified virus-free seeds",
      "Disinfect tools between plants",
      "Remove infected plants promptly"
    ],
    treatment: [
      "No cure available for infected plants",
      "Remove and destroy infected plants",
      "Control insect vectors",
      "Plant resistant varieties"
    ],
    severity: "medium"
  }
];

export function findPossibleDiseases(cropId: string, symptomIds: string[]): Disease[] {
  return diseases
    .filter(disease => disease.crops.includes(cropId))
    .map(disease => {
      const matchingSymptoms = symptomIds.filter(s => disease.symptoms.includes(s));
      const matchScore = matchingSymptoms.length / disease.symptoms.length;
      return { ...disease, matchScore };
    })
    .filter(d => d.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
