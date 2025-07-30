export type Role = 'smartslateAdmin' | 'smartslateManager' | 'smartslateClientManager' | 'learner';

export type User = {
	uid: string;
	email: string | undefined;
	displayName: string | undefined;
	photoURL?: string;
	metadata: {
		creationTime: string;
	};
	customClaims?: {
		role?: Role;
		[key: string]: any;
	};
};

export {};
