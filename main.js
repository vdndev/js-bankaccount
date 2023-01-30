// Fonction generant un id unique a partir d'un alphabet
const alphabet = "abcdefghijklmnopqrstuvwxyz1234567890";
function uuid(nbCar = 10) {
	let id = "";

	nbCar = (nbCar >= 4) ? nbCar : 4;

	for (let i = 0; i < nbCar; i++) {
		id += alphabet[Math.floor(Math.random() * alphabet.length)];
	}

	return id;
}

// Classe de gestion de compte
class Account {
	constructor(_lastname, _firstname, _amount) {
		this.firstname = _firstname;
		this.lastname = _lastname;
		this.id = uuid(4);
		this.value = _amount;
		this.events = [{
			date: Date.now(),
			type: "created",
			amount: _amount
		}];
	}

	getId() {
		return this.id;
	}

	getAmount() {
		return this.value;
	}

	getFullName() {
		return `${this.firstname} ${this.lastname}`;
	}

	credit(amount) {
		this.value += amount;
		this.events.push({
			date: Date.now(),
			type: "credited",
			amount,
		});
	}
	
	debit(amount) {
		if (amount > this.value) {
			throw new RangeError("You can't withdraw more than you own in your bank account!");
		} else {
			this.value -= amount;
			this.events.push({
				date: Date.now(),
				type: "debited",
				amount,
			});
		}
	}

	showAmount() {
		return `You got ${this.value}€ in your bank account.`
	}

	showLog() {
		return this.events.reduce((txt, evt) => {
			txt += `${(new Date(evt.date))}: Your account has been ${evt.type}`;
			if (evt.type === "debited") {
				txt += " for ";
			} else {
				txt += " with ";
			}
			txt += `${evt.amount}€\n`;

			return txt;
		}, "");
	}
}

// class de gestion de banque
class Bank {
	constructor() {
		this.accounts = new Map();
	}

	createAccount(lastname, firstname, amount) {
		const account = new Account(firstname, lastname, amount);
		const id = account.getId();

		this.accounts.set(id, account);

		return id;
	}

	retrieveAccount(id) {
		if (!this.accounts.has(id)) {
			throw new Error("Client not found");
		}

		return this.accounts.get(id);
	}

	showAccount(id) {
		const account = this.retrieveAccount(id);

		console.log(`Account N°${account.getId()}\nOwned by ${account.getFullName()}\nBalance: ${account.getAmount()}€\n`);
	}

	showMovements(id) {
		const account = this.retrieveAccount(id);

		console.log(`Account N°${account.getId()}\nOwned by ${account.getFullName()}\nBalance: ${account.getAmount()}€\nlogs:\n${account.showLog()}`);
	}

	transfer(_from, _to, amount) {
		const from = this.retrieveAccount(_from);
		const to = this.retrieveAccount(_to);
	
		from.debit(amount);
		to.credit(amount);
	}
}

// fonction generale de l'exercice
function main() {
	const bank = new Bank();
	const idClient1 = bank.createAccount("Doe", "John", 20000);
	const idClient2 = bank.createAccount("Doe", "Jane", 50000);

	console.clear();

	try {
		console.log("Initial Accounts");
		bank.showAccount(idClient1);
		bank.showAccount(idClient2);
		
		console.log();
		bank.transfer(idClient1, idClient2, 200);
		bank.showMovements(idClient1);
		bank.showMovements(idClient2);

		bank.transfer(idClient1, idClient2, 20000);
		bank.transfer(idClient2, idClient1, 400);

	} catch(err) {
		console.error(err.message);
	}
}

main();
