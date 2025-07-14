export interface Category {
  id: number;
  title: string;
  image: string;
  description: string;
  itemCount: number;
}

export const categories: Category[] = [
  {
    id: 1,
    title: "Banarasi Silk Sarees",
    image: "/images/categories/banaris kora saree.jpg",
    description: "Luxurious handwoven silk sarees from Varanasi",
    itemCount: 45
  },
  {
    id: 2,
    title: "Kanjivaram Silk",
    image: "/images/categories/Traditional Kanjivaram Wedding Saree",
    description: "Premium South Indian silk sarees",
    itemCount: 38
  },
  {
    id: 3,
    title: "Cotton Handloom",
    image: "/images/categories/fancy sarees",
    description: "Comfortable daily wear cotton sarees",
    itemCount: 52
  },
  {
    id: 4,
    title: "Designer Sarees",
    image: "/images/categories/tiissue silk sarees.jpeg",
    description: "Contemporary designer collections",
    itemCount: 29
  },
  {
    id: 5,
    title: "Bridal Collection",
    image: "/images/categories/kuppadam sarees.jpeg",
    description: "Exquisite bridal and wedding sarees",
    itemCount: 24
  },
  {
    id: 6,
    title: "Georgette Sarees",
    image: "/images/categories/office wear sarees",
    description: "Elegant georgette fabric sarees",
    itemCount: 41
  },
  {
    id: 7,
    title: "Chiffon Collection",
    image: "/images/categories/chinaya silk sarees.jpeg",
    description: "Light and graceful chiffon sarees",
    itemCount: 33
  },
  {
    id: 8,
    title: "Tissue Silk",
    image: "/images/categories/soft silk saree.webp",
    description: "Shimmering tissue silk sarees",
    itemCount: 27
  },
  {
    id: 9,
    title: "Mangalagiri Cotton",
    image: "/images/categories/kalanajal slik saress",
    description: "Traditional Andhra Pradesh cotton sarees",
    itemCount: 35
  },
  {
    id: 10,
    title: "Pochampally Ikat",
    image: "/images/categories/Traditional Kanjivaram Wedding Saree",
    description: "Geometric patterned Pochampally sarees",
    itemCount: 22
  },
  {
    id: 11,
    title: "Chanderi Silk",
    image: "/images/categories/fancy sarees",
    description: "Lightweight Madhya Pradesh silk sarees",
    itemCount: 31
  },
  {
    id: 12,
    title: "Tussar Silk",
    image: "/images/categories/banaris kora saree.jpg",
    description: "Natural textured tussar silk sarees",
    itemCount: 26
  },
  {
    id: 13,
    title: "Organza Sarees",
    image: "/images/categories/tiissue silk sarees.jpeg",
    description: "Crisp and elegant organza sarees",
    itemCount: 19
  },
  {
    id: 14,
    title: "Net Sarees",
    image: "/images/categories/kuppadam sarees.jpeg",
    description: "Modern net fabric sarees",
    itemCount: 23
  },
  {
    id: 15,
    title: "Linen Sarees",
    image: "/images/categories/office wear sarees",
    description: "Comfortable and breathable linen sarees",
    itemCount: 28
  },
  {
    id: 16,
    title: "Embroidered Sarees",
    image: "/images/categories/chinaya silk sarees.jpeg",
    description: "Intricately embroidered designer sarees",
    itemCount: 34
  }
];

export const featuredCategories = categories.slice(0, 8);
export const allCategories = categories;