// The review build is opt-in. The public build keeps the approved story edition.
export const b32Review = import.meta.env.MODE === 'b32-review';
export const b32Integrated = import.meta.env.MODE === 'b32-v04';
export const labPath = '/missions/main-M06/lab';
