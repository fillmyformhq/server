export interface IResponse {
	status: number;
	uniqueCode: string;
	functionName: string | null;
	serverMessage: string;
	message: string | null;
	data: object | null;
}
