from app.models import db, AccessibilityStatus


def add_status(status):
    if not AccessibilityStatus.query.filter_by(name=status).first():
        print("Add status: {}".format(status))
        access = AccessibilityStatus(status)
        db.session.add(access)
        db.session.commit()


if __name__ == '__main__':
    add_status('public')
    add_status('private')
