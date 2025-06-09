from flask import Blueprint, request, jsonify
from app.models.product import Product
from flask_jwt_extended import jwt_required

product_bp = Blueprint('products', __name__)

@product_bp.route('/search', methods=['GET'])
@jwt_required()
def search_products():
    query = request.args.get('q', '').lower()

    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    products = Product.query.filter(
        Product.name.ilike(f"%{query}%") |
        Product.description.ilike(f"%{query}%") |
        Product.category.ilike(f"%{query}%")
    ).all()

    if not products:
        return jsonify({"message": "No matching products found"}), 404

    result = []
    for product in products:
        result.append({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "category": product.category,
            "image_url": product.image_url,
            "in_stock": product.in_stock
        })

    return jsonify(result), 200

from app.models.product import Product
from flask_jwt_extended import jwt_required

@product_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "category": product.category,
        "image_url": product.image_url,
        "in_stock": product.in_stock
    }), 200

@product_bp.route('/filter', methods=['POST'])
@jwt_required()
def filter_products():
    data = request.get_json()
    category = data.get('category')
    in_stock = data.get('in_stock')
    max_price = data.get('max_price')

    query = Product.query

    if category:
        query = query.filter_by(category=category)
    if in_stock is not None:
        query = query.filter_by(in_stock=in_stock)
    if max_price:
        query = query.filter(Product.price <= max_price)

    products = query.all()
    result = [{
        "id": p.id,
        "name": p.name,
        "price": p.price,
        "category": p.category,
        "in_stock": p.in_stock
    } for p in products]

    return jsonify(result), 200
