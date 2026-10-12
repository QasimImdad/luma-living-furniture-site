-- Generated from the live Luma Living MySQL schema; no user or transaction rows are included.

-- Foreign keys below formalize the relationships used by backend queries; the live DB has no FK constraints.

CREATE DATABASE `luma_living` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `luma_living`;

SET NAMES utf8mb4;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `phone` varchar(13) NOT NULL,
  `email` varchar(140) NOT NULL,
  `gender` varchar(11) NOT NULL,
  `address` text NOT NULL,
  `password` varchar(60) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(90) NOT NULL,
  `description` text NOT NULL,
  `sku` varchar(40) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `image` text NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `stock` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `cartitems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_cartitems_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`),
  CONSTRAINT `fk_cartitems_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `status` varchar(30) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `shipping_address` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_orders_user_created` (`user_id`,`created_at`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(90) NOT NULL,
  `sku` varchar(40) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `products` (`id`, `name`, `description`, `sku`, `price`, `image`, `rating`, `stock`, `created_at`, `updated_at`, `deleated_at`) VALUES
(22, 'Aldercrest Button Tufted Bed', 'A softly curved, button-tufted ivory headboard anchors this tailored bed, paired with pale textured bedding and dark bedside chests. Its plush profile makes a polished, restful focal point in a main bedroom.', 'BED-001', 799, 'uploads/products/bedroom/bed (1).jpg', 4.6, 7, '2026-10-06 11:53:37', '2026-10-10 14:51:13', NULL),
(23, 'Nocturne Low Profile Platform Bed', 'Set against a deep-toned paneled wall, this low-profile bed pairs a slim, dark frame with calm, light bedding. Its spare silhouette keeps a modern bedroom feeling quiet and uncluttered.', 'BED-002', 899, 'uploads/products/bedroom/bed (2).jpg', 4.4, 5, '2026-10-06 11:53:37', NULL, NULL),
(24, 'Serein Wood Frame Bed', 'A low wood-toned bed frame and crisp white linens create a light, pared-back look beside a streamlined white dresser. The simple profile suits a bright bedroom and leaves room for personal accents.', 'BED-003', 749, 'uploads/products/bedroom/bed (3).jpg', 4.7, 5, '2026-10-06 11:53:37', '2026-10-07 21:03:08', NULL),
(25, 'Solstice Ribbed Headboard Bed', 'A clean-lined bed with a broad wood-toned headboard stands out against a ribbed feature wall. Soft neutral bedding and an uncluttered profile make it a natural fit for a calm contemporary bedroom.', 'BED-004', 1099, 'uploads/products/bedroom/bed (4).jpg', 4.8, 4, '2026-10-06 11:53:37', NULL, NULL),
(26, 'Linden Natural Profile Bed', 'This bed pairs a straight, natural-toned frame with crisp white bedding and a softly layered headboard. Its understated lines work well in a bright bedroom with warm, relaxed accents.', 'BED-005', 649, 'uploads/products/bedroom/bed (5).jpg', 4.3, 15, '2026-10-06 11:53:37', NULL, NULL),
(27, 'Morrow Gray Upholstered Bed', 'A gently padded gray headboard gives this streamlined bed a soft contrast to its warm wood-toned frame. Light linens and an open profile suit a serene, contemporary bedroom.', 'BED-006', 999, 'uploads/products/bedroom/bed (6).jpg', 4.5, 7, '2026-10-06 11:53:37', NULL, NULL),
(28, 'Dovetail Classic Upholstered Bed', 'Neutral upholstery and a gently shaped headboard give this bed a classic, inviting profile, while the darker bedroom setting adds contrast. Its restrained detailing pairs easily with traditional or transitional decor.', 'BED-007', 849, 'uploads/products/bedroom/bed (7).jpg', 4.6, 9, '2026-10-06 11:53:37', NULL, NULL),
(29, 'Liora Channel Tufted Bed', 'Vertical channel tufting across the tall, pale upholstered headboard gives this bed a refined, softly sculpted look. Matching padded details at the foot and a muted palette complete the polished bedroom setting.', 'BED-008', 1199, 'uploads/products/bedroom/bed (8).jpg', 4.8, 3, '2026-10-06 11:53:37', NULL, NULL),
(30, 'Axis Black Swivel Lounge Chair', 'A sculpted black seat with integrated arms sits above a five-star swivel base, creating a composed modern accent chair. Its compact footprint suits a reading corner, office, or conversation area.', 'CHR-001', 149, 'uploads/products/chairs/chair (1).jpg', 4.5, 18, '2026-10-06 11:53:37', NULL, NULL),
(31, 'Lennox Tufted Accent Armchair', 'Button tufting, a high curved back, and a light carved-look frame lend this white armchair a formal, vintage-inspired character. The distinctive silhouette suits a bedroom corner, dressing space, or occasional seating.', 'CHR-002', 89, 'uploads/products/chairs/chair (2).jpg', 4.3, 24, '2026-10-06 11:53:37', NULL, NULL),
(32, 'Mira Gray Upholstered Dining Chair', 'A softly curved gray upholstered back and seat rest on slender natural-tone legs for a light, contemporary look. Use it at a dining table or as a simple extra chair in a study.', 'CHR-003', 229, 'uploads/products/chairs/chair (3).jpg', 4.7, 7, '2026-10-06 11:53:37', NULL, NULL),
(33, 'Coda Black Bar Stool', 'The black molded seat, tall profile, and wood-tone legs with a metal footrest give this bar stool a crisp, mid-century-inspired silhouette. It brings casual seating to a kitchen island or counter-height nook.', 'CHR-004', 119, 'uploads/products/chairs/chair (4).jpg', 4.2, 16, '2026-10-06 11:53:37', NULL, NULL),
(34, 'Forme Black Shell Side Chair', 'A smooth black shell seat is paired with angled wood-tone legs and dark cross-bracing for a clean, graphic side chair. The compact shape works around a dining table, desk, or occasional-use spot.', 'CHR-005', 179, 'uploads/products/chairs/chair (5).jpg', 4.6, 11, '2026-10-06 11:53:37', NULL, NULL),
(35, 'Roux Rust Swivel Task Chair', 'Ribbed rust-colored upholstery wraps a rounded back and seat, set on a black five-wheel swivel base. Its warm accent color makes a distinctive addition to a home desk or creative workspace.', 'CHR-006', 249, 'uploads/products/chairs/chair (6).jpg', 4.8, 5, '2026-10-06 11:53:37', NULL, NULL),
(36, 'Wren Wood Frame Accent Chair', 'A pale upholstered seat and back are framed by exposed wood arms and a simple open base. Natural tones and clean lines make this accent chair an easy fit for a reading or lounge area.', 'CHR-007', 99, 'uploads/products/chairs/chair (7).jpg', 4.4, 20, '2026-10-06 11:53:37', NULL, NULL),
(38, 'Sutton Slatted Folding Chair', 'This folding side chair has a slatted wood back and seat with a simple, straight-frame profile. Easy to store between uses, it suits a patio, garden, or flexible dining setup.', 'CHR-009', 199, 'uploads/products/chairs/chair (9).jpg', 4.6, 9, '2026-10-06 11:53:37', NULL, NULL),
(39, 'Marin Round Wood Dining Table', 'A warm, round wood-toned top and three splayed legs bring a relaxed, compact profile to this dining table. Its circular shape suits a smaller dining area and helps keep the layout open.', 'DIN-001', 699, 'uploads/products/dinning_table/dinning table (1).jpg', 4.5, 6, '2026-10-06 11:53:37', NULL, NULL),
(40, 'Foundry Rectangular Wood Dining Table', 'Straightforward lines and a broad, warm wood-toned top give this rectangular table an inviting everyday presence. The generous surface anchors a family dining space and pairs naturally with wood chairs.', 'DIN-002', 899, 'uploads/products/dinning_table/dinning table (2).jpg', 4.6, 4, '2026-10-06 11:53:37', NULL, NULL),
(41, 'Briarstone Gray Chair Dining Set', 'This compact dining setting combines a rectangular wood-toned table with cushioned gray chairs for a coordinated, understated look. The neutral upholstery softens the crisp lines in a contemporary dining nook.', 'DIN-003', 1299, 'uploads/products/dinning_table/dinning table (3).jpg', 4.8, 3, '2026-10-06 11:53:37', NULL, NULL),
(42, 'Rowan Dark Top Dining Table', 'A dark tabletop and angular wood-tone base form a clean, modern dining profile, shown with black chairs. Its restrained contrast works well in a small dining room or open-plan kitchen.', 'DIN-004', 799, 'uploads/products/dinning_table/dinning table (4).jpg', 4.3, 8, '2026-10-06 11:53:37', NULL, NULL),
(43, 'Grandview Black Dining Table', 'A long black dining table and coordinating high-back chairs create a formal centerpiece beneath a statement chandelier. The elongated arrangement is suited to larger dining rooms and hosted meals.', 'DIN-005', 1499, 'uploads/products/dinning_table/dinning table (5).jpg', 4.7, 2, '2026-10-06 11:53:37', NULL, NULL),
(44, 'Calder Natural Wood Dining Table', 'A substantial natural wood-toned top and sturdy block-style legs give this dining table a sculptural, grounded look. Shown in a bright room with simple chairs, it brings organic warmth to a modern interior.', 'DIN-006', 999, 'uploads/products/dinning_table/dinning table (6).jpg', 4.4, 5, '2026-10-06 11:53:37', NULL, NULL),
(45, 'Skyline Slimline Dining Table', 'A slim, elongated wood-toned top and dark, narrow legs create a streamlined dining profile. Its long footprint works particularly well in an open-plan apartment or a dining area with a view.', 'DIN-007', 1199, 'uploads/products/dinning_table/dinning table (7).jpg', 4.8, 4, '2026-10-06 11:53:37', NULL, NULL),
(46, 'Hearthside Bench Style Dining Table', 'A richly toned rectangular table is paired with simple benches and chairs for a relaxed, farmhouse-inspired dining arrangement. The substantial top makes it a natural gathering point for everyday meals.', 'DIN-008', 849, 'uploads/products/dinning_table/dinning table (8).jpg', 4.5, 7, '2026-10-06 11:53:37', NULL, NULL),
(47, 'Slatebrook Charcoal Dining Table', 'A charcoal-toned rectangular top and dark, slender legs give this dining table an understated industrial edge. It is shown with coordinating chairs in a bright, architectural dining space.', 'DIN-009', 1699, 'uploads/products/dinning_table/dinning table (9).jpg', 4.9, 2, '2026-10-06 11:53:37', NULL, NULL),
(48, 'Parkside Long Top Dining Table', 'A long wood-toned table is surrounded by upholstered dark chairs, balancing a generous seating arrangement with a calm, neutral palette. The streamlined shape suits family dining or a bright open-plan room.', 'DIN-010', 1099, 'uploads/products/dinning_table/dinning table (10).jpg', 4.6, 6, '2026-10-06 11:53:37', NULL, NULL),
(49, 'Solis Tapered Leg Dining Table', 'Warm wood tones, tapered legs, and a clean rectangular silhouette define this light-filled dining setting. The table\'s unfussy design pairs easily with upholstered or wood dining chairs.', 'DIN-011', 1399, 'uploads/products/dinning_table/dinning table (11).jpg', 4.7, 3, '2026-10-06 11:53:37', NULL, NULL),
(50, 'Serein Low Profile Cream Sofa', 'A low, pale sofa with broad, softly rounded cushions gives this living space a relaxed, sculptural centerpiece. Its quiet color and streamlined shape sit naturally beside simple tables and large windows.', 'LIV-001', 499, 'uploads/products/living_room/living room (1).jpg', 4.4, 9, '2026-10-06 11:53:37', NULL, NULL),
(51, 'Vellum Ivory Corner Sectional', 'Generous squared cushions and a broad corner layout make this ivory sectional a comfortable-looking anchor for a modern living room. A low round coffee table and restrained palette keep the arrangement composed.', 'LIV-002', 899, 'uploads/products/living_room/living room (2).jpg', 4.6, 4, '2026-10-06 11:53:37', '2026-10-06 18:36:14', NULL),
(52, 'Caldera Cream Lounge Sofa', 'A crisp cream sofa anchors this sunlit living-room setting, balanced by sculptural, warm-toned lounge chairs. Its neutral upholstery gives colorful accents and natural finishes room to stand out.', 'LIV-003', 1299, 'uploads/products/living_room/living room (3).jpg', 4.8, 3, '2026-10-06 11:53:37', NULL, NULL),
(53, 'Cedarline Ivory Wood Accent Sofa', 'A streamlined ivory sofa with broad arms and a low back sits against warm wood paneling, creating a calm, mid-century-inspired focal point. Its simple upholstery and horizontal profile suit an open living room.', 'LIV-004', 699, 'uploads/products/living_room/living room (4).jpg', 4.3, 8, '2026-10-06 11:53:37', NULL, NULL),
(54, 'Caspian Patterned Statement Sofa', 'Vivid fuchsia and multicolor patterning give this sofa an expressive presence, framed by dark woven lounge chairs. It brings a bold focal point to a relaxed living room with eclectic character.', 'LIV-005', 999, 'uploads/products/living_room/living room (5).jpg', 4.7, 6, '2026-10-06 11:53:37', NULL, NULL),
(55, 'Ashford Gray Living Room Sofa', 'This pale gray sofa is styled with coordinating light lounge chairs, dark round tables, and a fireplace for a relaxed, balanced arrangement. Its neutral upholstery blends easily with wood floors and contemporary accents.', 'LIV-006', 1599, 'uploads/products/living_room/living room (6).jpg', 4.9, 2, '2026-10-06 11:53:37', NULL, NULL),
(56, 'Bexley Taupe Chaise Sectional', 'A generously scaled taupe sectional with a chaise-like return creates an inviting corner for lounging. Layered neutral cushions and a coordinating patterned armchair add a relaxed, traditional feel.', 'LIV-007', 799, 'uploads/products/living_room/living room (7).jpg', 4.5, 7, '2026-10-06 11:53:37', NULL, NULL),
(57, 'Canyon Mixed Tone Lounge Sofa', 'Soft gray seating is contrasted with cognac-toned leather lounge chairs and warm wood accents in this spacious living arrangement. The mix of textures lends a polished, welcoming character to a family room.', 'LIV-008', 1199, 'uploads/products/living_room/living room (8).jpg', 4.6, 4, '2026-10-06 11:53:37', NULL, NULL),
(58, 'Lagoon Teal Accent Seating Set', 'A sand-colored sofa is paired with deep teal patterned armchairs and a richly colored rug for an expressive living-room look. The mix creates a defined conversation area and a vivid contrast against the neutral sofa.', 'LIV-009', 1499, 'uploads/products/living_room/living room (9).jpg', 4.8, 2, '2026-10-06 11:53:37', '2026-10-06 18:36:14', NULL),
(59, 'Ledge Modular Office Lounge Sofa', 'With rounded, low cushions and a pale finish, this modular lounge sofa softens the crisp lines of a contemporary office. Its understated look works well in a reception area, waiting room, or relaxed meeting space.', 'OFC-001', 349, 'uploads/products/office_furniture/office furniture (1).jpg', 4.5, 10, '2026-10-06 11:53:37', NULL, NULL),
(60, 'Atrium Reception Lounge Set', 'Coordinated lounge seating and low tables give this reception setting a warm, professional feel. The inviting arrangement creates a comfortable waiting area while keeping a clean, contemporary profile.', 'OFC-002', 599, 'uploads/products/office_furniture/office furniture (2).jpg', 4.7, 5, '2026-10-06 11:53:37', NULL, NULL),
(61, 'Atelier Executive Desk', 'A broad wood-toned desk sits before illuminated shelving, with a clean white task chair completing the bright workspace. The expansive surface and surrounding storage create a composed home-office setting.', 'OFC-003', 249, 'uploads/products/office_furniture/office furniture (3).jpg', 4.3, 14, '2026-10-06 11:53:37', NULL, NULL),
(62, 'Solstice Wood Meeting Table', 'A compact wood-toned meeting table and coordinating chairs are arranged in a softly lit conference space. The streamlined group fits a private office or small team room with a pared-back style.', 'OFC-004', 799, 'uploads/products/office_furniture/office furniture (4).jpg', 4.8, 3, '2026-10-06 11:53:37', NULL, NULL),
(63, 'Common Ground Open Plan Workstations', 'Rows of shared desks and task chairs define this open-plan office arrangement, with screens helping organize individual work areas. The layout supports focused workstations while keeping shared collaboration close by.', 'OFC-005', 499, 'uploads/products/office_furniture/office furniture (5).jpg', 4.6, 8, '2026-10-06 11:53:37', NULL, NULL),
(64, 'Ledger Boardroom Table', 'A long, light wood-toned boardroom table is paired with ribbed cognac-colored meeting chairs for a polished contrast. The spacious arrangement suits discussions in a modern, glass-walled office.', 'OFC-006', 899, 'uploads/products/office_furniture/office furniture (6).jpg', 4.9, 2, '2026-10-06 11:53:37', NULL, NULL),
(65, 'Vantage Black Swivel Lounge Chair', 'A broad black upholstered seat, gently curved arms, and a five-spoke swivel base give this lounge chair a confident modern profile. It makes a refined accent for a private office, reading corner, or reception.', 'OFC-007', 399, 'uploads/products/office_furniture/office furniture (7).jpg', 4.4, 11, '2026-10-06 11:53:37', NULL, NULL),
(66, 'Forum Modular Office Lounge Set', 'Softly upholstered lounge chairs and compact sofas in muted blue and green bring a welcoming note to this bright workplace setting. Open shelving and a slim side table keep the arrangement practical for informal meetings or visitor seating.', 'OFC-008', 699, 'uploads/products/office_furniture/office furniture (8).jpg', 4.7, 4, '2026-10-06 11:53:37', NULL, NULL),
(67, 'Harbor Charcoal Chaise Sectional', 'A deep charcoal sectional with an extended chaise offers an expansive place to stretch out, while slim light legs keep its substantial silhouette visually open. The dark upholstery works well against timber, pale walls, or patterned rugs.', 'SOF-001', 899, 'uploads/products/sofas/sofa (1).jpg', 4.6, 5, '2026-10-06 11:53:37', NULL, NULL),
(68, 'Morrow Gray Wood Accent Sofa', 'A light gray two-seat sofa pairs tailored cushions with exposed wood-toned arms and legs for a relaxed, Scandinavian-inspired look. Its compact profile suits an apartment living room or secondary seating area.', 'SOF-002', 1199, 'uploads/products/sofas/sofa (2).jpg', 4.7, 4, '2026-10-06 11:53:37', NULL, NULL),
(69, 'Willow Sage Sofa and Chair Set', 'A muted sage sofa and matching lounge chairs create a coordinated seating group with an elegant, gently tailored profile. Set among warm wood accents, the soft green upholstery brings color without overpowering the room.', 'SOF-003', 1599, 'uploads/products/sofas/sofa (3).jpg', 4.8, 3, '2026-10-06 11:53:37', NULL, NULL),
(70, 'Gallery Pale Upholstered Seating Set', 'Pale upholstered sofas and armchairs are arranged around a low glass coffee table for a crisp, formal living-room look. Clean profiles and a restrained palette make the setting feel bright and composed.', 'SOF-004', 999, 'uploads/products/sofas/sofa (4).jpg', 4.4, 6, '2026-10-06 11:53:37', NULL, NULL),
(71, 'Marlow Curved Living Room Sofa', 'A softly curved pale sofa is styled with a rounded accent chair and textured ottoman for an airy, relaxed seating group. Layered cream tones and rounded forms suit a contemporary living room.', 'SOF-005', 1899, 'uploads/products/sofas/sofa (5).jpg', 4.9, 2, '2026-10-06 11:53:37', NULL, NULL),
(72, 'Sundown Ochre Chaise Sectional', 'A warm ochre sectional with a broad chaise anchors this sunlit seating arrangement, accented by layered neutral cushions. Its saturated color brings a welcoming focal point to a simple modern living room.', 'SOF-006', 1399, 'uploads/products/sofas/sofa (6).jpg', 4.6, 4, '2026-10-06 11:53:37', NULL, NULL),
(73, 'Cloudline Cream Modular Sectional', 'Low, cream-toned sectional seating with broad, soft arms creates a clean-lined, lounge-friendly arrangement. The pared-back silhouette and light upholstery are well suited to a calm, modern interior.', 'SOF-007', 2299, 'uploads/products/sofas/sofa (7).jpg', 4.8, 1, '2026-10-06 11:53:37', NULL, NULL),
(74, 'Dusk Sand Tone Chaise Sofa', 'A warm sand-colored sofa with a generous chaise pairs naturally with a dark coffee table and dramatic, floor-to-ceiling windows. Its softly cushioned profile brings a welcoming counterpoint to a modern high-ceiling room.', 'SOF-008', 1099, 'uploads/products/sofas/sofa (8).jpg', 4.5, 7, '2026-10-06 11:53:37', NULL, NULL),
(75, 'Sable Round Wood Accent Table', 'A small circular dark wood top sits on three slender angled legs, giving this accent table an airy, mid-century-inspired profile. Use it beside a sofa or as a compact display surface.', 'TBL-001', 199, 'uploads/products/tables/table (1).jpg', 4.4, 12, '2026-10-06 11:53:37', NULL, NULL),
(76, 'Mason Hairpin Leg Coffee Table', 'An elongated wood-tone top rests on slim black hairpin legs, with a lower shelf adding space for books or living-room essentials. The open frame keeps this coffee table visually light beside a sofa.', 'TBL-002', 299, 'uploads/products/tables/table (2).jpg', 4.6, 8, '2026-10-06 11:53:37', NULL, NULL),
(77, 'Boulder Rustic Storage Coffee Table', 'A thick, warm-toned rectangular top and chunky end supports give this coffee table a grounded, rustic character. A wide open shelf below keeps books and remotes close at hand while preserving a clear surface.', 'TBL-003', 449, 'uploads/products/tables/table (3).jpg', 4.8, 4, '2026-10-06 11:53:37', NULL, NULL),
(78, 'Linea Oak Top Trestle Table', 'A pale wood-toned rectangular top is balanced by two clean, silver-finished trestle bases for a simple modern profile. Its generous surface can serve as a dining, work, or shared project table.', 'TBL-004', 349, 'uploads/products/tables/table (4).jpg', 4.5, 6, '2026-10-06 11:53:37', NULL, NULL);

SET FOREIGN_KEY_CHECKS=1;
