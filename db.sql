CREATE TABLE sezione(
	id serial PRIMARY KEY,
	name varchar(50)
);

CREATE TABLE nastro(
	id serial PRIMARY KEY,
	name varchar(255),
	id_sezione int references sezione(id)
);

create table warnings_enums(
	id serial primary key,
	value varchar(60)
);

CREATE TABLE warning(
	id serial PRIMARY KEY,
	type int references warnings_enums(id),
	value float,
	id_nastro int references nastro(id)
);

CREATE TABLE messaggio(
	id serial PRIMARY KEY,
	type int references warnings_enums(id),
	value float,
	id_nastro int references nastro(id)
);

insert into warnings_enums (value) values( 'Velocità troppo alta');
insert into warnings_enums (value) values ('Consumi troppo alti');

insert into sezione(name) values('Sezione 0');
insert into sezione(name) values('Sezione 1');
insert into sezione(name) values('Sezione 2');
insert into sezione(name) values('Sezione 3');
insert into sezione(name) values('Sezione 4');
insert into sezione(name) values('Sezione 5');
insert into sezione(name) values('Sezione 6');
insert into sezione(name) values('Sezione 7');

select * from warnings_enums
select * from sezione