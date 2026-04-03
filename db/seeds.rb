# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "Seeding categories..."
categories = {}
["Handguards", "Skid Plates", "Lighting", "Luggage"].each do |name|
  categories[name] = ProductCategory.find_or_create_by!(name: name)
end

puts "Seeding products, components, and variants..."

products_data = [
  {
    name: "Full Wrap Handguard Kit",
    subtitle: "Complete protection for your levers",
    description: "<p>CNC-machined aluminum handguards with full wrap-around protection. Designed to protect your brake and clutch levers from impacts, roost, and branches.</p>",
    price: 89.99,
    height: 6, width: 8, depth: 4, weight: 1.25,
    application_notes: "Fits 7/8\" and 1-1/8\" handlebars",
    categories: ["Handguards"],
    components: [
      {
        name: "Color",
        variants: [
          { name: "Black", price: 0.00, sku: "HG-BLK-001" },
          { name: "Orange", price: 0.00, sku: "HG-ORG-001" },
          { name: "Blue", price: 0.00, sku: "HG-BLU-001" },
        ]
      },
      {
        name: "Bar Size",
        variants: [
          { name: "7/8\" Standard", price: 0.00, sku: "HG-78-001" },
          { name: "1-1/8\" Fat Bar", price: 5.00, sku: "HG-118-001" },
        ]
      }
    ]
  },
  {
    name: "Aluminum Skid Plate",
    subtitle: "Bomb-proof bottom protection",
    description: "<p>6061 aluminum skid plate with integrated engine and frame protection. 3/16\" thick with countersunk mounting hardware for maximum ground clearance.</p>",
    price: 249.99,
    height: 4, width: 14, depth: 24, weight: 6.50,
    application_notes: "Vehicle-specific fitment",
    categories: ["Skid Plates"],
    components: [
      {
        name: "Bike Model Fitment",
        variants: [
          { name: "KTM 500 EXC-F (2020-2023)", price: 0.00, sku: "SP-KTM500-001" },
          { name: "Husqvarna FE 501 (2020-2023)", price: 0.00, sku: "SP-HQV501-001" },
          { name: "GasGas EC 500F (2021-2023)", price: 0.00, sku: "SP-GG500-001" },
        ]
      },
      {
        name: "Finish",
        variants: [
          { name: "Raw Aluminum", price: 0.00, sku: "SP-RAW-001" },
          { name: "Black Anodized", price: 35.00, sku: "SP-ANO-001" },
        ]
      }
    ]
  },
  {
    name: "LED Adventure Light Bar",
    subtitle: "See the trail ahead",
    description: "<p>Compact 10\" LED light bar with custom mounting brackets. 6000K daylight color, IP68 waterproof rated. Includes wiring harness and handlebar switch.</p>",
    price: 179.99,
    height: 3, width: 11, depth: 4, weight: 2.10,
    application_notes: "Universal fit with included hardware",
    categories: ["Lighting"],
    components: [
      {
        name: "Beam Pattern",
        variants: [
          { name: "Spot", price: 0.00, sku: "LB-SPOT-001" },
          { name: "Combo (Spot/Flood)", price: 20.00, sku: "LB-COMBO-001" },
        ]
      }
    ]
  },
  {
    name: "Rear Rack System",
    subtitle: "Haul your gear",
    description: "<p>Tubular steel rear luggage rack with integrated tie-down points. Powder-coated for durability. Supports up to 25 lbs of cargo.</p>",
    price: 149.99,
    height: 8, width: 12, depth: 16, weight: 4.75,
    application_notes: "Bike-specific subframe mounts",
    categories: ["Luggage"],
    components: [
      {
        name: "Bike Model Fitment",
        variants: [
          { name: "KTM 500 EXC-F (2020-2023)", price: 0.00, sku: "RR-KTM500-001" },
          { name: "Husqvarna FE 501 (2020-2023)", price: 0.00, sku: "RR-HQV501-001" },
        ]
      },
      {
        name: "Color",
        variants: [
          { name: "Black", price: 0.00, sku: "RR-BLK-001" },
          { name: "Orange", price: 15.00, sku: "RR-ORG-001" },
        ]
      }
    ]
  },
  {
    name: "Bark Buster Handguards",
    subtitle: "Lightweight lever protection",
    description: "<p>Injection-molded reinforced plastic handguards with aluminum mounting kit. Lightweight roost and branch protection without the bulk.</p>",
    price: 44.99,
    height: 5, width: 7, depth: 3, weight: 0.65,
    application_notes: "Fits 7/8\" handlebars only",
    categories: ["Handguards"],
    components: [
      {
        name: "Color",
        variants: [
          { name: "Black", price: 0.00, sku: "BB-BLK-001" },
          { name: "White", price: 0.00, sku: "BB-WHT-001" },
          { name: "Orange", price: 0.00, sku: "BB-ORG-001" },
          { name: "Blue", price: 0.00, sku: "BB-BLU-001" },
        ]
      }
    ]
  }
]

products_data.each do |pdata|
  product = Product.find_or_create_by!(name: pdata[:name]) do |p|
    p.subtitle = pdata[:subtitle]
    p.description = pdata[:description]
    p.price = pdata[:price]
    p.height = pdata[:height]
    p.width = pdata[:width]
    p.depth = pdata[:depth]
    p.weight = pdata[:weight]
    p.application_notes = pdata[:application_notes]
    p.active = true
  end

  # Assign categories
  pdata[:categories].each do |cat_name|
    product.product_categories << categories[cat_name] unless product.product_categories.include?(categories[cat_name])
  end

  # Create components and variants
  pdata[:components].each do |comp_data|
    component = Component.find_or_create_by!(product: product, name: comp_data[:name])

    comp_data[:variants].each do |var_data|
      Variant.find_or_create_by!(component: component, name: var_data[:name]) do |v|
        v.price = var_data[:price]
        v.sku = var_data[:sku]
      end
    end
  end
end

puts "Seeded #{Product.count} products, #{Component.count} components, #{Variant.count} variants, #{ProductCategory.count} categories."
