import { getData, setData } from "./dataStore";

export async function upvoteNote(noteId: number, userId: number) {
  const data = await getData();
    const note = data.notes.find(n => n.noteId === noteId);
    if (!note) {
        return { error: 'Note not found' };
    }
    if (note.upvoteArray.includes(userId)) {
        // remove the userId from the upvoteCount array
        note.upvoteArray = note.upvoteArray.filter(id => id !== userId);
    } else {
        note.upvoteArray.push(userId);
    }
    note.upvoteCounter = note.upvoteArray.length;
    setData(data);
    return { message: 'Upvote successful' };
}