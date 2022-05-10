export type Token = {
	SecretKey: string;
}

export type IEnv = {
	MONGO_SRV: string;
	Token: Token;
}