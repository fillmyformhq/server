export interface IResponseInputParams {
	statusCode: string;
	functionName: string | null;
	message: string | null;
	data: object | null;
	uniqueCode: string;
}
