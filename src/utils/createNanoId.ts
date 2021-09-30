import { customAlphabet } from "nanoid/async";

async function createNanoId(): Promise<string> {
	const alphabet: string =
		"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	const lengthOfId: number = 10;

	const nanoid = customAlphabet(alphabet, lengthOfId);
	let id: string = await nanoid();

	return id;
}

export default createNanoId;
