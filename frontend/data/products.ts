export interface Product {
  id: number;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  category: string;
  fabric: string;
  color: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  deleted?: boolean;
  description?: {
    blouse: string;
    length: string;
    washing: string;
    note?: string;
  };
  specifications?: {
    fabric: string;
    media: string;
  };
  thumbnailImages?: string[];
}

export const topHandpickedSarees: Product[] = [
  {
    id: 1,
    title: "Royal Banarasi Silk Saree with Gold Zari Work",
    price: "$125.00",
    originalPrice: "$150.00",
    image: "/images/Royal Banarasi Silk Saree with Gold Zari Work.jpg",
    badge: "Best Seller",
    badgeColor: "bg-red-500",
    category: "Banarasi Silk",
    fabric: "Pure Silk",
    color: "Maroon",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    deleted: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Pure Silk",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 2,
    title: "Traditional Kanjivaram Wedding Saree",
    price: "$180.00",
    originalPrice: "$220.00",
    image: "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    badge: "Premium",
    badgeColor: "bg-purple-500",
    category: "Kanjivaram",
    fabric: "Silk",
    color: "Pink",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Silk",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 3,
    title: "Handloom Cotton Saree with Block Print",
    price: "$45.00",
    originalPrice: "$60.00",
    image: "/images/Handloom Cotton Saree with Block Print.jpeg",
    badge: "Eco-Friendly",
    badgeColor: "bg-green-500",
    category: "Cotton Handloom",
    fabric: "Cotton",
    color: "Blue",
    rating: 4.6,
    reviews: 156,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Cotton",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 4,
    title: "Designer Georgette Saree with Sequin Work",
    price: "$85.00",
    originalPrice: "$110.00",
    image: "/images/Designer Georgette Saree with Sequin Work.jpeg",
    badge: "Trending",
    badgeColor: "bg-orange-500",
    category: "Designer",
    fabric: "Georgette",
    color: "Navy Blue",
    rating: 4.7,
    reviews: 73,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Georgette",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  }
];

export const newArrivalSarees: Product[] = [
  {
    id: 5,
    title: "Bridal Red Silk Saree with Heavy Embroidery",
    price: "$250.00",
    image: "/images/Bridal Red Silk Saree with Heavy Embroidery.jpeg",
    badge: "New",
    badgeColor: "bg-blue-500",
    category: "Bridal",
    fabric: "Silk",
    color: "Red",
    rating: 4.9,
    reviews: 45,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Silk",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Handloom Cotton Saree with Block Print.jpeg",
      "/images/Royal Banarasi Silk Saree with Gold Zari Work.jpg",
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 6,
    title: "Elegant Chiffon Saree with Pearl Work",
    price: "$75.00",
    image: "/images/Elegant Chiffon Saree with Pearl Work.jpeg",
    badge: "New",
    badgeColor: "bg-blue-500",
    category: "Chiffon",
    fabric: "Chiffon",
    color: "Peach",
    rating: 4.5,
    reviews: 32,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Chiffon",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 7,
    title: "Tissue Silk Saree with Gold Border",
    price: "$95.00",
    image: "/images/Tissue Silk Saree with Gold Border.jpeg",
    badge: "New",
    badgeColor: "bg-blue-500",
    category: "Tissue Silk",
    fabric: "Tissue Silk",
    color: "Green",
    rating: 4.6,
    reviews: 28,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Tissue Silk",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Handloom Cotton Saree with Block Print.jpeg",
      "/images/Royal Banarasi Silk Saree with Gold Zari Work.jpg",
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 8,
    title: "Mangalagiri Cotton Saree with Traditional Border",
    price: "$55.00",
    image: "/images/Handloom Cotton Saree with Block Print.jpeg",
    badge: "New",
    badgeColor: "bg-blue-500",
    category: "Mangalagiri",
    fabric: "Cotton",
    color: "Yellow",
    rating: 4.4,
    reviews: 19,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Cotton",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  }
];

export const festivalCollection: Product[] = [
  {
    id: 9,
    title: "Diwali Special Gold Zari Saree",
    price: "$135.00",
    image: "https://images.pexels.com/photos/8839831/pexels-photo-8839831.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Festival Special",
    badgeColor: "bg-yellow-500",
    category: "Festival",
    fabric: "Silk",
    color: "Gold",
    rating: 4.8,
    reviews: 67,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Silk",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 10,
    title: "Navratri Chaniya Choli Style Saree",
    price: "$90.00",
    image: "https://images.pexels.com/photos/8839825/pexels-photo-8839825.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Festival Special",
    badgeColor: "bg-yellow-500",
    category: "Festival",
    fabric: "Georgette",
    color: "Multi",
    rating: 4.7,
    reviews: 54,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Georgette",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 11,
    title: "Karva Chauth Red Silk Saree",
    price: "$115.00",
    image: "https://images.pexels.com/photos/9054595/pexels-photo-9054595.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Festival Special",
    badgeColor: "bg-yellow-500",
    category: "Festival",
    fabric: "Silk",
    color: "Red",
    rating: 4.6,
    reviews: 41,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Silk",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 12,
    title: "Puja Special White Cotton Saree",
    price: "$40.00",
    image: "https://images.pexels.com/photos/9054599/pexels-photo-9054599.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Festival Special",
    badgeColor: "bg-yellow-500",
    category: "Festival",
    fabric: "Cotton",
    color: "White",
    rating: 4.5,
    reviews: 38,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Cotton",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  }
];

export const officeWearSarees: Product[] = [
  {
    id: 13,
    title: "Professional Linen Saree for Office",
    price: "$50.00",
    image: "https://images.pexels.com/photos/8839833/pexels-photo-8839833.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Office Wear",
    badgeColor: "bg-gray-500",
    category: "Office Wear",
    fabric: "Linen",
    color: "Beige",
    rating: 4.4,
    reviews: 92,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Linen",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 14,
    title: "Formal Cotton Saree with Subtle Print",
    price: "$42.00",
    image: "https://images.pexels.com/photos/9054593/pexels-photo-9054593.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Office Wear",
    badgeColor: "bg-gray-500",
    category: "Office Wear",
    fabric: "Cotton",
    color: "Gray",
    rating: 4.3,
    reviews: 76,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Cotton",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Handloom Cotton Saree with Block Print.jpeg",
      "/images/Royal Banarasi Silk Saree with Gold Zari Work.jpg",
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 15,
    title: "Corporate Georgette Saree",
    price: "$65.00",
    image: "https://images.pexels.com/photos/8839827/pexels-photo-8839827.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Office Wear",
    badgeColor: "bg-gray-500",
    category: "Office Wear",
    fabric: "Georgette",
    color: "Navy",
    rating: 4.5,
    reviews: 63,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Georgette",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 16,
    title: "Business Casual Handloom Saree",
    price: "$48.00",
    image: "https://images.pexels.com/photos/8839846/pexels-photo-8839846.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Office Wear",
    badgeColor: "bg-gray-500",
    category: "Office Wear",
    fabric: "Handloom",
    color: "Cream",
    rating: 4.2,
    reviews: 55,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Handloom",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  }
];

export const casualSarees: Product[] = [
  {
    id: 17,
    title: "Daily Wear Cotton Saree",
    price: "$35.00",
    image: "https://images.pexels.com/photos/9054597/pexels-photo-9054597.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Casual",
    badgeColor: "bg-teal-500",
    category: "Casual",
    fabric: "Cotton",
    color: "Light Blue",
    rating: 4.3,
    reviews: 128,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Cotton",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 18,
    title: "Comfortable Handloom Saree",
    price: "$38.00",
    image: "https://images.pexels.com/photos/8839831/pexels-photo-8839831.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Casual",
    badgeColor: "bg-teal-500",
    category: "Casual",
    fabric: "Handloom",
    color: "Green",
    rating: 4.4,
    reviews: 95,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Handloom",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 19,
    title: "Everyday Wear Printed Saree",
    price: "$32.00",
    image: "https://images.pexels.com/photos/9054595/pexels-photo-9054595.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Casual",
    badgeColor: "bg-teal-500",
    category: "Casual",
    fabric: "Cotton",
    color: "Floral",
    rating: 4.1,
    reviews: 87,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Cotton",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 20,
    title: "Simple Elegant Cotton Saree",
    price: "$36.00",
    image: "https://images.pexels.com/photos/8839825/pexels-photo-8839825.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Casual",
    badgeColor: "bg-teal-500",
    category: "Casual",
    fabric: "Cotton",
    color: "Pink",
    rating: 4.2,
    reviews: 71,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Cotton",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  }
];

export const premiumCollection: Product[] = [
  {
    id: 21,
    title: "Luxury Banarasi Silk with Real Gold Zari",
    price: "$350.00",
    originalPrice: "$450.00",
    image: "https://images.pexels.com/photos/8839833/pexels-photo-8839833.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Luxury",
    badgeColor: "bg-amber-500",
    category: "Premium",
    fabric: "Pure Silk",
    color: "Royal Blue",
    rating: 5.0,
    reviews: 23,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Pure Silk",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 22,
    title: "Heritage Kanjivaram with Temple Border",
    price: "$280.00",
    originalPrice: "$350.00",
    image: "https://images.pexels.com/photos/9054599/pexels-photo-9054599.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Luxury",
    badgeColor: "bg-amber-500",
    category: "Premium",
    fabric: "Kanjivaram Silk",
    color: "Deep Purple",
    rating: 4.9,
    reviews: 18,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Kanjivaram Silk",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 23,
    title: "Designer Bridal Lehenga Saree",
    price: "$420.00",
    originalPrice: "$550.00",
    image: "https://images.pexels.com/photos/8839846/pexels-photo-8839846.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Luxury",
    badgeColor: "bg-amber-500",
    category: "Premium",
    fabric: "Silk with Embroidery",
    color: "Maroon Gold",
    rating: 4.8,
    reviews: 15,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Silk with Embroidery",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  },
  {
    id: 24,
    title: "Exclusive Chanderi Silk with Handwork",
    price: "$195.00",
    originalPrice: "$250.00",
    image: "https://images.pexels.com/photos/8839827/pexels-photo-8839827.jpeg?auto=compress&cs=tinysrgb&w=600",
    badge: "Luxury",
    badgeColor: "bg-amber-500",
    category: "Premium",
    fabric: "Chanderi Silk",
    color: "Mint Green",
    rating: 4.7,
    reviews: 12,
    inStock: true,
    description: {
      blouse: "Attached",
      length: "6.3m with blouse: 0.8m",
      washing: "Dry Wash",
      note: "Color may vary due to photo-graphic lighting sources or your device settings",
    },
    specifications: {
      fabric: "Chanderi Silk",
      media: "Instagram",
    },
    thumbnailImages: [
      "/images/Traditional Kanjivaram Wedding Saree.jpeg",
    ],
  }
];

export const allProducts = [
  ...topHandpickedSarees,
  ...newArrivalSarees,
  ...festivalCollection,
  ...officeWearSarees,
  ...casualSarees,
  ...premiumCollection
];