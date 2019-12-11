from app import db, bcrypt
from app.models import (Role, User, FarmUser)


def add_admin_user(email, password):
    role_name = "admin"

    role_query = Role.query.filter_by(name=role_name).first()

    if role_query is None:
        print("Admin role does not exist")
        return

    admin_user = User.query.filter_by(email=email).first()

    if admin_user is None:
        encrypted_password = bcrypt.generate_password_hash(password)

        admin_user = User(email, encrypted_password)
        admin_user.first_name = role_name
        db.session.add(admin_user)
        db.session.commit()

    fu_admin = FarmUser.query.filter_by(user_id=admin_user.id,
                                        farm_id=None,
                                        role_id=role_query.id).first()

    if fu_admin is None:
        fu_admin = FarmUser(farm_id=None,
                            user_id=admin_user.id,
                            role_id=role_query.id)
        db.session.add(fu_admin)
        db.session.commit()


if __name__ == '__main__':
    email = "info@proeftuin.nl"
    password = "admin"

    add_admin_user(email, password)
