class Post {
  final int id;
  final String title;
  final String content;
  final String categoryName;

  Post({
    required this.id,
    required this.title,
    required this.content,
    required this.categoryName,
  });

  static const List<String> categories = [
    'Makanan Utama',
    'Minuman',
    'Dessert',
    'Masakan Tradisional',
  ];

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as int,
      title: json['title'] as String,
      content: json['content'] as String,
      categoryName: json['categoryName'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'categoryName': categoryName,
    };
  }
}
