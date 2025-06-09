import random
from faker import Faker
from datetime import datetime
from app import create_app, db
from app.models.product import Product

app = create_app()
app.app_context().push()

fake = Faker()

# Enhanced product categories and descriptors
CATEGORIES = {
    'Electronics': {
        'types': ['Smartphone', 'Laptop', 'Tablet', 'Smartwatch', 'Headphones', 'Camera', 'Speaker'],
        'brands': ['Apple', 'Samsung', 'Sony', 'Bose', 'Canon', 'Dell', 'HP']
    },
    'Books': {
        'types': ['Novel', 'Textbook', 'Biography', 'Cookbook', 'Fantasy', 'Science Fiction'],
        'authors': ['J.K. Rowling', 'Stephen King', 'Agatha Christie', 'George Orwell', 'J.R.R. Tolkien']
    },
    'Textiles': {
        'types': ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Sweater', 'Curtains', 'Bed Sheets'],
        'materials': ['Cotton', 'Silk', 'Wool', 'Linen', 'Polyester']
    }
}

def generate_product_description(category, product_name):
    """Generate realistic product descriptions"""
    if category == 'Electronics':
        features = [
            f"Latest {random.choice(['AI-powered', 'energy-efficient', 'high-performance'])} technology",
            f"{random.randint(8, 64)}GB RAM",
            f"{random.choice(['4K', 'Full HD', 'OLED'])} display",
            f"{random.randint(8, 48)}MP camera"
        ]
        return f"The {product_name} features {', '.join(features)}. {fake.sentence()}"
    elif category == 'Books':
        return f"{product_name}. {fake.sentence()} {fake.paragraph()}"
    else:  # Textiles
        return f"High-quality {random.choice(CATEGORIES[category]['materials'])} {product_name.lower()}. {fake.sentence()}"

def generate_mock_products(count=120):
    """Generate mock e-commerce products with realistic data"""
    print("Generating mock products...")
    
    # Clear existing products
    db.session.query(Product).delete()
    
    products = []
    categories = list(CATEGORIES.keys())
    
    for _ in range(count):
        category = random.choice(categories)
        category_data = CATEGORIES[category]
        
        if category == 'Electronics':
            name = f"{random.choice(category_data['brands'])} {random.choice(category_data['types'])} {random.randint(1, 15)}"
            price = round(random.uniform(99.99, 1999.99), 2)
        elif category == 'Books':
            name = f"{random.choice(category_data['types'])}: {fake.catch_phrase()}"  # Fixed this line
            price = round(random.uniform(5.99, 49.99), 2)
        else:  # Textiles
            name = f"{random.choice(category_data['materials'])} {random.choice(category_data['types'])}"
            price = round(random.uniform(9.99, 199.99), 2)
        
        product = Product(
            name=name,
            description=generate_product_description(category, name),
            price=price,
            category=category,
            image_url=f"https://picsum.photos/400/300?random={random.randint(1,1000)}",
            in_stock=random.choice([True, False]) if random.random() > 0.1 else True  # 10% chance out of stock
        )
        products.append(product)
    
    db.session.bulk_save_objects(products)
    db.session.commit()
    print(f"Successfully generated {count} products in {len(categories)} categories.")

if __name__ == '__main__':
    generate_mock_products(120)  # Generating 20% more than required