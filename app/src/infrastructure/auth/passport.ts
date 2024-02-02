import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import {Application} from 'express';

import {IAdminApplicationRepository} from '../../domain/model/admin/IAdminRepository';

import Logger from '../logger/logger';
import Admin from '../../domain/model/admin/admin';

const logger = new Logger('passport');

export default function passportSetting(app: Application, adminRepository: IAdminApplicationRepository): void {
  passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
  }, async (id, pw, done) => {
    try {
      const admin = await adminRepository.getAdmin();

      if (admin.Id !== id) {
        return done(null, false, {message: 'IDが正しくありません。'});
      }
      if (admin.Pw !== pw) {
        return done(null, false, {message: 'パスワードが正しくありません。'});
      }

      return done(null, admin);
    } catch (e: any) {
      return done(e, false, {message: e.message});
    }
  }));

  passport.serializeUser((admin, done) => {
    logger.debug('serializeUser');
    done(null, admin);
  });

  passport.deserializeUser((loginUser, done) => {
    const user = loginUser as {
      id: string,
      pw: string,
    };

    const admin = new Admin(user.id, user.pw);
    adminRepository.findById(admin.Id).then((admin) => {
      logger.debug('認証成功');
      done(null, admin);
    }).catch((err) => {
      console.log('認証失敗');
      done(err, null);
    });
  });

  app.use(passport.session());

  app.use(passport.initialize());
}
