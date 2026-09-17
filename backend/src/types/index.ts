export type Category =
    | "Makanan Utama"
    | "Minuman"
    | "Dessert"
    | "Masakan Tradisional";

export type Post = {
    id: number;
    title: string;
    content: string;
    categoryName: Category;
};

export type User = {
    id: number;
    name: string;
    email: string;
    password: string;
};
