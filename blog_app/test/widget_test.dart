import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:blog_app/main.dart';

void main() {
  testWidgets('Blog app loads post list screen', (WidgetTester tester) async {
    await tester.pumpWidget(const BlogApp());

    expect(find.text('Blog Resep'), findsOneWidget);
  });
}