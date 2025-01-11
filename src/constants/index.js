export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
export const ACCESS_TOKEN = 'accessToken';

export const POLL_LIST_SIZE = 30;
export const MAX_CHOICES = 6;
export const POLL_QUESTION_MAX_LENGTH = 140;
export const POLL_CHOICE_MAX_LENGTH = 40;

export const NAME_MIN_LENGTH = 4;
export const NAME_MAX_LENGTH = 40;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;

export const EMAIL_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;

export const API_ERROR_MESSAGES = {
    NETWORK_ERROR: 'Sunucuya bağlanırken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.',
    SERVER_ERROR: 'Sunucu hatası! Lütfen daha sonra tekrar deneyin.',
    UNAUTHORIZED: 'Bu işlemi gerçekleştirmek için giriş yapmalısınız.',
    FORBIDDEN: 'Bu işlemi gerçekleştirmek için yetkiniz yok.',
    NOT_FOUND: 'İstediğiniz kaynak bulunamadı.',
    VALIDATION_ERROR: 'Lütfen girdiğiniz bilgileri kontrol edin.',
    INVALID_CREDENTIALS: 'Kullanıcı adı veya şifre hatalı!',
    USER_NOT_FOUND: 'Kullanıcı bulunamadı!'
}; 