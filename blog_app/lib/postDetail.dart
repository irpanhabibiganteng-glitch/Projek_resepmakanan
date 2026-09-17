import 'package:flutter/material.dart';

import 'api_service.dart';
import 'editPost.dart';
import 'post.dart';

class PostDetailScreen extends StatelessWidget {
  final Post post;

  const PostDetailScreen({super.key, required this.post});

  @override
  Widget build(BuildContext context) {
    const terracotta = Color(0xFFD85A30);
    const mustard = Color(0xFFFAC775);
    const brown = Color(0xFF412402);
    const cream = Color(0xFFFAEEDA);

    Future<void> confirmDelete() async {
      final navigator = Navigator.of(context);
      final confirmed = await showDialog<bool>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Hapus Resep'),
          content: const Text('Apakah Anda yakin ingin menghapus resep ini?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Batal'),
            ),
            TextButton(
              onPressed: () => Navigator.pop(ctx, true),
              child: const Text('Hapus', style: TextStyle(color: terracotta)),
            ),
          ],
        ),
      );

      if (confirmed == true) {
        try {
          await ApiService.deletePost(post.id);
          if (context.mounted) {
            navigator.pop({'deletedId': post.id});
          }
        } catch (e) {
          if (context.mounted) {
            ScaffoldMessenger.of(
              context,
            ).showSnackBar(SnackBar(content: Text(e.toString())));
          }
        }
      }
    }

    return Scaffold(
      backgroundColor: cream,
      appBar: AppBar(
        title: const Text('Detail Resep'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () async {
              final navigator = Navigator.of(context);
              final updatedPost = await Navigator.push<Post>(
                context,
                MaterialPageRoute(builder: (_) => EditPostScreen(post: post)),
              );

              if (updatedPost != null) {
                navigator.pop({'updatedPost': updatedPost});
              }
            },
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: confirmDelete,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: mustard,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                post.categoryName,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: brown,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              post.title,
              style: const TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Color(0xFF412402),
              ),
            ),
            const SizedBox(height: 18),
            Text(
              post.content,
              style: const TextStyle(
                fontSize: 16,
                height: 1.7,
                color: Color(0xFF4A2D10),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
