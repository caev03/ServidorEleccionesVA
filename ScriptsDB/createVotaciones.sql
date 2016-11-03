CREATE TABLE EleccionesDB.Votaciones
(
year int,
elec_type int,
dpto_code int,
muni_code int,
party_code int,
code_list int,
first_lastname varchar(255),
second_lastname varchar(255),
name varchar(255),
votes int,
seats int,
FOREIGN KEY (elec_type) REFERENCES Elec_type_codes(elec_type),
FOREIGN KEY (dpto_code) REFERENCES Dpto_codes(dpto_code),
FOREIGN KEY (muni_code) REFERENCES Muni_codes(muni_code),
FOREIGN KEY (party_code) REFERENCES Party_codes(party_code)
);