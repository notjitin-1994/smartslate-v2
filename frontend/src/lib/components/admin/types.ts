export interface Inquiry {
	id: string;
	name: string;
	email: string;
	organization?: string;
	phone?: string;
	inquiryType: string;
	message: string;
	createdAt: any; // Serialized from API, not a true Timestamp object
}

export interface SolaraInterest {
	id: string;
	name: string;
	email: string;
	interest: 'use' | 'invest' | 'develop';
	createdAt: any;
}

export interface SSAInterest {
	id: string;
	name: string;
	email: string;
	phone: string;
	organization: string;
	jobTitle?: string;
	companySize?: '<50' | '50-200' | '200-1000' | '1000+';
	message?: string;
	createdAt: any;
}
