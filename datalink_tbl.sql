CREATE TABLE EquipmentInformation (
id serial PRIMARY KEY,
farm_id integer NOT NULL,
field_id integer NOT NULL,
cropfield_id integer,
equipment_id integer NOT NULL,
savedata boolean NOT NULL
);

CREATE TABLE dataLastSaved (
id serial PRIMARY KEY,
equipment_id integer NOT NULL,
last_ran varchar(25) NOT NULL
);

CREATE TABLE WolkyTolkyEquipment (
id serial PRIMARY KEY,
equipment_id integer NOT NULL,
station_id integer NOT NULL,
api_key varchar(200) NOT NULL
);