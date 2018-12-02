Animal = function () {
    this.name;
    this.value;

    this.init = function(name, value) {
        this.name = name;
        this.value = value;
    }

}

GameBoard = function () {
    this.stars;
    this.animals;

    this.init = function() {
        this.stars = 0;
        this.animals = [];
    }

    this.addAnimal = function(animal) {
        this.animals.push(animal)
    }

    this.removeAnimal = function(animalName) {
        for (let i = 0; i < animals.size(); i++) {
            if (animals[i].name == animalName) {
                animals.splice(i,1)
            }
        }
    }
}