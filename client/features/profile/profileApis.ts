import axios from 'axios';
import { handleError } from '../../utils/errorUtils';

export interface Profile {
  readonly name: string;
}

async function getProfile() {
  try {
    const res = await axios.get<Profile>('/api/profile');
    return res.data;
  } catch (err) {
    handleError(err);
  }
}

export default {
  getProfile,
};
