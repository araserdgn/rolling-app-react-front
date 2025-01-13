import axios from 'axios';
import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

// Axios instance oluşturma
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor - her istekte token kontrolü
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem(ACCESS_TOKEN);
                window.location.href = '/login';
            }
            const customError = new Error(error.response.data.message || 'Bir hata oluştu');
            customError.status = error.response.status;
            throw customError;
        } else if (error.request) {
            throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
        } else {
            throw error;
        }
    }
);

// Auth API calls
export const login = (loginRequest) => {
    return api.post('/auth/sign-in', loginRequest);
};

export const signup = (signupRequest) => {
    return api.post('/auth/sign-up', signupRequest);
};

// User API calls
export const getCurrentUser = () => {
    return api.get('/users/me');
};

export const getUserProfile = (username) => {
    return api.get(`/users/${username}`);
};

export const checkUsernameAvailability = (username) => {
    return api.get(`/users/checkUsernameAvailability?username=${username}`);
};

export const checkEmailAvailability = (email) => {
    return api.get(`/users/checkEmailAvailability?email=${email}`);
};

// Poll API calls
export const createPoll = (pollData) => {
    return api.post('/polls', pollData);
};

export const getAllPolls = (page = 0, size = 10) => {
    return api.get(`/polls?page=${page}&size=${size}`);
};

export const getUserCreatedPolls = (username, page = 0, size = 10) => {
    return api.get(`/users/${username}/polls?page=${page}&size=${size}`);
};

export const getUserVotedPolls = (username, page = 0, size = 10) => {
    return api.get(`/users/${username}/votes?page=${page}&size=${size}`);
};

export const getPollById = (pollId) => {
    return api.get(`/polls/${pollId}`);
};

export const castVote = (pollId, voteData) => {
    return api.post(`/polls/${pollId}/votes`, voteData);
}; 