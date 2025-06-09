from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.chatlog import ChatLog
import random
from app.models.product import Product

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/log', methods=['POST'])
@jwt_required()
def log_message():
    data = request.get_json()
    message = data.get('message')
    is_bot = data.get('is_bot', False)

    if not message:
        return jsonify({"error": "Message is required"}), 400

    user_id = get_jwt_identity()
    log = ChatLog(user_id=user_id, message=message, is_bot=is_bot)
    db.session.add(log)
    db.session.commit()

    return jsonify({"message": "Chat log saved"}), 201

@chat_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    logs = ChatLog.query.filter_by(user_id=user_id).order_by(ChatLog.timestamp.asc()).all()

    result = []
    for log in logs:
        result.append({
            "message": log.message,
            "is_bot": log.is_bot,
            "timestamp": log.timestamp.isoformat()
        })

    return jsonify(result), 200

@chat_bp.route('/feedback', methods=['POST'])
@jwt_required()
def submit_feedback():
    data = request.get_json()
    feedback = data.get('feedback')

    if not feedback:
        return jsonify({"error": "Feedback is required"}), 400

    # Just print/store it for now; no DB model required unless you're tracking it
    print(f"[Feedback] User {get_jwt_identity()}: {feedback}")
    return jsonify({"message": "Feedback received"}), 200

@chat_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def recommend():
    # Dummy logic: recommend 3 random products
    products = Product.query.order_by(db.func.random()).limit(3).all()

    result = []
    for p in products:
        result.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "category": p.category,
            "image_url": p.image_url
        })

    return jsonify(result), 200