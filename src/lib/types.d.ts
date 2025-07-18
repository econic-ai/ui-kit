export interface NavigationLink {
	title: string;
	slug: string;
	path?: string;
	anchor?: string;
	icon?: string;
	iconActive?: string;
	sectionIcon?: string;
	subtitle?: string;
	sections?: {
		title: string;
		path?: string;
		description?: string;
		icon?: string;
		iconActive?: string;
		sections?: {
			title: string;
			path?: string;
			sections?: {
				title: string;
				path: string;
				badge?: string;
			}[];
		}[];
	}[];
}

export interface Document {
	slug: string;
	file: string;
	metadata: {
		title: string;
		[key: string]: any;
	};
    date?: Date;
    date_formatted?: string;
    authors?: Array<{ name: string, url: string }>;
    pinned?: boolean;
	breadcrumbs: Array<{ title: string }>;
	body: string;
	sections: Section[];
	children: Document[];
	assets?: Record<string, string>;
    thumbnail: string; 
	next: null | { slug: string; title: string };
	prev: null | { slug: string; title: string };
}

export interface Section {
	slug: string;
	title: string;
	level: number;
}

export interface BannerData {
	id: string;
	start: Date;
	end: Date;
	arrow: boolean;
	href: string;
	content: {
		lg?: string;
		sm?: string;
	};
}
