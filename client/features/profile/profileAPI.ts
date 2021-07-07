import axios from 'axios';

export interface Profile {
  readonly name: string;
}

async function getProfile() {
  const res = await axios.get<Profile>('/api/profile');
  return res.data;
}

export default {
  getProfile,
};
