import 'dart:async';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:neurashop_mobile/config/theme.dart';
import 'package:neurashop_mobile/models/product_models.dart';
import 'package:neurashop_mobile/providers/product_provider.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final featuredProductsAsync = ref.watch(featuredProductsProvider);
    final categoriesAsync = ref.watch(categoriesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const _BrandTitle(),
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.search_rounded),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.shopping_bag_outlined),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(featuredProductsProvider);
          ref.invalidate(categoriesProvider);
        },
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            SliverToBoxAdapter(
              child: featuredProductsAsync.when(
                data: (products) => HomeHeroSection(products: products),
                loading: () => const _HeroSkeleton(),
                error: (error, stack) => const _SectionError(message: 'Failed to load hero products'),
              ),
            ),
            const SliverToBoxAdapter(
              child: SizedBox(height: 16),
            ),
            const SliverToBoxAdapter(
              child: FlashDealsBanner(),
            ),
            const SliverToBoxAdapter(
              child: SizedBox(height: 24),
            ),
            const SliverToBoxAdapter(
              child: SectionHeader(
                badge: 'Featured Collection',
                title: 'Trending Products',
                subtitle: 'Discover our most popular tech products handpicked for you.',
                gradient: LinearGradient(
                  colors: [AppColors.goldenYellow, AppColors.tealBlue],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: featuredProductsAsync.when(
                data: (products) => FeaturedProductsCarousel(products: products),
                loading: () => const _HorizontalSkeleton(),
                error: (error, stack) => const _SectionError(message: 'Failed to load featured products'),
              ),
            ),
            const SliverToBoxAdapter(
              child: SizedBox(height: 24),
            ),
            const SliverToBoxAdapter(
              child: TrustIndicators(),
            ),
            const SliverToBoxAdapter(
              child: SizedBox(height: 24),
            ),
            const SliverToBoxAdapter(
              child: SectionHeader(
                badge: 'Explore Categories',
                title: 'Shop By Category',
                subtitle: 'Find the perfect tech companion for your lifestyle.',
                gradient: LinearGradient(
                  colors: [AppColors.goldenYellow, AppColors.tealBlue],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: categoriesAsync.when(
                data: (categories) => Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                      childAspectRatio: 0.9,
                    ),
                    itemCount: categories.length,
                    itemBuilder: (context, index) => CategoryCard(category: categories[index]),
                  ),
                ),
                loading: () => const Padding(
                  padding: EdgeInsets.all(16),
                  child: _GridSkeleton(),
                ),
                error: (error, stack) => const _SectionError(message: 'Failed to load categories'),
              ),
            ),
            const SliverToBoxAdapter(
              child: SizedBox(height: 32),
            ),
          ],
        ),
      ),
      bottomNavigationBar: const BottomNavigationBar(
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search_rounded),
            label: 'Search',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart_outlined),
            label: 'Cart',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

class HomeHeroSection extends StatelessWidget {
  const HomeHeroSection({required this.products, super.key});

  final List<Product> products;

  @override
  Widget build(BuildContext context) {
    final product = products.isNotEmpty ? products.first : null;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.lightBackground,
            Colors.white,
            AppColors.cream,
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            top: -40,
            right: -30,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: AppColors.goldenYellow.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Positioned(
            bottom: -40,
            left: -20,
            child: Container(
              width: 160,
              height: 160,
              decoration: BoxDecoration(
                color: AppColors.tealBlue.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.deepNavy,
                  borderRadius: BorderRadius.circular(999),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.auto_awesome, color: AppColors.goldenYellow, size: 14),
                    SizedBox(width: 6),
                    Text(
                      'Powered by Neuraltale',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Discover Excellence',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.textPrimary,
                    ),
              ),
              const SizedBox(height: 8),
              Text(
                'Explore premium tech curated for style, speed, and everyday performance.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppColors.textSecondary,
                    ),
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  ElevatedButton(
                    onPressed: () {},
                    child: const Text('Browse Collection'),
                  ),
                  const SizedBox(width: 12),
                  OutlinedButton(
                    onPressed: () {},
                    child: const Text('View All'),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              if (product != null)
                _HeroProductCard(product: product)
              else
                const SizedBox(height: 140),
            ],
          ),
        ],
      ),
    );
  }
}

class _HeroProductCard extends StatelessWidget {
  const _HeroProductCard({required this.product});

  final Product product;

  @override
  Widget build(BuildContext context) => Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: SizedBox(
              width: 84,
              height: 84,
              child: product.imageUrl == null
                  ? Container(
                      color: const Color(0xFFF1F5F9),
                      child: const Icon(Icons.image_outlined, size: 32),
                    )
                  : CachedNetworkImage(
                      imageUrl: product.imageUrl!,
                      fit: BoxFit.cover,
                    ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                ),
                const SizedBox(height: 6),
                Text(
                  _formatPrice(product.price),
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: AppColors.deepNavy,
                        fontWeight: FontWeight.w800,
                      ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.deepNavy,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.arrow_forward, color: Colors.white, size: 18),
          ),
        ],
      ),
    );
}

class FlashDealsBanner extends StatefulWidget {
  const FlashDealsBanner({super.key});

  @override
  State<FlashDealsBanner> createState() => _FlashDealsBannerState();
}

class _FlashDealsBannerState extends State<FlashDealsBanner> {
  late Timer _timer;
  Duration timeLeft = const Duration(hours: 23, minutes: 59, seconds: 59);

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      setState(() {
        if (timeLeft.inSeconds > 0) {
          timeLeft -= const Duration(seconds: 1);
        } else {
          timeLeft = const Duration(hours: 23, minutes: 59, seconds: 59);
        }
      });
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: const LinearGradient(
          colors: [AppColors.goldenYellow, Color(0xFFE5A811)],
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(
                      color: AppColors.deepNavy,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.flash_on, color: AppColors.goldenYellow, size: 18),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.deepNavy,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: const Text(
                          'LIMITED TIME',
                          style: TextStyle(
                            color: AppColors.goldenYellow,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "Today's Hot Deals",
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w800,
                              color: AppColors.deepNavy,
                            ),
                      ),
                    ],
                  ),
                ],
              ),
              TextButton(
                onPressed: () {},
                style: TextButton.styleFrom(
                  foregroundColor: Colors.white,
                  backgroundColor: AppColors.deepNavy,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(999),
                  ),
                ),
                child: const Text('Shop Deals'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _CountdownBox(label: 'HRS', value: timeLeft.inHours),
              _CountdownBox(label: 'MIN', value: timeLeft.inMinutes.remainder(60)),
              _CountdownBox(label: 'SEC', value: timeLeft.inSeconds.remainder(60)),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  'Up to 40% off selected items',
                  style: TextStyle(
                    color: AppColors.deepNavy,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
}

class _CountdownBox extends StatelessWidget {
  const _CountdownBox({required this.label, required this.value});

  final String label;
  final int value;

  @override
  Widget build(BuildContext context) {
    final text = value.toString().padLeft(2, '0');

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          decoration: BoxDecoration(
            color: AppColors.deepNavy,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            text,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w600,
            color: AppColors.deepNavy,
          ),
        ),
      ],
    );
  }
}

class FeaturedProductsCarousel extends StatelessWidget {
  const FeaturedProductsCarousel({required this.products, super.key});

  final List<Product> products;

  @override
  Widget build(BuildContext context) {
    if (products.isEmpty) {
      return const SizedBox(height: 180);
    }

    return SizedBox(
      height: 260,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: products.length,
        itemBuilder: (context, index) => ProductCard(product: products[index]),
      ),
    );
  }
}

class ProductCard extends StatelessWidget {
  const ProductCard({required this.product, super.key});

  final Product product;

  @override
  Widget build(BuildContext context) => Container(
      width: 190,
      margin: const EdgeInsets.only(right: 16),
      child: Card(
        elevation: 8,
        shadowColor: Colors.black.withOpacity(0.08),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(14),
                child: AspectRatio(
                  aspectRatio: 1.2,
                  child: product.imageUrl == null
                      ? Container(
                          color: const Color(0xFFF1F5F9),
                          child: const Icon(Icons.image_outlined, size: 32),
                        )
                      : CachedNetworkImage(
                          imageUrl: product.imageUrl!,
                          fit: BoxFit.cover,
                        ),
                ),
              ),
              const SizedBox(height: 10),
              Text(
                product.name,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
              ),
              const SizedBox(height: 6),
              Text(
                _formatPrice(product.price),
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      color: AppColors.deepNavy,
                      fontWeight: FontWeight.w800,
                    ),
              ),
              const Spacer(),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                  child: const Text('View Details'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
}

class CategoryCard extends StatelessWidget {
  const CategoryCard({required this.category, super.key});

  final Category category;

  @override
  Widget build(BuildContext context) => ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: Stack(
        fit: StackFit.expand,
        children: [
          if (category.imageUrl != null)
            CachedNetworkImage(
              imageUrl: category.imageUrl!,
              fit: BoxFit.cover,
            )
          else
            Container(color: const Color(0xFFE2E8F0)),
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.bottomLeft,
                end: Alignment.topRight,
                colors: [Colors.black54, Colors.transparent],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    '${category.productCount}+ items',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  category.name,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Browse Collection',
                  style: TextStyle(
                    color: Colors.white70,
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
}

class TrustIndicators extends StatelessWidget {
  const TrustIndicators({super.key});

  @override
  Widget build(BuildContext context) => Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _TrustItem(icon: Icons.local_shipping_outlined, label: 'Fast Delivery'),
          _TrustItem(icon: Icons.verified_outlined, label: 'Genuine Products'),
          _TrustItem(icon: Icons.support_agent_outlined, label: '24/7 Support'),
        ],
      ),
    );
}

class _TrustItem extends StatelessWidget {
  const _TrustItem({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) => Column(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppColors.cream,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: AppColors.deepNavy, size: 20),
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
        ),
      ],
    );
}

class SectionHeader extends StatelessWidget {
  const SectionHeader({
    required this.badge, required this.title, required this.subtitle, required this.gradient, super.key,
  });

  final String badge;
  final String title;
  final String subtitle;
  final Gradient gradient;

  @override
  Widget build(BuildContext context) => Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              gradient: gradient,
              borderRadius: BorderRadius.circular(999),
            ),
            child: Text(
              badge.toUpperCase(),
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: AppColors.deepNavy,
              ),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            title,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w800,
                ),
          ),
          const SizedBox(height: 6),
          Text(
            subtitle,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppColors.textSecondary,
                ),
          ),
        ],
      ),
    );
}

class _BrandTitle extends StatelessWidget {
  const _BrandTitle();

  @override
  Widget build(BuildContext context) => Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: AppColors.deepNavy,
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(Icons.shopping_bag_rounded, color: AppColors.goldenYellow, size: 18),
        ),
        const SizedBox(width: 8),
        const GradientText(
          'Neurashop',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
          gradient: LinearGradient(colors: [AppColors.deepNavy, AppColors.tealBlue]),
        ),
      ],
    );
}

class GradientText extends StatelessWidget {
  const GradientText(
    this.text, {
    required this.style, required this.gradient, super.key,
  });

  final String text;
  final TextStyle style;
  final Gradient gradient;

  @override
  Widget build(BuildContext context) => ShaderMask(
      shaderCallback: (bounds) => gradient.createShader(
        Rect.fromLTWH(0, 0, bounds.width, bounds.height),
      ),
      child: Text(
        text,
        style: style.copyWith(color: Colors.white),
      ),
    );
}

class _SectionError extends StatelessWidget {
  const _SectionError({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) => Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          const Icon(Icons.error_outline, color: Color(0xFFEF4444)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
}

class _HeroSkeleton extends StatelessWidget {
  const _HeroSkeleton();

  @override
  Widget build(BuildContext context) => Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      padding: const EdgeInsets.all(20),
      height: 280,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
      ),
      child: const Center(
        child: CircularProgressIndicator(color: AppColors.tealBlue),
      ),
    );
}

class _HorizontalSkeleton extends StatelessWidget {
  const _HorizontalSkeleton();

  @override
  Widget build(BuildContext context) => SizedBox(
      height: 220,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: 3,
        itemBuilder: (context, index) => Container(
          width: 190,
          margin: const EdgeInsets.only(right: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
          ),
        ),
      ),
    );
}

class _GridSkeleton extends StatelessWidget {
  const _GridSkeleton();

  @override
  Widget build(BuildContext context) => GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 0.9,
      children: List.generate(
        4,
        (index) => Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
          ),
        ),
      ),
    );
}

String _formatPrice(double price) {
  final formatter = NumberFormat.currency(symbol: 'TZS ', decimalDigits: 0);
  return formatter.format(price);
}
