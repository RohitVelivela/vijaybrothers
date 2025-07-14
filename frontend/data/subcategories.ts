export interface SubCategory {
  id: number;
  title: string;
  parentCategory: string;
  link: string;
}

export const subcategories: SubCategory[] = [
  {
    id: 1,
    title: "Cotton Fabric",
    parentCategory: "Fabric",
    link: "/category/fabric/cotton"
  },
  {
    id: 2,
    title: "Silk Fabric",
    parentCategory: "Fabric",
    link: "/category/fabric/silk"
  },
  {
    id: 3,
    title: "Georgette Fabric",
    parentCategory: "Fabric",
    link: "/category/fabric/georgette"
  },
  {
    id: 4,
    title: "Chiffon Fabric",
    parentCategory: "Fabric",
    link: "/category/fabric/chiffon"
  },
  {
    id: 5,
    title: "Kanjivaram Handloom",
    parentCategory: "Handloom Sarees",
    link: "/category/handloom-sarees/kanjivaram"
  },
  {
    id: 6,
    title: "Banarasi Handloom",
    parentCategory: "Handloom Sarees",
    link: "/category/handloom-sarees/banarasi"
  },
  {
    id: 7,
    title: "Pochampally Handloom",
    parentCategory: "Handloom Sarees",
    link: "/category/handloom-sarees/pochampally"
  },
  {
    id: 8,
    title: "Dharmavaram Handloom",
    parentCategory: "Handloom Sarees",
    link: "/category/handloom-sarees/dharmavaram"
  },
];
