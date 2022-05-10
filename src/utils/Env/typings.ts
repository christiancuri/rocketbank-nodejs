export type Token = {
	SecretKey: string;
	ExpiresIn: string;
}

export type IEnv = {
	MONGO_SRV: string;
	Token: Token;
}