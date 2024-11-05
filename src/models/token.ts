export interface AccessToken {
	access: {
		token: string,
		expires: string
	},
	refresh: {
		token: string,
		expires: string
	}
}
