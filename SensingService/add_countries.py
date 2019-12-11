from app.models import db, Country
from country_list import countries_for_language


countries = dict(countries_for_language('en'))

for code, name in countries.items():
    record = Country.query.filter(Country.name == name).first()

    if record is None:
        print("Adding country " + name)

        record = Country(name, code)
        db.session.add(record)
        db.session.commit()
    else:
        print("Country " + name + " has already been added ...... Skipping")
