import { API_BASE_URL, ACCESS_TOKEN, API_ERROR_MESSAGES } from '../constants';

const request = async (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    try {
        const response = await fetch(options.url, options);
        
        if (response.status === 401) {
            const error = new Error('Oturum süreniz doldu veya yetkiniz yok');
            error.status = 401;
            throw error;
        }

        let json;
        try {
            json = await response.json();
        } catch (e) {
            if (!response.ok) {
                const error = new Error('Sunucudan geçersiz yanıt alındı');
                error.status = response.status;
                throw error;
            }
            json = {};
        }

        if (!response.ok) {
            const error = new Error(json.message || 'Bir hata oluştu');
            error.status = response.status;
            throw error;
        }

        return json;
    } catch (error) {
        if (!error.status) {
            error.status = 500;
        }
        throw error;
    }
};

// Auth API calls
export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/sign-in",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/sign-up",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

// User API calls
export function getCurrentUser() {
    return request({
        url: API_BASE_URL + "/users/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/users/" + username,
        method: 'GET'
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/users/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/users/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

// Poll API calls
export function createPoll(pollData) {
    return request({
        url: API_BASE_URL + "/polls",
        method: 'POST',
        body: JSON.stringify(pollData)
    });
}

export function getAllPolls(page = 0, size = 10) {
    return request({
        url: API_BASE_URL + `/polls?page=${page}&size=${size}`,
        method: 'GET'
    });
}

export function getUserCreatedPolls(username, page = 0, size = 10) {
    return request({
        url: API_BASE_URL + `/users/${username}/polls?page=${page}&size=${size}`,
        method: 'GET'
    });
}

export function getUserVotedPolls(username, page = 0, size = 10) {
    return request({
        url: API_BASE_URL + `/users/${username}/votes?page=${page}&size=${size}`,
        method: 'GET'
    });
}

export function getPollById(pollId) {
    return request({
        url: API_BASE_URL + "/polls/" + pollId,
        method: 'GET'
    });
}

export function castVote(pollId, voteData) {
    return request({
        url: API_BASE_URL + "/polls/" + pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
} 