from app.models import db, SoilType


def store_soil_type(soil_name, description):
    stype = SoilType.query.filter(SoilType.name == soil_name).first()

    if stype is None:
        stype = SoilType(soil_name, description)
        db.session.add(stype)
        db.session.commit()
    else:
        print("Soil type {} is already in database.".format(soil_name))


if __name__ == '__main__':
    # Reference:
    #   https://www.boughton.co.uk/products/topsoils/soil-types/
    #   https://www.rivm.nl/bibliotheek/rapporten/607711005.pdf
    soil_list = {
        "sandy": "Sandy Soil is light, warm, dry and tend to be acidic and low in nutrients.",
        "clay": "Clay Soil is a heavy soil type that benefits from high nutrients.",
        "silt": "Silt Soil is a light and moisture retentive soil type with a high fertility rating.",
        "peat": "Peat soil is high in organic matter and retains a large amount of moisture.",
        "chalk": "Chalk soil can be either light or heavy but always highly alkaline due to the "
                 "calcium carbonate or lime within its structure.",
        "loam": "Loam soil is a mixture of sand, silt and clay that are combined "
                "to avoid the negative effects of each type.",
        "loess": "Loess is a clastic, predominantly silt-sized sediment "
                 "that is formed by the accumulation of wind-blown dust."
    }

    for soil, desc in soil_list.items():
        store_soil_type(soil, desc)
