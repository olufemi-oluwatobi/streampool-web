import BaseService from '../base-service';
import HTTP from '../api';
import {
    BusinessRegistrationPayload,
    PersonalRegistrationPayload,
    ResetPasswordPayload,
    ResetPasswordHeaders,
    LoginPayload, UserProfileSettingsPayload, UserPasswordPayload, ForgotPasswordPayload
} from '../../interfaces/http';

class UserService extends BaseService {
    protected getUrl = (url: string) => `/auth/${url}`;

    async registerBusiness(data: BusinessRegistrationPayload) {
        return HTTP.baseApi().post(this.getUrl('register/business'), data);
    }

    async registerPersonal(data: PersonalRegistrationPayload, type: 'regular' | 'team_member') {
        const url = (() => {
            switch (type) {
                case 'regular':
                case 'team_member':
                    return 'register/business/team-member'
                default:
                    return 'register/personal'
            }
        })()
        return HTTP.baseApi().post(this.getUrl(url), data);
    }

    async signIn(data: LoginPayload) {
        return HTTP.baseApi().post(this.getUrl('sign_in'), data);
    }

    async signOut() {
        return HTTP.baseApi().delete(this.getUrl('sign_out'));
    }

    async updateSettings(data: UserProfileSettingsPayload) {
        return HTTP.baseApi().patch(this.getUrl('settings'), data)
    }

    async forgotPassword(data: ForgotPasswordPayload) {
        const redirectUrl = `${process.env.REACT_APP_WEB_APP_URL}auth/reset_password`
        return HTTP.baseApi().post(this.getUrl('password'), { ...data, redirect_url: redirectUrl })
    }

    async resetPassword(data: ResetPasswordPayload, headers: ResetPasswordHeaders) {
        return HTTP.baseApi().put(this.getUrl('password'), data, { headers })
    }

    async updatePassword(data: UserPasswordPayload) {
        return HTTP.baseApi().put(this.getUrl('password'), data)
    }

    async getProfile() {
        return HTTP.baseApi().get(this.getUrl('me'));
    }

}

export default new UserService();
