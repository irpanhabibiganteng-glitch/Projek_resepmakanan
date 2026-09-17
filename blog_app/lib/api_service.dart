import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import 'post.dart';

class ApiException implements Exception {
  final int statusCode;
  final String message;

  ApiException(this.statusCode, this.message);

  @override
  String toString() =>
      'ApiException(statusCode: $statusCode, message: $message)';
}

class ApiService {
  static String? _token;

  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api';
    }

    if (Platform.isAndroid) {
      return 'http://10.0.2.2:5000/api';
    }

    return 'http://localhost:5000/api';
  }

  static void saveToken(String token) {
    _token = token;
  }

  static void clearToken() {
    _token = null;
  }

  static Map<String, String> get jsonHeaders => {
    'Content-Type': 'application/json',
    if (_token != null && _token!.isNotEmpty) 'Authorization': 'Bearer $_token',
  };

  static Future<List<Post>> fetchPosts() async {
    final response = await http.get(
      Uri.parse('$baseUrl/posts'),
      headers: jsonHeaders,
    );

    if (response.statusCode >= 400) {
      throw ApiException(
        response.statusCode,
        jsonDecode(response.body)['message'] ?? 'Gagal memuat resep',
      );
    }

    final body = jsonDecode(response.body);
    final posts = body['posts'] as List<dynamic>? ?? const [];

    return posts
        .map((post) => Post.fromJson(post as Map<String, dynamic>))
        .toList();
  }

  static Future<Post> createPost(Post post) async {
    final response = await http.post(
      Uri.parse('$baseUrl/posts'),
      headers: jsonHeaders,
      body: jsonEncode(post.toJson()),
    );

    if (response.statusCode >= 400) {
      throw ApiException(
        response.statusCode,
        jsonDecode(response.body)['message'] ?? 'Gagal menambah resep',
      );
    }

    final body = jsonDecode(response.body);
    return Post.fromJson(body as Map<String, dynamic>);
  }

  static Future<Post> updatePost(Post post) async {
    final response = await http.put(
      Uri.parse('$baseUrl/posts/${post.id}'),
      headers: jsonHeaders,
      body: jsonEncode(post.toJson()),
    );

    if (response.statusCode >= 400) {
      throw ApiException(
        response.statusCode,
        jsonDecode(response.body)['message'] ?? 'Gagal memperbarui resep',
      );
    }

    final body = jsonDecode(response.body);
    return Post.fromJson(body as Map<String, dynamic>);
  }

  static Future<void> deletePost(int id) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/posts/$id'),
      headers: jsonHeaders,
    );

    if (response.statusCode >= 400) {
      throw ApiException(
        response.statusCode,
        jsonDecode(response.body)['message'] ?? 'Gagal menghapus resep',
      );
    }
  }

  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: jsonHeaders,
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode >= 400) {
      throw ApiException(
        response.statusCode,
        jsonDecode(response.body)['message'] ?? 'Login gagal',
      );
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: jsonHeaders,
      body: jsonEncode({'name': name, 'email': email, 'password': password}),
    );

    if (response.statusCode >= 400) {
      throw ApiException(
        response.statusCode,
        jsonDecode(response.body)['message'] ?? 'Registrasi gagal',
      );
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> getCurrentUser() async {
    final response = await http.get(
      Uri.parse('$baseUrl/users/me'),
      headers: jsonHeaders,
    );

    if (response.statusCode >= 400) {
      throw ApiException(
        response.statusCode,
        jsonDecode(response.body)['message'] ?? 'Gagal memuat profil user',
      );
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> updateCurrentUser({
    required String name,
    required String email,
    String? profileImage,
  }) async {
    final body = {
      'name': name,
      'email': email,
      if (profileImage != null && profileImage.trim().isNotEmpty)
        'profileImage': profileImage.trim(),
    };

    final response = await http.put(
      Uri.parse('$baseUrl/users/me'),
      headers: jsonHeaders,
      body: jsonEncode(body),
    );

    if (response.statusCode >= 400) {
      throw ApiException(
        response.statusCode,
        jsonDecode(response.body)['message'] ?? 'Gagal memperbarui profil user',
      );
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }
}
