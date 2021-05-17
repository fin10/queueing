import axios from 'axios';
import { handleError } from '../../utils/errorUtils';

export interface Profile {
  readonly name: string;
}

export async function getProfile(): Promise<Profile> {
  try {
    const res = await axios.get<Profile>('/api/profile');
    return res.data;
  } catch (err) {
    handleError(err);
  }
}
