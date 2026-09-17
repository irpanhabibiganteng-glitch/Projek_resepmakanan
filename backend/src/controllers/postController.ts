import { Request, Response } from "express";
import { posts } from "../data/posts";

export const getPosts = (_req: Request, res: Response) => {
    res.json({ posts });
};

export const getPostById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const post = posts.find((item) => item.id === id);

    if (!post) {
    return res.status(404).json({ message: "Resep tidak ditemukan" });
    }

    return res.json(post);
};

export const createPost = (req: Request, res: Response) => {
    const { title, content, categoryName } = req.body;

    if (!title || !content || !categoryName) {
    return res
        .status(400)
        .json({ message: "Judul, isi, dan kategori wajib diisi" });
    }

    const newPost = {
    id: Date.now(),
    title,
    content,
    categoryName,
    };

    posts.unshift(newPost);
    return res.status(201).json(newPost);
};

export const updatePost = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = posts.findIndex((item) => item.id === id);

    if (index === -1) {
    return res.status(404).json({ message: "Resep tidak ditemukan" });
    }

    const { title, content, categoryName } = req.body;
    posts[index] = {
    ...posts[index],
    title: title ?? posts[index].title,
    content: content ?? posts[index].content,
    categoryName: categoryName ?? posts[index].categoryName,
    };

    return res.json(posts[index]);
};

export const deletePost = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = posts.findIndex((item) => item.id === id);

    if (index === -1) {
    return res.status(404).json({ message: "Resep tidak ditemukan" });
    }

    const [deletedPost] = posts.splice(index, 1);
    return res.json({
    message: "Resep berhasil dihapus",
    deletedId: deletedPost.id,
    });
};
