// Used to rename object keys like created_at to createdAt

function capitalizeFirstLetter(word: string) {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

function convertToCamelCase(key: string) {
	let partsOfkey: Array<string> = key.split("_");
	let newKey = partsOfkey.reduce((acc, string) => {
		if (acc === "") {
			return string;
		} else {
			return acc + capitalizeFirstLetter(string);
		}
	}, "");
	return newKey;
}

/*
@params: Takes an array of objects
*/

function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
	return key in obj;
}

// Takes an array of objects and returns an array
function renameObjectKeys(objectsToConvert: Array<object>): Array<object> {
	let convertedObjects = objectsToConvert.map((objectToConvert: object) => {
		let newObj: any = {};
		for (let key in objectToConvert) {
			let newKey: string = convertToCamelCase(key);

			let keyValue;

			if (hasKey(objectToConvert, key)) {
				keyValue = objectToConvert[key];
			}

			newObj[newKey] = keyValue;
		}
		return newObj;
	});

	return convertedObjects;
}

export default renameObjectKeys;
