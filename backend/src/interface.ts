export interface User {
	userId: number;
	token: string[];
	username: string;
	avatar: string;
	password: string;
	usedPassword: string[];
}

export interface UserDetails {
	userId: number;
	username: string;
	avatar: string;
}

export interface Note {
	noteId: number;
	userId: number;
	title: string;
	courseCode: string;
	tag: string;
	description: string;
	upvoteCount: string[];
	file: string;
	timeCreated: number;
	timeLastEdited: number;
}

export interface NoteDisplay {
  noteId: number;
  title: string;
  upvotes: number;
  timeLastEdited: string;
}

export interface Data {
	users: User[];
	notes: Note[];
}
