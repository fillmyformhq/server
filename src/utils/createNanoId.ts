import { customAlphabet } from "nanoid/async";

async function createNanoId(): Promise<string> {
	const alphabet: string =
		"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

	const lengthOfId: number = 12;

	const nanoid = customAlphabet(alphabet, lengthOfId);
	const id: string = await nanoid();

	return id;
}

export default createNanoId;
