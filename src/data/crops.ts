export interface Crop {
  id: string;
  name: string;
  emoji: string;
  category: string;
  varieties?: string[];
}

export const crops: Crop[] = [
  // Vegetables
  { id: "tomato", name: "Tomato", emoji: "🍅", category: "Vegetables", varieties: ["Cherry", "Roma", "Beefsteak"] },
  { id: "potato", name: "Potato", emoji: "🥔", category: "Vegetables", varieties: ["Russet", "Red", "Yukon Gold"] },
  { id: "onion", name: "Onion", emoji: "🧅", category: "Vegetables", varieties: ["Red", "Yellow", "White"] },
  { id: "carrot", name: "Carrot", emoji: "🥕", category: "Vegetables" },
  { id: "cabbage", name: "Cabbage", emoji: "🥬", category: "Vegetables" },
  { id: "pepper", name: "Pepper", emoji: "🫑", category: "Vegetables", varieties: ["Bell", "Chili", "Jalapeno"] },
  { id: "eggplant", name: "Eggplant", emoji: "🍆", category: "Vegetables" },
  { id: "cucumber", name: "Cucumber", emoji: "🥒", category: "Vegetables" },
  
  // Grains
  { id: "wheat", name: "Wheat", emoji: "🌾", category: "Grains" },
  { id: "rice", name: "Rice", emoji: "🌾", category: "Grains", varieties: ["Basmati", "Jasmine", "Brown"] },
  { id: "corn", name: "Corn", emoji: "🌽", category: "Grains", varieties: ["Sweet", "Field", "Popcorn"] },
  
  // Fruits
  { id: "apple", name: "Apple", emoji: "🍎", category: "Fruits", varieties: ["Red Delicious", "Granny Smith", "Fuji"] },
  { id: "grape", name: "Grape", emoji: "🍇", category: "Fruits" },
  { id: "orange", name: "Orange", emoji: "🍊", category: "Fruits" },
  { id: "banana", name: "Banana", emoji: "🍌", category: "Fruits" },
  { id: "mango", name: "Mango", emoji: "🥭", category: "Fruits" },
  { id: "strawberry", name: "Strawberry", emoji: "🍓", category: "Fruits" },
  { id: "watermelon", name: "Watermelon", emoji: "🍉", category: "Fruits" },
  
  // Legumes
  { id: "soybean", name: "Soybean", emoji: "🫘", category: "Legumes" },
  { id: "peanut", name: "Peanut", emoji: "🥜", category: "Legumes" },
  { id: "beans", name: "Beans", emoji: "🫘", category: "Legumes" },
  
  // Other
  { id: "cotton", name: "Cotton", emoji: "☁️", category: "Commercial" },
  { id: "sugarcane", name: "Sugarcane", emoji: "🎋", category: "Commercial" },
  { id: "coffee", name: "Coffee", emoji: "☕", category: "Commercial" },
];

export const cropCategories = [...new Set(crops.map((c) => c.category))];
