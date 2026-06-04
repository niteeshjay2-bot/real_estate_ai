"""Saved Property Model - For Buyer wishlists"""
from datetime import datetime
from backend.app import db


class SavedProperty(db.Model):
    __tablename__ = 'saved_properties'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    property = db.relationship('Property', backref='saved_by')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'property_id', name='unique_saved_property'),
    )
