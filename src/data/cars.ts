export interface StaticCar {
  id: number;
  brand: string;
  name: string;
  type: string;
  tagline: string;
  description: string;
  image: string;
  horsepower: string;
  acceleration: string;
  topSpeed: string;
  price: string;
  priceLabel: string;
}

export interface Car {
  _id: string;
  sellerName?: string;
  sellerEmail?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  kilometers: number;
  fuelType: string;
  transmission: string;
  description: string;
  image: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  city?: string;
  views?: number;
}

export const cars: StaticCar[] = [

  // BMW
  {
    id: 1,
    brand: "BMW",
    name: "BMW M4",
    type: "Sports Car",
    tagline: "Born to dominate every road.",
    description:
      "A perfect combination of aggressive design, incredible performance and pure driving emotion.",
    image: "/images/bmw-m4.png.png",
    horsepower: "503 HP",
    acceleration: "3.8 Sec",
    topSpeed: "250 Km/h",
    price: "₹75 Lakh",
    priceLabel: "Starting Price",
  },

  {
    id: 2,
    brand: "BMW",
    name: "BMW X5",
    type: "Luxury SUV",
    tagline: "Luxury with an electrifying attitude.",
    description:
      "The BMW X5 combines breathtaking performance with bold luxury and advanced technology.",
    image: "/images/bmw-x5.png.png",
    horsepower: "335 HP",
    acceleration: "5.3 Sec",
    topSpeed: "250 Km/h",
    price: "₹1.20 Crore",
    priceLabel: "Starting Price",
  },


  // Mercedes
  {
    id: 3,
    brand: "Mercedes-Benz",
    name: "Mercedes C-Class",
    type: "Luxury Sedan",
    tagline: "Luxury meets unstoppable performance.",
    description:
      "Experience handcrafted luxury combined with powerful Mercedes engineering.",
    image: "/images/mercedes-c-class.png.png",
    horsepower: "255 HP",
    acceleration: "5.9 Sec",
    topSpeed: "250 Km/h",
    price: "₹60 Lakh",
    priceLabel: "Starting Price",
  },


  {
    id: 4,
    brand: "Mercedes-Benz",
    name: "Mercedes GLS",
    type: "Luxury SUV",
    tagline: "Iconic design. Unmatched presence.",
    description:
      "A premium SUV combining comfort, technology and outstanding performance.",
    image: "/images/mercedes-glc.png.png",
    horsepower: "375 HP",
    acceleration: "5.2 Sec",
    topSpeed: "250 Km/h",
    price: "₹1.30 Crore",
    priceLabel: "Starting Price",
  },


  // Audi
  {
    id: 5,
    brand: "Audi",
    name: "Audi A6",
    type: "Luxury Sedan",
    tagline: "Progress through performance.",
    description:
      "A powerful luxury sedan combining comfort with advanced technology.",
    image: "/images/audi-a6.png.png",
    horsepower: "241 HP",
    acceleration: "6.5 Sec",
    topSpeed: "250 Km/h",
    price: "₹70 Lakh",
    priceLabel: "Starting Price",
  },


  {
    id: 6,
    brand: "Audi",
    name: "Audi Q8",
    type: "Luxury SUV",
    tagline: "Bold design. Refined performance.",
    description:
      "A sophisticated SUV offering powerful performance and premium comfort.",
    image: "/images/audi-q8.png.png",
    horsepower: "335 HP",
    acceleration: "5.6 Sec",
    topSpeed: "250 Km/h",
    price: "₹1.07 Crore",
    priceLabel: "Starting Price",
  },


  // Porsche
  {
    id: 7,
    brand: "Porsche",
    name: "Porsche 911 Carrera",
    type: "Sports Car",
    tagline: "The legend continues.",
    description:
      "An iconic sports car delivering precision engineering and pure driving excitement.",
    image: "/images/porsche-911.png",
    horsepower: "379 HP",
    acceleration: "4.2 Sec",
    topSpeed: "293 Km/h",
    price: "₹1.99 Crore",
    priceLabel: "Starting Price",
  },


  // Lamborghini
  {
    id: 8,
    brand: "Lamborghini",
    name: "Lamborghini Huracán",
    type: "Super Car",
    tagline: "Pure emotion in every line.",
    description:
      "A dramatic supercar built for breathtaking performance.",
    image: "/images/lamborghini-huracan.png",
    horsepower: "631 HP",
    acceleration: "2.9 Sec",
    topSpeed: "325 Km/h",
    price: "₹3.22 Crore",
    priceLabel: "Starting Price",
  },


  // Range Rover
  {
    id: 9,
    brand: "Range Rover",
    name: "Range Rover Sport",
    type: "Luxury SUV",
    tagline: "Luxury without limits.",
    description:
      "A premium SUV combining luxury, performance and capability.",
    image: "/images/range-rover-sport.png",
    horsepower: "523 HP",
    acceleration: "4.5 Sec",
    topSpeed: "250 Km/h",
    price: "₹1.64 Crore",
    priceLabel: "Starting Price",
  },


  // Ferrari
  {
    id: 10,
    brand: "Ferrari",
    name: "Ferrari Roma",
    type: "Super Car",
    tagline: "La nuova dolce vita.",
    description:
      "A beautifully designed Ferrari combining elegance and performance.",
    image: "/images/ferrari-roma.png",
    horsepower: "612 HP",
    acceleration: "3.4 Sec",
    topSpeed: "320 Km/h",
    price: "₹3.76 Crore",
    priceLabel: "Starting Price",
  },

];