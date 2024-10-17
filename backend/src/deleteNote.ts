import { getData } from "./dataStore";

import { setData } from "./dataStore";

export async function deleteNote(noteId: number): Promise<{ error: string } | { message: string }> {
    const data = await getData();
    const noteIndex = data.notes.findIndex(n => n.noteId === noteId);
    if (noteIndex === -1) {
        return { error: 'Note not found' };
    }
    data.notes.splice(noteIndex, 1);
    await setData(data);
    return { message: 'Note deleted successfully' };
}