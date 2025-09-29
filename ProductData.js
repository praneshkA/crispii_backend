const Products = [
  // 🍘 Kaaram Snacks
  { id: 1, name: "Mixture", category: "Kaaram", image: "/upload/images/mixture.jpeg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 2, name: "Kaarasev", category: "Kaaram", image: "/upload/images/kaarasev.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 3, name: "Karaboondhi", category: "Kaaram", image: "/upload/images/karaboondhi.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 4, name: "Kadalai Pakkoda", category: "Kaaram", image: "/upload/images/kadalai_pakkoda.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 5, name: "Kadalai", category: "Kaaram", image: "/upload/images/kadalai.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 6, name: "Kadalai Parupu", category: "Kaaram", image: "/upload/images/kadalai_parupu.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 7, name: "Achu Muruku", category: "Kaaram", image: "/upload/images/achu_muruku.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 8, name: "Red Round Muruku", category: "Kaaram", image: "/upload/images/red_round_muruku.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 9, name: "White Round Muruku", category: "Kaaram", image: "/upload/images/white_round_muruku.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 10, name: "Garlic White", category: "Kaaram", image: "/upload/images/garlic_white.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 11, name: "Garlic Red", category: "Kaaram", image: "/upload/images/garlic_red.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 12, name: "Idiyappam Red", category: "Kaaram", image: "/upload/images/idiyappam_red.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 13, name: "Idiyappam White", category: "Kaaram", image: "/upload/images/idiyappam_white.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 14, name: "Mullu Red", category: "Kaaram", image: "/upload/images/mullu_red.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 15, name: "Thenkulal", category: "Kaaram", image: "/upload/images/thenkulal.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 16, name: "Deepavali Butter", category: "Kaaram", image: "/upload/images/deepavali_butter.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 17, name: "Chilli", category: "Kaaram", image: "/upload/images/chilli.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 18, name: "Aani Red", category: "Kaaram", image: "/upload/images/aani_red.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 19, name: "SweetSev", category: "Kaaram", image: "/upload/images/sweetsev.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },

  // 🍟 Chips
  { id: 20, name: "Potato Chilli", category: "Chips", image: "/upload/images/potato_chilli.jpg", prices: { "1000g": 220, "500g": 120, "250g": 70 } },
  { id: 21, name: "Potato Chips", category: "Chips", image: "/upload/images/potato_chips.jpg", prices: { "1000g": 300, "500g": 160, "250g": 90 } },
  { id: 22, name: "Maravalli Chips", category: "Chips", image: "/upload/images/maravalli_chips.jpg", prices: { "1000g": 140, "500g": 80, "250g": 50 } },
  { id: 23, name: "Nendram Chips", category: "Chips", image: "/upload/images/nendram_chips.jpg", prices: { "1000g": 300, "500g": 160, "250g": 90 } },
  { id: 24, name: "Wheel Chips", category: "Chips", image: "/upload/images/wheel_chips.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },

  // 🍬 Sweets / Mithai
  { id: 25, name: "Kadalai Mittai (250g)", category: "Sweets / Mithai", image: "/upload/images/kadalai_mittai.jpg", prices: { "250g": 70 } },
  { id: 26, name: "AatuKal Cake", category: "Sweets / Mithai", image: "/upload/images/aatukal_cake.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 27, name: "Chandharmuki / Chandharakala", category: "Sweets / Mithai", image: "/upload/images/chandharmuki.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 28, name: "Gulab Jamun (10pcs)", category: "Sweets / Mithai", image: "/upload/images/gulab_jamun.jpg", prices: { "10pcs": 30 } },
  { id: 29, name: "Corn Urundai", category: "Sweets / Mithai", image: "/upload/images/corn_urundai.jpg", prices: { "1pc": 30 } },
  { id: 30, name: "Then Mittai (24pcs)", category: "Sweets / Mithai", image: "/upload/images/then_mittai.jpg", prices: { "24pcs": 30 } },
  { id: 31, name: "Pori Urundai (12pcs)", category: "Sweets / Mithai", image: "/upload/images/pori_urundai.jpg", prices: { "12pcs": 30 } },
  { id: 32, name: "Athirasam (5pcs)", category: "Sweets / Mithai", image: "/upload/images/athirasam.jpg", prices: { "5pcs": 30 } },

  // 🍪 Cookies / Biscuits
  { id: 33, name: "Coconut Biscuit", category: "Cookies / Biscuits", image: "/upload/images/coconut_biscuit.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 34, name: "Chocolate Biscuit", category: "Cookies / Biscuits", image: "/upload/images/chocolate_biscuit.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 35, name: "ABCD Biscuit", category: "Cookies / Biscuits", image: "/upload/images/abcd_biscuit.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 36, name: "Heart Biscuit", category: "Cookies / Biscuits", image: "/upload/images/heart_biscuit.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 37, name: "Beans Biscuit", category: "Cookies / Biscuits", image: "/upload/images/beans_biscuit.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
  { id: 38, name: "Mundhiri Biscuit", category: "Cookies / Biscuits", image: "/upload/images/mundhiri_biscuit.jpg", prices: { "1000g": 150, "500g": 90, "250g": 60 } },
];

module.exports = Products;
