import { redirect } from '@sveltejs/kit';

// /ensag/parcors mène à la première proposition (B, « Lo camin »)
export function load() {
	redirect(307, '/ensag/parcors/b');
}
