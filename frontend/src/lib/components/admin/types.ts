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