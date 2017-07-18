
function crearArea(nombre, aforo){
	return {
		nombre: nombre,
		aforoMaximoZona: aforo,
		recintos: []
	};
}

function crearRecinto(nombre, capacidad){
	return {
		nombre: nombre,
		capacidad: capacidad,
		animales: []
	};
}

function crearAnimal(nombre, especie, edad, salud = 100, hambre = 0){
	return  {
		nombre: nombre,
		especie: especie,
		edad: edad,
		salud: salud,
		hambre: hambre
	};
}

var zoo = {
	nombre: "El último zoológico",
	ubicacion: {},
	areas: [],
	aforo: 120
};

zoo.ubicacion = {
	direccion: "Calle de los animales 5",
	ciudad: "París",
	pais: "Francia",
	//Completar
};

var area;
var recinto;
var jaula;
var animal;

//AREA 2 REPTILES

area = crearArea("Reptiles", 30);

recinto = crearRecinto("Cocodrilos", 5);
recinto.animales.push(crearAnimal("Pepe", "Cocodrilo del nilo", 25));
recinto.animales.push(crearAnimal("Hanibal", "Cocodrilo africano", 33));
recinto.animales.push(crearAnimal("Manuela", "Cocodrilo del nilo", 12));
area.recintos.push(recinto);

recinto = crearRecinto("Iguanas", 8);
recinto.animales.push(crearAnimal("Gilberto", "Iguana verde", 3));
recinto.animales.push(crearAnimal("Mauricio", "Iguana del Caribe", 4));
recinto.animales.push(crearAnimal("Alana", "Iguana del desierto", 2));
recinto.animales.push(crearAnimal("Fernando", "Iguana rinoceronte", 2));
recinto.animales.push(crearAnimal("Marcela", "Iguana del desierto", 2));
recinto.animales.push(crearAnimal("Pedro", "Iguana del Caribe", 2));
area.recintos.push(recinto);

recinto = crearRecinto("Tortugas", 8);
recinto.animales.push(crearAnimal("Matilda", "Tortuga dragón", 15));
recinto.animales.push(crearAnimal("Josefa", "Tortuga mordedora", 10));
recinto.animales.push(crearAnimal("Juan", "Tortuga caimán", 32));
recinto.animales.push(crearAnimal("Orlando", "Tortuga gigante de Aldabra", 94));
recinto.animales.push(crearAnimal("Rosario", "Tortuga mordedora", 12));
recinto.animales.push(crearAnimal("Lupita", "Tortuga caimán", 14));
recinto.animales.push(crearAnimal("Rigoberto", "Tortuga mordedora", 4));
area.recintos.push(recinto);

zoo.areas.push(area);


//AREA 2 MAMÍFEROS

area = crearArea("Mamíferos", 45);

recinto = crearRecinto("Gorilas", 6);
recinto.animales.push(crearAnimal("", "", 1));
recinto.animales.push(crearAnimal("", "", 1));
recinto.animales.push(crearAnimal("", "", 1));
area.recintos.push(recinto);

recinto = crearRecinto("Tigres", 2);
recinto.animales.push(crearAnimal("Alberto", "Tigre de bengala", 15));
area.recintos.push(recinto);

recinto = crearRecinto("Leones", 4);
recinto.animales.push(crearAnimal("Ana", "León de Katanga", 12));
recinto.animales.push(crearAnimal("Leonardo", "León del Congo", 5));
recinto.animales.push(crearAnimal("Leonor", "León de Katanga", 7));
recinto.animales.push(crearAnimal("Teresa", "León del Congo", 9));
area.recintos.push(recinto);

zoo.areas.push(area);


