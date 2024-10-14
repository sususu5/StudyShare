export interface User {
    userId: number;
    token: string[];
    username: string;
    password: string;
    usedPassword: string[];
}

export interface UserDetails {
userId: number;
username: string;
}

export interface Note {
noteId: number;
userId: number;
name: string;
timeCreated: number;
timeLastEdited: number;
description: string;
}

export interface Data {
users: User[];
notes: Note[];
}